import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import {Provider as PaperProvider} from 'react-native-paper';
import RootNavigator from './navigator/Navigator';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import loginReducer from './store/reducers/login';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';

const rootReducer = combineReducers({
    login: loginReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
    return Font.loadAsync({
        'Caveat-R': require('./assets/fonts/Caveat-Regular.ttf'),
        'Caveat-B': require('./assets/fonts/Caveat-Bold.ttf')
    });
}

export default function App() {
    const [dataLoaded, setDataLoaded] = useState(false);

    if (!dataLoaded) {
        return (<AppLoading startAsync={fetchFonts} onFinish={() => setDataLoaded(true)}/>);
    }

    return (
        <Provider store={store}>
            <PaperProvider>
                <RootNavigator/>
            </PaperProvider>
        </Provider>
    );
}

const styles = StyleSheet.create({});
