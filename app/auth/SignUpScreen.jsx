import * as React from 'react'
import { Text, TextInput, Button, View, StyleSheet,TouchableOpacity } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const[error,setError]=React.useState('');
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setError(err.errors[0].longMessage);

      // console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <>
        <View style={styles.card}>
      
        <Text style={styles.heading}>Verify your email !</Text>
        <Text>Check your  mail account and enter the 6 digit otp</Text>
        <TextInput
        style={styles.input}
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress} style={styles.vBtn}>
                <Text style={styles.buttonFont}>Verify </Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }

  return (
    <View>
      <>
        <Text style={styles.signUp}>Sign up</Text>
        <View style={styles.inputCard}>
        <Text style={styles.text}>Email</Text>
        <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(email) => setEmailAddress(email)}
      />
       {error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.text}>Password</Text>
      <TextInput
       style={styles.input}
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
        </View>
        <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
                <Text style={styles.buttonFont}>Sign Up </Text>
          </TouchableOpacity>
      </>
    </View>
  )
}
const styles=StyleSheet.create({
  signUp:{
    fontSize:40,
     marginTop:150,
     marginLeft:30
  },
  inputCard:{
    padding:30,
    display:'flex',
    flexDirection:'column',
    gap:10,
  },
  text:{
    fontSize:14,
     fontWeight:'bold'
  },
  error:{
    color: 'red'
  },
  input:{
    borderWidth:1,
    borderColor:'black',
    height:40,
    borderRadius:5,
    width:300,
    padding:10

  },
  vBtn:{
    backgroundColor:'black',
    color:'white',
    height:40,
    width:120,
    borderRadius:20,
    alignItems:'center',
    justifyContent:'center',

  },
  button:{
    backgroundColor:'black',
    color:'white',
    height:40,
    width:200,
    borderRadius:20,
     alignItems:'center',
     justifyContent:'center',
     marginLeft:80,
     marginTop:40


  },
 
  buttonFont:{
     fontSize:20,
     color:'white'

  },
  card:{
   
    display:'flex',
    flexDirection:'column',
    gap:20,
    alignItems:'flex-start',
    marginTop:250,
    marginLeft:20
  },
  heading:{
    fontSize:30
  },
  verify:{

  },
  
  
  
})