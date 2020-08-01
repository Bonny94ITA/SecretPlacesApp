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
//SDADSsdsfsfsf
export default function App() {
    const [dataLoaded, setDataLoaded] = useState(false);

    if (!dataLoaded) {
        return (<AppLoading startAsync={fetchFonts} onFinish={() => setDataLoaded(true)}/>);
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require(image)} style={styles.image}>
                <View style={styles.titleContainer}>
                    <Text style={styles.textTitle}>Secret Places</Text>
                </View>
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
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textTitle: {
        color: '#ffe0cc',
        fontSize: 60,
        fontFamily: 'Caveat',
    }
});
