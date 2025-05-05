import { configureStore } from "@reduxjs/toolkit";
// import { counterReducer } from "./features/CounterSlice/CounterSlice";
import counterReducer from './features/CounterSlice/CounterSlice';
// import counterReducer from '../redux/features/CounterSlice'
export const store = configureStore({
  reducer: {
    counter: counterReducer
  },
});
