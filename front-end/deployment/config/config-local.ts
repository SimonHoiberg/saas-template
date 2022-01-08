import developmentConfig from './config-development';
const HOSTED_URL = 'http://localhost:3000';

const configLocal = {
  ...developmentConfig,
  HOSTED_URL,
  MODE: 'LOCAL',
  REDIRECT_SIGN_IN: `${HOSTED_URL}/`,
  REDIRECT_SIGN_OUT: `${HOSTED_URL}/signout/`,
};

export default configLocal;
