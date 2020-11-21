import React, {useState, useEffect} from 'react';
import {
    Button,
    Keyboard,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Platform,
    ActivityIndicator
} from 'react-native';

import Header from '../components/Header';
import Colors from '../constants/colors';
import {AntDesign} from '@expo/vector-icons';
import {Formik} from 'formik';
import serverURL from '../components/ServerInfo';
import {useDispatch} from 'react-redux';
import * as authActions from '../store/actions/auth';
import {clearFreeRooms, setFreeRooms} from '../store/actions/ns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import {clearAlternatives} from '../store/actions/ss';

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
    const [isDatePickerVisibleA, setDatePickerVisibilityA] = useState(false);
    const [isDatePickerVisibleD, setDatePickerVisibilityD] = useState(false);
    const [dateArrival, setDateArrival] = useState(new Date());
    const [dateDeparture, setDateDeparture] = useState(new Date());

    const [selectedValue, setSelectedValue] = useState(null);
    const [pickerItems, setPickerItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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

    const showDatePickerA = () => {
        setDatePickerVisibilityA(true);
    };

    const hideDatePickerA = () => {
        setDatePickerVisibilityA(false);
    };

    const showDatePickerD = () => {
        setDatePickerVisibilityD(true);
    };

    const hideDatePickerD = () => {
        setDatePickerVisibilityD(false);
    };

    const handleConfirmArrival = (date) => {
        setDateArrival(date);
        hideDatePickerA();
    };

    const handleConfirmDeparture = (date) => {
        setDateDeparture(date);
        hideDatePickerD();
    };

    if (isLoading) {
        return (<View style={styles.loading}>
            <ActivityIndicator size={"large"} color={Colors.primary}/>
        </View>);
    }

    return (
        <View style={styles.header}>
            <Header title={"Ricerca Normale "} navigation={props.navigation}/>
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

                                        setIsLoading(true);
                                        const arrival = dateArrival.getDate() + "/" + (dateArrival.getMonth() + 1) + "/" + dateArrival.getFullYear()
                                        const departure = dateDeparture.getDate() + "/" + (dateDeparture.getMonth() + 1) + "/" + dateDeparture.getFullYear()

                                        const freeRooms = await normalSearch(selectedValue,
                                            arrival, departure, dispatch);
                                        freeRooms.forEach(element => {
                                            formattedFreeRooms.push({
                                                hotelName: element.hotel.name,
                                                hotelStars: element.hotel.stars,
                                                cityName: element.hotel.city.name,
                                                address: element.hotel.address,
                                                idRoom: element.id,
                                                numPlaces: element.numPlaces,
                                                ppn: element.pricePerNight,
                                                arrival: dateArrival,
                                                departure: dateDeparture
                                            });
                                        });

                                        dispatch(clearAlternatives());
                                        dispatch(setFreeRooms(formattedFreeRooms));
                                        props.navigation.navigate('resultsSearch');
                                        setIsLoading(false);
                                    }}
                                >
                                    {({handleChange, handleBlur, handleSubmit, values}) => (
                                        <View>
                                            <View style={styles.dateContainer}>
                                                <TouchableOpacity onPress={showDatePickerA} style={styles.item}>
                                                    <AntDesign name="calendar" size={40} color="black"/>
                                                </TouchableOpacity>
                                                <DateTimePickerModal
                                                    isVisible={isDatePickerVisibleA}
                                                    mode="date"
                                                    onConfirm={handleConfirmArrival}
                                                    onCancel={hideDatePickerA}
                                                />
                                                <Text
                                                    style={styles.item}> {dateArrival.getDate()}/{dateArrival.getMonth() + 1}/{dateArrival.getFullYear()} </Text>
                                            </View>
                                            <View style={styles.dateContainer}>
                                                <TouchableOpacity onPress={showDatePickerD} style={styles.item}>
                                                    <AntDesign name="calendar" size={40} color="black"/>
                                                </TouchableOpacity>
                                                <DateTimePickerModal
                                                    isVisible={isDatePickerVisibleD}
                                                    mode="date"
                                                    onConfirm={handleConfirmDeparture}
                                                    onCancel={hideDatePickerD}
                                                />
                                                <Text
                                                    style={styles.item}> {dateDeparture.getDate()}/{dateDeparture.getMonth() + 1}/{dateDeparture.getFullYear()} </Text>
                                            </View>
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
                                            <View style={{marginVertical: 5}}>
                                                <Button
                                                    title="Ricerca"
                                                    onPress={handleSubmit}
                                                    color={Colors.primary}
                                                />
                                            </View>
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
    container: {
        flex: 1
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center'
    },
    screen: {
        flex: 0.5,
        padding: 10,
        alignItems: 'center'
    },
    inputContainer: {
        width: 350,
        maxWidth: '87%',
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
        flex: Platform.OS === 'ios' ? 0 : 1,
        height: 40,
        borderColor: 'orange',
        borderWidth: 1,
        marginVertical: 5,
        width: 225,
        borderRadius: 10,
        textAlign: 'center',
        padding: Platform.OS === 'ios' ? 10 : 0,
        paddingBottom: 10
    },
    dateContainer: {
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '80%'
    },
    item: {
        width: '50%'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default NormalSearchScreen;
