// app/_layout.jsx
import { Text, Appearance, useColorScheme, View } from "react-native";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import SignUpScreen from "./auth/SignUpScreen";
import LoginScreen from "./auth/LoginScreen";
import { tokenCache } from "@/cache";
import React, { createContext, useContext, useState, useEffect } from "react";

// Create Theme Context with default value
const ThemeContext = createContext({
  theme: {
    background: '#ffffff',
    otherText:'white',
    text: '#000000',
    primary: '#007AFF',
    secondary: '#5856D6',
    container: '#f5f5f5',
  },
  toggleTheme: () => {},
  currentTheme: 'light'
});

const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme || 'light');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme || 'light');
    });
    return () => subscription.remove();
  }, []);

  const themes = {
    light: {
      background: '#ffffff',
      otherText:'white',
      text: '#000000',
      primary: '#007AFF',
      secondary: '#000000',
      container: '#f5f5f5',
    },
    dark: {
      background: '#000000',
      otherText:'white',
      text: '#ffffff',
      primary: '#0A84FF',
      secondary: '#5E5CE6',
      container: '#1c1c1e',
    },
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme: themes[theme],
    toggleTheme,
    currentTheme: theme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default function RootLayout() {
  // Call all Hooks at the top level
  const [fontsLoaded] = useFonts({
    'outfit': require('../assets/fonts/Outfit-Regular.ttf'),
  });
  const { theme } = useTheme(); // Get theme here at top level

  if (!fontsLoaded) {
    return (
      <View style={{ backgroundColor: theme.background }}>
        <Text style={{ color: theme.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    
    <ClerkProvider 
      tokenCache={tokenCache} 
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ThemeProvider>
      
        <View style={{ flex: 1, backgroundColor: theme.background }}>
          {/* <SignedIn>
            <Stack 
              screenOptions={{ 
                headerShown: false,
                contentStyle: { backgroundColor: theme.background } // Use theme directly
              }}
            >
              <Stack.Screen 
                name="(tabs)" 
                options={{ headerShown: false }} 
              />
              <Stack.Screen 
                name="Pages" 
                options={{ headerShown: false }} 
              />
            </Stack>
            
            
            
          </SignedIn>
          
          <SignedOut>
            <LoginScreen />
            
          </SignedOut> */}
          <Stack
       screenOptions={{
    headerShown: false,
    contentStyle: { backgroundColor: theme.background },
  }}
>
  <Stack.Screen name="(tabs)" />
  <Stack.Screen name="Pages" />
</Stack>
          
        </View>
        </ThemeProvider>
    </ClerkProvider>
    
  );
}