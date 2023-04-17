import Axios from 'axios';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { User } from '../../types/typesSSO';
import { toast } from 'react-hot-toast';

interface State {
  authenticated: boolean
  user: User | null
  loading: boolean
}

interface Action {
  type: string
  payload: any
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
  loading: true,
});

const DispatchContext = createContext(null);

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: payload.user,
      };
    case 'LOGOUT':
      return { ...state, authenticated: false, user: null };
    case 'STOP_LOADING':
      return { ...state, loading: false };
    default:
      throw new Error(`Unknow action type: ${type}`);
  }
};

//TODO: Store user session in localstorage to avoid re-login on other tabs

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  const dispatch = (type: string, payload?: any) =>
    defaultDispatch({ type, payload });

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await Axios.get('/auth/me');
        dispatch('LOGIN', res.data);
      } catch (err) {
        console.error('Usuario no autenticado.\n' + err);
      } finally {
        toast.error('Inicie sesión para ver todo el contenido.')
        dispatch('STOP_LOADING');
      }
    }
    loadUser();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
