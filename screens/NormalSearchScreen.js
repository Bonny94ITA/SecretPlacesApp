import {Button, StyleSheet, Text, View} from "react-native";
import React from "react";
import Colors from "../constants/colors";
import SecretSearchScreen from "./SecretSearchScreen";

const NormalSearchScreen = () => {
    return (
        <View style={styles.screen}>
            <Text>Normal Search</Text>
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

NormalSearchScreen.navigationOptions = {
    headerTitle: "Ricerca Normale"
}

export default NormalSearchScreen;