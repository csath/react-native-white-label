import React from 'react';
import {
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Animated,
    Dimensions,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import theme from '../../styles/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomIcon from '../../components/CustomIcon';

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
                        <Icon name={'ios-finger-print'} color={theme.TEXT_COLOR_INVERT} size={100} style={styles.logo}/>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={username => this.setState({ username })}
                            placeholder={'Username'}
                            value={username}
                            placeholderTextColor={theme.TEXT_COLOR_INVERT}
                        />
                        <TextInput
                            style={styles.textInput}
                            onChangeText={password => this.setState({ password })}
                            placeholder={'Password'}
                            value={password}
                            placeholderTextColor={theme.TEXT_COLOR_INVERT}
                        />
                        <TouchableOpacity style={styles.loginButton} onPress={this.login}>
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
                        {/* <CustomIcon name={'ios-notifications-outline'} color={theme.TEXT_COLOR_INVERT} size={40} /> */}

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
        backgroundColor: theme.PRIMARY_COLOR,
    },
    logo: {
        marginBottom: 40,
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
        backgroundColor: theme.SECONDARY_COLOR, 
        borderRadius: 4,
        marginTop: 60,
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