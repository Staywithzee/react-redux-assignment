// src/tests/StudentTable.test.jsx
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { describe, test, expect } from 'vitest';
import { server } from './server';
import { renderWithProviders } from './utils';
import StudentTable from '../components/StudentTable';

const BASE = 'http://localhost/api/v1/';

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

    // Retry button should also be present
    expect(
      screen.getByText(/ลองเชื่อมต่อใหม่อีกครั้ง/)
    ).toBeInTheDocument();
  });
});
