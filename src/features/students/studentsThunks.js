// src/features/students/studentsThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// REPLACE THIS WITH YOUR PERSONAL MOCKAPI.IO ENDPOINT URL IF DESIRED
const API_URL = 'https://67bc82c1ed4861eef79bf773.mockapi.io/api/v1/students';

// Check if the URL is the default placeholder
export const IS_PLACEHOLDER = API_URL.includes('67bc82c1ed4861eef79bf773');

// Original mockup list from Session 3 to use as a fallback
const initialStudents = [
  { id: '1', name: 'Somchai Rakpong', studentId: '6501001', major: 'Computer Science', gpa: 3.85 },
  { id: '2', name: 'Naree Thongdee', studentId: '6501002', major: 'Information Technology', gpa: 3.60 },
  { id: '3', name: 'Krit Suwan', studentId: '6501003', major: 'Computer Science', gpa: 2.95 },
  { id: '4', name: 'Malee Jaikaew', studentId: '6501004', major: 'Business IT', gpa: 3.40 },
  { id: '5', name: 'Pong Srisuk', studentId: '6501005', major: 'Information Technology', gpa: 3.75 },
];

// Helper functions for LocalStorage management
const getLocalStudents = () => {
  const local = localStorage.getItem('acadestate_students');
  if (!local) {
    localStorage.setItem('acadestate_students', JSON.stringify(initialStudents));
    return initialStudents;
  }
  return JSON.parse(local);
};

const saveLocalStudents = (students) => {
  localStorage.setItem('acadestate_students', JSON.stringify(students));
};

// 1. Fetch Students (GET /students)
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async () => {
    try {
      if (IS_PLACEHOLDER) {
        // Fall back directly if using the placeholder URL
        return getLocalStudents();
      }
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.warn('API failed, falling back to LocalStorage:', error.message);
      // Fallback on error (e.g., 404 or network issue)
      return getLocalStudents();
    }
  }
);

// 2. Add Student (POST /students)
export const addStudentAsync = createAsyncThunk(
  'students/addStudentAsync',
  async (studentData) => {
    try {
      if (IS_PLACEHOLDER) {
        const local = getLocalStudents();
        const newStudent = { ...studentData, id: String(Date.now()) };
        local.push(newStudent);
        saveLocalStudents(local);
        return newStudent;
      }
      const response = await axios.post(API_URL, studentData);
      return response.data;
    } catch (error) {
      console.warn('API failed, falling back to LocalStorage for adding:', error.message);
      const local = getLocalStudents();
      const newStudent = { ...studentData, id: String(Date.now()) };
      local.push(newStudent);
      saveLocalStudents(local);
      return newStudent;
    }
  }
);

// 3. Update Student (PUT /students/:id)
export const updateStudentAsync = createAsyncThunk(
  'students/updateStudentAsync',
  async (studentData) => {
    try {
      if (IS_PLACEHOLDER) {
        const local = getLocalStudents();
        const index = local.findIndex((s) => String(s.id) === String(studentData.id));
        if (index !== -1) {
          local[index] = studentData;
          saveLocalStudents(local);
        }
        return studentData;
      }
      const { id, ...dataToUpdate } = studentData;
      const response = await axios.put(`${API_URL}/${id}`, dataToUpdate);
      return response.data;
    } catch (error) {
      console.warn('API failed, falling back to LocalStorage for update:', error.message);
      const local = getLocalStudents();
      const index = local.findIndex((s) => String(s.id) === String(studentData.id));
      if (index !== -1) {
        local[index] = studentData;
        saveLocalStudents(local);
      }
      return studentData;
    }
  }
);

// 4. Delete Student (DELETE /students/:id)
export const deleteStudentAsync = createAsyncThunk(
  'students/deleteStudentAsync',
  async (id) => {
    try {
      if (IS_PLACEHOLDER) {
        const local = getLocalStudents();
        const filtered = local.filter((s) => String(s.id) !== String(id));
        saveLocalStudents(filtered);
        return id;
      }
      await axios.delete(`${API_URL}/${id}`);
      return id; // Return the ID so the reducer can remove it from local state
    } catch (error) {
      console.warn('API failed, falling back to LocalStorage for delete:', error.message);
      const local = getLocalStudents();
      const filtered = local.filter((s) => String(s.id) !== String(id));
      saveLocalStudents(filtered);
      return id;
    }
  }
);
