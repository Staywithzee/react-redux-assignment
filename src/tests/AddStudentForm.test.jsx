// src/tests/AddStudentForm.test.jsx
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, test, expect } from 'vitest';
import { server } from './server';
import { renderWithProviders } from './utils';
import AddStudentForm from '../components/AddStudentForm';
import StudentTable from '../components/StudentTable';

const BASE = 'http://localhost/api/v1/';

describe('AddStudentForm', () => {
  test('submits new student and displays in list', async () => {
    const user = userEvent.setup();

    // Mutable list so the re-fetch after invalidation returns Charlie
    const students = [
      { id: '1', name: 'Alice', studentId: 'ST001', major: 'Computer Science', gpa: 3.8 },
    ];

    server.use(
      http.get(`${BASE}students`, () => HttpResponse.json(students)),

      http.post(`${BASE}students`, async ({ request }) => {
        const body = await request.json();
        const newStudent = { ...body, id: '3' };
        students.push(newStudent);
        return HttpResponse.json(newStudent, { status: 201 });
      })
    );

    renderWithProviders(
      <>
        <AddStudentForm />
        <StudentTable />
      </>
    );

    // Wait for initial data to load
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

    // Fill in the form
    await user.type(screen.getByPlaceholderText('Full Name *'), 'Charlie');
    await user.type(screen.getByPlaceholderText('Student ID *'), 'ST003');
    await user.type(screen.getByPlaceholderText('Major'), 'Testing');
    await user.type(screen.getByPlaceholderText('GPA (0.0–4.0)'), '3.5');

    // Submit
    await user.click(screen.getByRole('button', { name: /\+ Add Student/i }));

    // Charlie should appear in the table after cache invalidation + re-fetch
    await waitFor(() => {
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });
  });
});
