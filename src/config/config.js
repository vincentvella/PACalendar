import Config from 'react-native-config';
import firebase from '@firebase/app';
import '@firebase/database';
import '@firebase/auth';

firebase.initializeApp({
  apiKey: Config.API_KEY,
  authDomain: Config.AUTH_DOMAIN,
  databaseURL: Config.DATABASE_URL,
  projectId: Config.PROJECT_ID,
  storageBucket: Config.STORAGE_BUCKET,
  messagingSenderId: Config.MESSAGING_SENDER_ID,
});

const ref = firebase.database().ref();
const firebaseAuth = firebase.auth();
const facebookProvider = firebase.auth.FacebookAuthProvider;
const googleProvider = firebase.auth.GoogleAuthProvider;
const database = firebase.database();

export {
  ref,
  firebaseAuth,
  facebookProvider,
  database,
  googleProvider,
};
