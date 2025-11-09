import { configureStore } from "@reduxjs/toolkit";
import isDarkReducer from './slice1';
const store = configureStore({
    reducer: {
        isDark: isDarkReducer,
    },
});
export default store;