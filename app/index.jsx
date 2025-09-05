import { SignedIn, SignedOut } from '@clerk/clerk-expo';


import Home from '../app/(tabs)/home';
import { Redirect } from 'expo-router';

export default function Page() {
  return (
    <>
      <SignedIn>
        <Redirect href={'/home'}/>
      </SignedIn>
      <SignedOut>
       <Redirect href={'/auth/LoginScreen'}/>
      </SignedOut>
    </>
  );
}
