import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { Auth } from 'aws-amplify';
import { Signer } from 'aws-appsync-auth-link/lib/signer/signer';
import { config } from '../deployment/config';

const appSyncFetch =
  (validateSession: () => Promise<void>) =>
  async (
    uri: string,
    options: RequestInit & { retry?: boolean },
  ): Promise<{
    text: () => Promise<string>;
  }> => {
    // Validate the user session
    await validateSession();

    const credentials = await Auth.currentCredentials();
    const session = (await Auth.currentSession()) as any;

    // Sign the request with the user's credentials
    Signer.sign(
      { ...options, url: config.GRAPHQL_ENDPOINT, region: config.REGION, service: 'appsync' },
      {
        access_key: credentials.accessKeyId,
        secret_key: credentials.secretAccessKey,
        session_token: credentials.sessionToken,
      },
    );

    const request = await fetch(uri, {
      ...options,
      headers: {
        ...options.headers,

        // We pass the JWT token to the AppSync API so we can use it to check validity
        // and access claims, etc.
        'x-jwt-identity-token': session.accessToken.jwtToken,
      },
    });

    const text = await request.text();

    return {
      text: async () => text,
    };
  };

const apolloAuthLink = (validateSession: () => Promise<void>) => {
  return ApolloLink.from([
    createHttpLink({ uri: config.GRAPHQL_ENDPOINT, fetch: appSyncFetch(validateSession) as any }),
  ]);
};

export const createAppSyncClient = (validateSession: () => Promise<void>) => {
  const authLink = apolloAuthLink(validateSession);
  const client = new ApolloClient({
    link: authLink as any,
    cache: new InMemoryCache(),
  });

  return client;
};
