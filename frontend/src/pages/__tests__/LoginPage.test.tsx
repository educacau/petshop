import {vi} from 'vitest';
import {render, screen} from '@testing-library/react';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn()
  })
}));

import {LoginPage} from '../LoginPage';

describe('LoginPage', () => {
  it('renders heading and button', () => {
    render(<LoginPage />);
    expect(screen.getByText(/PetCare Suite/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Entrar/i})).toBeInTheDocument();
  });
});
