import type { AuthContextType } from "../libs/HookTypes";
import { createContext, useContext } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default useAuth;
