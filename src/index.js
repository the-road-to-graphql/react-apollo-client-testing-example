import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { SchemaLink } from 'apollo-link-schema';
import {
  makeExecutableSchema,
  introspectSchema,
} from 'graphql-tools';

import { printSchema } from 'graphql/utilities/schemaPrinter';

import App from './App';
import {
  // schema,
  resolvers,
} from './schema';

import registerServiceWorker from './registerServiceWorker';

async function render() {
  const cache = new InMemoryCache();

  const GITHUB_BASE_URL = 'https://api.github.com/graphql';

  const httpLink = new HttpLink({
    uri: GITHUB_BASE_URL,
    headers: {
      authorization: `Bearer ${
        process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
      }`,
    },
  });

  const schema = await introspectSchema(httpLink);

  const executableSchema = makeExecutableSchema({
    typeDefs: printSchema(schema),
    // typeDefs: schema,
    resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
  });

  const client = new ApolloClient({
    link: new SchemaLink({ schema: executableSchema }),
    cache,
  });

  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('root'),
  );
}

render();

registerServiceWorker();
