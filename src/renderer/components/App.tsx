import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Mining } from "./Mining";
import { getAuth, EmailAuthProvider } from "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

export const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(
    () =>
      getAuth().onAuthStateChanged((user) => {
        setIsSignedIn(!!user);
      }),
    []
  );

  if (!isSignedIn) {
    return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth()} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Mining />
    </QueryClientProvider>
  );
};
