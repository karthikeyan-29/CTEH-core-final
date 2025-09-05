import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import React, { useState } from 'react'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.log('error occured')
        // console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      setError(err.errors[0].longMessage)
      // console.log(error)
      // console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, emailAddress, password])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.logoText}>Welcome Back </Text>

        <View style={styles.inputCard}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            onChangeText={(text) => setEmailAddress(text)}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Enter password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity onPress={onSignInPress} style={styles.button}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.alter}>
          <Text style={styles.normalText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/SignUpScreen')}>
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    fontFamily: 'outfit',
    color: '#262626',
  },
  inputCard: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'outfit',
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 15,
    fontFamily: 'outfit',
    backgroundColor: '#f8f8f8',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'outfit',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 10,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'outfit',
  },
  alter: {
    flexDirection: 'row',
    marginTop: 20,
  },
  normalText: {
    fontFamily: 'outfit',
    fontSize: 14,
    color: '#333',
  },
  signUpText: {
    fontFamily: 'outfit',
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 5,
  },
})
