import constants from "../config/constants";

const { AuthActions } = constants;
const {
  AUTHENTICATING,
  NOT_AUTHED,
  IS_AUTHED,
  RECEIVE_USER_DATA
} = AuthActions;

const initialState = {
  authedId: '',
  isAuthed: false,
  isAuthenticating: true,
};

export const Auth = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATING:
      return {
        ...state,
        isAuthenticating: true,
      };
    case NOT_AUTHED:
      return {
        ...state,
        isAuthenticating: false,
        isAuthed: false,
        authedId: '',
      };
    case IS_AUTHED:
      return {
        ...state,
        isAuthed: true,
        isAuthenticating: false,
        authedId: action.uid
      };
    case RECEIVE_USER_DATA:
      return {
        ...state,
        userData: action.userData,
      };
    default:
      return state;
  }
};

export default Auth
