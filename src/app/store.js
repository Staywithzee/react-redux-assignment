import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { studentsApi } from '../features/students/studentsApi';
import coursesReducer from '../features/courses/coursesSlice';
import gradesReducer from '../features/grades/gradesSlice';
import loggerMiddleware from './middleware/logger';

export const store = configureStore({
  reducer: {
    [studentsApi.reducerPath]: studentsApi.reducer,
    courses: coursesReducer,
    grades: gradesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(studentsApi.middleware)
      .concat(loggerMiddleware),
});

// Required for refetchOnFocus / refetchOnReconnect
setupListeners(store.dispatch);

export default store;
