import React, {useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    ImageBackground,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

import Colors from '../constants/colors';
import {useDispatch} from 'react-redux';
import {CONSTANTS, JSHash} from 'react-native-hash';
import {submitFacebookLogin, submitGoogleLogin, submitLogin} from '../store/actions/auth';
import {Formik} from 'formik';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
import {SocialIcon} from 'react-native-elements';

async function signInWithFacebookAsync() {
    try {
        await Facebook.initializeAsync('246982563186236');

        const {
            type,
            token,
            expirationDate,
            permissions,
            declinedPermissions,
        } = await Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile', 'email'],
        });
        if (type === 'success') {
            const response = await (await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`)).json();
            response.token = token;
            console.log("e");
            console.log(response)
            return response;
        } else {
            // type === 'cancel'
        }
    } catch ({message}) {
        alert(`Facebook Login Error: ${message}`);
    }
}

async function signInWithGoogleAsync() {
    try {
        const result = await Google.logInAsync({
            androidClientId: "744778791116-4i8pbooljrcu84n8a0h9eu1q5uq1m68g.apps.googleusercontent.com",
            iosClientId: "744778791116-33on6tj1j34ooe4cou7vqnusdf8st83o.apps.googleusercontent.com",
            scopes: ['profile', 'email'],
        });

        if (result.type === 'success') {
            return result;
        } else {
            return {cancelled: true};
        }
    } catch (e) {
        return {error: true};
    }
}

const LoginScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const login = async (email, password) => {
        setError(null);
        setIsLoading(true);

        try {
            let hash = await JSHash(password, CONSTANTS.HashAlgorithms.sha256);
            await dispatch(submitLogin(email, hash));
            props.navigation.navigate('Homepage');
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
    }

    if (error !== null) {
        Alert.alert('Errore', "Login Fallito!", [{text: 'OK'}]);
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
                        <Text style={styles.textTitle}>Secret Places </Text>
                    </View>
                    <View style={styles.screen}>
                        <View style={styles.inputContainer}>
                            <Formik
                                initialValues={{email: '', password: ''}}
                                onSubmit={async values => {
                                    await login(values.email, values.password);
                                }}
                            >
                                {({handleChange, handleBlur, handleSubmit, values}) => (
                                    <View>
                                        <TextInput
                                            placeholder={"Mail"}
                                            returnKeyType='next'
                                            keyboardType='email-address'
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
                                        <View style={{marginVertical: 5}}>
                                            <Button
                                                title="Login"
                                                onPress={handleSubmit}
                                                color={Colors.primary}/>
                                        </View>
                                    </View>
                                )}
                            </Formik>
                            <Text>Ti sei già registrato?</Text>
                            <TouchableOpacity onPress={() => {
                                props.navigation.navigate('Registrazione')
                            }}>
                                <Text style={styles.RegistrationStyle}>Registrazione</Text>
                            </TouchableOpacity>
                            <View
                                style={{flexDirection: 'row', alignItems: 'center', paddingTop: 20, paddingBottom: 20}}>
                                <View style={{flex: 1, height: 1, backgroundColor: 'orange'}}/>
                                <View>
                                    <Text style={{width: 50, textAlign: 'center', color: Colors.title}}>Oppure</Text>
                                </View>
                                <View style={{flex: 1, height: 1, backgroundColor: 'orange'}}/>
                            </View>
                            <View style={{textAlign: 'center'}}>
                                <SocialIcon
                                    title='Login con Google'
                                    onPress={async () => {
                                        const info = await signInWithGoogleAsync();
                                        await dispatch(submitGoogleLogin(info));
                                        props.navigation.navigate('Homepage');
                                    }}
                                    button
                                    type='google'
                                    iconStyle={{width: '100%'}}
                                    style={{paddingLeft: 10, paddingRight: 10}}
                                />
                                <SocialIcon
                                    title='Login con Facebook'
                                    onPress={async () => {
                                        const info = await signInWithFacebookAsync();
                                        await dispatch(submitFacebookLogin(info));
                                        props.navigation.navigate('Homepage');
                                    }}
                                    button
                                    type='facebook'
                                    iconStyle={{width: '100%'}}
                                    style={{paddingLeft: 10, paddingRight: 10}}
                                />
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center'
    },
    titleContainer: {
        flex: 0.45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textTitle: {
        color: Colors.title,
        fontSize: 70,
        fontFamily: 'Caveat-B',
    },
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center'
    },
    inputContainer: {
        width: 350,
        maxWidth: '87%',
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
        textAlign: 'center',
        padding: 10
    },
    RegistrationStyle: {
        color: Colors.title,
        paddingTop: 5
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reload: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default LoginScreen;

