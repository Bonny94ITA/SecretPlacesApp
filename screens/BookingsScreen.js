import {Button, StyleSheet, Text, View} from "react-native";
import React from "react";
import Colors from "../constants/colors";
import HomepageScreen from "./HomepageScreen";
import Header from "../components/Header";

const BookingsScreen = () => {
    return (
        <View style={styles.header}>
            <Header title={"Prenotazioni"}/>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flex: 1
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default BookingsScreen;
