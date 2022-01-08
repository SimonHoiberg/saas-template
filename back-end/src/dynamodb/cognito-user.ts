import { CognitoUser } from '../types/cognito-user';
import { client } from './client';

/**
 * Get a cognito user given an id
 * @param id
 */
export const getCognitoUser = async (id: string) => {
  const params = {
    TableName: process.env.DYNAMO_USER_TABLE as string,
    Key: { id },
  };

  return client.getItem<CognitoUser>(params);
};

export const createCognitoUser = async (user: CognitoUser) => {
  const params = {
    TableName: process.env.DYNAMO_USER_TABLE as string,
    Item: user,
  };

  return client.putItem(params);
};
