import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SectionList,
    SafeAreaView,
    Dimensions,
    Image
} from 'react-native';
import theme from '../../styles/theme';
import configs from 'react-native-white-label';

export default class Home extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerStyle: {
            backgroundColor: theme.PRIMARY_COLOR,
        },
        headerTintColor: theme.TEXT_COLOR_INVERT,
        headerTitleStyle: {
             fontWeight: 'bold',
        },
    })

    
    render() {
        return(
            <SafeAreaView style={[styles.safeAreaView, { backgroundColor: theme.BACKGROUND_COLOR, justifyContent: 'center', alignItems: 'center' }]}>
                <Image source={require('../../images/prank.gif')} style={{ height: Dimensions.get('window').height * (configs.mask === 'sr' ? 0.6 : 0.2), }}/>
                <Text style={styles.headerText}>{`I'm running on\n${configs.mask.toUpperCase()}\nmask configs`}</Text>
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
    drawerIconRight: {
        marginHorizontal: 15,
        position: 'absolute',
        top: 60,
        right: 0,
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
        fontSize: 24,
        color: theme.TEXT_COLOR_INVERT,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 15,
        // position: 'absolute',
        // bottom: Dimensions.get('window').height / 3,
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

