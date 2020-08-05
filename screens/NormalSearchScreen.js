import {Button, StyleSheet, Text, View} from "react-native";
import React from "react";
import Colors from "../constants/colors";

const NormalSearchScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>Normal Search</Text>
            <Button
                title="Go to Secret Search"
                onPress={() => props.navigation.navigate('SecretSearch')}
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

export default NormalSearchScreen;