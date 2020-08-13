import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Keyboard,
    ImageBackground,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import Colors from '../constants/colors';
import {useSelector, useDispatch} from "react-redux";
import {submitLogin} from "../store/actions/login";

const LoginScreen = props => {
    //TRY AGAIN
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const loginState = useSelector(state => state.login);
    console.log(loginState);
    const dispatch = useDispatch();

    const submitLoginHandler = async () => {
        //Chiamata HTTP
        setIsLoading(true);

        try {
            await dispatch(submitLogin("ciao", "ciao"));
            setTimeout(function () {
                setIsLoading(false);
            }, 5000);

            props.navigation.navigate('Homepage');
        } catch(err) {
            setError(err.message);
        }
    }

    const submitRegistrationHandler = () => {
        props.navigation.navigate('Registrazione');
    }

    if (error !== null) {
        return (<View style={styles.loading}>
            <Text>An error occurred!</Text>
        </View>);
    }

    if (isLoading) {
        return (<View style={styles.loading}>
            <ActivityIndicator size={"large"} color={Colors.primary} />
        </View>);
    }

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}>
            <View style={styles.container}>
                <ImageBackground source={require('../assets/sunset3.jpg')} style={styles.image}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.textTitle}>Secret Places</Text>
                    </View>
                    <View style={styles.screen}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder={"Username"}
                                style={styles.inputText}
                            />
                            <TextInput
                                placeholder={"Password"}
                                secureTextEntry={true}
                                style={styles.inputText}
                            />
                            <Button
                                style={styles.login}
                                title="Login"
                                onPress={submitLoginHandler}
                                color={Colors.primary}
                            />
                            <Text
                                style={styles.RegistrationStyle}
                                onPress={submitRegistrationHandler}> {'Registrazione'} </Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center'
    },
    inputContainer: {
        width: 300,
        maxWidth: '80%',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 6,
        shadowOpacity: 0.26,
        elevation: 8,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10
    },
    inputText: {
        height: 40,
        borderColor: 'orange',
        borderWidth: 1,
        marginVertical: 5,
        width: 225,
        borderRadius: 10,
        textAlign: 'center'
    },
    login: {
        color: Colors.primary
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    container: {
        flex: 1,
        flexDirection: "column"
    },
    titleContainer: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textTitle: {
        color: Colors.title,
        fontSize: 70,
        fontFamily: 'Caveat',
    },
    RegistrationStyle: {
        color: Colors.title,
        textDecorationLine: 'underline'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default LoginScreen;

