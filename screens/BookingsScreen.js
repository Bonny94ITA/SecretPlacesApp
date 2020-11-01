import React, {useEffect, useState, useReducer} from 'react';
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
import Dialog, {
    DialogButton,
    DialogFooter,
    SlideAnimation,
    DialogContent
} from 'react-native-popup-dialog';

const Sojourn = (props) => {
    return props.sojourn;
}

const Item = ({item, bookings, setBookings}) => {
    console.log("OK")

    const dispatch = useDispatch();
    //const [state, dispatch_] = useReducer(reducer, initialState);
    const [isVisible, setIsVisible] = useState(false);

    const sojourns = item.sojourns.map((sojourn) =>
        <Sojourn key={sojourn.id.toString()}
                 sojourn={
                     <View style={styles.columnContainer}>
                         <View style={styles.rowContainer}>
                             <AntDesign name="home" size={20} style={styles.icon}/>
                             <Text style={[styles.text, {fontWeight: 'bold'}]}>{sojourn.hotelName}</Text>
                             <AntDesign name="enviromento" size={20} style={styles.icon}/>
                             <Text style={styles.text}>{sojourn.address}</Text>
                         </View>
                         <View style={styles.rowContainer}>
                             <View style={styles.columnContainer}>
                                 <View style={styles.rowContainer}>
                                     <AntDesign name="staro" size={20} style={styles.icon}/>
                                     <Text style={styles.text}>{sojourn.stars}</Text>
                                 </View>
                                 <View style={styles.rowContainer}>
                                     <AntDesign name="user" size={20} style={styles.icon}/>
                                     <Text style={styles.text}>{sojourn.numPlaces}</Text>
                                 </View>
                                 <View style={styles.rowContainer}>
                                     <Entypo name="credit" size={20} style={styles.icon}/>
                                     <Text style={styles.text}>{sojourn.pricePerNight}</Text>
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
                 }
        />
    );

    return (
        <View>
            <View style={styles.item}>
                {sojourns}
                <Button
                    title="Paga"
                    color={Colors.primary}
                />
                <Button
                    title="Cancella"
                    onPress={() => setIsVisible(true)}
                    color={Colors.primary}
                />
            </View>
            <Dialog
                visible={isVisible}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                onTouchOutside={() => {
                    setIsVisible(false);
                    //dispatch_({type: 'hideDialog'});
                }}
                footer={
                    <DialogFooter>
                        <DialogButton
                            text="Annulla"
                            onPress={() => {
                                setIsVisible(false);
                                //dispatch_({type: 'hideDialog'});
                            }}
                        />
                        <DialogButton
                            text="Conferma"
                            onPress={async () => {
                                //dispatch_({type: 'hideDialog'});
                                const userData = await AsyncStorage.getItem('userData');
                                const jsonObj = JSON.parse(userData);
                                await deleteBooking(dispatch, jsonObj.token, item.id);

                                let tmp = bookings.filter(function (booking) {
                                    return booking.id !== item.id;
                                });

                                setBookings(tmp);
                                setIsVisible(false);
                            }}
                        />
                    </DialogFooter>
                }
            >
                <DialogContent style={styles.popupContainer}>
                    <Text style={styles.popup}>
                        Vuoi cancellare la prenotazione?
                    </Text>
                </DialogContent>
            </Dialog>
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

    await timeout(5000, fetch(serverURL + '/bookings/id/' + +userId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            token_info: JSON.stringify({token: token, type: 0})
        }
    }))
        .then(async function (response) {
            bookings = await response.json();
        }, function (error) {
            dispatch(authActions.submitLogout());
            console.log(error);
        }).catch(function (error) {
            dispatch(authActions.submitLogout());
            console.log(error);
        });

    return bookings;
}

async function deleteBooking(dispatch, token, bookingId) {
    let res = null;

    await timeout(5000, fetch(serverURL + '/bookings/delete/' + +bookingId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            token_info: JSON.stringify({token: token, type: 0})
        }
    }))
        .then(async function (response) {
            res = await response.json();
            console.log(res);
        }, function (error) {
            dispatch(authActions.submitLogout());
            console.log(error);
        }).catch(function (error) {
            dispatch(authActions.submitLogout());
            console.log(error);
        });

    return res;
}

const BookingsScreen = props => {
    console.log("AUGURI")
    const [bookings, setBookings] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchBookings(dispatch) {
            const userData = await AsyncStorage.getItem('userData');
            const jsonObj = JSON.parse(userData);
            const bookings = await getBookings(dispatch, jsonObj.token, jsonObj.userId);
            const formattedBookings = [];

            bookings.forEach(booking => {
                const formattedSojourns = [];
                booking.sojourns.forEach(element => {
                    formattedSojourns.push({
                        id: element.id,
                        arrival: element.arrival,
                        departure: element.departure,
                        hotelName: element.room.hotel.name,
                        address: element.room.hotel.address,
                        hotelCity: element.room.hotel.city.name,
                        stars: element.room.hotel.stars,
                        numPlaces: element.room.numPlaces,
                        pricePerNight: element.room.pricePerNight,
                        totalPrice: element.totalPrice
                    })
                })

                formattedBookings.push({
                    id: booking.id,
                    sojourns: formattedSojourns,
                    totalPrice: booking.totalPrice
                });
            });

            return formattedBookings;
        }

        props.navigation.addListener('didFocus', async () => {
            console.log("dsa");
            const fb = await fetchBookings(dispatch);
            console.log(fb)
            setBookings(fb);
        });

        fetchBookings(dispatch).then(r => setBookings(r));
    }, [])

    return (
        <View style={styles.header}>
            <Header title={"Prenotazioni "}/>
            <View style={styles.container}>
                <View style={styles.outputContainer}>
                    <FlatList
                        data={bookings}
                        renderItem={({item}) => {
                            if (item.sojourns.length > 0) {
                                return (
                                    <Item
                                        item={item}
                                        bookings={bookings}
                                        setBookings={setBookings}
                                    />
                                );
                            }
                        }}
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
    },
    popup: {
        fontWeight: 'bold',
        fontSize: 15,
        paddingTop: 25,
        textAlign: 'center'
    }
});

export default BookingsScreen;
