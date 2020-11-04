import React, {useState} from 'react';
import {StyleSheet, YellowBox} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import {Provider as PaperProvider} from 'react-native-paper';
import RootNavigator from './navigator/NavigatorContainer';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import authReducer from './store/reducers/auth';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import normalSearchReducer from "./store/reducers/ns";
import secretSearchReducer from "./store/reducers/ss";
import citiesReducer from "./store/reducers/cities";
import _ from 'lodash';

YellowBox.ignoreWarnings(['componentWillReceiveProps']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('componentWillReceiveProps') <= -1) {
        _console.warn(message);
    }
};

const rootReducer = combineReducers({
    auth: authReducer,
    normalSearch: normalSearchReducer,
    secretSearch: secretSearchReducer,
    cities: citiesReducer
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
