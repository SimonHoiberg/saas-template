import localConfig from './config/config-local';
import developmentConfig from './config/config-development';
import productionConfig from './config/config-production';

export const setCloudEnv = () => {
  if (process.env.NEXT_PUBLIC_CLOUD_ENV !== 'prod') {
    typeof window !== 'undefined' && localStorage.setItem('env_development', 'true');
  }
};

export const isdev = !!(typeof window !== 'undefined' && localStorage?.getItem('env_development'));

let config = localConfig;

if (process.env.NEXT_PUBLIC_CLOUD_ENV === 'prod') {
  config = productionConfig;
}

if (process.env.NEXT_PUBLIC_CLOUD_ENV === 'dev') {
  config = developmentConfig;
}

export { config };
