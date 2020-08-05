import React from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import NormalSearchScreen from '../screens/NormalSearchScreen';
import SecretSearchScreen from '../screens/SecretSearchScreen';
import {View, Text, StyleSheet, Button} from 'react-native';
import Colors from "../constants/colors";

const HomepageScreen = props => {
    console.log(props);
    return (
        <View style={styles.screen}>
            <Text>Homepage</Text>
            <Button
                title="Go to Bookings"
                onPress={() => props.navigation.navigate('Bookings')}
                color={Colors.primary}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default HomepageScreen;
