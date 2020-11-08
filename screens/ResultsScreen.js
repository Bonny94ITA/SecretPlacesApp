import React, {useState, useReducer} from 'react';
import * as SQLite from 'expo-sqlite';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    Button,
    Image,
    AsyncStorage,
    Alert
} from 'react-native';

import Header from '../components/Header';
import Colors from '../constants/colors';
import Pic from '../constants/pics';
import {AntDesign, Entypo} from '@expo/vector-icons';
import {useSelector, useDispatch} from 'react-redux';
import serverURL from '../components/ServerInfo';
import * as authActions from '../store/actions/auth';
import base64 from "react-native-base64";
import {round} from "react-native-reanimated";

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

const Sojourn = (props) => {
    return props.sojourn;
}

const Alternative = ({item, alternatives, setAlternatives, image}) => {
    const dispatch = useDispatch();

    const sojourns = item.sojourns.map(sojourn =>
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
                                         uri: image
                                     }}
                                 />
                             </View>
                         </View>
                     </View>
                 }
        />
    );

    const addBooking_ = () =>
        Alert.alert(
            "Sei sicuro di voler prenotare?",
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
                            const sojs = []

                            item.sojourns.forEach(sojourn => {
                                sojs.push({
                                    arrival: sojourn.arrival,
                                    departure: sojourn.departure,
                                    room: {id: sojourn.idRoom}
                                });
                            });

                            const booking = {
                                sojourns: sojs
                            }

                            await addBooking(dispatch, booking, jsonObj.userId, jsonObj.token);

                            return alternatives.filter(function (alt) {
                                return alt.id !== item.id;
                            });
                        }

                        httpRequest().then(r => setAlternatives(r));
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
                        title="Prenota"
                        onPress={addBooking_}
                        color={Colors.primary}
                    />
                </View>
            </View>
        </View>
    );
}

const FreeRoom = ({item, freeRooms, setFreeRooms, image}) => {
    const dispatch = useDispatch();

    const addBooking_ = () =>
        Alert.alert(
            "Sei sicuro di voler prenotare?",
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

                            const booking = {
                                sojourns: [
                                    {
                                        arrival: "12/07/2020",
                                        departure: "24/08/2020",
                                        room: {id: item.idRoom}
                                    }
                                ]
                            }

                            await addBooking(dispatch, booking, jsonObj.userId, jsonObj.token);

                            console.log(freeRooms)

                            return freeRooms.filter(function (fr) {
                                return fr.idRoom !== item.idRoom;
                            });
                        }

                        httpRequest().then(r => setFreeRooms(r));
                    }
                }
            ],
            {cancelable: false}
        );

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
                            source={{
                                uri: image
                            }}
                        />
                    </View>
                </View>
            </View>
            <View style={{marginVertical: 5}}>
                <Button
                    title="Prenota"
                    onPress={addBooking_}
                    color={Colors.primary}
                />
            </View>
        </View>
    );
}

const ResultsScreen = props => {
    const freeRooms = useSelector(state => state.normalSearch.freeRooms);
    const alternatives = useSelector(state => state.secretSearch.alternatives);
    const [freeRooms_, setFreeRooms_] = useState(freeRooms);
    const [alternatives_, setAlternative_] = useState(alternatives);
    const db = SQLite.openDatabase("DB.db");
    const executeQuery = "INSERT OR REPLACE INTO mapping(id_img, id_room) VALUES (?,?);";
    const dict = {};
    let imagesNum;

    if (freeRooms != null) {
        db.transaction(tx => {
                tx.executeSql(
                    'Select count(id) from images;', [], function (tx, result) {
                        imagesNum = result.rows._array[0]["count(id)"];

                        for (let i = 0; i < freeRooms.length; ++i) {
                            let img = Math.round(Math.random() * (imagesNum - 1))
                            tx.executeSql(executeQuery, [img, freeRooms[i].idRoom])
                            tx.executeSql(
                                'select url from images where id = ?;', [img], function (tx, result) {
                                    dict[freeRooms[i].idRoom] = base64.decode(result.rows._array[0]["url"]);
                                }
                            )
                        }
                    }, function (err) {
                        console.log(err)
                    }
                )

            }, (err) => {
                console.log(err)
            },
            () => {
                console.log("Success")
            });

        return (
            <View style={styles.header}>
                <Header title={"Risultati Ricerca "}/>
                <View style={styles.container}>
                    <View style={styles.outputContainer}>
                        <FlatList
                            data={freeRooms_}
                            renderItem={({item}) => {
                                return (
                                    <FreeRoom
                                        item={item}
                                        freeRooms={freeRooms_}
                                        setFreeRooms={setFreeRooms_}
                                        image={dict[item.idRoom]}
                                    />
                                );
                            }}
                            keyExtractor={item => item.idRoom.toString()}
                        />
                    </View>
                </View>
            </View>
        );
    } else {
        db.transaction(tx => {
                tx.executeSql(
                    'Select count(id) from images;', [], function (tx, result) {
                        imagesNum = result.rows._array[0]["count(id)"];

                        for (let a = 0; a < alternatives.length; ++a) {
                            for (let i = 0; i < alternatives[a].sojourns.length; ++i) {
                                let img = Math.round(Math.random() * (imagesNum - 1))
                                tx.executeSql(executeQuery, [img, alternatives[a].sojourns[i].idRoom])
                                tx.executeSql(
                                    'select url from images where id = ?;', [img], function (tx, result) {
                                        dict[alternatives[a].sojourns[i].idRoom] = base64.decode(result.rows._array[0]["url"]);
                                    }
                                )
                            }
                        }

                        tx.executeSql('Select * from mapping;', [], function (tx, result) {
                            console.log(result)
                        })
                    }, function (err) {
                        console.log(err)
                    }
                )

            }, (err) => {
                console.log(err)
            },
            () => {
                console.log("Success")
            });

        for (let i = 0; i < alternatives.length; ++i)
            dict[alternatives[i].id] = Pic();

        return (
            <View style={styles.header}>
                <Header title={"Risultati Ricerca"}/>
                <View style={styles.container}>
                    <View style={styles.outputContainer}>
                        <FlatList
                            data={alternatives_}
                            renderItem={({item}) => {
                                if (item.sojourns.length > 0) {
                                    return (
                                        <Alternative
                                            item={item}
                                            alternatives={alternatives_}
                                            setAlternatives={setAlternative_}
                                            image={dict[item.id]}
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
    }
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
