import * as React from 'react';
import style from './layout.module.scss';

interface ILayoutProps {}

const Layout: React.SFC<ILayoutProps> = ({ children }) => {
  return (
    <React.Fragment>
      <div className={style.main}>{children}</div>
    </React.Fragment>
  );
};

Layout.defaultProps = {};
export default Layout;
