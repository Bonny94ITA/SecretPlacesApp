import React from 'react';
import {View, Text, StyleSheet, TextInput, Button, Alert} from 'react-native';

const Login = props => {
    return (
        <View style={styles.screen}>
            <View style ={styles.inputContainer}>
                <TextInput
                    placeholder={"username"}
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                />
                <TextInput
                    placeholder={"password"}
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
        alignItems: 'center'
    }
});

export default Login;

