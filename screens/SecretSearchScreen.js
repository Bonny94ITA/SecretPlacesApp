import React, {useState, useEffect, useReducer} from 'react';
import {
    Button,
    StyleSheet,
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    TouchableHighlight, ActivityIndicator
} from 'react-native';

import {CheckBox} from 'react-native-elements'

import Header from '../components/Header';
import Colors from '../constants/colors';
import {AntDesign} from '@expo/vector-icons';
import {Formik} from 'formik';
import serverURL from '../components/ServerInfo';
import {useDispatch, useSelector} from 'react-redux';
import * as authActions from '../store/actions/auth';
import {clearFreeRooms, setFreeRooms} from '../store/actions/ns';
import {setAlternatives} from '../store/actions/ss';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Rating, AirbnbRating} from 'react-native-ratings';

function timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Timeout exceeded."))
        }, milliseconds);
        promise.then(resolve, reject);
    });
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
        dispatch(authActions.submitLogout());
        console.log(error);
    }).catch(function (error) {
        dispatch(authActions.submitLogout());
        console.log(error);
    });

    return alternatives;
}

const initialCitiesState = {flags: [], index: -1};

function citiesReducer(state, action) {
    switch (action.type.name) {
        case 'setFlag':
            state.flags[action.type.index] = !state.flags[action.type.index]
            return {flags: state.flags, index: action.type.index};
        case 'setFlags':
            return {flags: action.type.flags, index: -1};
        default:
            throw new Error();
    }
}


const initialTtsState = {flags: [], index: -1};

function ttsReducer(state, action) {
    switch (action.type.name) {
        case 'setFlag':
            state.flags[action.type.index] = !state.flags[action.type.index]
            return {flags: state.flags, index: action.type.index};
        case 'setFlags':
            return {flags: action.type.flags, index: -1};
        default:
            throw new Error();
    }
}


const SecretSearchScreen = props => {
    const [isDatePickerVisibleA, setDatePickerVisibilityA] = useState(false);
    const [isDatePickerVisibleD, setDatePickerVisibilityD] = useState(false);
    const [dateArrival, setDateArrival] = useState(new Date());
    const [dateDeparture, setDateDeparture] = useState(new Date());
    const [minStars, setMinStars] = useState(0);
    const [maxStars, setMaxStars] = useState(5);

    const [pickerCities, setPickerCities] = useState([]);
    const [pickerTts, setPickerTts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTTVisible, setModalTTVisible] = useState(false);

    const cities = useSelector(state => state.cities.cities);
    const [stateCities, dispatchCities] = useReducer(citiesReducer, initialCitiesState);
    const [stateTts, dispatchTts] = useReducer(ttsReducer, initialTtsState);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const tourismTypes = ["balneare", "montano", "lacustre", "naturalistico", "culturale",
        "termale", "religioso", "sportivo", "enogastronomico"];

    useEffect(() => {
        const flags_ = [];
        for (let i = 0; i < tourismTypes.length; ++i)
            flags_.push(false);

        dispatchTts({type: {name: 'setFlags', flags: flags_}});

        if (cities != null) {
            const flags_ = [];
            for (let i = 0; i < cities.length; ++i)
                flags_.push(false);

            dispatchCities({type: {name: 'setFlags', flags: flags_}});
        }
    }, []);

    useEffect(() => {
        if (stateTts.index >= 0) {
            console.log("lello");

            const items = pickerTts.slice();
            items[stateTts.index] = (<CheckBox
                title={tourismTypes[stateTts.index]}
                checked={stateTts.flags[stateTts.index]}
                onPress={() => {
                    dispatchTts({type: {name: 'setFlag', index: stateTts.index}});
                }}
                key={stateTts.index}
            />);

            setPickerTts(items);
        } else {
            const ttsItems = [];
            tourismTypes.forEach((tt, i) => {
                    ttsItems.push(<CheckBox
                        title={tt}
                        checked={false}
                        onPress={() => {
                            dispatchTts({type: {name: 'setFlag', index: i}});
                        }}
                        key={i}
                    />);
                }
            );

            setPickerTts(ttsItems);
        }
    }, [stateTts]);

    useEffect(() => {
        if (stateCities.index >= 0) {
            console.log("lello");

            const items = pickerCities.slice();
            items[stateCities.index] = (<CheckBox
                title={cities[stateCities.index].name}
                checked={stateCities.flags[stateCities.index]}
                onPress={() => {
                    dispatchCities({type: {name: 'setFlag', index: stateCities.index}});
                }}
                key={stateCities.index}
            />);

            setPickerCities(items);
        } else {
            const citiesItems = [];
            cities.forEach((city, i) => {
                    citiesItems.push(<CheckBox
                        title={city.name}
                        checked={false}
                        onPress={() => {
                            dispatchCities({type: {name: 'setFlag', index: i}});
                        }}
                        key={i}
                    />);
                }
            );

            setPickerCities(citiesItems);
        }
    }, [stateCities]);

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

    const ratingMinCompleted = (star) => {
        setMinStars(star);
        console.log("Rating is min: " + star)
    };

    const ratingMaxCompleted = (star) => {
        setMaxStars(star);
        console.log("Rating is max: " + star)
    };

    if (isLoading) {
        return (<View style={styles.loading}>
            <ActivityIndicator size={"large"} color={Colors.primary}/>
        </View>);
    }

    return (
        <View style={styles.header}>
            <Header title={"Ricerca Esperta "} navigation={props.navigation}/>
            <View style={styles.container}>
                <ImageBackground source={require('../assets/sunset2.jpg')} style={styles.image}>
                    <ScrollView>
                        <View style={styles.screen}>
                            <View style={styles.inputContainer}>
                                <Formik
                                    initialValues={{
                                        maxBudget: '',
                                        numPeople: '',
                                        onlyRegion: '',
                                        onlyNotRegion: ''
                                    }}
                                    onSubmit={async values => {
                                        const formattedAlternatives = [];
                                        const cities_ = [];
                                        const tts_ = [];

                                        setIsLoading(true);
                                        for (let i = 0; i < stateCities.flags.length; ++i) {
                                            if (stateCities.flags[i]) {
                                                cities_.push({region: cities[i].region, city: cities[i].name});
                                            }
                                        }

                                        for (let i = 0; i < stateTts.flags.length; ++i) {
                                            if (stateTts.flags[i]) {
                                                tts_.push(tourismTypes[i]);
                                            }
                                        }

                                        const arrival = dateArrival.getDate() + "/" + (dateArrival.getMonth() + 1) + "/" + dateArrival.getFullYear()
                                        const departure = dateDeparture.getDate() + "/" + (dateDeparture.getMonth() + 1) + "/" + dateDeparture.getFullYear()

                                        const alternatives = await secretSearch(cities_,
                                            values.maxBudget, values.numPeople, values.onlyRegion, values.onlyNotRegion, maxStars, minStars,
                                            tts_, arrival, departure, dispatch);

                                        alternatives.forEach((element, index) => {
                                            const formattedSojourns = [];
                                            element.sojourns.forEach((sojourn, sojIndex) => {
                                                formattedSojourns.push({
                                                    id: sojIndex,
                                                    arrival: sojourn.arrival,
                                                    departure: sojourn.departure,
                                                    hotelName: sojourn.room.hotel.name,
                                                    address: sojourn.room.hotel.address,
                                                    hotelCity: sojourn.room.hotel.city.name,
                                                    idRoom: sojourn.room.id,
                                                    stars: sojourn.room.hotel.stars,
                                                    numPlaces: sojourn.room.numPlaces,
                                                    pricePerNight: sojourn.room.pricePerNight,
                                                    totalPrice: sojourn.totalPrice
                                                });
                                            });
                                            formattedAlternatives.push({
                                                id: index,
                                                days: element.days,
                                                sojourns: formattedSojourns,
                                                totalPrice: element.totalPrice
                                            });
                                        });

                                        dispatchCities({type: {name: 'setFlags', flags: []}});
                                        dispatchTts({type: {name: 'setFlags', flags: []}});
                                        dispatch(clearFreeRooms());
                                        dispatch(setAlternatives(formattedAlternatives));
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
                                            <View style={{marginVertical: 5}}>
                                                <Button
                                                    title="Seleziona le città"
                                                    onPress={() => {
                                                        setModalVisible(true)
                                                    }}
                                                    color={Colors.primary}
                                                />
                                            </View>
                                            <View style={{marginVertical: 5}}>
                                                <Button
                                                    title="Seleziona il turismo"
                                                    onPress={() => {
                                                        setModalTTVisible(true)
                                                    }}
                                                    color={Colors.primary}
                                                />
                                            </View>
                                            <Modal
                                                animationType="slide"
                                                transparent={true}
                                                visible={modalVisible}
                                                onRequestClose={() => {
                                                    Alert.alert("Modal has been closed.");
                                                }}
                                            >
                                                <View style={styles.centeredView}>
                                                    <View style={styles.modalView}>
                                                        <View>
                                                            {pickerCities}
                                                            <TouchableHighlight
                                                                style={styles.hideButton}
                                                                onPress={() => {
                                                                    setModalVisible(false);
                                                                }}
                                                            >
                                                                <Text style={styles.textStyle}>{"Nascondi"}</Text>
                                                            </TouchableHighlight>
                                                        </View>
                                                    </View>
                                                </View>

                                            </Modal>
                                            <Modal
                                                animationType="slide"
                                                transparent={true}
                                                visible={modalTTVisible}
                                                onRequestClose={() => {
                                                    Alert.alert("Modal has been closed.");
                                                }}
                                            >
                                                <View style={styles.centeredView}>
                                                    <View style={styles.modalView}>
                                                        <View>
                                                            {pickerTts}
                                                            <TouchableHighlight
                                                                style={styles.hideButton}
                                                                onPress={() => {
                                                                    setModalTTVisible(false);
                                                                }}
                                                            >
                                                                <Text style={styles.textStyle}>{"Nascondi"}</Text>
                                                            </TouchableHighlight>
                                                        </View>
                                                    </View>
                                                </View>
                                            </Modal>
                                            <View style={{marginVertical: 5}}>
                                                <Text>Numero di persone:</Text>
                                            </View>
                                            <TextInput
                                                placeholder={"Numero"}
                                                returnKeyType='next'
                                                keyboardType='numeric'
                                                onChangeText={handleChange('numPeople')}
                                                onBlur={handleBlur('numPeople')}
                                                //value={values.minBudget}
                                                style={styles.picker}
                                            />
                                            <Text>Seleziona il tuo budget:</Text>
                                            <TextInput
                                                placeholder={"Max Budget"}
                                                returnKeyType='next'
                                                keyboardType='numeric'
                                                onChangeText={handleChange('maxBudget')}
                                                onBlur={handleBlur('maxBudget')}
                                                //value={values.minBudget}
                                                style={styles.picker}
                                            />
                                            <Text>Stelle minime dell'hotel:</Text>
                                            <Rating
                                                type='star'
                                                ratingCount={5}
                                                imageSize={30}
                                                style={{padding: 10}}
                                                onFinishRating={ratingMinCompleted}
                                            />
                                            <Text>Stelle massime dell'hotel:</Text>
                                            <Rating
                                                type='star'
                                                ratingCount={5}
                                                imageSize={30}
                                                style={{padding: 10}}
                                                onFinishRating={ratingMaxCompleted}
                                            />
                                            <Text>Regione preferita:</Text>
                                            <TextInput
                                                placeholder={"Regione"}
                                                returnKeyType='next'
                                                onChangeText={handleChange('onlyRegion')}
                                                onBlur={handleBlur('onlyRegion')}
                                                //value={values.onlyRegion}
                                                style={styles.picker}
                                            />
                                            <Text>Regione da escludere:</Text>
                                            <TextInput
                                                placeholder={"Regione"}
                                                returnKeyType='next'
                                                onChangeText={handleChange('onlyNotRegion')}
                                                onBlur={handleBlur('onlyNotRegion')}
                                                //value={values.onlyNotRegion}
                                                style={styles.picker}
                                            />
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
                    </ScrollView>
                </ImageBackground>
            </View>
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
        marginTop: 20,
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
        height: 40,
        borderColor: 'orange',
        borderWidth: 1,
        marginVertical: 5,
        width: 240,
        borderRadius: 10,
        textAlign: 'center',
        padding: 10
    },
    // rowContainer: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between'
    // },
    // inputBudget: {
    //     height: 40,
    //     borderColor: 'orange',
    //     borderWidth: 1,
    //     marginVertical: 5,
    //     width: 100,
    //     borderRadius: 10,
    //     textAlign: 'center',
    //     padding: 10
    // },
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    modalView: {
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 6,
        shadowOpacity: 0.26,
        elevation: 8,
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10
    },
    hideButton: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        padding: 10,
        marginTop: 10
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default SecretSearchScreen;
