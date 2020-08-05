import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";

import Colors from './constants/colors';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './navigator/Navigator';
import LoginScreen from "./screens/LoginScreen";

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
        <NavigationContainer>
            <Navigator />
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({

});
