import React, {useEffect, useState} from 'react';
import {
    AsyncStorage,
    Button,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';

import Header from '../components/Header';
import Colors from '../constants/colors';
import {AntDesign, Entypo} from '@expo/vector-icons';
import serverURL from '../components/ServerInfo';
import * as authActions from '../store/actions/auth';
import {useDispatch} from 'react-redux';
import Dialog, {DialogButton, DialogFooter, DialogTitle, SlideAnimation} from "react-native-popup-dialog";

const Item = ({item}) => {
    const [isVisible, setVisible] = useState(false);
    //console.log(item)
    const items = []
    item.sojourns.forEach(item => {
        items.push(<View style={styles.item}>
            <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                    <AntDesign name="home" size={20} style={styles.icon}/>
                    <Text style={[styles.text, {fontWeight: 'bold'}]}>{item.hotelName}</Text>
                    <AntDesign name="enviromento" size={20} style={styles.icon}/>
                    <Text style={styles.text}>{item.hotelAddress}</Text>
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
                dialogTitle={<DialogTitle title="Sei sicuro di voler prenotare?"/>}
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
                            }}
                        />
                    </DialogFooter>
                }
            >
            </Dialog>
        </View>);
    });

    return (
        <View>
            {items}
        </View>
    );
}


function timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Timeout exceeded."))
        }, milliseconds);
        promise.then(resolve, reject);
    });
}

async function getBookings(dispatch, token, userId) {
    let bookings = null;

    console.log(userId);
    console.log(token)
    await timeout(5000, fetch(serverURL + '/bookings/id/' + +userId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            token_info: JSON.stringify({token: token, type: 0})
        }
    }))
        .then(async function (response) {
            bookings = await response.json();
            console.log(bookings);
        }, function (error) {
            dispatch(authActions.submitLogout());
            console.log(error);
        }).catch(function (error) {
            dispatch(authActions.submitLogout());
            console.log(error);
        });

    return bookings;
}

const BookingsScreen = () => {
    const [bookings, setBookings] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchBookings(dispatch) {
            const userData = await AsyncStorage.getItem('userData');
            const jsonObj = JSON.parse(userData);
            const bookings = await getBookings(dispatch, jsonObj.token, 1);
            const formattedBookings = [];

            bookings.forEach(booking => {
                const formattedSojourns = [];
                booking.sojourns.forEach(element => {
                    formattedSojourns.push({
                        arrival: element.arrival,
                        departure: element.departure,
                        hotelName: element.room.hotel.name,
                        address: element.room.hotel.address,
                        hotelCity: element.room.hotel.city.name,
                        stars: element.room.hotel.stars,
                        numPlaces: element.room.numPlaces,
                        totalPrice: element.totalPrice
                    })
                })

                formattedBookings.push({
                    id: booking.id,
                    sojourns: formattedSojourns,
                    totalPrice: booking.totalPrice
                });
            });

            setBookings(formattedBookings);
            console.log(formattedBookings);
            //console.log(formattedBookings);
        }

        fetchBookings(dispatch);
    }, []);

    const renderItem = ({item}) => {
        if (item.sojourns.length > 0) {
            return (
                <Item item={item}/>
            );
        }
    };

    return (
        <View style={styles.header}>
            <Header title={"Prenotazioni"}/>
            <View style={styles.container}>
                <View style={styles.outputContainer}>
                    <FlatList
                        data={bookings}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
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
    }
});

export default BookingsScreen;
