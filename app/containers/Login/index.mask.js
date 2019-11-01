import React from 'react';
import {
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Animated,
    Dimensions,
    Image,
    TouchableOpacity,
} from 'react-native';
import theme from '../../styles/theme';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Login extends React.Component {
    static navigationOptions = {
        header: null,
    };

    state = {
        username: '',
        password: '',
        opacity: new Animated.Value(0),
    }

    componentDidMount() {
        const { opacity } = this.state;
        Animated.timing(
            opacity,
            {
              toValue: 1,
              duration: 1000,
            }
          ).start();
    }

    login = () => {
        const { opacity } = this.state;
        Animated.timing(
            opacity,
            {
              toValue: 0,
              duration: 300,
            }
        ).start();
        setTimeout(() => this.props.navigation.replace('MainDrawer'), 300);
    }

    render() {
        const { username, password, opacity } = this.state;
        return(
            <SafeAreaView style={styles.parentContainer}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Animated.View style={[styles.container, { opacity }]}>
                        <Image source={require('../../images/bike.gif')} backgroundColor={'transparent'} style={styles.logo}/>
                        <TouchableOpacity style={styles.loginButton} onPress={this.login}>
                            <Text style={styles.loginText}>Get started</Text>
                        </TouchableOpacity>
                    </Animated.View>
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
    parentContainer: {
        flex: 1,
        backgroundColor: theme.TEXT_COLOR_INVERT,
    },
    logo: {
        marginBottom: 40,
        height: 150
    },
    textInput: { 
        height: 40, 
        width: Dimensions.get('window').width * 2 / 3,
        borderColor: theme.TEXT_COLOR_INVERT, 
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 15,
        color: theme.TEXT_COLOR_INVERT,
        fontSize: 17,
        marginVertical: 15,
    },
    loginButton: {
        height: 45, 
        width: Dimensions.get('window').width * 2 / 3,
        backgroundColor: theme.PRIMARY_COLOR, 
        borderRadius: 4,
        marginTop: 100,
        marginBottom: 60,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: theme.GALLERY_COLOR,
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: {
            height: 2,
            width: 0
        }
    },
    loginText: {
        textAlign: 'center',
        color: theme.TEXT_COLOR_INVERT,
        fontSize: 19,
        fontWeight: 'bold'
    }
});