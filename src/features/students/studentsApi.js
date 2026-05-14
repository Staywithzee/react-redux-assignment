// src/features/students/studentsApi.js — Session 6
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE = 'https://67bc82c1ed4861eef79bf773.mockapi.io/api/v1/';

// RTK Query always uses the real API — no localStorage fallback
export const IS_PLACEHOLDER = false;

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE }),
  tagTypes: ['Student'],
  endpoints: builder => ({
    // ── QUERIES (reads, results are cached) ───────────────
    getStudents: builder.query({
      query: () => 'students',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Student', id })), { type: 'Student', id: 'LIST' }]
          : [{ type: 'Student', id: 'LIST' }],
    }),
    getStudentById: builder.query({
      query: (id) => `students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),
    // ── MUTATIONS (writes) ────────────────────────────────
    addStudent: builder.mutation({
      query: (student) => ({ url: 'students', method: 'POST', body: student }),
      invalidatesTags: [{ type: 'Student', id: 'LIST' }],
    }),
    updateStudent: builder.mutation({
      query: (student) => ({ url: `students/${student.id}`, method: 'PUT', body: student }),
      invalidatesTags: (result, error, student) => [
        { type: 'Student', id: student.id },
        { type: 'Student', id: 'LIST' },
      ],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({ url: `students/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Student', id },
        { type: 'Student', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
