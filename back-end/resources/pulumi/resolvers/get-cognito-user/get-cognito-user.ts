import AWS from 'aws-sdk';
import * as aws from '@pulumi/aws';
import { getCognitoUser } from '../../../../src/dynamodb/cognito-user';
import { createCallbackResponse } from '../../../../src/utils/response';
import { variables } from '../../variables';

/**
 * Get a user from the DynamoDB table.
 */
export const handler: aws.lambda.Callback<any, unknown> = async (event, context, callback) => {
  console.log('event', JSON.stringify(event, null, 2));
  const response = createCallbackResponse(callback);

  const jwtToken = event.request.headers['x-jwt-identity-token'];
  const cognitoIdentity = new AWS.CognitoIdentityServiceProvider({ region: variables.region });

  try {
    const cognitoUser = await cognitoIdentity
      .getUser({
        AccessToken: jwtToken,
      })
      .promise();

    const sub = cognitoUser.UserAttributes.find((attr) => attr.Name === 'sub');

    if (!sub?.Value) {
      throw Error('Invalid user ID');
    }

    const user = await getCognitoUser(sub.Value);

    if (!user) {
      return response({
        statusCode: 404,
        message: `User with ID "${sub.Value}" is not found`,
      });
    }

    return response({ statusCode: 200, data: user });
  } catch (error) {
    console.error(error);

    const { message } = error as Error;
    return response({ statusCode: 500, message });
  }
};
