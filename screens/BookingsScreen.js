import {AsyncStorage, Button, StyleSheet, Text, View} from "react-native";
import Colors from "../constants/colors";
import HomepageScreen from "./HomepageScreen";
import Header from "../components/Header";
import serverURL from "../components/ServerInfo";
import * as authActions from "../store/actions/auth";
import {useDispatch} from "react-redux";
import React, {useEffect} from 'react';

function timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Timeout exceeded."))
        }, milliseconds);
        promise.then(resolve, reject);
    });
}

async function getBookings(dispatch, token, userId) {
    let bookings = null;

    console.log(userId);
    console.log(token)
    await timeout(5000, fetch(serverURL + '/bookings/id/' + +userId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            token_info: JSON.stringify({token: token, type: 0})
        }
    }))
        .then(async function (response) {
            bookings = await response.json();
        }, function (error) {
            dispatch(authActions.submitLogout());
            console.log(error);
        }).catch(function (error) {
            dispatch(authActions.submitLogout());
            console.log(error);
        });

    return bookings;
}

const BookingsScreen = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchBookings(dispatch) {
            const userData = await AsyncStorage.getItem('userData');
            const jsonObj = JSON.parse(userData);
            const bookings = await getBookings(dispatch, jsonObj.token, 1);
            const formattedBookings = [];
            const formattedSojourns = [];

            bookings.forEach(booking => {
                booking.sojourns.forEach(element => {
                    formattedSojourns.push({
                        arrival: element.arrival,
                        departure: element.departure,
                        hotelName: element.room.hotel.name,
                        address: element.room.hotel.address,
                        hotelCity: element.room.hotel.city.name,
                        stars: element.room.hotel.stars,
                        numPlaces: element.room.numPlaces,
                        totalPrice: element.totalPrice
                    })
                })
            });

            bookings.forEach(element => {
                formattedBookings.push({
                    id: element.id,
                    sojourns: formattedSojourns,
                    totalPrice: element.totalPrice
                });
            });

            //console.log(formattedBookings);
        }

        fetchBookings(dispatch);
    }, []);

    return (
        <View style={styles.header}>
            <Header title={"Prenotazioni"}/>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flex: 1
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default BookingsScreen;
