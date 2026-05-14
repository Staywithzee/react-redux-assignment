// src/tests/utils.js
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { studentsApi } from '../features/students/studentsApi';

export function renderWithProviders(ui, { preloadedState = {} } = {}) {
  const store = configureStore({
    reducer: {
      [studentsApi.reducerPath]: studentsApi.reducer,
    },
    middleware: g => g().concat(studentsApi.middleware),
    preloadedState,
  });

  function Wrapper({ children }) {
    return React.createElement(Provider, { store }, children);
  }

  return { store, ...render(ui, { wrapper: Wrapper }) };
}
