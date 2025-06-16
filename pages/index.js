
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Button,
  CircularProgress,
  Container,
  Typography,
  TextField
} from '@mui/material';
import { useAuth } from '../src/firebase/auth';
import styles from '../styles/landing.module.scss';

export default function Home() {
  const router = useRouter();
  const { authUser, isLoading, signIn, signUp } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  useEffect(() => {
    if (!isLoading && authUser) {
      router.replace('/dashboard');
    }
  }, [authUser, isLoading, router]);

  const handleSignIn = async () => {
    setError('');
    try {
      await signIn(email, password);
      // success → useEffect will redirect
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
  };

  const handleSignUp = async () => {
    setError('');
    try {
      await signUp(email, password);
      // success → useEffect will redirect
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    }
  };

  if (authUser) return null;

  return (
    <>
      <Head>
        <title>Expense Tracker</title>
      </Head>

      <main>
        <Container className={styles.container}>
          <Typography variant="h1">Welcome to Expense Tracker!</Typography>
          <Typography variant="h2">
            Add, view, edit, and delete expenses
          </Typography>

          <div className={styles.buttons}>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <TextField
              label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin="normal"
            />

            <Button className= {styles.loginButton}
              variant="contained"
              color="secondary"
              onClick={handleSignIn}
              disabled={isLoading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Login'}
            </Button>

            <Button
              variant="outlined"
              onClick={handleSignUp}
              disabled={isLoading}
              fullWidth
              sx={{ mt: 1 }}
            >
              Register
            </Button>
          </div>
        </Container>
      </main>
    </>
  );
}
