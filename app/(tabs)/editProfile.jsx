import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
//import { Colors, DarkColors, Colors } from "../constants/theme";
import useThemeColors from '../hooks/useThemeColors';
const Colors = useThemeColors();


export default function EditProfile() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dobYear, setDobYear] = useState('');
const [dobMonth, setDobMonth] = useState('');
const [dobDay, setDobDay] = useState('');
  const [gender, setGender] = useState('male');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [contact, setContact] = useState('');

  const handleSave = () => {
    // TODO: Send updated data to backend
    const fullDob = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;
    console.log({
      firstName, middleName, lastName, dob, gender,
      district, city, street, contact
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>

      <Text style={styles.label}>Name</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Middle Name"
          value={middleName}
          onChangeText={setMiddleName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
      
      <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.row}>
        <TextInput
            style={styles.input}
            placeholder="YYYY"
            value={dobYear}
            onChangeText={setDobYear}
            keyboardType="numeric"
            maxLength={4}
        />
        <TextInput
            style={styles.input}
            placeholder="MM"
            value={dobMonth}
            onChangeText={setDobMonth}
            keyboardType="numeric"
            maxLength={2}
        />
        <TextInput
            style={styles.input}
            placeholder="DD"
            value={dobDay}
            onChangeText={setDobDay}
            keyboardType="numeric"
            maxLength={2}
        />
</View>


      <Text style={styles.label}>Gender</Text>
      <View style={styles.radioGroup}>
        <RadioButton.Item label="Male" color={Colors.primary} value="male" status={gender === 'male' ? 'checked' : 'unchecked'} onPress={() => setGender('male')} />
        <RadioButton.Item label="Female" color={Colors.primary} value="female" status={gender === 'female' ? 'checked' : 'unchecked'} onPress={() => setGender('female')} />
        <RadioButton.Item label="Other" color={Colors.primary} value="other" status={gender === 'other' ? 'checked' : 'unchecked'} onPress={() => setGender('other')} />
      </View>

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="District"
        value={district}
        onChangeText={setDistrict}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Street Address"
        value={street}
        onChangeText={setStreet}
      />

      <Text style={styles.label}>Contact No</Text>
      <TextInput
        style={styles.input}
        placeholder="98XXXXXXXX"
        value={contact}
        onChangeText={setContact}
        keyboardType="phone-pad"
        underlineColorAndroid="transparent"  // ✅ This removes Android underline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.white,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.black,
  },
  label: {
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: Colors.black,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    flex: 1,
    minWidth: '30%',
    color: Colors.black,
    
  },
  radioGroup: {
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  saveText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
