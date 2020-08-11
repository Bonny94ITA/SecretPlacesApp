import {Button, StyleSheet, Text, View} from "react-native";
import React from "react";
import Colors from "../constants/colors";
import HomepageScreen from "./HomepageScreen";

const BookingsScreen = () => {
    return (
        <View style={styles.screen}>
            <Text>Bookings</Text>
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

BookingsScreen.navigationOptions = {
    headerTitle: 'Prenotazioni'
}

export default BookingsScreen;