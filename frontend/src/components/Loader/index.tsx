import * as React from 'react';
import style from './loader.module.scss';

const Loader: React.SFC = props => {
  return (
    <div style={{ justifyContent: 'center', display: 'flex', width: '100%' }}>
      <div className={style.loader}></div>
    </div>
  );
};

export default Loader;
