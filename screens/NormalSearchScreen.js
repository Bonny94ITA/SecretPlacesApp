import React, {useState, useEffect} from 'react';
import {
    Button,
    Keyboard,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    TextInput,
    Picker
} from "react-native";

import Colors from "../constants/colors";
import {Ionicons} from '@expo/vector-icons';
import Header from "../components/Header";
import {Formik} from 'formik';
import serverURL from '../components/ServerInfo';
import {useDispatch} from "react-redux";
import * as authActions from "../store/actions/auth";
import {setFreeRooms} from "../store/actions/ns";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// function timeout(milliseconds, promise) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             reject(new Error("Timeout exceeded."))
//         }, milliseconds);
//         promise.then(resolve, reject);
//     });
// }

// async function getCities(dispatch) {
//     let cities = null;
//
//     await timeout(5000, fetch(serverURL + '/hotels/cities'))
//         .then(async function(response) {
//             cities = await response.json();
//             //console.log(cities);
//         },function(error) {
//             dispatch(authActions.submitLogout());
//             console.log(error);
//         }).catch(function(error) {
//             dispatch(authActions.submitLogout());
//             console.log(error);
//         });
//
//     return cities;
// }

// async function normalSearch(city, arrival, departure, dispatch) {
//     let freeRooms = null;
//
//     await timeout(5000, fetch(serverURL + '/hotels/freeRooms', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             city: city,
//             arrival: arrival,
//             departure: departure
//         })
//     })).then(async function(response) {
//         freeRooms = await response.json();
//     },function(error) {
//         dispatch(authActions.submitLogout());
//         console.log(error);
//     }).catch(function(error) {
//         dispatch(authActions.submitLogout());
//         console.log(error);
//     });
//
//     return freeRooms;
// }

const NormalSearchScreen = props => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateArrival, setDateArrival] = useState(new Date(1598051730000));
    const [dateDeparture, setDateDeparture] = useState(new Date(1598051730000));

    // const [selectedValue, setSelectedValue] = useState("Cagliari");
    // const [pickerItems, setPickerItems] = useState(null);
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     async function fetchCities(dispatch) {
    //         const cities = await getCities(dispatch);
    //
    //         if (cities !== null) {
    //             const items = cities.map((s, i) => {
    //                 //return <Picker.Item key={i} value={s.name} label={s.name}/>
    //             });
    //             setPickerItems(items);
    //         }
    //     }
    //     fetchCities(dispatch);
    // }, []);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirmArrival = (date) => {
        console.warn("A date has been picked: ", date);
        setDateArrival(date);
        hideDatePicker();
    };

    const handleConfirmDeparture = (date) => {
        console.warn("A date has been picked: ", date);
        setDateDeparture(date);
        hideDatePicker();
    };

    return (
        <View style={styles.header}>
            <Header title={"Ricerca Normale"}/>
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
            }}>
                <View style={styles.container}>
                    <View style={styles.screen}>
                        <View style={styles.inputContainer}>
                            <Formik
                                initialValues={{city: '', arrival: '', departure: ''}}
                                //onSubmit={async values => {
                                // const formattedFreeRooms = [];
                                // const freeRooms = await normalSearch("Cagliari",
                                //     "12/07/2020", "24/08/2020", dispatch);
                                // freeRooms.forEach(element => {
                                //     formattedFreeRooms.push({
                                //         hotelName: element.hotel.name,
                                //         hotelStars: element.hotel.stars,
                                //         hotelAddress: element.hotel.address,
                                //         idRoom: element.id,
                                //         numPlaces: element.numPlaces,
                                //         ppn: element.pricePerNight
                                //     });
                                // });
                                // dispatch(setFreeRooms(formattedFreeRooms));
                                // props.navigation.navigate('resultsSearch');
                                //}}
                            >
                                {({handleChange, handleBlur, handleSubmit, values}) => (
                                    <View>
                                        <Button title="Data di Partenza" onPress={showDatePicker}/>
                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisible}
                                            mode="date"
                                            onConfirm={handleConfirmArrival}
                                            onCancel={hideDatePicker}
                                        />
                                        <Button title="Data di Arrivo" onPress={showDatePicker}/>
                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisible}
                                            mode="date"
                                            onConfirm={handleConfirmDeparture}
                                            onCancel={hideDatePicker}
                                        />
                                        {/*<Picker*/}
                                        {/*    selectedValue={selectedValue}*/}
                                        {/*    style={{ height: 50, width: 150 }}*/}
                                        {/*    onValueChange={(itemValue) => setSelectedValue(itemValue)}>*/}
                                        {/*    {pickerItems}*/}
                                        {/*</Picker>*/}
                                        <TextInput
                                            placeholder={"Città"}
                                            returnKeyType='next'
                                            onChangeText={handleChange('city')}
                                            onBlur={handleBlur('city')}
                                            style={styles.inputText}
                                        />
                                        <Button
                                            title="Ricerca"
                                            onPress={handleSubmit}
                                            color={Colors.primary}
                                        />
                                    </View>
                                )}
                            </Formik>
                        </View>
                    </View>
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
        padding: 10,
        alignItems: 'center'
    },
    inputContainer: {
        width: 300,
        maxWidth: '80%',
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
    inputText: {
        height: 40,
        borderColor: 'orange',
        borderWidth: 1,
        marginVertical: 5,
        width: 225,
        borderRadius: 10,
        textAlign: 'center'
    },
    dataPicker: {
        height: 40,
        marginVertical: 5,
        width: 225,
    },
    container: {
        flex: 1,
        flexDirection: "column"
    },
    titleContainer: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NormalSearchScreen;
