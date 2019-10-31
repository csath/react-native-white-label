import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

// root routes
import Home from './Home';
import Login from './Login';

import CustomDrawer from './CustomDrawer';

const HomeStack = createStackNavigator({
  Home: { screen: Home },
});

const Drawer = createDrawerNavigator({
  Landing: { screen: HomeStack },
}, {
    contentComponent: props => <CustomDrawer {...props} />,
  });

export default AppNavigator = createStackNavigator({
  Login: { screen: Login },
  MainDrawer: { screen: Drawer, navigationOptions: { header: null } },
});


