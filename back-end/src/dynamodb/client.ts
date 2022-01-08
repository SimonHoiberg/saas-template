import AWS from 'aws-sdk';
import { variables } from '../../resources/pulumi/variables';

AWS.config.update({ region: variables.region });

/**
 * Get all items from a table
 * Helper function
 * @param params
 */
const getAllItems = async <T>(params: AWS.DynamoDB.DocumentClient.ScanInput): Promise<T[] | null> => {
  const docdbb = new AWS.DynamoDB.DocumentClient();

  let items: T[] = [];
  const result = await docdbb.scan(params).promise();

  if (!result.Items) {
    return null;
  }

  items = [...result.Items] as T[];

  if (result.LastEvaluatedKey) {
    const nextItems = await getAllItems<T>({
      ...params,
      ExclusiveStartKey: result.LastEvaluatedKey,
    });

    if (nextItems) {
      items = [...items, ...nextItems];
    }
  }

  return items;
};

/**
 * Get all items from a query
 * Helper function
 * @param params
 */
const getItems = async <T>(params: AWS.DynamoDB.DocumentClient.QueryInput): Promise<T[] | null> => {
  const docdbb = new AWS.DynamoDB.DocumentClient();

  let items: T[] = [];
  const result = await docdbb.query(params).promise();

  if (!result.Items) {
    return null;
  }

  items = [...result.Items] as T[];

  if (result.LastEvaluatedKey) {
    const nextItems = await getItems<T>({
      ...params,
      ExclusiveStartKey: result.LastEvaluatedKey,
    });

    if (nextItems) {
      items = [...items, ...nextItems];
    }
  }

  return items;
};

/**
 * Get count from a query
 * Helper function
 * @param params
 * @returns
 */
const getCount = async (params: AWS.DynamoDB.DocumentClient.QueryInput): Promise<number | null> => {
  const docdbb = new AWS.DynamoDB.DocumentClient();

  const result = await docdbb.query(params).promise();

  if (result.Count === undefined) {
    return null;
  }

  return result.Count;
};

/**
 * Get a specific item
 * @param params
 */
const getItem = async <T>(params: AWS.DynamoDB.DocumentClient.GetItemInput): Promise<T | null> => {
  const docdbb = new AWS.DynamoDB.DocumentClient();

  const result = await docdbb.get(params).promise();

  if (!result.Item) {
    return null;
  }

  return result.Item as T;
};

/**
 * Update a specific item
 * @param params
 */
const updateItem = async <T>(params: AWS.DynamoDB.DocumentClient.UpdateItemInput): Promise<T | null> => {
  const docdbb = new AWS.DynamoDB.DocumentClient();

  const result = await docdbb.update({ ...params, ReturnValues: 'ALL_NEW' }).promise();

  if (!result.$response.data) {
    return null;
  }

  return result.$response.data.Attributes as T;
};

const updateDynamicItem = async <T>(tableName: string, item: { id: string }): Promise<T | null> => {
  const updateItem: Record<string, any> = { ...item } as { id?: string };
  delete updateItem.id;

  Object.entries(updateItem).forEach(([key, value]) => {
    if (value === undefined) {
      delete updateItem[key];
    }
  });

  const UpdateExpression = Object.keys(updateItem).reduce(
    (expr, key, i, arr) => `${expr} #${key} = :${key}${i !== arr.length - 1 ? ',' : ''}`,
    'SET ',
  );

  const ExpressionAttributeNames = Object.keys(updateItem).reduce((values, key) => {
    values[`#${key}`] = key;
    return values;
  }, {} as Record<string, any>);

  const ExpressionAttributeValues = Object.entries(updateItem).reduce((values, [key, value]) => {
    values[`:${key}`] = value;
    return values;
  }, {} as Record<string, any>);

  const params = {
    TableName: `${tableName}`,
    Key: { id: item.id },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };

  return client.updateItem<T>(params);
};

/**
 * Add an item
 * @param params
 */
const putItem = async <T>(params: AWS.DynamoDB.DocumentClient.PutItemInput): Promise<T | null> => {
  const docdbb = new AWS.DynamoDB.DocumentClient();

  await docdbb.put(params).promise();

  return params.Item as T;
};

/**
 * Delete an item
 * @param params
 * @returns
 */
const deleteItem = async <T>(params: AWS.DynamoDB.DocumentClient.DeleteItemInput): Promise<T | null> => {
  const docdbb = new AWS.DynamoDB.DocumentClient();

  const result = await docdbb.delete({ ...params, ReturnValues: 'ALL_OLD' }).promise();

  if (!result.$response.data) {
    return null;
  }

  return result.$response.data.Attributes as T;
};

export const client = {
  getAllItems,
  getItems,
  getCount,
  getItem,
  updateItem,
  updateDynamicItem,
  putItem,
  deleteItem,
};
