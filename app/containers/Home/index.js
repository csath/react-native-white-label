import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SectionList,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import theme from '../../styles/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerActions } from 'react-navigation-drawer';

function Item({ title }) {
    return (
      <View style={styles.itemContainer}>
          <View style={styles.item}>

          </View>
          <View style={styles.item}>

        </View>
      </View>
    );
}

const DATA = [
    {
      title: {
          display: 'My Actions',
          color: theme.PRIMARY_COLOR,
      },
      data: ['Pizza', ''],
    },
    {
        title: {
            display: 'My Options',
            color: '#F62459',
        },
      data: ['French Fries', ''],
    },
    {
        title: {
            display: 'Career Coaching',
            color: '#FFA400',
        },
      data: ['Water', '', ''],
    },
  ];

export default class Home extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Welcome',
        headerStyle: {
            backgroundColor: theme.PRIMARY_COLOR,
        },
        headerLeft: <Icon name={'ios-menu'} color={theme.TEXT_COLOR_INVERT} size={28} style={styles.drawerIcon} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}/>,
        headerTintColor: theme.TEXT_COLOR_INVERT,
        header: null

    })

    state = {
        menuColor: DATA[0].title.color
    }

    ref = React.createRef();

    _onViewableItemsChanged = (
        info = {
            viewableItems: {
                key,
                isViewable,
                item: { columns },
                index,
                section
            },
        },
    ) => {
        const visibleSec = (info.viewableItems.find(i => i.isViewable));
        if (visibleSec && visibleSec.section && visibleSec.section.title && visibleSec.section.title.color) {
            this.setState({ menuColor: visibleSec.section.title.color});
        }
    };
    
    render() {
        return(
            <SafeAreaView style={[styles.safeAreaView, { backgroundColor: this.state.menuColor }]}>
                <Icon name={'ios-menu'} color={theme.TEXT_COLOR_INVERT} size={28} style={styles.drawerIcon} onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}/>
                 <SectionList
                    ref={this.ref}
                    sections={DATA}
                    stickySectionHeadersEnabled={true}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item title={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={[styles.header,  { backgroundColor: this.state.menuColor || theme.TEXT_COLOR_INVERT }]}>
                            <Text style={[styles.headerText]}>{title.display}</Text>
                        </View>
                    )}
                    onViewableItemsChanged={this._onViewableItemsChanged}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    drawerIcon: {
        marginHorizontal: 15,
        position: 'absolute',
        top: 60,
        zIndex: 999
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: theme.TEXT_COLOR_INVERT
    },
    header: {
        height: 60,
        flex: 1,
        justifyContent: 'center'
    },
    headerText: {
        alignSelf: 'center',
        fontSize: 18,
        color: theme.TEXT_COLOR_INVERT,
        fontWeight: 'bold'
    },
    divider: {
        width: Dimensions.get('window').width - 30,
        height: StyleSheet.hairlineWidth,
        backgroundColor: theme.DIVIDER_COLOR
    },
    itemContainer: {
        margin: 30,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    item: {
        borderRadius: 4,
        backgroundColor: theme.TEXT_COLOR_INVERT,
        height: 200,
        width: 150,
        margin: 15,
    }
});

