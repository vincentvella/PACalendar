import { authWithGoogleToken, authWithToken, getAccessToken, getGoogleToken, logout, updateUser } from "../api/auth";
import constants from "../config/constants";

const { AuthActions } = constants;
const { NOT_AUTHED, LOGGING_OUT, IS_AUTHED, AUTHENTICATING, RECEIVE_USER_DATA } = AuthActions;

export const notAuthed = () => ({ type: NOT_AUTHED });

export const loggingOut = () => ({ type: LOGGING_OUT });

export const isAuthed = uid => ({ type: IS_AUTHED, uid });

export const authenticating = () => ({ type: AUTHENTICATING });

export const setUserData = userData => ({ type: RECEIVE_USER_DATA, userData });

export const handleUnauth = () => (dispatch) => {
  logout();
  dispatch(loggingOut());
};

export const handleGoogleAuth = (data) => (dispatch) => {
  dispatch(authenticating());
  return authWithGoogleToken(getGoogleToken(data))
  .catch((error) => console.warn('Error in Google Auth', error));
};

export const handleFacebookAuth = () => (dispatch) => {
  dispatch(authenticating());
  return getAccessToken()
  .then(({ accessToken }) => {
    authWithToken(accessToken);
  })
  .catch((error) => console.warn('Error in handleAuthWithFirebase: ', error));
};

export const onAuthChanged = (user) => (dispatch) => {
  if (!user) {
    dispatch(notAuthed());
  } else {
    if (user.providerData[0].providerId === 'google.com') {
      const { uid, displayName, photoURL } = user;
      updateUser({ uid, displayName, photoURL: photoURL });
      dispatch(setUserData({ displayName: displayName, photoURL: photoURL }));
      dispatch(isAuthed(uid));
    } else {
      const { uid, displayName } = user;
      const { photoURL } = user.providerData[0];
      updateUser({ uid, displayName, photoURL: `${photoURL}?height=500`, });
      dispatch(setUserData({ displayName: displayName, photoURL: `${photoURL}?height=500` }));
      dispatch(isAuthed(uid));
    }
  }
};
