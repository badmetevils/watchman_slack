import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Layout from './components/Layout';

const App = () => {
  return <Layout>A custom boilerplate with react typescript and material ul and sass</Layout>;
};

export default App;

ReactDOM.render(<App />, document.querySelector('app-boilerplate'));
