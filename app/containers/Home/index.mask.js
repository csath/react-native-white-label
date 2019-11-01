import React from 'react';
import {
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    Alert,
    TouchableOpacity,
} from 'react-native';
import theme from '../../styles/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerActions } from 'react-navigation-drawer';
import configs from 'rn-white-label';

export default class Home extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTintColor: theme.PRIMARY_COLOR,
        title: 'Welcome',
        headerRight: <Icon name={'ios-menu'} color={theme.TEXT_COLOR_INVERT} size={28} style={styles.drawerIcon} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}/>,
        headerStyle: {
            backgroundColor: theme.PRIMARY_COLOR,
        },
        headerTintColor: theme.TEXT_COLOR_INVERT,
        headerTitleStyle: {
             fontWeight: 'bold',
        },
        headerLeft: <Icon name={'ios-information-circle-outline'} color={theme.TEXT_COLOR_INVERT} size={28} style={styles.drawerIcon} onPress={() => Alert.alert("Yey!\nNow you can read Wl configs just using \n`import configs from 'rn-white-label'`\n inside JS env\n", JSON.stringify(configs, '', 4))}/>
    })

    state = {
    }

    
    render() {
        return(
            <SafeAreaView style={[styles.safeAreaView, { backgroundColor: theme.SECONDARY_COLOR }]}>
                <ScrollView contentContainerStyle={styles.container}>
                    <TouchableOpacity onPress={() => alert('Ohh, you need to take a Bicycle?')} style={styles.button}>
                        <Text style={styles.headerText}>Bicycle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => alert('Ohh, you need to take a Car?')}  style={styles.button}>
                        <Text style={styles.headerText}>Car</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => alert('Ohh, you need to take a Train?')}  style={styles.button}>
                        <Text style={styles.headerText}>Train</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    drawerIcon: {
        marginHorizontal: 15,
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
        color: theme.PRIMARY_COLOR,
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
    },
    button: {
        height: 60,
        backgroundColor: theme.TEXT_COLOR_INVERT,
        width: Dimensions.get('window').width * 0.75,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30
    }
});

