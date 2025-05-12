import '../styles/global.scss'
import '../styles/firebaseui-styling.global.scss';
import { ThemeProvider } from '@mui/material/styles';
import { AuthUserProvider } from '../firebase/auth';
import { theme } from '../styles/theme.js';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

export default function App({ Component, pageProps }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </LocalizationProvider>);
}
