// src/features/students/studentsSlice.js — Session 4 update
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchStudents,
  addStudentAsync,
  updateStudentAsync,
  deleteStudentAsync,
} from './studentsThunks';

const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    list: [],
    status: 'idle', // NEW: tracks async state ('idle' | 'loading' | 'succeeded' | 'failed')
    error: null,    // NEW: holds error message if failed
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStudents.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.list = payload;
      })
      .addCase(fetchStudents.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      })
      .addCase(addStudentAsync.fulfilled, (state, { payload }) => {
        state.list.push(payload);
      })
      .addCase(updateStudentAsync.fulfilled, (state, { payload }) => {
        const i = state.list.findIndex(s => s.id === payload.id);
        if (i !== -1) {
          state.list[i] = payload;
        }
      })
      .addCase(deleteStudentAsync.fulfilled, (state, { payload }) => {
        state.list = state.list.filter(s => s.id !== payload);
      });
  },
});

export default studentsSlice.reducer;
