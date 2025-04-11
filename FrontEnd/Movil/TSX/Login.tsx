import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../types';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import styles from '../../styles/auth-styles';

const Login = () => {
const ipPC = "192.168.43.42"
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const navigation = useNavigation<NavigationProps>();

const handleLogin = async () => {
let errors = [];

if (!email.trim()) {
	errors.push('* El correo electrónico es obligatorio');
}
if (!password.trim()) {
	errors.push('* La contraseña es obligatoria');
}

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (email && !emailPattern.test(email)) {
	errors.push('* El correo electrónico no tiene un formato válido');
}

const response = await fetch(`http://${ipPC}:3000/check-email/${email}`);
const emailData = await response.json();
if (!emailData.exists) {
  console.log("El correo electrónico no está registrado")
	errors.push('* El correo electrónico no está registrado');
}

if (errors.length > 0) {
	setErrorMessage(errors.join('\n'));
	return;
}

const loginResponse = await fetch(`http://${ipPC}:3000/login`, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ email, password }),
});

const loginData = await loginResponse.json();

if (loginResponse.ok) {
	setErrorMessage('');
	navigation.navigate('home', { userId: loginData.userId });
} else {
	setErrorMessage(loginData.message);
	setTimeout(() => setErrorMessage(''), 3000);
}
};

return (
	<View style={styles.container}>
    <View style={styles.rightContainer}>
			<Image source={ require('../../../assets/background-gradient.jpg') } style={styles.image} />
		</View>
		{/* <View style={styles.leftContainer}></View> */}
		<View style={styles.formContainer}>
			<Text style={styles.title}>Iniciar Sesión</Text>
			{errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
			<TextInput
			placeholder="Correo Electrónico"
			style={styles.input}
			keyboardType="email-address"
			autoCapitalize="none"
			autoCorrect={false}
			value={email}
			onChangeText={setEmail}
			/>
			<TextInput
			placeholder="Contraseña"
			secureTextEntry
			style={styles.input}
			value={password}
			onChangeText={setPassword}
			/>
			<TouchableOpacity style={styles.button} onPress={handleLogin}>
			<Text style={styles.textButton}>Iniciar sesión</Text>
			</TouchableOpacity>
			<View style={styles.containerAnchors}>
				<Text>¿No tienes una cuenta? </Text>
				<TouchableOpacity onPress={() => navigation.navigate('register')}>
					<Text style={styles.linkText}>Registrarse</Text>
				</TouchableOpacity>
			</View>
		</View>
	</View>
	);
};


export default Login;