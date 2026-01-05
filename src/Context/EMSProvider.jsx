import { createContext, useState } from "react";

export const EMSContext = createContext(null);

export const EMSProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };


  const sharedData={
    login,logout,user
  }
  return (
    <EMSContext.Provider value={sharedData}>
      {children}
    </EMSContext.Provider>
  );
};


