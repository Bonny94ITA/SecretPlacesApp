import {Button, StyleSheet, Text, View} from "react-native";
import React from "react";
import Colors from "../constants/colors";

const SecretSearchScreen = () => {
    return (
        <View style={styles.screen}>
            <Text>Secret Search</Text>
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

SecretSearchScreen.navigationOptions = {
    headerTitle: "Ricerca Segreta"
}

export default SecretSearchScreen;