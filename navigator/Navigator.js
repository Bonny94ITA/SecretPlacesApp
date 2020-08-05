import React from 'react';
import {Button} from 'react-native';
//import { Ionicons } from '@expo/vector-icons';
//import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import HomepageScreen from '../screens/HomepageScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import Colors from '../constants/colors';
import NormalSearchScreen from '../screens/NormalSearchScreen';
import SecretSearchScreen from '../screens/SecretSearchScreen';
import BookingsScreen from '../screens/BookingsScreen';
import {createDrawerNavigator} from "@react-navigation/drawer";
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function StackNavigator(propsNav) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Homepage" component={HomepageScreen}/>
            <Stack.Screen name="Bookings" options={{
                headerLeft: (props) => (
                    <HeaderBackButton
                        {...props}
                        onPress={() => {
                            propsNav.navigation.goBack();
                        }}
                    />
                ),
            }} component={BookingsScreen}/>
            <Stack.Screen name="NormalSearch" options={{
                headerLeft: (props) => (
                    <HeaderBackButton
                        {...props}
                        onPress={() => {
                            propsNav.navigation.goBack();
                        }}
                    />
                ),
            }} component={NormalSearchScreen}/>
            <Stack.Screen name="SecretSearch" options={{
                headerLeft: (props) => (
                    <HeaderBackButton
                        {...props}
                        onPress={() => {
                            propsNav.navigation.goBack();
                        }}
                    />
                ),
            }} component={SecretSearchScreen}/>
        </Stack.Navigator>
    );
}

function MainNavigator() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Login" component={LoginScreen}/>
            <Drawer.Screen name="Homepage" component={StackNavigator}/>
            <Drawer.Screen name="NormalSearch" component={NormalSearchScreen}/>
            <Drawer.Screen name="SecretSearch" component={SecretSearchScreen}/>
            <Drawer.Screen name="Bookings" component={BookingsScreen}/>
        </Drawer.Navigator>
    );
}

export default MainNavigator;
