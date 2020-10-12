import React from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    Text,
    ScrollView
} from 'react-native';

import Header from '../components/Header';
import Colors from '../constants/colors';

const HomepageScreen = props => {
    return (
        <View style={styles.header}>
            <Header title={"Homepage"}/>
            <View style={styles.container}>
                <ImageBackground source={require('../assets/sunset.jpg')} style={styles.image}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.textTitle}>Secret Places</Text>
                    </View>
                    <View style={styles.screen}>

                    </View>
                </ImageBackground>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flex: 1
    },
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center'
    },
    titleContainer: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textTitle: {
        color: Colors.title,
        fontSize: 70,
        fontFamily: 'Caveat-B',
    },
    screen: {
        flex: 1,
        paddingTop: '50%',
        padding: 10,
        alignItems: 'center'
    }
});

export default HomepageScreen;
