import * as aws from '@pulumi/aws';
import { verificationMessage } from '../markup/verification-message';
import { postConfirmationLambda } from './cognito/post-confirmation';

/**
 * UserPool
 */
const userPool = new aws.cognito.UserPool('main-users', {
  deviceConfiguration: {
    deviceOnlyRememberedOnUserPrompt: false,
    challengeRequiredOnNewDevice: false,
  },
  accountRecoverySetting: {
    recoveryMechanisms: [{ priority: 1, name: 'verified_email' }],
  },
  mfaConfiguration: 'OFF',
  usernameAttributes: ['email'],
  autoVerifiedAttributes: ['email'],
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: false,
    requireSymbols: false,
    temporaryPasswordValidityDays: 2,
  },
  verificationMessageTemplate: {
    emailSubject: 'Verify your account',
    defaultEmailOption: 'CONFIRM_WITH_CODE',
    emailMessage: verificationMessage,
  },
  emailConfiguration: {
    emailSendingAccount: 'COGNITO_DEFAULT',
  },
  lambdaConfig: {
    postConfirmation: postConfirmationLambda.arn,
  },
});

/**
 * UserPoolClient
 */
const userPoolClient = new aws.cognito.UserPoolClient('main-client', {
  userPoolId: userPool.id,
  generateSecret: false,
  refreshTokenValidity: 3650,
  accessTokenValidity: 1,
  idTokenValidity: 1,
  tokenValidityUnits: {
    refreshToken: 'days',
    accessToken: 'days',
    idToken: 'days',
  },
  preventUserExistenceErrors: 'ENABLED',
  callbackUrls: [
    'http://localhost:3000/',
    // 'actual.domain.com'
  ],
  logoutUrls: [
    'http://localhost:3000/signout',
    // 'actual.domain.com/signout'
  ],
  supportedIdentityProviders: ['COGNITO'],
  allowedOauthScopes: ['email', 'openid', 'profile'],
  explicitAuthFlows: ['ALLOW_CUSTOM_AUTH', 'ALLOW_REFRESH_TOKEN_AUTH', 'ALLOW_USER_SRP_AUTH'],
  allowedOauthFlows: ['code'],
  allowedOauthFlowsUserPoolClient: true,
});

/**
 * Add lambda invoke permissions to cognito
 */
new aws.lambda.Permission('allow-cognito', {
  action: 'lambda:InvokeFunction',
  function: postConfirmationLambda.name,
  principal: 'cognito-idp.amazonaws.com',
  sourceArn: userPool.arn,
});

/**
 * Create identity pool
 */
const identityPool = new aws.cognito.IdentityPool('main-identity-pool', {
  identityPoolName: 'main-identity-pool',
  allowUnauthenticatedIdentities: false,
  cognitoIdentityProviders: [
    {
      clientId: userPoolClient.id,
      providerName: userPool.endpoint,
    },
  ],
});

/**
 * Create authentication role (including trust relationship)
 */
const authenticatedRole = new aws.iam.Role('main-authenticated-role', {
  assumeRolePolicy: identityPool.id.apply((id) =>
    JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            Federated: 'cognito-identity.amazonaws.com',
          },
          Action: 'sts:AssumeRoleWithWebIdentity',
          Condition: {
            'StringEquals': {
              'cognito-identity.amazonaws.com:aud': id,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'authenticated',
            },
          },
        },
      ],
    }),
  ),
});

new aws.iam.RolePolicy('main-authenticated-role-policy', {
  role: authenticatedRole.id,
  policy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['mobileanalytics:PutEvents', 'cognito-sync:*', 'cognito-identity:*', 'appsync:GraphQL'],
        Resource: ['*'],
      },
    ],
  }),
});

/**
 * Attaching role to identity pool
 */
new aws.cognito.IdentityPoolRoleAttachment('main-identity-pool-roles', {
  identityPoolId: identityPool.id,
  roles: {
    authenticated: authenticatedRole.arn,
  },
});

export const userpoolID = userPool.id;
export const userpoolClientID = userPoolClient.id;
export const identityPoolID = identityPool.id;
