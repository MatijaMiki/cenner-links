import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app  = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

const googleProvider   = new GoogleAuthProvider();
const githubProvider   = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const signInWithGoogle   = () => signInWithPopup(auth, googleProvider)  .then(r => r.user.getIdToken());
export const signInWithGithub   = () => signInWithPopup(auth, githubProvider)  .then(r => r.user.getIdToken());
export const signInWithFacebook = () => signInWithPopup(auth, facebookProvider).then(r => r.user.getIdToken());
