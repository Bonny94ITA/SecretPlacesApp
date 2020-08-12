import {Button, StyleSheet, Text, View} from "react-native";
import React from "react";
import Colors from "../constants/colors";
import Header from "../components/Header";

const SecretSearchScreen = () => {
    return (
        <View style={styles.header}>
            <Header title = {"Ricerca Segreta"}/>
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

SecretSearchScreen.navigationOptions = {
    headerTitle: "Ricerca Segreta"
}

export default SecretSearchScreen;