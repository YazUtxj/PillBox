import React, { useEffect, useState } from "react";
import { View, Text, Modal, Image } from "react-native";
import { Button, TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import styles from "../styles/home-styles";

interface AlarmModalProps {
  visible: boolean;
  selectedAlarm: number | null;
  alarms: { id: string; title: string; intervalHours: number; durationDays: number; startTime: Date }[];
  setAlarms: React.Dispatch<React.SetStateAction<{ title: string; intervalHours: number; durationDays: number; startTime: Date }[]>>;
  onClose: () => void;
  userId: string;
}

const AlarmModal: React.FC<AlarmModalProps> = ({ visible, selectedAlarm, alarms, setAlarms, onClose, userId }) => {
  const ipPC = "192.168.43.42"
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  if (selectedAlarm === null) return null;
  useEffect(() => {
    if (selectedAlarm !== null) {
      setName(alarms[selectedAlarm].title);
    }
  }, [selectedAlarm]);

  const saveContainer = async () => {
    setLoading(true);
    try {
        const container = alarms[selectedAlarm];
        const response = await fetch(`http://${ipPC}:3000/edit-container`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                containerId: container.id,
                name_container: name,
                init_time: container.startTime.toISOString(),
                hours: container.intervalHours,
                days: container.durationDays,
            }),
        });
        const text = await response.text();
        const data = JSON.parse(text);
        if (!response.ok) {
            throw new Error(data.message || "Error al guardar el contenedor");
        }
        setAlarms((prevAlarms) => {
            const updatedAlarms = [...prevAlarms];
            updatedAlarms[selectedAlarm] = {
                ...updatedAlarms[selectedAlarm],
                title: name,
                intervalHours: container.intervalHours,
                durationDays: container.durationDays,
                startTime: container.startTime
            };
            return updatedAlarms;
        });
        onClose();
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};



  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Configurar Alarma</Text>
          <View style={styles.center}>
            <Image source={require("../../assets/alarm_icon.png")} style={styles.image}/>
          </View>
          <View style={styles.center}>
            <Button onPress={() => setShowTimePicker(true)}>Elegir hora de inicio</Button>
            <Text>Inicio actual: {alarms[selectedAlarm].startTime.toLocaleTimeString()}</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nombre del contenedor"
            value={name}
            onChangeText={setName}
          />
          {showTimePicker && (
            <DateTimePicker
              value={alarms[selectedAlarm].startTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedTime) => {
                if (selectedTime) {
                  const updatedAlarms = [...alarms];
                  updatedAlarms[selectedAlarm].startTime = selectedTime;
                  setAlarms(updatedAlarms);
                }
                setShowTimePicker(false);
              }}
            />
          )}
          <View style={styles.subContainerDateTime}>
            <View style={styles.subContainerDT1}>
              <Text>Repetir cada:</Text>
            </View>
            <View style={styles.subContainerDT2}>
              <Picker
                selectedValue={alarms[selectedAlarm].intervalHours}
                onValueChange={(value) => {
                  const updatedAlarms = [...alarms];
                  updatedAlarms[selectedAlarm].intervalHours = value;
                  setAlarms(updatedAlarms);
                }}
                style={styles.picker}
              >
                {[...Array(25).keys()].map((hours) => (
                  <Picker.Item key={hours} label={`${hours} horas`} value={hours} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.subContainerDateTime}>
            <View style={styles.subContainerDT1}>
              <Text>Duración:</Text>
            </View>
            <View style={styles.subContainerDT2}>
              <Picker
                selectedValue={alarms[selectedAlarm].durationDays}
                onValueChange={(value) => {
                  const updatedAlarms = [...alarms];
                  updatedAlarms[selectedAlarm].durationDays = value;
                  setAlarms(updatedAlarms);
                }}
                style={styles.picker}
              >
                {[...Array(31).keys()].map((days) => (
                  <Picker.Item key={days} label={`${days} días`} value={days} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.flex}>
            <Button onPress={() => onClose()}>Cancelar</Button>
            <Button loading={loading} onPress={saveContainer}>Guardar</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlarmModal;
