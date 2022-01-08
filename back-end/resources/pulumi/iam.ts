import * as aws from '@pulumi/aws';

/**
 * Base policy shared by common resources
 */
export const basePolicy = new aws.iam.Policy('base-policy', {
  path: '/',
  description: 'Base IAM policy for all resources',
  policy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Action: [
          'dynamodb:*',
          'ses:*',
          's3:*',
          'sqs:*',
          'cognito-identity:*',
          'cognito-idp:*',
          'cognito-sync:*',
          'appsync:GraphQL',
          'lambda:InvokeFunction',
          'lambda:InvokeAsync',
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        Effect: 'Allow',
        Resource: '*',
      },
    ],
  }),
});

/**
 * Base role shared by common resources
 */
export const baseRole = new aws.iam.Role('base-role', {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({ Service: 'lambda.amazonaws.com' }),
  managedPolicyArns: [basePolicy.arn],
});

/**
 * Role for AppSync resolvers
 */
export const appSyncRole = new aws.iam.Role('appsync-role', {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({ Service: 'appsync.amazonaws.com' }),
  managedPolicyArns: [basePolicy.arn],
});

/**
 * Attaching policy to the role
 */
export const roleAttachtment = new aws.iam.RolePolicyAttachment('base-policy-role-attachment', {
  policyArn: basePolicy.arn,
  role: baseRole,
});
