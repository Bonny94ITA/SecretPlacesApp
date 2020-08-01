import React, {useState} from 'react';
import {StyleSheet, Text, View, ImageBackground, Button, Alert, TextInput} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";

import Login from './screens/Login';

const image = './assets/sunset2.jpg';
const fetchFonts = () => {
    return Font.loadAsync({
        'Caveat': require('./assets/fonts/Caveat-Bold.ttf')
    });
}
//SDADS
export default function App() {
    const [dataLoaded, setDataLoaded] = useState(false);

    if (!dataLoaded) {
        return (<AppLoading startAsync={fetchFonts} onFinish={() => setDataLoaded(true)}/>);
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require(image)} style={styles.image}>
                <Text style={styles.textTitle}>Secret Places</Text>
                <Login/>
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
        marginVertical: 100,
        marginLeft: "13%",
        color: '#ffe0cc',
        fontSize: 60,
        fontFamily: 'Caveat',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
