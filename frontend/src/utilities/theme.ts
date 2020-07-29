import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    common: { black: '#000', white: '#fff' },
    background: { paper: '#fff', default: '#fafafa' },
    primary: {
      light: 'rgba(68, 195, 255, 1)',
      main: 'rgba(0, 137, 255, 1)',
      dark: 'rgba(0, 119, 198, 1)',
      contrastText: '#fff'
    },
    secondary: {
      light: 'rgba(255, 107, 52, 1)',
      main: 'rgba(255, 79, 5, 1)',
      dark: 'rgba(230, 67, 0, 1)',
      contrastText: '#fff'
    },
    error: { light: '#e57373', main: '#f44336', dark: '#d32f2f', contrastText: '#fff' },
    text: {
      primary: 'rgba(68, 68, 68, 1)',
      secondary: 'rgba(102, 102, 102, 1)',
      disabled: 'rgba(204, 204, 204, 1)',
      hint: 'rgba(153, 153, 153, 1)'
    }
  },
  typography: {
    fontFamily: "'Merriweather Sans', sans-serif",
    htmlFontSize: 12,
    fontSize: 12
  }
});
