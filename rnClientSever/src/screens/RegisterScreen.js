import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    StyleSheet,
    StatusBar,
    Alert,
    ImageBackground,
    TextInput,
    ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import PORT from '../server/port'
import io from "socket.io-client";


import styles from '../themes/SignInSignUp/styles'
const RegisterScreen = ({ navigation }) => {
    const [data, setData] = React.useState({
        name: '',
        phone: '',
        errPhone: '',
        password: '',
        confirmPass: '',
        secureTextEntryPass: true,
        secureTextEntryConfirmPass: true,
        check_txtNameChanged: false,
        check_txtPhoneChanged: false,
        isValidName: true,
        isValidPhone: true,
        isValidPassword: true,
        isValidConfirmPassword: true,
    });


    const textInputNameChanged = (val) => {
        if (val.length !== 0) {
            setData({
                ...data,
                name: val,
                check_txtNameChanged: true,
                isValidName: true
            })
        } else {
            setData({
                ...data,
                name: val,
                check_txtNameChanged: false,
            })
        }
    }

    const textInputPhoneChanged = (val) => {
        if (val.length === 10) {
            setData({
                ...data,
                phone: val,
                check_txtPhoneChanged: true,
                isValidPhone: true
            })
        } else {
            setData({
                ...data,
                phone: val,
                check_txtPhoneChanged: false,
            })
        }
    }
    const textInputPassChanged = (val) => {
        setData({
            ...data,
            password: val,
        })
        if (val.length === 6) {
            setData({
                ...data,
                password: val,
                isValidPassword: true,
            })
        }
    }


    const textInputConfirmPassChanged = (val) => {
        setData({
            ...data,
            confirmPass: val,
            isValidConfirmPassword: true
        })
    }

    const updateSecureTextEntryPass = () => {
        setData({
            ...data,
            secureTextEntryPass: !data.secureTextEntryPass,
        })
    }

    const updateSecureTextEntryConfirmPass = () => {
        setData({
            ...data,
            secureTextEntryConfirmPass: !data.secureTextEntryConfirmPass,
        })
    }

    const checkValidName = () => {
        if (data.name.trim() !== '') {
            setData({
                ...data,
                isValidName: true
            })
            return true
        } else {
            setData({
                ...data,
                isValidName: false
            })
            return false
        }
    }

    const checkValidPhone = () => {
        if (data.phone.trim().length === 10) {
            setData({
                ...data,
                isValidPhone: true
            })
            return true
        } else if (data.phone.trim().length < 10) {
            setData({
                ...data,
                isValidPhone: false,
                errPhone: "Password must be 10 characters long"
            })
            return false
        }
    }
    const checkValidPass = () => {
        if (data.password.trim().length === 6) {
            setData({
                ...data,
                isValidPassword: true
            })
            return true
        } else if (data.password.trim().length < 6) {
            setData({
                ...data,
                isValidPassword: false
            })
            return false
        }
    }

    const checkConfirmPass = () => {
        if (data.password.trim() === data.confirmPass.trim()) {
            return true
        } else {
            setData({
                ...data,
                isValidConfirmPassword: false
            })
            // alert('Password does not match')
            return false
        }
    }
    useEffect(() => {
        socket = io(PORT);
    }, []);

    const handleResgister = async (user) => {
        if (checkValidName() && checkValidPhone() && checkValidPass() && checkConfirmPass()) {
            socket.emit('register', user)
            socket.on('resRegister', (resdata) => {
                if (resdata) {
                    navigation.replace('HomeScreen')
                } else {
                    setData({
                        ...data,
                        isValidPhone: false,
                        errPhone: 'Phone number has been registered'
                    })
                }
            })
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#00C27F'} barStyle='light-content' />
            <Animatable.View animation="fadeIn" style={styles.header}>
                <Text style={styles.text_header}>
                    Register
            </Text>
            </Animatable.View>
            <Animatable.View animation="slideInUp" style={styles.footer}>
                <Text style={styles.text_footer}>Full Name</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color={'#05375a'}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Name"
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        returnKeyType='next'
                        onChangeText={(val) => textInputNameChanged(val)}
                        style={styles.textInput}
                    />
                    {data.check_txtNameChanged ?
                        <Animatable.View
                            animation='bounceIn'
                        >
                            <Feather
                                name="check-circle"
                                color="green"
                                size={20}
                            />
                        </Animatable.View>
                        : null}
                </View>
                {
                    data.isValidName ? null :
                        <Animatable.View animation="fadeInLeft" >
                            <Text style={styles.errorMsg}>Name can't be empty</Text>
                        </Animatable.View>
                }
                <Text style={[styles.text_footer, { marginTop: 20 }]}>Phone</Text>
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
                        onChangeText={(val) => textInputPhoneChanged(val)}
                        style={styles.textInput}
                    />
                    {data.check_txtPhoneChanged ?
                        <Animatable.View
                            animation='bounceIn'
                        >
                            <Feather
                                name="check-circle"
                                color="green"
                                size={20}
                            />
                        </Animatable.View>
                        : null}
                </View>
                {
                    data.isValidPhone ? null :
                        <Animatable.View animation="fadeInLeft" >
                            <Text style={styles.errorMsg}>{data.errPhone}</Text>
                        </Animatable.View>
                }
                <Text style={[styles.text_footer, { marginTop: 20 }]}>Password</Text>
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
                        secureTextEntry={data.secureTextEntryPass ? true : false}
                        maxLength={6}
                        keyboardType='numeric'
                        onChangeText={(val) => textInputPassChanged(val)}
                        style={styles.textInput}
                    />
                    <TouchableOpacity onPress={() => updateSecureTextEntryPass()}>
                        {data.secureTextEntryPass ?
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
                            <Text style={styles.errorMsg}>Password must be 6 characters long</Text>
                        </Animatable.View>
                }
                <Text style={[styles.text_footer, { marginTop: 20 }]}>Confirm Password</Text>
                <View style={styles.action}>
                    <Feather
                        name="lock"
                        color={'#05375a'}
                        size={20}
                    />
                    <TextInput
                        placeholder="Confirm Your Password"
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        secureTextEntry={data.secureTextEntryConfirmPass ? true : false}
                        maxLength={6}
                        keyboardType='numeric'
                        onChangeText={(val) => textInputConfirmPassChanged(val)}
                        style={styles.textInput}
                    />
                    <TouchableOpacity onPress={() => updateSecureTextEntryConfirmPass()}>
                        {data.secureTextEntryConfirmPass ?
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
                    data.isValidConfirmPassword ? null :
                        <Animatable.View animation="fadeInLeft" >
                            <Text style={styles.errorMsg}>Password is not match</Text>
                        </Animatable.View>
                }
                <View style={styles.button}>
                    <TouchableOpacity
                        onPress={() => handleResgister(data)}
                        style={styles.signIn}>
                        <LinearGradient
                            colors={['#778ca3', '#4b6584']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, { color: '#fff' }]}>
                                Sign Up
                </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.replace('LoginScreen')}
                        style={[styles.signIn, {
                            borderColor: '#4b6584',
                            borderWidth: 1,
                            marginTop: 15
                        }]}
                    >
                        <Text style={[styles.textSign, { color: '#4b6584' }]}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
}
export default RegisterScreen;
