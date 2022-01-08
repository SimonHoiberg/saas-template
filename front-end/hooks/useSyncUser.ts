import { gql, useLazyQuery } from '@apollo/client';
import { CognitoUser } from '../graphql/API';
import { getCognitoUser } from '../graphql/queries';

export const useGetUser = () => {
  const [call, { loading, error, data }] = useLazyQuery<{ getCognitoUser: CognitoUser }>(gql(getCognitoUser), {
    fetchPolicy: 'no-cache',
  });

  return {
    getUser: call,
    getUserData: data?.getCognitoUser,
    getUserLoading: loading,
    getUserError: error,
  };
};
