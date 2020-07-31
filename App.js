import React, {useState} from 'react';
import {StyleSheet, Text, View, ImageBackground, Button, Alert, TextInput} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";

const image = './assets/sunset2.jpg';
const fetchFonts = () => {
    return Font.loadAsync({
        'Caveat': require('./assets/fonts/Caveat-Bold.ttf')
    });
}

export default function App() {
    const [dataLoaded, setDataLoaded] = useState(false);

    if (!dataLoaded) {
        return (<AppLoading startAsync={fetchFonts} onFinish={() => setDataLoaded(true)}/>);
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require(image)} style={styles.image}>
                <Text style={styles.textTitle}>Secret Places</Text>
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
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    textTitle: {
        marginTop: "60%",
        marginLeft: "13%",
        color: '#ffe0cc',
        fontSize: 60,
        fontFamily: 'Caveat',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1
    },
    login: {}
});
