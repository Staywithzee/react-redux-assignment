import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const gradesSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {
    addGrade: (state, action) => {
      state.push(action.payload);
    },
    updateGrade: (state, action) => {
      const index = state.findIndex(grade => grade.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    deleteGrade: (state, action) => {
      return state.filter(grade => grade.id !== action.payload);
    },
  },
});

export const { addGrade, updateGrade, deleteGrade } = gradesSlice.actions;
export default gradesSlice.reducer;
