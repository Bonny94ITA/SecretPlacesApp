import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    Alert,
    Button,
    Image
} from 'react-native';

import Colors from '../constants/colors';
import {AntDesign, Entypo} from '@expo/vector-icons';
import Header from '../components/Header';
import {useSelector} from 'react-redux';
import Dialog, {DialogTitle, DialogContent} from 'react-native-popup-dialog';

const Item = ({item}) => {
    const [isVisible, setVisible] = useState(false);

    return (
        <View style={styles.item}>
            <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                    <AntDesign name="home" size={20} style={styles.icon}/>
                    <Text style={styles.text}>{item.hotelName}</Text>
                    <AntDesign name="enviromento" size={20} style={styles.icon}/>
                    <Text style={styles.text}>{item.hotelAddress}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.columnContainer}>
                        <View style={styles.rowContainer}>
                            <AntDesign name="staro" size={20} style={styles.icon}/>
                            <Text style={styles.text}>{item.hotelStars}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <AntDesign name="user" size={20} style={styles.icon}/>
                            <Text style={styles.text}>{item.numPlaces}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Entypo name="credit" size={20} style={styles.icon}/>
                            <Text style={styles.text}>{item.ppn}</Text>
                        </View>
                    </View>
                    <View style={styles.columnContainer}>
                        <Image
                            style={styles.image}
                            source={require('../assets/hotel.jpg')}
                        />
                    </View>
                </View>
            </View>
            <Button
                title="Prenota"
                onPress={() => setVisible(true)}
                color={Colors.primary}
            />
            <Dialog
                visible={isVisible}
                onTouchOutside={() => {
                    setVisible(false);
                }}
                dialogTitle={<DialogTitle title="Dialog Title" />}
            >
                <DialogContent>
                    <Text>ciao</Text>
                </DialogContent>
            </Dialog>
        </View>
    );
}

const ResultsScreen = props => {
    const freeRooms = useSelector(state => state.normalSearch.freeRooms);

    const renderItem = ({item}) => {
        //const backgroundColor = item.idRoom === selectedId ? "#ffd699" : "#ffe0b3";

        return (
            <Item
                item={item}
                //style={{backgroundColor}}
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
        padding: 20
    },
    item: {
        backgroundColor: '#ffd699',
        padding: 10,
        margin: 10,
        borderRadius: 10
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10
    },
    columnContainer: {
        flexDirection: 'column',
        paddingRight: '20%'
    },
    icon: {
        padding: 10,
        color: 'black'
    },
    text: {
        fontSize: 20
    },
    image: {
        width: 175,
        height: 150,
        borderRadius: 25
    }
});

export default ResultsScreen;
