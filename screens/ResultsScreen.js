import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    Button,
    Image, AsyncStorage
} from 'react-native';

import Header from '../components/Header';
import Colors from '../constants/colors';
import Pic from '../constants/pics';
import {AntDesign, Entypo} from '@expo/vector-icons';
import {useSelector, useDispatch} from 'react-redux';
import Dialog, {
    SlideAnimation,
    DialogFooter,
    DialogButton,
    DialogContent
} from 'react-native-popup-dialog';
import serverURL from "../components/ServerInfo";
import * as authActions from "../store/actions/auth";

function timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Timeout exceeded."))
        }, milliseconds);
        promise.then(resolve, reject);
    });
}

async function addBooking(dispatch, booking, guestId, token) {
    let res = null;

    await timeout(5000, fetch(serverURL + '/bookings/insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            token_info: JSON.stringify({token: token, type: 0})
        },
        body: JSON.stringify({
            guest: guestId,
            booking: booking
        })
    })).then(async function (response) {
        res = await response.json();
    }, function (error) {
        dispatch(authActions.submitLogout());
        console.log(error);
    }).catch(function (error) {
        dispatch(authActions.submitLogout());
        console.log(error);
    });

    return res;
}

const Alternative = ({item}) => {
    const [isVisible, setVisible] = useState(false);
    const dispatch = useDispatch();

    return (
        <View style={styles.item}>
            <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                    <AntDesign name="home" size={20} style={styles.icon}/>
                    <Text style={[styles.text, {fontWeight: 'bold'}]}>{item.sojourns.hotelName}</Text>
                    <AntDesign name="enviromento" size={20} style={styles.icon}/>
                    {/*<Text style={styles.text}>{item.sojourns.address}</Text>*/}
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.columnContainer}>
                        <View style={styles.rowContainer}>
                            <AntDesign name="staro" size={20} style={styles.icon}/>
                            <Text style={styles.text}>{item.sojourns.hotelStars}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <AntDesign name="user" size={20} style={styles.icon}/>
                            <Text style={styles.text}>{item.sojourns.numPlaces}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Entypo name="credit" size={20} style={styles.icon}/>
                            <Text style={styles.text}>{item.sojourns.ppn}</Text>
                        </View>
                    </View>
                    <View style={styles.columnContainer}>
                        <Image
                            style={styles.image}
                            source={require('../assets/hotel.jpg')}
                        />
                    </View>
                </View>
            </View>
            <Button
                title="Prenota"
                onPress={() => setVisible(true)}
                color={Colors.primary}
            />
            <Dialog
                visible={isVisible}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                onTouchOutside={() => {
                    setVisible(false);
                }}
                footer={
                    <DialogFooter>
                        <DialogButton
                            text="Annulla"
                            onPress={() => {
                                setVisible(false);
                            }}
                        />
                        <DialogButton
                            text="Conferma"
                            onPress={() => {
                                setVisible(false);

                                async function foo() {
                                    const userData = await AsyncStorage.getItem('userData');
                                    const jsonObj = JSON.parse(userData);

                                    const booking = {
                                        sojourns: [
                                            {
                                                arrival: "12/07/2020",
                                                departure: "24/08/2020",
                                                room: {id: item.idRoom}
                                            }
                                        ]
                                    }

                                    addBooking(dispatch, booking, jsonObj.userId, jsonObj.token);
                                }

                                foo();
                            }}
                        />
                    </DialogFooter>
                }
            >
                <DialogContent style={styles.popupContainer}>
                    <Text style={styles.popup}>
                        Sei sicuro di voler prenotare?
                    </Text>
                </DialogContent>
            </Dialog>
        </View>
    );
}

const FreeRoom = ({item}) => {
    const [isVisible, setVisible] = useState(false);
    const dispatch = useDispatch();

    return (
        <View style={styles.item}>
            <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                    <AntDesign name="home" size={20} style={styles.icon}/>
                    <Text style={[styles.text, {fontWeight: 'bold'}]}>{item.hotelName}</Text>
                    <AntDesign name="enviromento" size={20} style={styles.icon}/>
                    <Text style={styles.text}>{item.address}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.columnContainer}>
                        <View style={styles.rowContainer}>
                            <AntDesign name="staro" size={20} style={styles.icon}/>
                            <Text style={styles.text}>{item.hotelStars}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <AntDesign name="user" size={20} style={styles.icon}/>
                            <Text style={styles.text}>{item.numPlaces}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Entypo name="credit" size={20} style={styles.icon}/>
                            <Text style={styles.text}>{item.ppn}</Text>
                        </View>
                    </View>
                    <View style={styles.columnContainer}>
                        <Image
                            style={styles.image}
                            source={require('../assets/hotel.jpg')}
                        />
                    </View>
                </View>
            </View>
            <Button
                title="Prenota"
                onPress={() => setVisible(true)}
                color={Colors.primary}
            />
            <Dialog
                visible={isVisible}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                onTouchOutside={() => {
                    setVisible(false);
                }}
                footer={
                    <DialogFooter>
                        <DialogButton
                            text="Annulla"
                            onPress={() => {
                                setVisible(false);
                            }}
                        />
                        <DialogButton
                            text="Conferma"
                            onPress={() => {
                                setVisible(false);

                                async function foo() {
                                    const userData = await AsyncStorage.getItem('userData');
                                    const jsonObj = JSON.parse(userData);

                                    const booking = {
                                        sojourns: [
                                            {
                                                arrival: "12/07/2020",
                                                departure: "24/08/2020",
                                                room: {id: item.idRoom}
                                            }
                                        ]
                                    }

                                    addBooking(dispatch, booking, jsonObj.userId, jsonObj.token);
                                }

                                foo();
                            }}
                        />
                    </DialogFooter>
                }
            >
                <DialogContent style={styles.popupContainer}>
                    <Text style={styles.popup}>
                        Sei sicuro di voler prenotare?
                    </Text>
                </DialogContent>
            </Dialog>
        </View>
    );
}

const ResultsScreen = props => {
    const freeRooms = useSelector(state => state.normalSearch.freeRooms);
    const alternatives = useSelector(state => state.secretSearch.alternatives);
    let data;

    if (alternatives != null)
        data = alternatives
    else
        data = freeRooms

    const renderItem = ({item}) => {
        if (freeRooms != null) {
            return (
                <FreeRoom item={item}/>
            );
        } else {
            return (
                <Alternative item={item}/>
            );
        }
    };

    return (
        <View style={styles.header}>
            <Header title={"Risultati Ricerca"}/>
            <View style={styles.container}>
                <View style={styles.outputContainer}>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.idRoom.toString()}
                    />
                </View>
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
        backgroundColor: Colors.background
    },
    outputContainer: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 6,
        shadowOpacity: 0.26,
        elevation: 8,
        padding: 20
    },
    item: {
        backgroundColor: Colors.containerBackground,
        padding: 10,
        margin: 10,
        borderRadius: 10
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 10
    },
    columnContainer: {
        flexDirection: 'column',
        paddingRight: 10
    },
    icon: {
        padding: 10,
        color: 'black'
    },
    text: {
        fontSize: 20
    },
    image: {
        width: 175,
        height: 150,
        borderRadius: 25
    },
    popup: {
        fontWeight: 'bold',
        fontSize: 15,
        paddingTop: 25,
        textAlign: 'center'
    }
});

export default ResultsScreen;
