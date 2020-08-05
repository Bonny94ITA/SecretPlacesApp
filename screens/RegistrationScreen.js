import React from 'react';
import {View, Text, StyleSheet, TextInput, Button, Alert} from 'react-native';

import Colors from '../constants/colors';

const RegistrationScreen = props => {
    return (
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
                    title="LoginScreen"
                    onPress={() => Alert.alert('Simple Button pressed')}
                    color={Colors.primary}
                />
                <Text> {'Registrazione'} </Text>
                <Text> {'LoginScreen come ospite'} </Text>
            </View>
        </View>
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
    }
});

export default RegistrationScreen;

