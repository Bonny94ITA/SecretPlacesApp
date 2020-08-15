import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    TouchableWithoutFeedback,
    Keyboard,
    ImageBackground, ActivityIndicator, Alert
} from 'react-native';

import Colors from '../constants/colors';
import {useDispatch, useSelector} from "react-redux";
import {submitLogin, submitRegister} from "../store/actions/auth";

const RegistrationScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const loginState = useSelector(state => state.login);
    console.log(loginState);
    const dispatch = useDispatch();

    const register = async () => {
        setError(null);
        setIsLoading(true);

        try {
            await dispatch(submitRegister("abc@abc.com", "maicol", "Markov"));
            await dispatch(submitLogin("abc@abc.com", "maicol"));
            props.navigation.navigate('Homepage');
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
    }

    if (error !== null) {
        Alert.alert('An error occurred!', error, [{text: 'OK'}]);
        setIsLoading(false);
        setError(null);
    }

    if (isLoading) {
        return (<View style={styles.loading}>
            <ActivityIndicator size={"large"} color={Colors.primary}/>
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
                                placeholder={"Mail"}
                                style={styles.inputText}
                            />
                            <TextInput
                                placeholder={"Password"}
                                secureTextEntry={true}
                                style={styles.inputText}
                            />
                            <TextInput
                                placeholder={"Conferma Password"}
                                secureTextEntry={true}
                                style={styles.inputText}
                            />
                            <Button
                                style={styles.login}
                                title="Registrazione"
                                color={Colors.primary}
                                onPress={register}
                            />
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
        fontFamily: 'Caveat-B',
    },
    RegistrationStyle: {
        color: Colors.title,
        textDecorationLine: 'underline'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reload: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default RegistrationScreen;

