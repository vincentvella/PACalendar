import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import React, { Component } from 'react';
import Config from 'react-native-config';
import { createLogger } from "redux-logger";
import OneSignal from "react-native-onesignal";
import { composeWithDevTools } from 'remote-redux-devtools';
import { persistReducer, persistStore } from "redux-persist";
import { AsyncStorage, Text, YellowBox } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import immutableTransform from 'redux-persist-transform-immutable';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import reducers from './redux';
import AppRoutes from "./routes/routes";
import constants from "./config/constants";

const { AuthActions } = constants;
const { LOGGING_OUT } = AuthActions;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  transforms: [immutableTransform()],
  stateReconciler: autoMergeLevel2
};

const initialState = {
  Auth: {},
  Events: {},
  Organization: {},
};

const appReducer = combineReducers(reducers);
const rootReducer = (state, action) => {
  if (action.type === LOGGING_OUT) {
    state = { ...initialState }; // Clears state on logout
  }
  return appReducer(state, action);
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const middleware = [thunk];
if (Config.LOCAL) {
  middleware.push(createLogger());
}
const enhancer = composeWithDevTools({})(applyMiddleware(...middleware));
const store = createStore(persistedReducer, initialState, compose(enhancer));
const persistor = persistStore(store, null, () => store.getState());

YellowBox.ignoreWarnings([
  'Setting a timer',
  'Remote debugger',
  'Warning: Failed prop type: Invalid prop `ImageComponent` of type `object` supplied to `Avatar`, expected `function`.',
  'Require cycle:'
]);

export default class App extends Component {
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) {
      Text.defaultProps = { allowFontScaling: false };
    }
    OneSignal.init("c49cc06f-19a2-4cca-ba81-f88c765dec61");
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    this.onReceived = this.onReceived.bind(this);
    this.onOpened = this.onOpened.bind(this);
    this.onIds = this.onIds.bind(this);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppRoutes {...this.props}/>
        </PersistGate>
      </Provider>
    );
  }
}
