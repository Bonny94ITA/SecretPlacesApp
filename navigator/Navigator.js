import React from 'react';
import { Platform, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
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
    Homepage: HomepageScreen,
    "Ricerca Normale": {
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
    "Ricerca Segreta": {
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
            activeTintColor: 'white',
            shifting: true,
            barStyle: {
                backgroundColor: Colors.primaryColor
            }
        })
        : createBottomTabNavigator(tabScreenConfig, {
            tabBarOptions: {
                activeTintColor: Colors.accentColor
            }
        });

const DrawerNavigator = createDrawerNavigator(
    {
        Login: LoginScreen,
        Homepage: {
            screen: TabNavigator
        },
        NormalSearch: NormalSearchScreen,
        SecretSearch: SecretSearchScreen,
        Bookings: BookingsScreen,
    },
    {
        contentOptions: {
            activeTintColor: Colors.accentColor
        }
    }
);

export default createAppContainer(DrawerNavigator);
