interface ResponseData<T> {
  statusCode: number;
  message?: string;
  data?: T;
}

type Callback = (error?: string | Error | null | undefined, result?: any) => void;

/**
 * Helper function for creating a Lambda Function response.
 */
export const response = <T>(responseData: ResponseData<T>) => {
  const { statusCode, message, data } = responseData;

  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      success: !!data || statusCode < 300,
      message,
      data,
    }),
  };
};

/**
 * Helper function for creating a Lambda Function callback response.
 */
export const createCallbackResponse =
  (callback: Callback) =>
  <T>(responseData: ResponseData<T>) => {
    const { statusCode, message, data } = responseData;

    if (!!data || statusCode < 300) {
      return callback(null, data);
    }

    return callback(message ? new Error(message) : 'An unknown error occured');
  };
