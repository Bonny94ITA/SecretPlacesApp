import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {View, Button, SafeAreaView, StyleSheet} from 'react-native';
import Colors from '../constants/colors';
import * as authActions from '../store/actions/auth';

import HomepageScreen from '../screens/HomepageScreen';
import LoginScreen from '../screens/LoginScreen';
import StartupScreen from '../screens/StartupScreen';
import NormalSearchScreen from '../screens/NormalSearchScreen';
import SecretSearchScreen from '../screens/SecretSearchScreen';
import BookingsScreen from '../screens/BookingsScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import {useDispatch} from 'react-redux';
import ResultsScreen from '../screens/ResultsScreen';

const NormalSearchStackNavigator = createStackNavigator({
        normalSearch: NormalSearchScreen,
        resultsSearch: ResultsScreen,
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    });

const SecretSearchStackNavigator = createStackNavigator({
        secretSearch: SecretSearchScreen,
        resultsSearch: ResultsScreen,
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    });

const DrawerNavigator = createDrawerNavigator(
    {
        "Homepage": HomepageScreen,
        "Ricerca Normale": NormalSearchStackNavigator,
        "Ricerca Esperta": SecretSearchStackNavigator,
        "Ricerche Salvate": BookingsScreen
    },
    {
        contentComponent: props => {
            const dispatch = useDispatch();
            return (
                <View style={styles.container}>
                    <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                        <DrawerItems {...props}
                                     onItemPress={
                                         (route) => {
                                             if (route.route.routeName !== "Logout") {
                                                 if (route.route.routeName === "Ricerca Normale") {
                                                        props.navigation._childrenNavigation["Ricerca Normale"].navigate('normalSearch');
                                                 }

                                                 if (route.route.routeName === "Ricerca Esperta") {
                                                     props.navigation._childrenNavigation["Ricerca Esperta"].navigate('secretSearch');
                                                 }

                                                 props.onItemPress(route);
                                             }
                                         }
                                     }/>
                        <View style={{marginVertical: 10}}>
                            <Button
                                title="Logout"
                                color={Colors.primary}
                                onPress={() => {
                                    dispatch(authActions.submitLogout());
                                }}
                            />
                        </View>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 10,
    },
});

export default createAppContainer(MainNavigator);
