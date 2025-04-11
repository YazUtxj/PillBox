import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import styles from '../styles/home-styles';

interface TemperatureComponentProps {
  userId: string;
  ipPC: string;
}

interface Record {
  id: string;
  temperature: number;
  humidity: number;
  date: string;
  formattedDate: string;
}

interface GraphDataResponse {
  message: string;
  user_id: string;
  totalRecords: number;
  records: Record[];
}

const screenWidth = Dimensions.get("window").width;

const TemperatureComponent: React.FC<TemperatureComponentProps> = ({ userId, ipPC }) => {
  const [graphData, setGraphData] = useState<GraphDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://${ipPC}:3000/get-graphdata/${userId}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data: GraphDataResponse = await response.json();
        
        if (!data.records || data.records.length === 0) {
          setError('No hay datos disponibles aqui');
        } else {
          setGraphData(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchGraphData();
    }
  }, [userId, ipPC]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorGraphText}>No hay datos disponibles aqui</Text>
        <LineChart
          data={{
            labels: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
            datasets: [{ data: [0, 0, 0, 0, 0, 0] }]
          }}
          width={screenWidth - 60}
          height={200}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: "#222",
            backgroundGradientTo: "#444",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: () => "#fff",
            formatYLabel: (value) => Math.round(Number(value)).toString(),
            decimalPlaces: 0,
          }}
          bezier
          style={{ marginVertical: 10, borderRadius: 10 }}
          fromZero={true}
          yAxisInterval={1}
        />
        <LineChart
          data={{
            labels: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
            datasets: [{ data: [0, 0, 0, 0, 0, 0] }]
          }}
          width={screenWidth - 60}
          height={200}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: "#222",
            backgroundGradientTo: "#444",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: () => "#fff",
            formatYLabel: (value) => Math.round(Number(value)).toString(),
            decimalPlaces: 0,
          }}
          bezier
          style={{ marginVertical: 10, borderRadius: 10 }}
          fromZero={true}
          yAxisInterval={1}
        />
      </View>
    );
  }

  if (!graphData || graphData.records.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>No hay datos disponibles para mostrar</Text>
      </View>
    );
  }

  const lastRecords = graphData.records.slice(-6);
  const temperatureData = lastRecords.map(record => record.temperature);
  const humidityData = lastRecords.map(record => record.humidity);
  const labels = lastRecords.map(record => 
    new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );


  const chartConfig = {
    backgroundGradientFrom: "#222",
    backgroundGradientTo: "#444",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: () => "#fff",
    formatYLabel: (value) => Math.round(Number(value)).toString(),
    decimalPlaces: 1,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  };

  return (
    <View style={styles.container}>
      {/* Gráfica de Temperatura */}
      <Text style={styles.title}>(C°) Temperatura de tu pastillero</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: temperatureData }]
        }}
        width={screenWidth - 40}
        height={220}
        yAxisSuffix="°C"
        yAxisInterval={1}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

      {/* Gráfica de Humedad */}
      <Text style={styles.title}>(%) Humedad en tu pastillero</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: humidityData }]
        }}
        width={screenWidth - 40}
        height={220}
        yAxisSuffix="%"
        yAxisInterval={1}
        chartConfig={{
          ...chartConfig,
          color: (opacity = 1) => `rgba(100, 200, 255, ${opacity})`
        }}
        bezier
        style={styles.chart}
      />

      <Text style={styles.smallText}>
        Última actualización: {graphData.records[0].formattedDate}
      </Text>
    </View>
  );
};

export default TemperatureComponent;