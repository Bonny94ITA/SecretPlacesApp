import React, { useState } from "react";
import {View, StyleSheet, FlatList, Text, TouchableOpacity, StatusBar } from 'react-native';
import Header from '../components/Header';

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
    },
    {
        id: '58694a0f-3dd1-471f-bd96-145571e29d72',
        title: 'Fourth Item',
    },
    {
        id: '58694a8f-3da1-471f-bd96-145571e29d72',
        title: 'Fifth Item',
    },
    {
        id: '58644a8f-3da1-471f-bd96-145571e29d72',
        title: 'Sixth Item',
    },
    {
        id: '98644a8f-3da1-471f-bd96-145571e29d72',
        title: 'Seventh Item',
    },
];

const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
        <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
);

const ResultsScreen = props => {
    const [selectedId, setSelectedId] = useState(null);

    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";

        return (
            <Item
                item={item}
                onPress={() => setSelectedId(item.id)}
                style={{ backgroundColor }}
            />
        );
    };

    return (
        <View style={styles.header}>
            <Header title={"Risultati Ricerca"}/>
            <View style={{flex:1}}>
                <FlatList style={{marginTop: 10, marginBottom: 10}}
                    data={DATA}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
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
        fontSize: 32,
    }
});

export default ResultsScreen;