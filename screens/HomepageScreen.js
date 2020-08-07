import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import Colors from "../constants/colors";
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from "react-navigation-header-buttons";

const HomepageScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>Homepage</Text>
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
