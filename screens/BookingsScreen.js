import {StyleSheet, Text, View} from "react-native";
import React from "react";

const BookingsScreen = props => {
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

export default BookingsScreen;