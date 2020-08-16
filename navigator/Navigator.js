import React from 'react';
import {createAppContainer, createSwitchNavigator } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import { View, Button, SafeAreaView } from 'react-native';
import Colors from '../constants/colors';
import * as authActions from '../store/actions/auth';

import HomepageScreen from '../screens/HomepageScreen';
import LoginScreen from '../screens/LoginScreen';
import StartupScreen from '../screens/StartupScreen';
import NormalSearchScreen from '../screens/NormalSearchScreen';
import SecretSearchScreen from '../screens/SecretSearchScreen';
import BookingsScreen from '../screens/BookingsScreen';
import RegistrationScreen from "../screens/RegistrationScreen";
import {useDispatch} from "react-redux";

//dsadsadadad

const DrawerNavigator = createDrawerNavigator(
    {
        "Homepage": HomepageScreen,
        "Ricerca Normale": NormalSearchScreen,
        "Ricerca Segreta": SecretSearchScreen,
        "Prenotazioni": BookingsScreen
    },
    {
        resetOnBlur: true,
        contentComponent: props => {
            const dispatch = useDispatch();
            return (
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                        <DrawerItems {...props} />
                        <Button
                            title="Logout"
                            color={Colors.primary}
                            onPress={() => {
                                dispatch(authActions.logout());
                                props.navigation.navigate('Login');
                            }}
                        />
                    </SafeAreaView>
                </View>
            );
        }
    },
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
    Startup: StartupScreen,
    Login: AuthNavigator,
    Homepage: DrawerNavigator
});

export default createAppContainer(MainNavigator);
