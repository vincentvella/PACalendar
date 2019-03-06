import React from "react";
import { AppRegistry } from 'react-native';
import App from './src/index';
import { name } from './app.json';

const Application = () => (<App />);

AppRegistry.registerComponent(name, () => Application);
