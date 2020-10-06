import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    TouchableWithoutFeedback,
    Keyboard,
    ImageBackground,
    ActivityIndicator,
    Alert
} from 'react-native';

import Colors from '../constants/colors';
import {useDispatch} from 'react-redux';
import {JSHash, CONSTANTS} from 'react-native-hash';
import {submitLogin, submitRegister} from '../store/actions/auth';
import {Formik} from 'formik';

const RegistrationScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const register = async (email, password, username) => {
        setError(null);
        setIsLoading(true);

        try {
            let hash = await JSHash(password, CONSTANTS.HashAlgorithms.sha256);
            await dispatch(submitRegister(email, hash, username));
            await dispatch(submitLogin(email, hash));
            props.navigation.navigate('Homepage');
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
    }

    if (error !== null) {
        Alert.alert('Errore', "Registrazione fallita!", [{text: 'OK'}]);
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
                            <Formik
                                initialValues={{username: '', email: '', password: '', confirmpassword: ''}}
                                onSubmit={async values => {
                                    await register(values.email, values.password, values.username);
                                }}
                            >
                                {({handleChange, handleBlur, handleSubmit, values}) => (
                                    <View>
                                        <TextInput
                                            placeholder={"Username"}
                                            returnKeyType='next'
                                            onChangeText={handleChange('username')}
                                            onBlur={handleBlur('username')}
                                            //value={values.username}
                                            style={styles.inputText}
                                        />
                                        <TextInput
                                            placeholder={"Mail"}
                                            keyboardType='email-address'
                                            returnKeyType='next'
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('email')}
                                            //value={values.email}
                                            style={styles.inputText}
                                        />
                                        <TextInput
                                            placeholder={"Password"}
                                            returnKeyType='next'
                                            secureTextEntry={true}
                                            onChangeText={handleChange('password')}
                                            onBlur={handleBlur('password')}
                                            //value={values.password}
                                            style={styles.inputText}
                                        />
                                        <TextInput
                                            placeholder={"Conferma Password"}
                                            returnKeyType='next'
                                            secureTextEntry={true}
                                            onChangeText={handleChange('confirmpassword')}
                                            onBlur={handleBlur('confirmpassword')}
                                            //value={values.confirmpassword}
                                            style={styles.inputText}
                                        />
                                        <View style={{marginVertical: 5}}>
                                            <Button
                                                title="Registrazione"
                                                color={Colors.primary}
                                                onPress={handleSubmit}
                                            />
                                        </View>
                                    </View>
                                )}
                            </Formik>
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

