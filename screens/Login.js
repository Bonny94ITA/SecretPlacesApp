import React from 'react';
import {View, Text, StyleSheet, TextInput, Button, Alert} from 'react-native';

const Login = props => {
    return (
        <View style={styles.screen}>
            <View style ={styles.inputContainer}>
                <TextInput
                    placeholder={"Username"}
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                />
                <TextInput
                    placeholder={"Password"}
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                />
                <Button
                    style={styles.login}
                    title="Login"
                    onPress={() => Alert.alert('Simple Button pressed')}
                />
                <Text> {'Login come ospite'} </Text>
                <Text> {'Registrazione'} </Text>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
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
    }
});

export default Login;

