import * as aws from '@pulumi/aws';
import fs from 'fs';
import { resolve } from 'path';
import { setupGetCognitoUserSource } from './resolvers/get-cognito-user/source';

const schema = fs.readFileSync(resolve(__dirname, '../schema/schema.graphql'), 'utf8');

if (!schema || typeof schema !== 'string') {
  throw Error('Could not read GraphQL schema');
}

/**
 * AppSync
 */
const appSync = new aws.appsync.GraphQLApi('appsync', {
  schema,
  authenticationType: 'AWS_IAM',
});

/**
 * Sources
 */
setupGetCognitoUserSource(appSync.id);

export const appSyncID = appSync.id;
export const graphQLEndpoint = appSync.uris;
