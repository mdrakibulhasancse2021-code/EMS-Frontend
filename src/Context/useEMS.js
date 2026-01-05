import { useContext } from "react";
import { EMSContext } from "./EMSProvider";

// custom hook (optional)
export const useAuth = () => {
  return useContext(EMSContext);
};