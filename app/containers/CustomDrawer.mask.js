import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import theme from '../styles/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { getColor } from '../App';

class CustomDrawer extends Component {
  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollView} style={[styles.drawerBackground, { backgroundColor: getColor() || theme.PRIMARY_COLOR }]} showsVerticalScrollIndicator={false}>
        <View style={styles.headerDrawer}>
          <View style={styles.topSpacer} />
          <Icon name={'ios-bicycle'} color={theme.TEXT_COLOR_INVERT} size={80} />
          <View style={styles.topSpacer} />
        </View>
        <View style={styles.headerDrawer}>
          <View style={styles.topSpacer} />
          <Icon name={'ios-bus'} color={theme.TEXT_COLOR_INVERT} size={80} />
          <View style={styles.topSpacer} />
        </View>
        <View style={styles.headerDrawer}>
          <View style={styles.topSpacer} />
          <Icon name={'ios-boat'} color={theme.TEXT_COLOR_INVERT} size={80} />
          <View style={styles.topSpacer} />
        </View>
        <View style={styles.headerDrawer}>
          <View style={styles.topSpacer} />
          <Icon name={'ios-walk'} color={theme.TEXT_COLOR_INVERT} size={80} />
          <View style={styles.topSpacer} />
        </View>
        <View style={styles.headerDrawer}>
          <View style={styles.topSpacer} />
          <Icon name={'ios-car'} color={theme.TEXT_COLOR_INVERT} size={80} />
          <View style={styles.topSpacer} />
        </View>
        <TouchableOpacity style={styles.headerDrawer} onPress={() => this.props.navigation.replace('Login')}>
          <View style={styles.topSpacer} />
          <Icon name={'ios-train'} color={theme.TEXT_COLOR_INVERT} size={80} />
          <View style={styles.topSpacer} />
        </TouchableOpacity>
        
      </ScrollView>
    );
  }
}

export default CustomDrawer;

const styles = StyleSheet.create({
  topSpacer: {
    height: 15,
  },
  sectionTitle: {
    height: 45,
    alignItems: 'center',
    flexDirection: 'row',
  },
  sectionTitleSmall: {
    height: 35,
    alignItems: 'center',
    flexDirection: 'row',
  },
  sectionItem: {
    height: 38,
    alignItems: 'center',
    flexDirection: 'row',
  },
  sectionItemSmall: {
    height: 32,
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemText: {
    color: theme.TEXT_COLOR_INVERT,
    marginLeft: 38,
  },
  sectionTitleText: {
    color: theme.TEXT_COLOR_INVERT,
    fontWeight: '600',
    fontSize: 17,
  },
  mainDrawer: {
    flex: 1,
    marginHorizontal: 30,
  },
  headerDrawer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 15,
    borderBottomColor: theme.TEXT_COLOR_INVERT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomStartRadius: 15,
    borderBottomEndRadius: 15,
  },
  scrollView: {
    paddingVertical: 60,
  },
  drawerBackground: {
    backgroundColor: theme.PRIMARY_COLOR,
  },
  iconStyle: {
    marginRight: 10,
    width: 28,
  },
});

const sectionItemStyle = styles.sectionItem;
const sectionTitleStyle = styles.sectionTitle;
