import {Button, StyleSheet, Text, View} from "react-native";
import React from "react";
import Colors from "../constants/colors";

const BookingsScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>Bookings</Text>
            <Button
                title="Go to Normal Search"
                onPress={() => props.navigation.navigate('NormalSearch')}
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

export default BookingsScreen;