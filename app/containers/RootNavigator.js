import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { mask } from 'react-native-white-label';

// root routes
import Home from './Home';
import Login from './Login';
import DetailView from './DetailView';

import CustomDrawer from './CustomDrawer';

const HomeStack = createStackNavigator({
  Home: { screen: Home },
  DetailView: { screen: DetailView },
});

const Drawer = createDrawerNavigator({
  Landing: { screen: HomeStack },
}, {
    contentComponent: props => <CustomDrawer {...props} />,
    drawerPosition: mask === 'sr' ? 'right' : 'left'
  });

export default AppNavigator = createStackNavigator({
  Login: { screen: Login },
  MainDrawer: { screen: Drawer, navigationOptions: { header: null } },
});


