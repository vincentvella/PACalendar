import { firebaseAuth, facebookProvider, ref, googleProvider } from "../config/config";
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import {GoogleSignin} from "react-native-google-signin";

export const getAccessToken = () => AccessToken.getCurrentAccessToken();

export const authWithToken = (accessToken) => firebaseAuth.signInAndRetrieveDataWithCredential(facebookProvider.credential(accessToken));

export const getGoogleToken = (data) => googleProvider.credential(data.idToken, data.accessToken);

export const authWithGoogleToken = (data) => firebaseAuth.signInAndRetrieveDataWithCredential(data);

export const updateUser = (user) => ref.child(`Mobile/Users/${user.uid}`).set(user);

const signOut = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (error) {
    console.log('error', error);
  }
};

export const logout = () => {
  signOut();
  LoginManager.logOut();
  firebaseAuth.signOut();
  ref.off();
};
