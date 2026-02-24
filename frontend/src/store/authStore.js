import create from 'zustand';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,

  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },

  isAuthenticated: () => {
    const state = useAuthStore.getState();
    return state.token !== null;
  },

  isAdmin: () => {
    const state = useAuthStore.getState();
    return state.user?.role === 'admin';
  }
}));

export default useAuthStore;
