import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 1, name: 'Somchai Rakpong', studentId: '6501001', major: 'Computer Science', gpa: 3.85 },
    { id: 2, name: 'Naree Thongdee', studentId: '6501002', major: 'Information Technology', gpa: 3.60 },
    { id: 3, name: 'Krit Suwan', studentId: '6501003', major: 'Computer Science', gpa: 2.95 },
    { id: 4, name: 'Malee Jaikaew', studentId: '6501004', major: 'Business IT', gpa: 3.40 },
    { id: 5, name: 'Pong Srisuk', studentId: '6501005', major: 'Information Technology', gpa: 3.75 },
  ]
};

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    addStudent: (state, action) => {
      state.list.push(action.payload);
    },
    deleteStudent: (state, action) => {
      state.list = state.list.filter(student => student.id !== action.payload);
    },
    updateStudent: (state, action) => {
      const index = state.list.findIndex(student => student.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload };
      }
    },
  },
});

export const { addStudent, deleteStudent, updateStudent } = studentsSlice.actions;
export default studentsSlice.reducer;
