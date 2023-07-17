import './App.css'
// import {Routes, Route} from 'react-router-dom'
import Messages from './components/messages';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';

// Create an instance of Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache: new InMemoryCache(),
});
function App() {

  return (
    <ApolloProvider client={client}>
    <>
      <div className='con'>
          <input className='Messages' type='text'/><button>send</button>
      </div>
          <Messages/>
    </>
    </ApolloProvider>
  )
}

export default App
