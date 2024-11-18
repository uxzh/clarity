import { createContext, useContext } from "react";
import useAuth from "../hooks/useAuth";

export const AuthContext = createContext({});

const Provider = AuthContext.Provider;

export const AuthProvider = ({children}) => {
  const auth = useAuth()
  const { isLoading } = auth;

  return (
    <Provider value={{...auth}}>
      {!isLoading && children}
    </Provider>
  )
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const isUserSignedIn = () => {
  const { user } = useAuthContext();
  return user?.isLoggedIn;
};
