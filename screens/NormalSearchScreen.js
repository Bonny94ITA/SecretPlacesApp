import {Button, StyleSheet, Text, View} from "react-native";
import React from "react";
import Colors from "../constants/colors";
import SecretSearchScreen from "./SecretSearchScreen";
import Header from "../components/Header";

const NormalSearchScreen = () => {
    return (
        <View style={styles.header}>
            <Header title = {"Ricerca Normale"}/>
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

NormalSearchScreen.navigationOptions = {
    headerTitle: "Ricerca Normale"
}

export default NormalSearchScreen;