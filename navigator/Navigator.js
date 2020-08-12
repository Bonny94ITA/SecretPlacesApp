import React from 'react';
import { Platform, Text } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

import HomepageScreen from '../screens/HomepageScreen';
import LoginScreen from '../screens/LoginScreen';
import NormalSearchScreen from '../screens/NormalSearchScreen';
import SecretSearchScreen from '../screens/SecretSearchScreen';
import BookingsScreen from '../screens/BookingsScreen';
import Colors from "../constants/colors";

const DrawerNavigator = createDrawerNavigator(
    {
        Homepage: HomepageScreen,
        NormalSearch: NormalSearchScreen,
        SecretSearch: SecretSearchScreen,
        Bookings: BookingsScreen
    },
    {
        resetOnBlur: true
    }
);

const AuthNavigator = createStackNavigator({
        Login: LoginScreen
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }});

const MainNavigator = createSwitchNavigator({
    Login: AuthNavigator,
    Homepage: DrawerNavigator
});

export default createAppContainer(MainNavigator);