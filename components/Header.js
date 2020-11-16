import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import Colors from '../constants/colors';

const Header = props => {
    return (
        <View style={styles.header}>
            <View style={styles.rowContainer}>
                <View style={styles.columnContainer}>
                    <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                        <Image source={require('../assets/drawer.png')} style={styles.hamburger}/>
                    </TouchableOpacity>
                    <View></View>
                    <View></View>
                    <Text style={styles.headerTitle}>{props.title}</Text>
                    <View></View>
                    <View></View>
                    <View></View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 90,
        paddingTop: 30,
        backgroundColor: Colors.header
    },
    rowContainer: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 10
    },
    columnContainer:{
        flex: 7,
        flexDirection: "row",
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    hamburger: {
        width: 50,
        height: 50,
        tintColor: '#bd631f'
    },
    headerTitle: {
        color: 'white',
        fontSize: 30,
        fontFamily: 'Caveat-R',
        paddingRight: 30
    }
});

export default Header;
