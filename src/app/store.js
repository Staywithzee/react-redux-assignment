import { configureStore } from '@reduxjs/toolkit';
import { studentsApi } from '../features/students/studentsApi';
import coursesReducer from '../features/courses/coursesSlice';
import gradesReducer from '../features/grades/gradesSlice';

export const store = configureStore({
  reducer: {
    [studentsApi.reducerPath]: studentsApi.reducer,
    courses: coursesReducer,
    grades: gradesReducer,
  },
  middleware: g => g().concat(studentsApi.middleware),
});

export default store;
