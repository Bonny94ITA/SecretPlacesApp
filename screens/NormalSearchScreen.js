import {
    Button,
    Keyboard,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import React from "react";
import Colors from "../constants/colors";
import Header from "../components/Header";
import {Formik} from 'formik';
import DatePicker from 'react-native-datepicker';


const NormalSearchScreen = () => {
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
                                initialValues={{email: ''}}
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
                                        <DatePicker
                                            style={styles.dataPicker}
                                            //date={this.state.date}
                                            mode="date"
                                            placeholder="Data di partenza"
                                            format="YYYY-MM-DD"
                                            minDate="2016-05-01"
                                            maxDate="2016-06-01"
                                            confirmBtnText="Conferma"
                                            cancelBtnText="Annulla"
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 4,
                                                    marginLeft: 0,
                                                },
                                                dateInput: {
                                                    height: 40,
                                                    borderColor: 'orange',
                                                    borderWidth: 1,
                                                    marginVertical: 5,
                                                    borderRadius: 10,
                                                    textAlign: 'center'
                                                }
                                            }}
                                            onDateChange={(date) => {
                                                this.setState({date: date})
                                            }}
                                        />
                                        <DatePicker
                                            style={styles.dataPicker}
                                            //date={this.state.date}
                                            mode="date"
                                            placeholder="Data di arrivo"
                                            format="YYYY-MM-DD"
                                            minDate="2016-05-01"
                                            maxDate="2016-06-01"
                                            confirmBtnText="Conferma"
                                            cancelBtnText="Annulla"
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 4,
                                                    marginLeft: 0
                                                },
                                                dateInput: {
                                                    height: 40,
                                                    borderColor: 'orange',
                                                    borderWidth: 1,
                                                    borderRadius: 10
                                                }
                                                // ... You can check the source to find the other keys.
                                            }}
                                            onDateChange={(date) => {
                                                this.setState({date: date})
                                            }}
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
