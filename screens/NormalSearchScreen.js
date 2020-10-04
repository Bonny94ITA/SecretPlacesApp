import React, {useState, useEffect} from 'react';
import {
    Button,
    Keyboard,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text, ImageBackground
} from "react-native";

import Colors from '../constants/colors';
import {Ionicons} from '@expo/vector-icons';
import Header from '../components/Header';
import {Formik} from 'formik';
import serverURL from '../components/ServerInfo';
import {useDispatch} from 'react-redux';
import * as authActions from '../store/actions/auth';
import {setFreeRooms} from '../store/actions/ns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';

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

async function normalSearch(city, arrival, departure, dispatch) {
    let freeRooms = null;

    await timeout(5000, fetch(serverURL + '/hotels/freeRooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            city: city,
            arrival: arrival,
            departure: departure
        })
    })).then(async function (response) {
        freeRooms = await response.json();
    }, function (error) {
        dispatch(authActions.submitLogout());
        console.log(error);
    }).catch(function (error) {
        dispatch(authActions.submitLogout());
        console.log(error);
    });

    return freeRooms;
}

const NormalSearchScreen = props => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateArrival, setDateArrival] = useState(new Date(1598051730000));
    const [dateDeparture, setDateDeparture] = useState(new Date(1598051730000));

    const [selectedValue, setSelectedValue] = useState("Cagliari");
    const [pickerItems, setPickerItems] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {

        async function fetchCities(dispatch) {
            const cities = await getCities(dispatch);

            if (cities !== null) {
                const citiesItems = [];
                const items = cities.map((s, i) => {
                    citiesItems.push({label: s.name, value: s.name})
                });
                setPickerItems(citiesItems);
            }
        }

        fetchCities(dispatch);
    }, []);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirmArrival = (date) => {
        setDateArrival(date);
        hideDatePicker();
    };

    const handleConfirmDeparture = (date) => {
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
                    <ImageBackground source={require('../assets/sunset2.jpg')} style={styles.image}>
                        <View style={styles.screen}>
                            <View style={styles.inputContainer}>
                                <Formik
                                    initialValues={{city: '', arrival: '', departure: ''}}
                                    onSubmit={async values => {
                                        const formattedFreeRooms = [];
                                        const freeRooms = await normalSearch("Cagliari",
                                            "12/07/2020", "24/08/2020", dispatch);
                                        freeRooms.forEach(element => {
                                            formattedFreeRooms.push({
                                                hotelName: element.hotel.name,
                                                hotelStars: element.hotel.stars,
                                                hotelAddress: element.hotel.address,
                                                idRoom: element.id,
                                                numPlaces: element.numPlaces,
                                                ppn: element.pricePerNight
                                            });
                                        });
                                        dispatch(setFreeRooms(formattedFreeRooms));
                                        props.navigation.navigate('resultsSearch');
                                    }}
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
                                            <Text> data </Text>
                                            <Button title="Data di Arrivo" onPress={showDatePicker}/>
                                            <DateTimePickerModal
                                                isVisible={isDatePickerVisible}
                                                mode="date"
                                                onConfirm={handleConfirmDeparture}
                                                onCancel={hideDatePicker}
                                            />
                                            <Text> data </Text>
                                            <View style={styles.picker}>
                                                <RNPickerSelect
                                                    placeholder={{
                                                        label: 'Seleziona una città...',
                                                        value: null,
                                                    }}
                                                    selectedValue={selectedValue}
                                                    onValueChange={(itemValue) => setSelectedValue(itemValue)}
                                                    items={pickerItems}
                                                />
                                            </View>
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
    picker: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        paddingRight: 30,
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
    data: {
        padding: 10,
        textAlign: 'center'
    },
    container: {
        flex: 1,
        flexDirection: "column"
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    }
});

export default NormalSearchScreen;
