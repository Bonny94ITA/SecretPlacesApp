import React from 'react';
import {View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    ImageBackground} from 'react-native';
import Header from '../components/Header';


const HomepageScreen = props => {
    return (
        <View style={styles.header}>
            <Header title={"Homepage"}/>
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
            }}>
                <View style={styles.container}>
                    <ImageBackground source={require('../assets/sunset.jpg')} style={styles.image}>
                        <View style={styles.screen}>

                        </View>
                    </ImageBackground>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flex: 1
    },
    screen: {
        flex: 1,
        paddingTop: '50%',
        padding: 10,
        alignItems: 'center'
    },
    container: {
        flex: 1,
        flexDirection: "column"
    },
    // titleContainer: {
    //     flex: 0.5,
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    }
});

export default HomepageScreen;
