import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';

import HomepageScreen from '../screens/HomepageScreen';
import LoginScreen from '../screens/LoginScreen';
import NormalSearchScreen from '../screens/NormalSearchScreen';
import SecretSearchScreen from '../screens/SecretSearchScreen';
import BookingsScreen from '../screens/BookingsScreen';
import RegistrationScreen from "../screens/RegistrationScreen";

const DrawerNavigator = createDrawerNavigator(
    {
        "Homepage": HomepageScreen,
        "Ricerca Normale": NormalSearchScreen,
        "Ricerca Segreta": SecretSearchScreen,
        "Prenotazioni": BookingsScreen
    },
    {
        resetOnBlur: true
    }
);

const AuthNavigator = createStackNavigator({
        "Login": LoginScreen,
        "Registrazione": RegistrationScreen,
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    });

const MainNavigator = createSwitchNavigator({
    Login: AuthNavigator,
    Homepage: DrawerNavigator
});

export default createAppContainer(MainNavigator);
