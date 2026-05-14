// src/tests/StudentTable.test.jsx
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import { describe, test, expect } from 'vitest';
import { server } from './server';
import { renderWithProviders } from './utils';
import StudentTable from '../components/StudentTable';

const BASE = 'http://localhost/api/v1/';
const alice = { id: '1', name: 'Alice', studentId: 'ST001', major: 'CS', gpa: 3.8 };

describe('StudentTable', () => {
  // ── Test 1: Loading State ──────────────────────────────────────────────
  test('shows loading state while fetching', () => {
    // Handler never resolves → keeps isLoading = true
    server.use(
      http.get(`${BASE}students`, async () => {
        await delay('infinite');
      })
    );

    renderWithProviders(<StudentTable />);

    expect(
      screen.getByText('กำลังโหลดรายชื่อนักศึกษาจากฐานข้อมูล...')
    ).toBeInTheDocument();
  });

  // ── Test 2: Render Student Data ────────────────────────────────────────
  test('renders student data after successful fetch', async () => {
    renderWithProviders(<StudentTable />);

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  // ── Test 3: API Error 403 ──────────────────────────────────────────────
  test('displays error message on 403 response', async () => {
    server.use(
      http.get(`${BASE}students`, () =>
        new HttpResponse(null, { status: 403, statusText: 'Forbidden' })
      )
    );

    renderWithProviders(<StudentTable />);

    await waitFor(() => {
      expect(screen.getByText(/การเชื่อมต่อล้มเหลว/)).toBeInTheDocument();
    });

    expect(screen.getByText(/ลองเชื่อมต่อใหม่อีกครั้ง/)).toBeInTheDocument();
  });
});

// ── Optimistic Updates ─────────────────────────────────────────────────────
describe('optimistic updates (updateStudent)', () => {
  async function openEditModal(user) {
    await waitFor(() => screen.getByText('Alice'));
    await user.click(screen.getByRole('button', { name: /Edit/i }));
    const nameInput = screen.getByDisplayValue('Alice');
    await user.clear(nameInput);
    await user.type(nameInput, 'Alice Updated');
  }

  test('shows new name immediately before server responds', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${BASE}students`, () => HttpResponse.json([alice])),
      // PUT never resolves → keeps mutation pending → optimistic patch stays
      http.put(`${BASE}students/:id`, async () => { await delay('infinite'); })
    );

    renderWithProviders(<StudentTable />);
    await openEditModal(user);
    await user.click(screen.getByRole('button', { name: /Save Changes/i }));

    // Table already shows the new name before server replies
    await waitFor(() =>
      expect(screen.getByText('Alice Updated')).toBeInTheDocument()
    );
  });

  test('rolls back to original name on server error', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${BASE}students`, () => HttpResponse.json([alice])),
      http.put(`${BASE}students/:id`, () =>
        new HttpResponse(null, { status: 500 })
      )
    );

    renderWithProviders(<StudentTable />);
    await openEditModal(user);
    await user.click(screen.getByRole('button', { name: /Save Changes/i }));

    // After server rejects: cache rolled back → original name restored
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.queryByText('Alice Updated')).not.toBeInTheDocument();
    });
  });
});
