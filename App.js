import React, {useState} from 'react';
import {StyleSheet, Text, View, ImageBackground, TouchableWithoutFeedback, Keyboard} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";

import Colors from './constants/colors';
import Login from './screens/Login';

const image = './assets/sunset3.jpg';
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
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}>
            <View style={styles.container}>
                <ImageBackground source={require(image)} style={styles.image}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.textTitle}>Secret Places</Text>
                    </View>
                    <Login/>
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
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
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textTitle: {
        color: Colors.title,
        fontSize: 70,
        fontFamily: 'Caveat',
    }
});
