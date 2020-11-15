import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Colors from '../constants/colors';

const Header = props => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} >
                <Image source={require('../assets/drawer.png')} style={{ width: 50, height: 50, tintColor: '#bd631f' }} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{props.title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 90,
        paddingTop: 27,
        backgroundColor: Colors.header,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle: {
        color: 'white',
        fontSize: 30,
        fontFamily: 'Caveat-R'
    }
});

export default Header;
