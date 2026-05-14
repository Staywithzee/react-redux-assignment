// src/tests/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers/students';

export const server = setupServer(...handlers);
