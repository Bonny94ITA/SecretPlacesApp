import {StyleSheet, Text, View} from "react-native";
import React from "react";

const NormalSearchScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>Ricerca Normale</Text>
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

export default NormalSearchScreen;