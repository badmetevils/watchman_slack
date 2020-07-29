import * as React from 'react';
import { Container, Box } from '@material-ui/core';

interface ILayoutProps {}

const Layout: React.SFC<ILayoutProps> = ({ children }) => {
  return (
    <React.Fragment>
      <Container>
        <Box paddingY={'4rem'}>{children}</Box>
      </Container>
    </React.Fragment>
  );
};

Layout.defaultProps = {};
export default Layout;
