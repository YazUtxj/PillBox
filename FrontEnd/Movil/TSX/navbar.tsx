import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types';
import styles from '../styles/home-styles';

type NavbarProps = {
  setModalVisible: (visible: boolean) => void;
};

const Navbar: React.FC<NavbarProps> = ({ setModalVisible }) => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setModalVisible(true)}
        >
          <Image source={require("../../assets/wifi.png")} style={styles.image_navbar}/>
        </TouchableOpacity>
      <View style={styles.centerButtons}>
        <Text style={styles.title}>Pastillero App</Text>
      </View>
      <TouchableOpacity style={styles.rightButton} onPress={() => navigation.navigate('login')}>
        <Image source={require("../../assets/cerrar-sesion.png")} style={styles.image_navbar}/>
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;
