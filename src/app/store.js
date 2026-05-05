import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from '../features/students/studentsSlice';
import coursesReducer from '../features/courses/coursesSlice';
import gradesReducer from '../features/grades/gradesSlice';

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    courses: coursesReducer,
    grades: gradesReducer,
  },
});

export default store;
