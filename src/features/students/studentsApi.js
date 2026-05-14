// src/features/students/studentsApi.js — Session 6/7/8
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// VITE_API_URL set in .env.test (tests) and .env.production (prod)
// Falls back to placeholder MockAPI URL in local dev
const BASE = import.meta.env.VITE_API_URL ?? 'https://67bc82c1ed4861eef79bf773.mockapi.io/api/v1/';

// true  → use localStorage fallback on HTTP errors (local dev, no real API)
// false → propagate HTTP errors as RTK Query errors  (tests + production)
export const IS_PLACEHOLDER = !import.meta.env.VITE_API_URL;

// ── localStorage fallback ──────────────────────────────────────────────────
const STORAGE_KEY = 'acadestate_students';

const initialStudents = [
  { id: '1', name: 'Somchai Rakpong',  studentId: '6501001', major: 'Computer Science',       gpa: 3.85 },
  { id: '2', name: 'Naree Thongdee',   studentId: '6501002', major: 'Information Technology', gpa: 3.60 },
  { id: '3', name: 'Krit Suwan',       studentId: '6501003', major: 'Computer Science',       gpa: 2.95 },
  { id: '4', name: 'Malee Jaikaew',    studentId: '6501004', major: 'Business IT',            gpa: 3.40 },
  { id: '5', name: 'Pong Srisuk',      studentId: '6501005', major: 'Information Technology', gpa: 3.75 },
];

function getLocal() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStudents));
    return initialStudents;
  }
  return JSON.parse(raw);
}

function saveLocal(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// Helper: return RTK Query error or localStorage fallback based on IS_PLACEHOLDER
function httpError(status, statusText) {
  if (IS_PLACEHOLDER) return { data: getLocal() };
  return { error: { status, data: statusText } };
}

// ── RTK Query API ──────────────────────────────────────────────────────────
export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE }),
  tagTypes: ['Student'],
  endpoints: builder => ({
    getStudents: builder.query({
      queryFn: async () => {
        try {
          const res = await fetch(`${BASE}students`);
          if (!res.ok) return httpError(res.status, res.statusText);
          return { data: await res.json() };
        } catch {
          return { data: getLocal() };
        }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Student', id })), { type: 'Student', id: 'LIST' }]
          : [{ type: 'Student', id: 'LIST' }],
    }),

    getStudentById: builder.query({
      queryFn: async (id) => {
        try {
          const res = await fetch(`${BASE}students/${id}`);
          if (!res.ok) return httpError(res.status, res.statusText);
          return { data: await res.json() };
        } catch {
          const student = getLocal().find(s => String(s.id) === String(id));
          return student ? { data: student } : { error: { status: 404, data: 'Not found' } };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),

    addStudent: builder.mutation({
      queryFn: async (student) => {
        try {
          const res = await fetch(`${BASE}students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student),
          });
          if (!res.ok) return httpError(res.status, res.statusText);
          return { data: await res.json() };
        } catch {
          const list = getLocal();
          const newStudent = { ...student, id: String(Date.now()) };
          saveLocal([...list, newStudent]);
          return { data: newStudent };
        }
      },
      invalidatesTags: [{ type: 'Student', id: 'LIST' }],
    }),

    updateStudent: builder.mutation({
      queryFn: async (student) => {
        try {
          const res = await fetch(`${BASE}students/${student.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student),
          });
          if (!res.ok) return httpError(res.status, res.statusText);
          return { data: await res.json() };
        } catch {
          const list = getLocal();
          const idx = list.findIndex(s => String(s.id) === String(student.id));
          if (idx !== -1) { list[idx] = student; saveLocal(list); }
          return { data: student };
        }
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchList = dispatch(
          studentsApi.util.updateQueryData('getStudents', undefined, draft => {
            const item = draft.find(s => s.id === id);
            if (item) Object.assign(item, patch);
          })
        );
        const patchDetail = dispatch(
          studentsApi.util.updateQueryData('getStudentById', id, draft => {
            Object.assign(draft, patch);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchList.undo();
          patchDetail.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }],
    }),

    deleteStudent: builder.mutation({
      queryFn: async (id) => {
        try {
          const res = await fetch(`${BASE}students/${id}`, { method: 'DELETE' });
          if (!res.ok) return httpError(res.status, res.statusText);
          return { data: id };
        } catch {
          saveLocal(getLocal().filter(s => String(s.id) !== String(id)));
          return { data: id };
        }
      },
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
