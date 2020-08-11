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

const tabScreenConfig = {
    NormalSearch: {
        screen: NormalSearchScreen,
        navigationOptions: {
            tabBarIcon: tabInfo => {
                return (
                    <Ionicons name="ios-restaurant" size={25} color={tabInfo.tintColor} />
                );
            },
            tabBarColor: Colors.primaryColor,
            tabBarLabel:
                Platform.OS === 'android' ? (
                    <Text>Meals</Text>
                ) : (
                    'Meals'
                )
        }
    },
    Homepage: {
        screen: HomepageScreen,
    },
    SecretSearch: {
        screen: SecretSearchScreen,
        navigationOptions: {
            tabBarIcon: tabInfo => {
                return <Ionicons name="ios-star" size={25} color={tabInfo.tintColor} />;
            },
            tabBarColor: Colors.accentColor,
            tabBarLabel:
                Platform.OS === 'android' ? (
                    <Text>Favorites</Text>
                ) : (
                    'Favorites'
                )
        }
    }
};

const TabNavigator =
    Platform.OS === 'android'
        ? createMaterialBottomTabNavigator(tabScreenConfig, {
            initialRouteName: 'Homepage',
            activeTintColor: 'white',
            shifting: true,
            barStyle: {
                backgroundColor: Colors.primaryColor
            },
        })
        : createBottomTabNavigator(tabScreenConfig, {
            initialRouteName: 'Homepage',
            tabBarOptions: {
                activeTintColor: Colors.accentColor
            }
        });

const DrawerNavigator = createDrawerNavigator(
    {
        Homepage: {
            screen: TabNavigator
        },
        NormalSearch: NormalSearchScreen,
        SecretSearch: SecretSearchScreen,
        Bookings: BookingsScreen,
    }
);

const AuthNavigator = createStackNavigator({
    Login: LoginScreen
});

const MainNavigator = createSwitchNavigator({
    Login: AuthNavigator,
    Homepage: DrawerNavigator
});

export default createAppContainer(MainNavigator);
