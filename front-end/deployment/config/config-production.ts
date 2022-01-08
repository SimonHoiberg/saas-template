/**
 * Add your live production URL here
 */
const HOSTED_URL = 'https://public.domain.com';

const configProduction = {
  HOSTED_URL,
  MODE: 'PRODUCTION',
  REGION: 'eu-west-1',
  REDIRECT_SIGN_IN: `${HOSTED_URL}/`,
  REDIRECT_SIGN_OUT: `${HOSTED_URL}/signout/`,
  AUTHENTICATION_TYPE: 'AWS_IAM' as const,

  /**
   * Add the details from the Pulumi output here, after running 'pulumi up'
   */
  USER_POOL_CLIENT_ID: '',
  USER_POOL_ID: '',
  IDENTITY_POOL_ID: '',
  GRAPHQL_ENDPOINT: '',
};

export default configProduction;
