import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Layout from './components/Layout';
import 'antd/dist/antd.css';
import './styles/reset.css';
import './styles/global.scss';
import './styles/utils.scss';
import Home from './pages/Home';

const App = () => {
  return (
    <Layout>
      <Home />
    </Layout>
  );
};

export default App;

ReactDOM.render(<App />, document.querySelector('frontend-watchman'));
