import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { mount } from 'enzyme';
import { spy } from 'sinon';

import './test/setup';
import clientMock from './test/client-mock';

import App, {
  Star,
  STAR_REPOSITORY,
  GET_REPOSITORIES_OF_ORGANIZATION,
} from './App';

describe('Star', () => {
  it('calls the mutate method on Apollo Client', () => {
    spy(clientMock, 'mutate');

    const wrapper = mount(
      <ApolloProvider client={clientMock}>
        <Star id={'1'} />
      </ApolloProvider>,
    );

    wrapper.find('button').simulate('click');

    expect(clientMock.mutate.calledOnce).toEqual(true);

    expect(clientMock.mutate.getCall(0).args[0].variables).toEqual({
      id: '1',
    });

    expect(clientMock.mutate.getCall(0).args[0].mutation).toEqual(
      STAR_REPOSITORY,
    );

    clientMock.mutate.restore();
  });
});

describe('App', () => {
  it('calls the query method on Apollo Client', () => {
    spy(clientMock, 'watchQuery');

    const wrapper = mount(
      <ApolloProvider client={clientMock}>
        <App />
      </ApolloProvider>,
    );

    expect(clientMock.watchQuery.calledOnce).toEqual(true);

    expect(clientMock.watchQuery.getCall(0).args[0].query).toEqual(
      GET_REPOSITORIES_OF_ORGANIZATION,
    );

    clientMock.watchQuery.restore();
  });

  it('renders correctly after the query method on Apollo Client executed', () => {
    const wrapper = mount(
      <ApolloProvider client={clientMock}>
        <App />
      </ApolloProvider>,
    );

    expect(
      wrapper
        .find('Repositories')
        .find('RepositoryList')
        .find('li').length,
    ).toEqual(2);

    expect(
      wrapper.find('Repositories').props().repositories.edges[0].node
        .id,
    ).toEqual('1');

    expect(
      wrapper.find('Repositories').props().repositories.edges[1].node
        .id,
    ).toEqual('2');
  });
});
