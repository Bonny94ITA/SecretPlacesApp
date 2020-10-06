import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    Alert,
    Button
} from 'react-native';

import Colors from '../constants/colors';
import {AntDesign, Entypo} from '@expo/vector-icons';
import Header from '../components/Header';
import {useSelector} from 'react-redux';

const Item = ({item, onPress, style}) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
        <AntDesign name="enviromento" size={30} color="black"/>
        <Text style={styles.title}>{item.hotelAddress}</Text>
        <AntDesign name="home" size={30} color="black"/>
        <Text style={styles.title}>{item.hotelName}</Text>
        <AntDesign name="staro" size={30} color="black"/>
        <Text style={styles.title}>{item.hotelStars}</Text>
        <AntDesign name="user" size={30} color="black"/>
        <Text style={styles.title}>{item.numPlaces}</Text>
        <Entypo name="credit" size={30} color="black"/>
        <Text style={styles.title}>{item.ppn}</Text>
        <Button
            title="Prenota"
            onPress= {() => Alert.alert('Prenotato!')}
            color={Colors.primary}
        />
    </TouchableOpacity>
);

const ResultsScreen = props => {
    const freeRooms = useSelector(state => state.normalSearch.freeRooms);
    const [selectedId, setSelectedId] = useState(null);

    const renderItem = ({item}) => {
        const backgroundColor = item.idRoom === selectedId ? "#ffd699" : "#ffe0b3";

        return (
            <Item
                item={item}
                onPress={() => setSelectedId(item.idRoom)}
                style={{backgroundColor}}
            />
        );
    };

    return (
        <View style={styles.header}>
            <Header title={"Risultati Ricerca"}/>
            <View style={styles.container}>
                <View style={styles.outputContainer}>
                    <FlatList
                        data={freeRooms}
                        renderItem={renderItem}
                        keyExtractor={item => item.idRoom.toString()}
                    />
                </View>
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
        backgroundColor: Colors.background
    },
    outputContainer: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 6,
        shadowOpacity: 0.26,
        elevation: 8,
        padding: 20,
        borderRadius: 10
    },
    item: {
        padding: 20,
        margin: 10
    },
    title: {
        fontSize: 20,
    }
});

export default ResultsScreen;
