import { renderHook, act } from '@testing-library/react-hooks';
import { AuthProvider } from '../AuthContext';

describe('AuthProvider', () => {
  it('should provide auth context', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    
    const { result } = renderHook(() => {
      const { token, login, logout } = useContext(AuthContext);
      return { token, login, logout };
    }, { wrapper });

    expect(result.current.token).toBeNull();
    
    act(() => {
      result.current.login('test-token');
    });
    
    expect(result.current.token).toBe('test-token');
    expect(localStorage.getItem('token')).toBe('test-token');
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
