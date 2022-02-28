# AWS + React SaaS Template

End-to-end SaaS Template using AWS Amplify, Apollo Client, Chakra, and NextJS.

![](https://imgur.com/0Q8LTqa.png)

![YouTube Channel](https://img.shields.io/youtube/views/SUjTIX0a1PM?style=social)
![YouTube Channel](https://img.shields.io/youtube/likes/SUjTIX0a1PM?style=social)
![YouTube Channel](https://img.shields.io/youtube/channel/subscribers/UCMo28ATCDU0Kn9dpilAF79Q?style=social)

## Table of content

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Get Help](#get-help)
- [Contribute](#contribute)

## Tech Stack

🔹 [DynamoDB](https://aws.amazon.com/dynamodb/)  
🔹 [AppSync (GraphQL)](https://aws.amazon.com/appsync/)  
🔹 [Cognito](https://aws.amazon.com/cognito/)  
🔸 [React](https://reactjs.org) / [NextJS](https://nextjs.org/)  
🔸 [Amplify](https://aws.amazon.com/amplify/)  
🔸 [Apollo Client](https://www.apollographql.com/docs/react/get-started/setup/)  
🔸 [Chakra](https://chakra-ui.com/)  
▪️ [Pulumi](https://pulumi.com/)  
▪️ [GitHub Actions](https://github.com/features/actions)  

## Prerequisites

### Create an account on AWS (https://aws.amazon.com/).

You will need to setup the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) on your local system, if you haven't already.

### Create an account on Pulumi (https://pulumi.com/).

You will need to setup the [Pulumi CLI](https://www.pulumi.com/docs/get-started/aws/begin/) and configure it with AWS.

### Install Amplify CLI.

We need Amplify to set up the Front End, so you need to setup the [Amplify CLI](https://docs.amplify.aws/cli/start/install/) on your local system.

#### ℹ️ Additional info

This repository is a **_monorepo_**, but you can split out the _front-end_ and _back-end_ folders into separate repositories.

## Setup

### Setup the stack in the cloud

Go to the back-end folder:  
`cd back-end`

Install the dependencies:  
`npm install`

Use Pulumi to setup the stack in the cloud:  
`pulumi up`

This command will set up a stack consisting of _18 resources_ in AWS.  
They boil down to:

- A DynamoDB table for users
- A Cognito user pool
- An Identity Pool
- AppSync GraphQL API
- A _PostConfirmation_ Lambda which is triggered when a user signs up
- A _Resolver_ Lambda which is used to fetch a user through GraphQL

When the `pulumi up` command has finished running, you will get an output that looks similar to this.  
**Note down this output**:

```console
Outputs:
    appSyncID       : "<APPSYNC-ID>"
    dynamoID        : "<TABLE-NAME>"
    graphQLEndpoint : {
        GRAPHQL : "https://<GRAPHQL-ENDPOINT>/graphql"
        REALTIME: "wss://<REALTIME-ENDPOINT>/graphql"
    }
    identityPoolID  : "<IDENTITY-POOL-ID>"
    userpoolClientID: "<USERPOOL-CLIENT-ID>"
    userpoolID      : "<USERPOOL-ID>"

```

#### ℹ️ Additional info

If Pulumi complains about missing region, use the command:
`pulumi config set aws:region eu-west-1`

If you want to use another region than `eu-west-1`, go to the file `back-end/resources/variables/` and change the region here as well.

```typescript
export const variables = {
  region: 'eu-west-1' as const, // <-- change this to your region
  dynamoDBTables: {} as Record<string, Output<string>>,
};
```

### Setup the front-end

Go to the front-end folder:  
`cd front-end`

Install the dependencies:  
`npm install`

Use Amplify to link the front-end to the back-end:
`amplify init`

- ? Enter a name for the project: **_my-app-name_**
- ? Choose the environment you would like to use: **_dev_**
- ? Choose your default editor: **_Visual Studio Code_**
- ? Choose the type of app that you're building: **_javascript_**
- ? What javascript framework are you using: **_react_**
- ? Source Directory Path: **_src_**
- ? Distribution Directory Path: **_build_**
- ? Build Command: **_npm run build_**
- ? Start Command: **_npm run start_**
- ? Select the authentication method you want to use: **_AWS profile_**
- ? Please choose the profile you want to use: **_<default - or pick the one you use>_**

This will setup an Amplify project in the cloud for the front-end.

A file called `src/aws-exports.js` will be created. You can safely deleted this file.  
(In fact, you can delete the `src` folder entirely).

### Configure the environment

Go to the file `front-end/deployment/config/config-development.ts`.  
Now, use the Pulumi output from before, to setup the environment:

```typescript
const configDevelopment = {
  ...

  /**
   * Add the details from the Pulumi output here, after running 'pulumi up'
   */
  USER_POOL_CLIENT_ID: '<USERPOOL-CLIENT-ID>',
  USER_POOL_ID: '<USERPOOL-ID>',
  IDENTITY_POOL_ID: '<IDENTITY-POOL-ID>',
  GRAPHQL_ENDPOINT: 'https://<GRAPHQL-ENDPOINT>/graphql',
};
```

Next, run the command:
`amplify codegen add -apiId <APPSYNC-ID>`

- ? Choose the code generation language target: **_typescript_**
- ? Enter the file name pattern of graphql queries, mutations and subscriptions: **_/graphql/\*\*/\*.ts_**
- ? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions? **_Y_**
- ? Enter maximum statement depth [increase from default if your schema is deeply nested]: **_4_**
- ? Enter the file name for the generated code: **_/graphql/API.ts_**
- ? Do you want to generate code for your newly created GraphQL API? **_Y_**

### Add hosting

Finally, setup hosting for the front-end:  
`amplify hosting add`

- ? Select the plugin module to execute: **_Hosting with Amplify Console_**
- ? Choose a type: **_Continuous deployment_**

Sign into AWS and link your GitHub repository to Amplify Console.  
When the environment has been set up, go to the **Environment variables** page from the left menu, and click **Manage variables**.

Add a new variable called `NEXT_PUBLIC_CLOUD_ENV` with the value `dev`.

Amplify will create a hosted URL for you.  
Go to the file `front-end/deployment/config/config-development.ts` again, and add the URL here:

```typescript
/**
 * Add your hosted dev URL here
 */
const HOSTED_URL = '<ADD-YOUR-HOSTED-URL-HERE>';
```

Finally, run:  
`amplify push`  
`amplify publish`

Let Amplify do it's thing 😎

### Start the app locally

Start the app by running `npm run dev`.  
The app will start locally on [http://localhost:3000](http://localhost:3000).

Create a new user by going to the `/signup` page.  
Sign into the app by going to the `/signin` page.

Authentication should work smoothly at this point - now, start building your SaaS 🚀

### ℹ️ Additional info

If you want to use different environments (dev and prod), simply set up Pulumi in a different environment, and paste the output into the `front-end/deployment/config/config-production.ts`.

Similarly, create an **environment variable** in the Amplify Console for the production environment called `NEXT_PUBLIC_CLOUD_ENV` with the value `prod`.

## Get Help

- Reach out on [Twitter](https://twitter.com/SimonHoiberg)
- Open an [issue](https://github.com/SimonHoiberg/saas-template/issues/new)

## Contribute

PRs are welcome!
