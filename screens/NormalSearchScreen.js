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
    const [date, setDate] = useState(new Date(1598051730000));
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios')
        setDate(currentDate);
    };

    const showHidePicker = () => {
        setShow(!show);
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
                                    console.log(date.getDate());
                                    console.log(date.getUTCMonth() + 1);
                                    console.log(date.getUTCFullYear());
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
                                            <Button onPress={showHidePicker} title="Show date picker!"/>
                                        </View>
                                        {show && (
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={date}
                                                mode={'date'}
                                                is24Hour={true}
                                                display="default"
                                                onChange={onChange}
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
