import React, { useEffect, useState } from "react";
import { View, Text, Modal, Image } from "react-native";
import { Button, TextInput } from "react-native-paper";
import styles from "../styles/home-styles";


//* Aqui van las notificaciones, (es un modal emergente)


const AlarmModal = () => {
  // Logica

return (
    <Modal animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.title}>Ya es hora!</Text>
                <Text style={styles.subtitle}>#nombredelcontenedor</Text>
            </View>
        </View>
    </Modal>
    );
};

export default AlarmModal;
