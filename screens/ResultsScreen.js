import React, { useState } from "react";
import {View, StyleSheet, FlatList, Text, TouchableOpacity, StatusBar } from 'react-native';
import Header from '../components/Header';
import {useSelector} from "react-redux";

const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
        <Text style={styles.title}>{item.hotelAddress}</Text>
        <Text style={styles.title}>{item.hotelName}</Text>
        <Text style={styles.title}>{item.hotelStars}</Text>
        <Text style={styles.title}>{item.idRoom}</Text>
        <Text style={styles.title}>{item.numPlaces}</Text>
        <Text style={styles.title}>{item.ppn}</Text>
    </TouchableOpacity>
);

const ResultsScreen = props => {
    const freeRooms = useSelector(state => state.normalSearch.freeRooms);
    const [selectedId, setSelectedId] = useState(null);

    const renderItem = ({ item }) => {
        const backgroundColor = item.idRoom === selectedId ? "#6e3b6e" : "#f9c2ff";

        return (
            <Item
                item={item}
                onPress={() => setSelectedId(item.idRoom)}
                style={{ backgroundColor }}
            />
        );
    };

    return (
        <View style={styles.header}>
            <Header title={"Risultati Ricerca"}/>
            <View style={{flex:1}}>
                <FlatList style={{marginTop: 10, marginBottom: 10}}
                    data={freeRooms}
                    renderItem={renderItem}
                    keyExtractor={item => item.idRoom}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flex: 1
    },
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 16,
    }
});

export default ResultsScreen;