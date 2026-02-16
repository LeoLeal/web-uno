import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/room/page', () => ({
  default: () => <div>Room Route</div>,
}));

import { AppRoutes } from './AppRoutes';

describe('AppRoutes', () => {
  it('renders the homepage at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /create new game/i })).toBeInTheDocument();
  });

  it('redirects /room to /', () => {
    render(
      <MemoryRouter initialEntries={['/room']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /create new game/i })).toBeInTheDocument();
  });

  it('renders room route for /room/:id', () => {
    render(
      <MemoryRouter initialEntries={['/room/test-room']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Room Route')).toBeInTheDocument();
  });
});
