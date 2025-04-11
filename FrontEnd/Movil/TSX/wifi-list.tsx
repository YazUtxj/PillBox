import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Platform, PermissionsAndroid, FlatList, Modal } from 'react-native';
import styles from '../styles/home-styles';
import WifiManager from 'react-native-wifi-reborn';

type WiFiModalProps = {
  visible: boolean;
  onClose: () => void;
};

const WiFiModal: React.FC<WiFiModalProps> = ({ visible, onClose }) => {
  const [wifiList, setWifiList] = useState<{ SSID: string; BSSID?: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso de ubicación',
          message: 'Se necesita acceso a la ubicación para escanear redes WiFi',
          buttonNeutral: 'Preguntar después',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Aceptar',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const scanWifiNetworks = async () => {
    setLoading(true);
    const hasPermission = await requestPermissions();

    if (!hasPermission) {
      alert('Permiso denegado');
      setLoading(false);
      return;
    }

    if (!WifiManager || typeof WifiManager.loadWifiList !== 'function') {
      console.error('WifiManager no está disponible');
      alert('Error: No se puede acceder a la lista de redes WiFi.');
      setLoading(false);
      return;
    }

    try {
      const networks = await WifiManager.loadWifiList();
      console.log('Redes WiFi encontradas:', networks);

      const formattedNetworks = networks.map((net) => ({
        SSID: net.SSID || 'Red desconocida',
        BSSID: net.BSSID || '',
      }));

      setWifiList(formattedNetworks);
    } catch (error) {
      console.error('❌ Error escaneando WiFi:', error);
      alert('No se pudieron obtener redes WiFi.');
    }

    setLoading(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onShow={scanWifiNetworks}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Redes WiFi disponibles</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={wifiList}
              keyExtractor={(item) => item.BSSID || item.SSID}
              renderItem={({ item }) => <Text style={styles.networkItem}>{item.SSID}</Text>}
            />
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default WiFiModal;