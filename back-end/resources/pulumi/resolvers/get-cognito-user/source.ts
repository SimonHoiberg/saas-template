import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { appSyncRole, baseRole } from '../../iam';
import { handler } from './get-cognito-user';
import { variables } from '../../variables';

export const setupGetCognitoUserSource = (appSyncID: pulumi.Input<string>) => {
  /**
   * Lambda Function
   */
  const getCognitoUserResolver = new aws.lambda.CallbackFunction('get-cognito-user-fn', {
    runtime: 'nodejs14.x',
    callback: handler,
    role: baseRole,
    environment: {
      variables: {
        DYNAMO_USER_TABLE: variables.dynamoDBTables['user-table'],
      },
    },
  });

  /**
   * Data Source
   */
  const dataSource = new aws.appsync.DataSource('get-cognito-user-ds', {
    apiId: appSyncID,
    name: 'GetCognitoUserDs',
    type: 'AWS_LAMBDA',
    serviceRoleArn: appSyncRole.arn,
    lambdaConfig: {
      functionArn: getCognitoUserResolver.arn,
    },
  });

  /**
   * Resolver
   */
  new aws.appsync.Resolver('get-cognito-user-rs', {
    apiId: appSyncID,
    field: 'getCognitoUser',
    type: 'Query',
    dataSource: dataSource.name,
    requestTemplate: `
      {
        "version" : "2017-02-28",
        "operation": "Invoke",
        "payload": $util.toJson($context)
      }
    `,
    responseTemplate: '$util.toJson($context.result)',
  });
};
