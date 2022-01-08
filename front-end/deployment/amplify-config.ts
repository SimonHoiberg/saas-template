import { config } from './config';

/**
 * This is the configuration you should consume through 'Amplify.configure'
 */
const amplifyConfig = {
  Auth: {
    mandatorySignIn: true,
    region: config.REGION,
    userPoolId: config.USER_POOL_ID,
    identityPoolId: config.IDENTITY_POOL_ID,
    userPoolWebClientId: config.USER_POOL_CLIENT_ID,
    oauth: {
      redirectSignIn: config.REDIRECT_SIGN_IN,
      redirectSignOut: config.REDIRECT_SIGN_OUT,
      scope: ['email', 'openid', 'aws.cognito.signin.user.admin'],
      responseType: 'code',
    },
  },
  aws_appsync_graphqlEndpoint: config.GRAPHQL_ENDPOINT,
  aws_appsync_region: config.REGION,
  aws_appsync_authenticationType: config.AUTHENTICATION_TYPE,
  federationTarget: 'COGNITO_USER_POOLS',
};

export default amplifyConfig;
