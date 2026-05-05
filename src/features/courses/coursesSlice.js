import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  { id: 'CS101', name: 'Introduction to Computer Science', credits: 3 },
  { id: 'IT201', name: 'Database Management Systems', credits: 3 },
  { id: 'BIT301', name: 'Business Intelligence', credits: 3 },
  { id: 'CS401', name: 'Artificial Intelligence', credits: 3 },
];

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    addCourse: (state, action) => {
      state.push(action.payload);
    },
    deleteCourse: (state, action) => {
      return state.filter(course => course.id !== action.payload);
    },
  },
});

export const { addCourse, deleteCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
