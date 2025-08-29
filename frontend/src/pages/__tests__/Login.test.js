import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';
import { AuthProvider } from '@/context/AuthContext';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Login', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should submit login form', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token' })
    });

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), {
      target: { value: 'password' }
    });
    fireEvent.click(screen.getByText('Se connecter'));

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password'
      })
    });
  });
});
