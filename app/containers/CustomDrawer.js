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

class CustomDrawer extends Component {
  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollView} style={styles.drawerBackground} showsVerticalScrollIndicator={false}>
        <View style={styles.headerDrawer}>
          <View style={styles.topSpacer} />
          <Icon name={'ios-finger-print'} color={theme.TEXT_COLOR_INVERT} size={80} />
          <View style={styles.topSpacer} />
        </View>

        <View style={styles.mainDrawer}>
          <TouchableOpacity style={sectionTitleStyle}>
            <Icon name={"ios-mail"} size={26} color={theme.TEXT_COLOR_INVERT} style={styles.iconStyle}/>
            <Text style={styles.sectionTitleText}>{'Inbox'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={sectionItemStyle}>
            <Text style={styles.listItemText}>{'Incoming'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={sectionItemStyle}>
            <Text style={styles.listItemText}>{'Outgoing'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={sectionTitleStyle}>
            <Icon name={"ios-pulse"} size={26} color={theme.TEXT_COLOR_INVERT} style={styles.iconStyle}/>
            <Text style={styles.sectionTitleText}>{'Analytics'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={sectionItemStyle}>
            <Text style={styles.listItemText}>{'Reports'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={sectionItemStyle}>
            <Text style={styles.listItemText}>{'Graphs'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={sectionTitleStyle}>
            <Icon name={"ios-construct"} size={25} color={theme.TEXT_COLOR_INVERT} style={styles.iconStyle}/>
            <Text style={styles.sectionTitleText}>{'Settings'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={sectionTitleStyle} onPress={() => this.props.navigation.replace('Login')}>
            <Icon name={"ios-log-out"} size={25} color={theme.TEXT_COLOR_INVERT} style={styles.iconStyle}/>
            <Text style={styles.sectionTitleText}>{'Logout'}</Text>
          </TouchableOpacity>

        </View>
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
