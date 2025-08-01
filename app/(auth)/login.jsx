import { router } from 'expo-router';
import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-expo';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {

    console.log("login pressed");

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password
      });

      if (signInAttempt.status === "complete") {
        console.log("sigin in successful");
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    }
    catch (err) {
      console.error(JSON.stringify(err, null, 2))
      if (err.errors[0].code === 'form_password_incorrect' || err.errors[0].code === 'form_identifier_not_found') {
        setError(true);
        setErrorMsg('Your credentials do not match!!');
      }

      console.log(err.errors[0].code);
    }
  };

  if (!isLoaded) return <Text>Loading.....</Text>;

  return (
    <View style={styles.container}>

      {/* Heading */}
      <Text style={styles.title}>Hey,{"\n"}Welcome Back</Text>

      {/* Subtitle */}
      {/* <Text style={styles.subtitle}>Please login to continue</Text> */}

      {/* Email Input */}
      <View style={styles.inputContainer}>
        {/* <Ionicons name="mail-outline" size={20} color="#008000" style={styles.icon} /> */}
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {/* { {if(emailError){
          return <Text>Email Not Found</Text>
        }
        }} */}
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        {/* <Ionicons name="lock-closed-outline" size={20} color="#008000" style={styles.icon} /> */}
        <TextInput
          placeholder="Enter your password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => { }} style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <Text style={styles.signupText}>
        Don’t have an account?{' '}
        <Text style={styles.signupLink} onPress={() => router.push('/signup')}>
          Sign up
        </Text>
      </Text>
    </View>
  );
};

// export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  bold: {
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 10,
  },
  forgotText: {
    color: 'gray',
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: '#008000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray',
  },
  signupLink: {
    color: '#008000',
    fontWeight: '500',
  },
});
