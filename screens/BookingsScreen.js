import React, {useEffect, useState} from 'react';
import base64 from "react-native-base64";
import {
    AsyncStorage,
    Button,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
    Alert
} from 'react-native';

import Header from '../components/Header';
import Colors from '../constants/colors';
import {AntDesign, Entypo} from '@expo/vector-icons';
import serverURL from '../components/ServerInfo';
import * as authActions from '../store/actions/auth';
import {setListener} from '../store/actions/listener';
import {useDispatch} from 'react-redux';
import * as SQLite from "expo-sqlite";

const Sojourn = (props) => {
    return props.sojourn;
}

const Item = ({item, bookings, setBookings, images}) => {
    const dispatch = useDispatch();

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
                                     source={{
                                         uri: images[sojourn.idRoom]
                                     }}
                                 />
                             </View>
                         </View>
                     </View>
                 }
        />
    );

    const deleteBooking_ = () =>
        Alert.alert(
            "Vuoi cancellare la prenotazione?",
            "",
            [
                {
                    text: "Annulla",
                    style: "cancel"
                },
                {
                    text: "Conferma", onPress: () => {
                        async function httpRequest() {
                            const userData = await AsyncStorage.getItem('userData');
                            const jsonObj = JSON.parse(userData);
                            await deleteBooking(dispatch, jsonObj.token, item.id);

                            return bookings.filter(function (booking) {
                                return booking.id !== item.id;
                            });
                        }

                        httpRequest().then(r => setBookings(r));
                    }
                }
            ],
            {cancelable: false}
        );

    return (
        <View>
            <View style={styles.item}>
                {sojourns}
                <View style={{marginVertical: 5}}>
                    <Button
                        title="Paga"
                        color={Colors.primary}
                    />
                </View>
                <View style={{marginVertical: 5}}>
                    <Button
                        title="Cancella"
                        onPress={deleteBooking_}
                        color={Colors.primary}
                    />
                </View>
            </View>
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

async function getBookings(dispatch, token, tokenType, userId) {
    let bookings = null;

    await timeout(5000, fetch(serverURL + '/bookings/id/' + +userId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            token_info: JSON.stringify({token: token, type: tokenType})
        }
    }))
        .then(async function (response) {
            bookings = await response.json();
            console.log(bookings)
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

async function fetchBookings(dispatch) {
    const userData = await AsyncStorage.getItem('userData');
    const jsonObj = JSON.parse(userData);
    const bookings = await getBookings(dispatch, jsonObj.token, 1, jsonObj.userId);
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
                idRoom: element.room.id,
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

async function fillDictionary() {
    return new Promise((resolve, reject) => {
        const db = SQLite.openDatabase("DB.db");
        const dict_ = {};
        db.transaction(tx => {
                const images = {};
                tx.executeSql(
                    'select * from mapping;',
                    [], function (tx, mapping) {
                        // console.log(mapping)
                        tx.executeSql(
                            'select * from images;',
                            [], function (tx, result) {
                                for (let i = 0; i < result.rows._array.length; ++i)
                                    images[result.rows._array[i]["id"]] = result.rows._array[i]["url"];

                                for (let i = 0; i < mapping.rows.length; ++i) {
                                    dict_[mapping.rows._array[i]["id_room"]] =
                                        base64.decode(images[mapping.rows._array[i]["id_img"]])
                                }
                            }
                        )
                    }
                )
            }, (err) => {
                console.log(err)
            },
            () => {
                console.log("Success")
                resolve(dict_);
            });
    });
}

const BookingsScreen = props => {
    console.log("render")
    const [bookings, setBookings] = useState([]);
    const [dict, setDict] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        const focusListener = props.navigation.addListener('didFocus', async () => {
            const fb = await fetchBookings(dispatch);
            const dict_ = await fillDictionary();
            setBookings(fb);
            setDict(dict_);
        });

        dispatch(setListener(focusListener));

        fetchBookings(dispatch).then(bookings_ => {
            fillDictionary().then(dict_ => {
                setBookings(bookings_);
                setDict(dict_);
            });
        });
    }, []);

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
                                        images={dict}
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
