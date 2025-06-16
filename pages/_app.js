import '../styles/global.scss';
import '../styles/firebaseui-styling.global.scss';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../styles/theme.js';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AuthUserProvider } from '../src/firebase/auth';

export default function App({ Component, pageProps }) {
  return (
  <AuthUserProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </LocalizationProvider>
    </AuthUserProvider>
  );
}
