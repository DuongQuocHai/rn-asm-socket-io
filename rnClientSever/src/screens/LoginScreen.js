import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StatusBar,
    ImageBackground,
    Alert,
    ActivityIndicator,
    ToastAndroid
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import io from "socket.io-client";

import PORT from '../server/port'


import styles from '../themes/SignInSignUp/styles'


const LoginScreen = ({ navigation }) => {

    const [data, setData] = React.useState({
        phone: '',
        password: '',
        errPhone: '',
        errPassword: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidPhone: true,
        isValidPassword: true
    });

    useEffect(() => {
        socket = io(PORT);
    }, []);

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry,
        })
    }

    const changeTxtPhone = (val) => {
        if (val.trim().length === 10) {
            setData({
                ...data,
                phone: val,
                check_textInputChange: true,
                isValidPhone: true
            })
        } else {
            setData({
                ...data,
                phone: val,
                check_textInputChange: false,
            })
        }
    }
    const changeTxtPass = (val) => {
        setData({
            ...data,
            password: val,
            isValidPassword: true
        });
        if (val === 6) {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            })
        }
    }

    const checkValidPhone = (phone) => {
        if (phone.trim().length === 10) {
            setData({
                ...data,
                isValidPhone: true
            })
            return true
        } else if (phone.trim().length < 10) {
            setData({
                ...data,
                isValidPhone: false,
                errPhone: "Phone must be 10 characters long"
            })
            return false
        }
    }
    const checkValidPass = (password) => {
        if (password.trim().length === 6) {
            setData({
                ...data,
                isValidPassword: true
            })
            return true
        } else if (password.trim().length < 6) {
            setData({
                ...data,
                isValidPassword: false,
                errPassword: "Password must be 6 characters long"
            })
            return false
        }
    }

    const handleLogin = async (data) => {
        if (checkValidPhone(data.phone) && checkValidPass(data.password)) {
            socket.emit('login', (data))
            socket.on('resLogin', (resdata) => {
                if (resdata) {
                    navigation.replace('HomeScreen')
                } else {
                    ToastAndroid.showWithGravity(
                        'Wrong phone number or password!',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                    )
                }
            })
        } else { setLoading(false); console.log('huhu') }
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#00C27F'} barStyle='light-content' />
            <Animatable.View animation="fadeIn" style={styles.header}>
                <Text style={styles.text_header}>
                    Login
                </Text>
            </Animatable.View>
            <Animatable.View animation="slideInUp" style={styles.footer}>
                <Text style={styles.text_footer}>Phone</Text>
                <View style={styles.action}>
                    <Feather
                        name="phone"
                        color={'#05375a'}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Phone"
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        maxLength={10}
                        keyboardType='numeric'
                        returnKeyType='next'
                        // onEndEditing={(val) => handleValidPhone(val.nativeEvent.text)}
                        onChangeText={(val) => changeTxtPhone(val)}
                        style={styles.textInput}
                    />
                    {
                        data.check_textInputChange ?
                            <Animatable.View animation='bounceIn' >
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null
                    }
                </View>
                {
                    data.isValidPhone ? null :
                        <Animatable.View animation="fadeInLeft" >
                            <Text style={styles.errorMsg}>{data.errPhone}</Text>
                        </Animatable.View>
                }
                <Text style={[styles.text_footer, { marginTop: 35 }]}>Password</Text>
                <View style={styles.action}>
                    <Feather
                        name="lock"
                        color={'#05375a'}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Password"
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        maxLength={6}
                        onChangeText={(val) => changeTxtPass(val)}
                        keyboardType='numeric'
                        style={styles.textInput}
                    />
                    <TouchableOpacity onPress={() => updateSecureTextEntry()}>
                        {data.secureTextEntry ?
                            <Feather
                                name="eye-off"
                                color="grey"
                                size={20}
                            /> :
                            <Feather
                                name="eye"
                                color="grey"
                                size={20}
                            />
                        }
                    </TouchableOpacity>
                </View>
                {
                    data.isValidPassword ? null :
                        <Animatable.View animation="fadeInLeft" >
                            <Text style={styles.errorMsg}>{data.errPassword}</Text>
                        </Animatable.View>
                }
                <TouchableOpacity>
                    <Text style={{ color: '#4b6584', marginTop: 15 }}>Forgot password?</Text>
                </TouchableOpacity>
                <View style={styles.button}>
                    <TouchableOpacity disabled={false} style={styles.signIn}
                        // onPress={() => { handleLogin(data.phone, data.password) }} 
                        onPress={() => handleLogin(data)}
                    >
                        <LinearGradient colors={['#778ca3', '#4b6584']} style={styles.signIn} >
                            <Text style={[styles.textSign, { color: '#fff' }]}>
                                Sign In
              </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')} style={[styles.signIn, {
                        borderColor: '#4b6584', borderWidth: 1, marginTop: 15
                    }]} >
                        <Text style={[styles.textSign, { color: '#4b6584' }]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
}

export default LoginScreen;
