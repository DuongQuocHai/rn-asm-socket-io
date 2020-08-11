import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TextInput, TouchableOpacity, FlatList, ToastAndroid, Dimensions, Image, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios'

import { Button, Overlay } from 'react-native-elements';
import PORT from '../server/port'
import io from "socket.io-client";
import ItemProduct from '../component/ItemProduct'

import FloatingButton from '../component/FloatingButton'

const RANDOM_IMAGE = 'https://api.unsplash.com/users/quochaiduong73/likes/?client_id=DY70YHkz6hFn1yAebVvq_9OfANkVWEzDC9wEGZCl0d0'

const HomeScreen = ({ navigation }) => {
    const [visibleModal, setVisibleModal] = useState(false);
    const [dataShoe, setDataShoe] = useState({
        images: 'https://images.unsplash.com/photo-1593620877307-39a5895e4adc?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE1NjEwNX0',
        name: '',
        price: '',
        price_promotion: '',
        description: '',
    });
    const [listShoes, setListShoes] = useState(null);
    const [onPressModal, setOnPressModal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [textSearch, setTextSearch] = useState('');

    useEffect(() => {
        socket = io(PORT);
        getShoes();
    }, []);

    const randomIamge = async () => {
        try {
            const res = await axios.get(RANDOM_IMAGE);
            if (res) {
                const iRandom = Math.floor(Math.random() * res.data.length + 1);
                const image = res.data[iRandom];
                return setDataShoe({
                    ...dataShoe,
                    images: image.urls.full
                })
            } else {
                ToastAndroid.showWithGravity(
                    'Reload image failed',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                )
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handlerCancel = () => {
        setVisibleModal(false);
        setDataShoe({});
    }



    const getShoes = () => {
        setIsLoading(true);
        setTextSearch('')
        socket.emit('getShoes')
        socket.on('resGetShoes', (resdata) => {
            if (resdata) {
                setListShoes(resdata);
                setIsLoading(false);
            } else {
                ToastAndroid.showWithGravity(
                    'Get all failed!',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                )
            }
        })
    }

    const addShoe = (data) => {
        socket.emit('addShoe', data)
        socket.on('resAddShoe', (resdata) => {
            if (resdata) {
                ToastAndroid.showWithGravity(
                    'Create successfully',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                )
                getShoes();
                handlerCancel();
            } else {
                ToastAndroid.showWithGravity(
                    'Create failed!',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                )
            }
        })
    }


    const setDataUpdateShoe = (data) => {
        console.log(data)
        setDataShoe(data);
        setVisibleModal(true);
        setOnPressModal(1)
    }

    const updateShoe = (data) => {
        socket.emit('updateShoe', data)
        socket.on('resUpdateShoe', (resdata) => {
            if (resdata) {
                ToastAndroid.showWithGravity(
                    'Update successfully',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                )
                getShoes();
                handlerCancel();
            } else {
                ToastAndroid.showWithGravity(
                    'Update failed!',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                )
            }
        })
    }

    const deleteShoe = (data) => {
        socket.emit('deleteShoe', data)
        socket.on('resDeleteShoe', (resdata) => {
            if (resdata) {
                ToastAndroid.showWithGravity(
                    'Delete successfully',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                )
                getShoes();
            } else {
                ToastAndroid.showWithGravity(
                    'Delete failed!',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                )
            }
        })
    }

    const pressSearch = (name) => {
        var matchedShoes = listShoes.filter((shoe) => {
            return shoe.name.toLocaleLowerCase().indexOf(name.toLocaleLowerCase()) !== -1;
        })
        setListShoes(matchedShoes)
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#4b6584'} barStyle='light-content' />
            <View style={styles.header}>
                <View style={styles.tabBar}>
                    <View style={styles.back}>
                        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')} >
                            <SimpleLineIcons color='white' size={22} name={'logout'} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.warpperSearch} >
                        <TextInput
                            placeholder='Search'
                            style={styles.txtSearch}
                            value={textSearch}
                            onBlur={() => pressSearch(textSearch)}
                            onChangeText={(val) => setTextSearch(val)}
                        />
                        <TouchableOpacity onPress={() => pressSearch(textSearch)} >
                            <FontAwesome
                                name='search'
                                size={17}
                                color='grey'
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={listShoes}
                    onRefresh={() => getShoes()}
                    refreshing={isLoading}
                    renderItem={({ item }) => (
                        <ItemProduct
                            key={item._id}
                            data={item}
                            onPress={() => setDataUpdateShoe(item)}
                            onLongPress={() => deleteShoe(item)}
                        />
                    )}
                    numColumns={2}
                    style={{ flex: 1 }}
                    keyExtractor={item => item._id.toString()} />
            </View>
            <Overlay fullScreen={true} isVisible={visibleModal} >
                <View style={styles.container}>
                    <ScrollView
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                            <View>
                                <View style={styles.headerModal}>
                                    <Image
                                        source={{ uri: dataShoe.images ? dataShoe.images : 'https://images.unsplash.com/photo-1593620877307-39a5895e4adc?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE1NjEwNX0' }}
                                        resizeMode='cover'
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                    <View style={styles.warpperBtnIcon}>
                                        <TouchableOpacity
                                            onPress={() => randomIamge()}
                                            style={styles.btnIcon} >
                                            <Entypo color={'black'} size={25} name='edit' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.warpperBody}>
                                    <Text style={styles.text_footer}>Name</Text>
                                    <View style={styles.action}>
                                        <TextInput
                                            placeholder="Shoe name"
                                            placeholderTextColor="#666666"
                                            autoCapitalize="none"
                                            returnKeyType='next'
                                            value={dataShoe.name}
                                            onChangeText={(val) => setDataShoe({
                                                ...dataShoe,
                                                name: val
                                            })}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <Text style={[styles.text_footer, { marginTop: 20 }]}>Price</Text>
                                    <View style={styles.action}>

                                        <TextInput
                                            placeholder="Shoe price"
                                            placeholderTextColor="#666666"
                                            autoCapitalize="none"
                                            keyboardType='numeric'
                                            returnKeyType='next'
                                            value={dataShoe.price + ""}
                                            style={styles.textInput}
                                            onChangeText={(val) => setDataShoe({
                                                ...dataShoe,
                                                price: val
                                            })}
                                        // onChangeText={(val) => changeTxtPhone(val)}

                                        />
                                    </View>
                                    <Text style={[styles.text_footer, { marginTop: 20 }]}>Promotional price</Text>
                                    <View style={styles.action}>

                                        <TextInput
                                            placeholder="Promotional shoe prices"
                                            placeholderTextColor="#666666"
                                            autoCapitalize="none"
                                            keyboardType='numeric'
                                            returnKeyType='next'
                                            value={dataShoe.price_promotion + ""}
                                            onChangeText={(val) => setDataShoe({
                                                ...dataShoe,
                                                price_promotion: val
                                            })}
                                            // onChangeText={(val) => changeTxtPhone(val)}
                                            style={styles.textInput}

                                        />
                                    </View>
                                    <Text style={[styles.text_footer, { marginTop: 20 }]}>Description</Text>
                                    <View style={styles.action}>
                                        <TextInput
                                            placeholder="Shoe description"
                                            placeholderTextColor="#666666"
                                            autoCapitalize="none"
                                            returnKeyType='next'
                                            multiline={true}
                                            value={dataShoe.description}
                                            onChangeText={(val) => setDataShoe({
                                                ...dataShoe,
                                                description: val
                                            })}
                                            // onChangeText={(val) => changeTxtPhone(val)}
                                            style={[styles.textInput, { height: 150 }]}

                                        />
                                    </View>
                                    <View style={{ marginTop: 10, justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                                        <TouchableOpacity
                                            onPress={() => handlerCancel()}
                                            style={[styles.signIn, {
                                                borderColor: '#4b6584',
                                                borderWidth: 1,
                                            }]}
                                        >
                                            <Text style={[styles.textSign, { color: '#4b6584' }]}>Cancel</Text>
                                        </TouchableOpacity>
                                        {
                                            onPressModal ?
                                                <TouchableOpacity disabled={false} style={styles.signIn}
                                                    onPress={() => updateShoe(dataShoe)}
                                                >
                                                    <LinearGradient colors={['#778ca3', '#4b6584']} style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }} >
                                                        <Text style={[styles.textSign, { color: '#fff' }]}>
                                                            Update
                                                        </Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity disabled={false} style={styles.signIn}
                                                    onPress={() => addShoe(dataShoe)}
                                                >
                                                    <LinearGradient colors={['#778ca3', '#4b6584']} style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }} >
                                                        <Text style={[styles.textSign, { color: '#fff' }]}>
                                                            Created
                                                        </Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView >
                </View>
            </Overlay>
            <FloatingButton onPress={() => {
                setOnPressModal(0)
                setVisibleModal(true)
            }
            }
            />
        </View>
    );
}

export default HomeScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#4b6584',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
    },
    tabBar: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10

    },
    headerModal: {
        width: Dimensions.get('window').width,
        height: 230,
        position: 'relative'
    },
    back: {
        justifyContent: 'center',
        width: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.7
    },
    warpperSearch: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
        height: 42,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    txtSearch: {
        fontSize: 17,
        color: 'grey',
        flex: 1
    },
    warpperBody: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    warpperBtnIcon: {
        position: 'absolute',
        bottom: 10,
        right: 25,
        flexDirection: 'row'
    },
    btnIcon: {
        backgroundColor: '#f1f2f6',
        marginLeft: 10,
        borderRadius: 5,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        backgroundColor: '#fff',
        fontSize: 15
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: '45%'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }

});


