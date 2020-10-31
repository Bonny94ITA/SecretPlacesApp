import React, {useState, useReducer} from 'react';
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

const Sojourn = (props) => {
    return props.sojourn;
}

const initialState = {visible: false};

function reducer(state, action) {
    switch (action.type) {
        case 'showDialog':
            return {visible: true};
        case 'hideDialog':
            return {visible: false};
        default:
            throw new Error();
    }
}

const Alternative = ({item, alternatives}) => {
    const [isVisible, setIsVisible] = useState(false);
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
                    title="Prenota"
                    onPress={() => setIsVisible(true)}
                    color={Colors.primary}
                />
                <Dialog
                    visible={isVisible}
                    dialogAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                    onTouchOutside={() => {
                        setIsVisible(false);
                    }}
                    footer={
                        <DialogFooter>
                            <DialogButton
                                text="Annulla"
                                onPress={() => {
                                    setIsVisible(false);
                                }}
                            />
                            <DialogButton
                                text="Conferma"
                                onPress={async () => {
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
                                    setIsVisible(false);
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
        </View>
    );
}

const FreeRoom = ({item}) => {
    //const [state, dispatch_] = useReducer(reducer, initialState);
    const [isVisible, setIsVisible] = useState(false);
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
                onPress={() => setIsVisible(true)}
                color={Colors.primary}
            />
            <Dialog
                visible={isVisible}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                onTouchOutside={() => {
                    setIsVisible(false);
                }}
                footer={
                    <DialogFooter>
                        <DialogButton
                            text="Annulla"
                            onPress={() => {
                                setIsVisible(false);
                            }}
                        />
                        <DialogButton
                            text="Conferma"
                            onPress={async () => {
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
                                setIsVisible(false);
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

    if (freeRooms != null) {
        return (
            <View style={styles.header}>
                <Header title={"Risultati Ricerca"}/>
                <View style={styles.container}>
                    <View style={styles.outputContainer}>
                        <FlatList
                            data={freeRooms}
                            renderItem={({item}) => {
                                return (
                                    <FreeRoom item={item}/>
                                );
                            }}
                            keyExtractor={item => item.idRoom.toString()}
                        />
                    </View>
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.header}>
                <Header title={"Risultati Ricerca"}/>
                <View style={styles.container}>
                    <View style={styles.outputContainer}>
                        <FlatList
                            data={alternatives}
                            renderItem={({item}) => {
                                if (item.sojourns.length > 0) {
                                    return (
                                        <Alternative
                                            item={item}
                                            alternatives={alternatives}
                                            //setAternatives={setBookings}
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
