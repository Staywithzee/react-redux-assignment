// src/features/students/studentsSlice.js — Session 5
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import {
  fetchStudents,
  addStudentAsync,
  updateStudentAsync,
  deleteStudentAsync,
} from './studentsThunks';

const studentsAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = studentsAdapter.getInitialState({ status: 'idle', error: null });

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStudents.pending, st => { st.status = 'loading'; })
      .addCase(fetchStudents.fulfilled, (st, { payload }) => {
        st.status = 'succeeded';
        studentsAdapter.setAll(st, payload);
      })
      .addCase(fetchStudents.rejected, (st, { payload }) => { st.status = 'failed'; st.error = payload; })
      .addCase(addStudentAsync.fulfilled, (s, { payload }) => studentsAdapter.addOne(s, payload))
      .addCase(updateStudentAsync.fulfilled, (s, { payload }) => studentsAdapter.upsertOne(s, payload))
      .addCase(deleteStudentAsync.fulfilled, (s, { payload }) => studentsAdapter.removeOne(s, payload));
  },
});

export const {
  selectAll: selectAllStudents,
  selectById: selectStudentById,
  selectTotal: selectStudentCount,
} = studentsAdapter.getSelectors(s => s.students);

export default studentsSlice.reducer;
