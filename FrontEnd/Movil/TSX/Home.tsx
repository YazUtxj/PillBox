import { View, Text, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AlarmModal from '../../components/alarm-modal';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../types';
import React, { useEffect, useState } from 'react';
import WiFiModal from '../../components/wifi-list';
import styles from '../../styles/home-styles';
import Navbar from '../../components/navbar';
import TemperatureComponent from '../../components/dht-data';
import RecordTable from '../../components/table-data';


type HomeScreenProps = { route: RouteProp<RootStackParamList, 'home'>; };
const Home: React.FC<HomeScreenProps> = ({ route }) => {
    const ipPC = "192.168.43.42"
    const { userId } = route.params || {};
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAlarm, setSelectedAlarm] = useState<number | null>(null);
    const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
    const [alarms, setAlarms] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContainers = async () => {
        try {
            const response = await fetch(`http://${ipPC}:3000/get-containers/${userId}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                const userContainers = data.map((container: any) => ({
                    id: container._id,
                    title: container.name_container,
                    intervalHours: container.hours,
                    durationDays: container.days,
                    startTime: new Date(container.init_time),
                }));
                setAlarms(userContainers);
            } else {
                setAlarms([]);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://${ipPC}:3000/user/${userId}`);
                const data = await response.json();
                if (response.ok) setUserData(data);
                else console.error('Error al obtener datos del usuario:', data.message);
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };
        if (userId) {
            fetchUserData();
            fetchContainers();
        }

    }, [userId]);

    const resetContainer = async (index: number) => {
        const container = alarms[index];
        Alert.alert(
            "Restablecer Contenedor",
            `¿Estás seguro de que quieres restablecer el contenedor "${container.title}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Aceptar",
                    onPress: async () => {
                        try {
                            const response = await fetch(`http://${ipPC}:3000/edit-container`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    containerId: container.id,
                                    name_container: "Sin nombre",
                                    init_time: new Date().toISOString(),
                                    hours: 0,
                                    days: 0,
                                }),
                            });
                            if (!response.ok) {
                                const data = await response.json();
                                throw new Error(data.message || "Error al resetear el contenedor");
                            }
                            setAlarms((prevAlarms) => {
                                const updatedAlarms = [...prevAlarms];
                                updatedAlarms[index] = {
                                    id: container.id,
                                    title: "Sin nombre",
                                    intervalHours: 0,
                                    durationDays: 0,
                                    startTime: new Date(),
                                };
                                return updatedAlarms;
                            });
                            fetchContainers();
                        } catch (error) {
                            console.error("Error al resetear el contenedor:", error);
                        }
                    },
                },
            ]
        );
    };

    const openModal = (index: number) => setSelectedAlarm(index);
    const closeModal = () => setSelectedAlarm(null);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Navbar setModalVisible={setModalVisible}/>
                <View style={styles.content}>
                    <View style={styles.subtitle}>
                        <Text style={styles.title}>Configurar horarios</Text>
                        <Text>Presiona un contenedor para configurar su alarma o presiona el boton de Resetear para reiniciar la configuracion del contenedor</Text>
                    </View>
                    <View style={styles.containersSub}>
                        {alarms.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.listItem} onPress={() => openModal(index)}>
                                <Text style={styles.listTitle}>{item.title}</Text>
                                <Text style={styles.listSubtitle}>Cada {item.intervalHours}h por {item.durationDays} días</Text>
                                <TouchableOpacity 
                                    style={styles.resetButton} 
                                    onPress={() => resetContainer(index)}
                                ><Text style={styles.resetButtonText}>Resetear</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {/* <View style={styles.bg_graph_container}>
                        <Image source={require("../../../assets/background-gradient-home.jpg")} style={styles.bg_graph}/>
                    </View> */}
                    <TemperatureComponent 
                        userId={userId}
                        ipPC={ipPC}
                    />
                    <RecordTable userId={userId} ipPC={ipPC}/>
                    {selectedAlarm !== null && (
                        <AlarmModal
                            visible={selectedAlarm !== null}
                            selectedAlarm={selectedAlarm}
                            alarms={alarms}
                            setAlarms={setAlarms}
                            onClose={closeModal}
                            userId={userId}
                        />
                    )}
                    <WiFiModal visible={modalVisible} onClose={() => setModalVisible(false)}/>
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;