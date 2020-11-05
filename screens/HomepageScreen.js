import React, {useEffect} from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    Text,
    ScrollView
} from 'react-native';

import Header from '../components/Header';
import Colors from '../constants/colors';
import serverURL from "../components/ServerInfo";
import * as authActions from "../store/actions/auth";
import {CheckBox} from "react-native-elements";
import {useDispatch} from "react-redux";
import {setCities} from '../store/actions/cities';

function timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Timeout exceeded."))
        }, milliseconds);
        promise.then(resolve, reject);
    });
}

async function getCities(dispatch) {
    let cities = null;

    await timeout(5000, fetch(serverURL + '/hotels/cities'))
        .then(async function (response) {
            cities = await response.json();
        }, function (error) {
            dispatch(authActions.submitLogout());
            console.log(error);
        }).catch(function (error) {
            dispatch(authActions.submitLogout());
            console.log(error);
        });

    return cities;
}

const HomepageScreen = props => {
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchCities(dispatch) {
            return await getCities(dispatch);
        }

        fetchCities(dispatch).then(cities => dispatch(setCities(cities)));
    }, []);

    return (
        <View style={styles.header}>
            <Header title={"Homepage "}/>
            <View style={styles.container}>
                <ImageBackground source={require('../assets/sunset.jpg')} style={styles.image}>
                    <ScrollView>
                        <View style={styles.titleContainer}>
                            <Text style={styles.textTitle}>Secret Places </Text>
                        </View>
                        <View style={styles.screen}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.faq}>FAQ </Text>
                                <Text style={styles.question}>How does free trial work?</Text>
                                <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a diam nec
                                    augue tincidunt accumsan. In dignissim laoreet ipsum eu interdum.
                                </Text>
                                <Text style={styles.question}>Can I cancel any time?</Text>
                                <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a diam nec
                                    augue tincidunt accumsan. In dignissim laoreet ipsum eu interdum.
                                </Text>
                                <Text style={styles.question}>What happens after my trial ended?</Text>
                                <Text>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a diam nec augue
                                    tincidunt accumsan. In dignissim laoreet ipsum eu interdum.
                                </Text>
                                <Text style={styles.question}>Can I have a discount?</Text>
                                <Text>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a diam nec augue
                                    tincidunt accumsan. In dignissim laoreet ipsum eu interdum.
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20
    },
    textTitle: {
        color: Colors.containerBackground,
        fontSize: 70,
        fontFamily: 'Caveat-B',
    },
    screen: {
        flex: 1,
        paddingTop: '50%',
        padding: 10,
        alignItems: 'center'
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 6,
        shadowOpacity: 0.26,
        elevation: 8,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10
    },
    faq: {
        color: Colors.title,
        fontSize: 30,
        fontFamily: 'Caveat-B',
    },
    question: {
        color: Colors.title,
        fontSize: 20,
        alignSelf: 'flex-start',
        paddingTop: 10,
        paddingBottom: 10
    }
});

export default HomepageScreen;
