import React, {useState, useEffect} from 'react';
import {
    Button,
    Keyboard,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text,
    ImageBackground,
    TouchableOpacity
} from 'react-native';

import Colors from '../constants/colors';
import {AntDesign} from '@expo/vector-icons';
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

async function secretSearch(cities, maxBudget, numPeople, onlyRegion, onlyNotRegion,
                            maxStars, minStars, tourismTypes, arrival, departure, dispatch) {
    let alternatives = null;

    await timeout(5000, fetch(serverURL + '/hotels/secretSearch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cities: cities,
            maxBudget: maxBudget,
            people: numPeople,
            onlyRegion: onlyRegion,
            onlyNotRegion: onlyNotRegion,
            maxStars: maxStars,
            minStars: minStars,
            tourismTypes: tourismTypes,
            arrival: arrival,
            departure: departure
        })
    })).then(async function (response) {
        alternatives = await response.json();
    }, function (error) {
        //dispatch(authActions.submitLogout());
        console.log(error);
    }).catch(function (error) {
        //dispatch(authActions.submitLogout());
        console.log(error);
    });

    return alternatives;
}

const SecretSearchScreen = props => {
    const [isDatePickerVisibleA, setDatePickerVisibilityA] = useState(false);
    const [isDatePickerVisibleD, setDatePickerVisibilityD] = useState(false);
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
        console.log("ciao");
        hideDatePickerD();
    };

    return (
        <View style={styles.header}>
            <Header title={"Ricerca Segreta"}/>
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
            }}>
                <View style={styles.container}>
                    <ImageBackground source={require('../assets/sunset2.jpg')} style={styles.image}>
                        <View style={styles.screen}>
                            <View style={styles.inputContainer}>
                                <Formik
                                    // modificare la formica (quando si andrà a leggere da input)
                                    initialValues={{city: '', arrival: '', departure: ''}}
                                    onSubmit={async values => {
                                        const formattedAlteratives = [];
                                        const alternatives = await secretSearch([{region: "Sardegna", city: "Nuoro"}, {region: "Sardegna", city: "Cagliari"}],
                                            500, 3, "Sardegna", "Sicilia", 4, 2,
                                            ["balenare", "lacustre", "naturalistico"], "12/07/2020", "24/08/2020", dispatch);
                                        // alternatives.forEach(element => {
                                        //     formattedAlteratives.push({
                                        //         hotelName: element.hotel.name,
                                        //         hotelStars: element.hotel.stars,
                                        //         hotelAddress: element.hotel.address,
                                        //         idRoom: element.id,
                                        //         numPlaces: element.numPlaces,
                                        //         ppn: element.pricePerNight
                                        //     });
                                        // });
                                        console.log(alternatives);
                                        //dispatch(setFreeRooms(formattedAlteratives));
                                        props.navigation.navigate('resultsSearch');
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
        height: 40,
        borderColor: 'orange',
        borderWidth: 1,
        marginVertical: 5,
        width: 225,
        borderRadius: 10,
        textAlign: 'center',
        padding: 10
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
    }
});

export default SecretSearchScreen;
