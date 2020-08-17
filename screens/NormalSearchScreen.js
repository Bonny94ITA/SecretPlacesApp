import React, {useState} from 'react';
import {
    Button,
    Keyboard,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";

import Colors from "../constants/colors";
import Header from "../components/Header";
import {Formik} from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';

const NormalSearchScreen = () => {
    const [dateArrival, setDateArrival] = useState(new Date(1598051730000));
    const [dateDeparture, setDateDeparture] = useState(new Date(1598051730000));
    const [showArrival, setShowArrival] = useState(false);
    const [showDeparture, setShowDeparture] = useState(false);

    const onChangeArrival = (event, selectedDate) => {
        const currentDate = selectedDate || dateArrival;
        setShowArrival(Platform.OS === 'ios')
        setDateArrival(currentDate);
    };

    const onChangeDeparture = (event, selectedDate) => {
        const currentDate = selectedDate || dateDeparture;
        setShowDeparture(Platform.OS === 'ios')
        setDateDeparture(currentDate);
    };

    const showHidePickerArrival = () => {
        setShowArrival(!showArrival);
    };

    const showHidePickerDeparture = () => {
        setShowDeparture(!showDeparture);
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
                                onSubmit={() => {
                                    console.log(dateArrival.getDate());
                                    console.log(dateArrival.getUTCMonth() + 1);
                                    console.log(dateArrival.getUTCFullYear());
                                    console.log(dateDeparture.getDate());
                                    console.log(dateDeparture.getUTCMonth() + 1);
                                    console.log(dateDeparture.getUTCFullYear());
                                }}
                            >
                                {({handleChange, handleBlur, handleSubmit, values}) => (
                                    <View>
                                        <TextInput
                                            placeholder={"Città"}
                                            returnKeyType='next'
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('città')}
                                            //value={values.email}
                                            style={styles.inputText}
                                        />
                                        <View>
                                            <Button onPress={showHidePickerArrival} title="Data di partenza"/>
                                        </View>
                                        {showArrival && (
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={dateArrival}
                                                mode={'date'}
                                                is24Hour={true}
                                                display="default"
                                                onChange={onChangeArrival}
                                            />
                                        )}
                                        <View>
                                            <Button onPress={showHidePickerDeparture} title="Data di arrivo"/>
                                        </View>
                                        {showDeparture && (
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={dateDeparture}
                                                mode={'date'}
                                                is24Hour={true}
                                                display="default"
                                                onChange={onChangeDeparture}
                                            />
                                        )}
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
