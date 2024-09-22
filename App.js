import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker, Alert } from 'react-native';

export default function App() {
  // State to store user inputs
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

  // Helper function to calculate natural logarithm
  const ln = (i) => Math.log(i);

  // Helper function to square a value
  const sq = (i) => i * i;

  // Main function to calculate the risk
  const calculateRisk = () => {
    let C_Age, C_Sq_Age, C_Total_Chol, C_Age_Total_Chol, C_HDL_Chol, C_Age_HDL_Chol;
    let C_On_Hypertension_Meds, C_Age_On_Hypertension_Meds, C_Off_Hypertension_Meds, C_Age_Off_Hypertension_Meds;
    let C_Smoker, C_Age_Smoker, C_Diabetes, S10, Mean_Terms;
  
    // Select coefficients based on race and gender
    if (sex === 'female') {
      if (race === 'white') {
        // Coefficients for white females (unchanged)
        C_Age = -29.799;
        C_Sq_Age = 4.884;
        C_Total_Chol = 13.540;
        C_Age_Total_Chol = -3.114;
        C_HDL_Chol = -13.578;
        C_Age_HDL_Chol = 3.149;
        C_On_Hypertension_Meds = 2.019;
        C_Off_Hypertension_Meds = 1.957;
        C_Smoker = 7.574;
        C_Age_Smoker = -1.665;
        C_Diabetes = 0.661;
        S10 = 0.9665;
        Mean_Terms = -29.18;
      } else if (race === 'african_american') { 
        // Updated coefficients for African-American females
        C_Age = 17.114;
        C_Sq_Age = 0;  // No squared term for African-American females
        C_Total_Chol = 0.940;
        C_Age_Total_Chol = 0;
        C_HDL_Chol = -18.920;
        C_Age_HDL_Chol = 4.475;
        C_On_Hypertension_Meds = 29.291;
        C_Age_On_Hypertension_Meds = -6.432;
        C_Off_Hypertension_Meds = 27.820;
        C_Age_Off_Hypertension_Meds = -6.087;
        C_Smoker = 0.691;
        C_Age_Smoker = 0;
        C_Diabetes = 0.874;
        S10 = 0.9533;
        Mean_Terms = 86.61;
      }      
    } else { 
      // Coefficients for males (white or African-American)
      if (race === 'white') { 
        C_Age = 12.344;
        C_Sq_Age = 0;
        C_Total_Chol = 11.853;
        C_Age_Total_Chol = -2.664;
        C_HDL_Chol = -7.990;
        C_Age_HDL_Chol = 1.769;
        C_On_Hypertension_Meds = 1.797;
        C_Off_Hypertension_Meds = 1.764;
        C_Smoker = 7.837;
        C_Age_Smoker = -1.795;
        C_Diabetes = 0.658;
        S10 = 0.9144;
        Mean_Terms = 61.18;
      } else if (race === 'african_american') { 
        C_Age = 2.469;
        C_Sq_Age = 0;
        C_Total_Chol = 0.302;
        C_Age_Total_Chol = 0;
        C_HDL_Chol = -0.307;
        C_Age_HDL_Chol = 0;
        C_On_Hypertension_Meds = 1.916;
        C_Off_Hypertension_Meds = 1.809;
        C_Smoker = 0.549;
        C_Age_Smoker = 0;
        C_Diabetes = 0.645;
        S10 = 0.8954;
        Mean_Terms = 19.54;
      }
    }
  
    // Validate inputs
    if (!age || !totalCholesterol || !hdlCholesterol || !systolicBP) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }
  
    // Convert inputs to numbers
    const numAge = parseFloat(age);
    const numTotalChol = parseFloat(totalCholesterol);
    const numHdlChol = parseFloat(hdlCholesterol);
    const numSystolicBP = parseFloat(systolicBP);
  
    // Avoid invalid inputs (0 or negative values) for logarithmic calculations
    if (numAge <= 0 || numTotalChol <= 0 || numHdlChol <= 0 || numSystolicBP <= 0) {
      Alert.alert("Error", "Inputs must be greater than zero");
      return;
    }

    // Debug logs to check the values going into the calculations
    console.log('Age:', numAge);
    console.log('Total Cholesterol:', numTotalChol);
    console.log('HDL:', numHdlChol);
    console.log('Systolic BP:', numSystolicBP);
  
    // Perform the calculation
    let Terms = 
      C_Age * ln(numAge) +
      C_Sq_Age * sq(ln(numAge)) +
      C_Total_Chol * ln(numTotalChol) +
      C_Age_Total_Chol * ln(numAge) * ln(numTotalChol) +
      C_HDL_Chol * ln(numHdlChol) +
      C_Age_HDL_Chol * ln(numAge) * ln(numHdlChol);

    // Add blood pressure terms
    if (onHypertensionMeds) {
      Terms += C_On_Hypertension_Meds * ln(numSystolicBP);
      if (C_Age_On_Hypertension_Meds) {
        Terms += C_Age_On_Hypertension_Meds * ln(numAge) * ln(numSystolicBP);
      }
    } else {
      Terms += C_Off_Hypertension_Meds * ln(numSystolicBP);
      if (C_Age_Off_Hypertension_Meds) {
        Terms += C_Age_Off_Hypertension_Meds * ln(numAge) * ln(numSystolicBP);
      }
    }

    // Add smoker terms
    if (smoker) {
      Terms += C_Smoker;
      if (C_Age_Smoker) {
        Terms += C_Age_Smoker * ln(numAge);
      }
    }

    // Add diabetes term
    Terms += C_Diabetes * (diabetes ? 1 : 0);
    
    console.log('Terms:', Terms);  // Debug log for Terms calculation
  
    const risk = 100 * (1 - Math.pow(S10, Math.exp(Terms - Mean_Terms)));
  
    console.log('Risk:', risk);  // Debug log for risk calculation
  
    if (isNaN(risk) || risk < 0 || risk > 100) {
      setRiskResult("Error: Invalid calculation result");
    } else {
      setRiskResult(risk.toFixed(2) + "%");
    }
  };


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

      {/* Race and Sex Picker */}
      <Picker selectedValue={sex} onValueChange={setSex} style={styles.picker}>
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Male" value="male" />
      </Picker>

      <Picker selectedValue={race} onValueChange={setRace} style={styles.picker}>
        <Picker.Item label="White" value="white" />
        <Picker.Item label="African American" value="african_american" />
      </Picker>

      {/* Toggle for smoker, diabetes, and hypertension meds */}
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

      {/* Calculate Button */}
      <Button title="Calculate Risk" onPress={calculateRisk} />

      {/* Display result */}
      {riskResult && (
        <Text style={styles.result}>
          Your estimated 10-year risk of ASCVD is {riskResult}
        </Text>
      )}
    </View>
  );
}

// Styles for the app
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