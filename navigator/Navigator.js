import React from 'react';

import HomepageScreen from '../screens/HomepageScreen';
import LoginScreen from '../screens/LoginScreen';
import NormalSearchScreen from '../screens/NormalSearchScreen';
import SecretSearchScreen from '../screens/SecretSearchScreen';
import BookingsScreen from '../screens/BookingsScreen';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer, DrawerActions } from '@react-navigation/native';

const Drawer = createDrawerNavigator();
function MainNavigator(props) {
    console.log(1);
    console.log(props);
    return (
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name="Login" component={LoginScreen}/>
                <Drawer.Screen name="Homepage" component={HomepageScreen}/>
                <Drawer.Screen name="NormalSearch" component={NormalSearchScreen}/>
                <Drawer.Screen name="SecretSearch" component={SecretSearchScreen}/>
                <Drawer.Screen name="Bookings" component={BookingsScreen}/>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

export default MainNavigator;
