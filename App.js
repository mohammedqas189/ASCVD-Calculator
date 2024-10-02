import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker } from 'react-native';
import ChatPage from './ChatPage'; // Assuming ChatPage is in the same directory

export default function App() {
  const [showChat, setShowChat] = useState(false); // State to toggle between pages

  // State for ASCVD Risk Calculator
  const [age, setAge] = useState('');
  const [totalCholesterol, setTotalCholesterol] = useState('');
  const [hdlCholesterol, setHdlCholesterol] = useState('');
  const [systolicBP, setSystolicBP] = useState('');
  const [smoker, setSmoker] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [onHypertensionMeds, setOnHypertensionMeds] = useState(false);
  const [sex, setSex] = useState('female');
  const [race, setRace] = useState('white');
  const [riskResult, setRiskResult] = useState(null);

  const togglePage = () => {
    setShowChat(!showChat);
  };

  const calculateRisk = () => {
    // Your risk calculation logic here
    setRiskResult('15.4%'); // Example result
  };

  if (showChat) {
    // Render ChatPage if showChat is true
    return <ChatPage navigation={{ goBack: togglePage }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ASCVD Risk Calculator</Text>

      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Total Cholesterol (mg/dL)"
        keyboardType="numeric"
        value={totalCholesterol}
        onChangeText={setTotalCholesterol}
      />
      <TextInput
        style={styles.input}
        placeholder="HDL Cholesterol (mg/dL)"
        keyboardType="numeric"
        value={hdlCholesterol}
        onChangeText={setHdlCholesterol}
      />
      <TextInput
        style={styles.input}
        placeholder="Systolic Blood Pressure (mm Hg)"
        keyboardType="numeric"
        value={systolicBP}
        onChangeText={setSystolicBP}
      />

      <Picker selectedValue={sex} onValueChange={setSex} style={styles.picker}>
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Male" value="male" />
      </Picker>

      <Picker selectedValue={race} onValueChange={setRace} style={styles.picker}>
        <Picker.Item label="White" value="white" />
        <Picker.Item label="African American" value="african_american" />
      </Picker>

      <View style={styles.checkboxContainer}>
        <Text>Smoker</Text>
        <Button title={smoker ? "Yes" : "No"} onPress={() => setSmoker(!smoker)} />
      </View>

      <View style={styles.checkboxContainer}>
        <Text>Diabetes</Text>
        <Button title={diabetes ? "Yes" : "No"} onPress={() => setDiabetes(!diabetes)} />
      </View>

      <View style={styles.checkboxContainer}>
        <Text>On Hypertension Meds</Text>
        <Button title={onHypertensionMeds ? "Yes" : "No"} onPress={() => setOnHypertensionMeds(!onHypertensionMeds)} />
      </View>

      {/* Add padding between buttons */}
      <Button title="Calculate Risk" onPress={calculateRisk} />

      {riskResult && (
        <Text style={styles.result}>
          Your estimated 10-year risk of ASCVD is {riskResult}
        </Text>
      )}

      <View style={{ marginTop: 10 }}> {/* Padding between buttons */}
        <Button title="Go to Chat Page" onPress={togglePage} />
      </View>
    </View>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: 'green',
  },
});
