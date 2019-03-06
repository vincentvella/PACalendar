import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createDrawerNavigator, createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from "react-navigation";
import Feed from "./Main/feed";
import Calendar from "./Main/calendar";
import { colors } from "../config/styles";
import LoginContainer from "./Login/login";
import { findTabIcon } from "../config/helpers";
import Discover from "./Main/discover/discover";
import Drawer from "../components/drawer/drawer";
import LoadingScreen from "./Loading/loading-screen";
import AuthLoadingScreen from "./Auth/auth-loading";
import { Listing, Organization } from "../components";
import CodePushScreen from "./Loading/code-push-screen";

//<editor-fold desc="Tab Settings">
const tabSettings = {
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName = findTabIcon(routeName, focused);
      if (routeName === 'Posters' || routeName === 'Feed') {
        return <MaterialCommunityIcons name={iconName} size={25} color={tintColor}/>;
      } else if (routeName === 'Calendar') {
        return <FontAwesome name={iconName} size={25} color={tintColor}/>;
      }
      return <Ionicon name={iconName} size={25} color={tintColor}/>;
    },
  }),
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: colors.blue,
    inactiveTintColor: 'gray',
  },
  animationEnabled: false,
  swipeEnabled: false,
};

const drawerButton = (title) => ({
  navigationOptions: ({ navigation }) => ({
    title,
    headerBackTitle: title,
    headerLeft: (
      <TouchableOpacity style={{ paddingLeft: 15 }} onPress={() => navigation.toggleDrawer()}>
        <FontAwesome name={'navicon'} size={25} color={'black'}/>
      </TouchableOpacity>
    )
  })
});

const otherStackSettings = {
  navigationOptions: () => ({
    title: 'Listing',
  })
};

const tabNavigatorConfiguration = ({ navigation }) => ({tabBarVisible: !(navigation.state.index > 0)});

//</editor-fold>

//<editor-fold desc="Main Tab Configuration">
const LoginStack = createStackNavigator({
  Login: { screen: LoginContainer, navigationOptions: { header: null } }
});

const ListingStack = createStackNavigator({
  Listing: { screen: Listing, path: 'listing', ...otherStackSettings },
});

const OrganizationStack = createStackNavigator({
  Organization: { screen: Organization, path: 'organization', ...otherStackSettings },
});

const FeedStack = createStackNavigator({
  Feed: { screen: Feed, path: 'feed', ...drawerButton('Feed') },
  Listing: { screen: Listing, navigationOptions: () => ({ title: 'Listing' }) },
  Organization: { screen: Organization, navigationOptions: () => ({ title: 'Organization' }) },
});

const CalendarStack = createStackNavigator({
  Calendar: { screen: Calendar, path: 'calendar', ...drawerButton('Calendar') },
  Listing: { screen: Listing, navigationOptions: () => ({ title: 'Listing' }) },
  Organization: { screen: Organization, navigationOptions: () => ({ title: 'Organization' }) },
});

const DiscoverStack = createStackNavigator({
  Discover: { screen: Discover, path: 'discover', ...drawerButton('Discover') },
  Listing: { screen: Listing, navigationOptions: () => ({ title: 'Listing' }) },
  Organization: { screen: Organization, navigationOptions: () => ({ title: 'Organization' }) },
});

FeedStack.navigationOptions = tabNavigatorConfiguration;
CalendarStack.navigationOptions = tabNavigatorConfiguration;
DiscoverStack.navigationOptions = tabNavigatorConfiguration;
//</editor-fold>

const HomeStack = createStackNavigator({
  Tabs: {
    screen: createBottomTabNavigator({
      Feed: FeedStack,
      Calendar: CalendarStack,
      Discover: DiscoverStack,
    }, { initialRouteName: 'Calendar', ...tabSettings })
  },
  ListingStack, //To see a deep linked event
  OrganizationStack, //To see a deep linked Org
}, { navigationOptions: { header: null } });

const DrawerNavigator = createDrawerNavigator({
  Home: { screen: HomeStack, path: 'home' },
}, { contentComponent: Drawer });

const AuthLoadingStack = createStackNavigator({
  CodePush: { screen: CodePushScreen, path: 'codePush', navigationOptions: { header: null } },
  AuthLoading: { screen: AuthLoadingScreen, path: 'authLoading', navigationOptions: { header: null, title: 'Login' } },
});

const AppRoutes = createSwitchNavigator({
  AuthLoading: { path: 'loadAuth', screen: AuthLoadingStack, navigationOptions: { header: null } },
  Login: {
    screen: LoginStack
  },
  Loading: {
    screen: LoadingScreen
  },
  Main: {
    path: 'main',
    screen: DrawerNavigator,
    navigationOptions: { header: null }
  }
}, {
  navigationOptions: {
    initialRouteName: 'AuthLoading',
  }
});

export default class AppRouter extends Component {
  render() {
    return (
      <AppRoutes/>
    );
  }
}
