// src/tests/handlers/students.js
import { http, HttpResponse } from 'msw';

const BASE = 'http://localhost/api/v1/';

export const mockStudents = [
  { id: '1', name: 'Alice',  studentId: 'ST001', major: 'Computer Science',       gpa: 3.8 },
  { id: '2', name: 'Bob',    studentId: 'ST002', major: 'Information Technology', gpa: 3.2 },
];

export const handlers = [
  http.get(`${BASE}students`, () =>
    HttpResponse.json(mockStudents)
  ),

  http.post(`${BASE}students`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...body, id: String(Date.now()) }, { status: 201 });
  }),

  http.put(`${BASE}students/:id`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...body, id: params.id });
  }),

  http.delete(`${BASE}students/:id`, ({ params }) =>
    HttpResponse.json({ id: params.id })
  ),
];
