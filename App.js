import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import {Provider as PaperProvider} from 'react-native-paper';
import RootNavigator from './navigator/Navigator';

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
        <PaperProvider>
            <RootNavigator/>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({});