import React, {useState, useEffect, useReducer} from 'react';
import {
    Button,
    Keyboard,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    TouchableHighlight
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
import RNPickerSelect from 'react-native-picker-select';
import {Rating, AirbnbRating} from 'react-native-ratings';

import Dialog, {
    SlideAnimation,
    DialogFooter,
    DialogButton,
    DialogContent
} from 'react-native-popup-dialog';


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
        //dispatch(authActions.submitLogout());
        console.log(error);
    }).catch(function (error) {
        //dispatch(authActions.submitLogout());
        console.log(error);
    });

    return alternatives;
}

const initialState = {flags: [false, false, false, false, false, false]};

function reducer(state, action) {
    let newState = Object.assign({}, state);
    newState.flags[action.index] = !newState.flags[action.index];
    return newState;
}


const SecretSearchScreen = props => {
    const [isDatePickerVisibleA, setDatePickerVisibilityA] = useState(false);
    const [isDatePickerVisibleD, setDatePickerVisibilityD] = useState(false);
    const [dateArrival, setDateArrival] = useState(new Date(1598051730000));
    const [dateDeparture, setDateDeparture] = useState(new Date(1598051730000));
    const [minStar, setMinStar] = useState(0);
    const [maxStar, setMaxStar] = useState(5);

    const [selectedValue, setSelectedValue] = useState("Cagliari");
    const [selectedTourism, setSelectedTourism] = useState(null);
    const [pickerItems, setPickerItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const cities = useSelector(state => state.cities.cities);
    const [state, dispatchReducer] = useReducer(reducer, initialState);
    const dispatch = useDispatch();

    console.log("dsadsadasd")

    useEffect(() => {
        if (cities != null) {
            //dispatchReducer({type: 'init', paylaod: cities.lenght});

            const citiesItems = [];
            cities.forEach((city, i) => {
                    citiesItems.push(<CheckBox
                        title={city.name}
                        checked={state.flags[i]}
                        onPress={() => dispatchReducer({index: i})}
                        key={i}
                    />);
                }
            );

            setPickerItems(citiesItems);
        }
    }, [state]);

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
        setMinStar(star);
        console.log("Rating is min: " + star)
    };

    const ratingMaxCompleted = (star) => {
        setMaxStar(star);
        console.log("Rating is max: " + star)
    };

    return (
        <View style={styles.header}>
            <Header title={"Ricerca Segreta "}/>
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
            }}>
                <View style={styles.container}>
                    <ImageBackground source={require('../assets/sunset2.jpg')} style={styles.image}>
                        <ScrollView>
                            <View style={styles.screen}>
                                <View style={styles.inputContainer}>
                                    <Formik
                                        // modificare la formica (quando si andrà a leggere da input)
                                        initialValues={{city: '', arrival: '', departure: ''}}
                                        onSubmit={async values => {
                                            const formattedAlteratives = [];
                                            const alternatives = await secretSearch([{
                                                    region: "Sardegna",
                                                    city: "Nuoro"
                                                }, {region: "Sardegna", city: "Cagliari"}],
                                                500, 3, "Sardegna", "Sicilia", 4, 2,
                                                ["balenare", "lacustre", "naturalistico"], "12/07/2020", "24/08/2020", dispatch);

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
                                                formattedAlteratives.push({
                                                    id: index,
                                                    days: element.days,
                                                    sojourns: formattedSojourns,
                                                    totalPrice: element.totalPrice
                                                });
                                            });

                                            dispatch(clearFreeRooms());
                                            dispatch(setAlternatives(formattedAlteratives));
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
                                                <Button
                                                    title="Seleziona le città"
                                                    onPress={() => {
                                                        setModalVisible(true)
                                                    }}
                                                    color={Colors.primary}
                                                />
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
                                                                {pickerItems}
                                                                <TouchableHighlight
                                                                    style={{
                                                                        ...styles.openButton,
                                                                        backgroundColor: "#2196F3"
                                                                    }}
                                                                    onPress={() => {
                                                                        setModalVisible(false);
                                                                    }}
                                                                >
                                                                    <Text style={styles.textStyle}>Hide Modal</Text>
                                                                </TouchableHighlight>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </Modal>
                                                {/*<View style={styles.picker}>*/}
                                                {/*    <RNPickerSelect*/}
                                                {/*        placeholder={{*/}
                                                {/*            label: 'Seleziona una città...',*/}
                                                {/*            value: null,*/}
                                                {/*        }}*/}
                                                {/*        selectedValue={selectedValue}*/}
                                                {/*        onValueChange={(itemValue) => setSelectedValue(itemValue)}*/}
                                                {/*        items={pickerItems}*/}
                                                {/*    />*/}
                                                {/*</View>*/}
                                                <Text>Seleziona il tuo budget:</Text>

                                                <View style={styles.rowContainer}>
                                                    <TextInput
                                                        placeholder={"Min Budget"}
                                                        returnKeyType='next'
                                                        keyboardType='numeric'
                                                        onChangeText={handleChange('Min Budget')}
                                                        onBlur={handleBlur('Min Budget')}
                                                        //value={values.minBudget}
                                                        style={styles.inputBudget}
                                                    />
                                                    <TextInput
                                                        placeholder={"Max Budget"}
                                                        returnKeyType='next'
                                                        keyboardType='numeric'
                                                        onChangeText={handleChange('Max Budget')}
                                                        onBlur={handleBlur('Max Budget')}
                                                        //value={values.maxBudget}
                                                        style={styles.inputBudget}
                                                    />
                                                </View>
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
                                                <Text>Tipo di turismo:</Text>
                                                <View style={styles.picker}>
                                                    <RNPickerSelect
                                                        placeholder={{
                                                            label: 'Seleziona tipologia di turismo...',
                                                            value: null,
                                                        }}
                                                        selectedValue={selectedValue}
                                                        onValueChange={(value) => setSelectedTourism(value)}
                                                        items={[
                                                            {label: 'Balneare', value: 'balneare'},
                                                            {label: 'Naturalistico', value: 'naturalistico'},
                                                            {label: 'Montano', value: 'montano'},
                                                            {label: 'Lacustre', value: 'lacustre'},
                                                            {label: 'Termale', value: 'termale'},
                                                            {label: 'Sportivo', value: 'sportivo'}
                                                        ]}
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
                        </ScrollView>
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
        marginTop: 20,
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
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    inputBudget: {
        height: 40,
        borderColor: 'orange',
        borderWidth: 1,
        marginVertical: 5,
        width: 100,
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
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default SecretSearchScreen;
