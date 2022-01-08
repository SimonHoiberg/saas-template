import * as aws from '@pulumi/aws';
import { baseRole } from '../iam';
import { createCognitoUser, getCognitoUser } from '../../../src/dynamodb/cognito-user';
import { variables } from '../variables';

/**
 * This lambda triggers when a user is confirmed (after enterering the confirmation code).
 * It will create a user entry in the DynamoDB table which maps to the cognito user.
 */
const handler: aws.lambda.Callback<any, unknown> = async (event, context, callback) => {
  console.log('event', JSON.stringify(event, null, 2));

  try {
    const { name, email, sub } = event.request.userAttributes;
    const existingUser = await getCognitoUser(sub);

    if (existingUser) {
      callback(null, event);
      return;
    }

    await createCognitoUser({
      id: sub,
      username: name,
      email,
      createdAt: new Date().toISOString(),
    });

    callback(null, event);
  } catch (error) {
    console.error(error);
    callback(error);
  }
};

export const postConfirmationLambda = new aws.lambda.CallbackFunction('post-confirmation-fn', {
  runtime: 'nodejs14.x',
  callback: handler,
  role: baseRole,
  environment: {
    variables: {
      DYNAMO_USER_TABLE: variables.dynamoDBTables['user-table'],
    },
  },
});
