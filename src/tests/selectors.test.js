// src/tests/selectors.test.js — Unit tests for pure selectors
import { describe, test, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { studentsApi } from '../features/students/studentsApi';
import {
  selectAverageGpa,
  selectHighAchievers,
  selectGpaDistribution,
} from '../features/students/selectors';

// Inject mock data directly into the RTK Query cache — no HTTP needed
async function makeState(students) {
  const store = configureStore({
    reducer: { [studentsApi.reducerPath]: studentsApi.reducer },
    middleware: g => g().concat(studentsApi.middleware),
  });
  // upsertQueryData is async — must await before reading state
  await store.dispatch(
    studentsApi.util.upsertQueryData('getStudents', undefined, students)
  );
  return store.getState();
}

const mockStudents = [
  { id: '1', name: 'Alice', studentId: 'ST001', major: 'CS', gpa: 3.8 }, // high
  { id: '2', name: 'Bob',   studentId: 'ST002', major: 'IT', gpa: 2.3 }, // low
  { id: '3', name: 'Carol', studentId: 'ST003', major: 'CS', gpa: 3.5 }, // high
];

describe('selectAverageGpa', () => {
  test('returns formatted average of all students', async () => {
    // (3.8 + 2.3 + 3.5) / 3 = 3.20
    expect(selectAverageGpa(await makeState(mockStudents))).toBe('3.20');
  });

  test('returns — when student list is empty', async () => {
    expect(selectAverageGpa(await makeState([]))).toBe('—');
  });
});

describe('selectHighAchievers', () => {
  test('returns only students with GPA >= 3.5', async () => {
    const result = selectHighAchievers(await makeState(mockStudents));
    expect(result).toHaveLength(2);
    expect(result.map(s => s.name)).toEqual(expect.arrayContaining(['Alice', 'Carol']));
    expect(result.map(s => s.name)).not.toContain('Bob');
  });

  test('returns empty array when no high achievers', async () => {
    const low = [{ id: '1', name: 'Dave', gpa: 2.0 }];
    expect(selectHighAchievers(await makeState(low))).toHaveLength(0);
  });
});

describe('selectGpaDistribution', () => {
  test('counts students into correct brackets', async () => {
    const dist = selectGpaDistribution(await makeState(mockStudents));
    expect(dist.high).toBe(2);    // Alice (3.8), Carol (3.5)
    expect(dist.medium).toBe(0);  // nobody between 2.5 and 3.49
    expect(dist.low).toBe(1);     // Bob (2.3)
  });

  test('returns all zeros for empty list', async () => {
    const dist = selectGpaDistribution(await makeState([]));
    expect(dist).toEqual({ high: 0, medium: 0, low: 0 });
  });
});
