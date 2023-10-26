"use client"
import { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { User } from '../types/typesSSO';
import toast from 'react-hot-toast';

export interface AuthState {
	authenticated: boolean;
	user: User | null;
	loading: boolean;
}

interface Action {
	type: string;
	payload?: any;
}
const initialState = {
	authenticated: false,
	user: null,
	loading: true,
};

const StateContext = createContext<AuthState>(initialState);

const reducer = (state: AuthState, { type, payload }: Action): AuthState => {
	switch (type) {
		case 'LOGIN':
			console.warn('LOGIN', payload);
			if(!payload) {toast.error('LOGIN: Usuario no encontrado'); return {...state,  authenticated: false, user: null}; }
			localStorage.setItem('cliente', JSON.stringify(payload.datos || payload));
			return {
				...state,
				authenticated: true,
				user: payload,
			};
		case 'LOGOUT':
			localStorage.removeItem('token');
			axios.defaults.headers.common['Authorization'] = '';
			return { ...state, authenticated: false, user: null };
		case 'UPDATE':
			return { ...state, user: payload };
		case 'STOP_LOADING':
			return { ...state, loading: false };
		default:
			throw new Error(`Unknow action type: ${type}`);
	}
};
//@typescript-eslint/no-empty-function
const DispatchContext = createContext<(type: string, payload?: any) => void>(() => {
	console.log('Auth Dispatcher. Not initialized.');
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, defaultDispatch] = useReducer(reducer, initialState);

	const dispatch = (type: string, payload?: any) => defaultDispatch({ type, payload });

	// useEffect(() => {
	// 	async function loadUser() {
	// 		try {
	// 			if (!axios.defaults.headers.common['Authorization']) {
	// 				const token = localStorage.getItem('token');
	// 				axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
	// 			}
	// 			const res = await axios.get('/auth/me');
	// 			dispatch('UPDATE', res.data);
	// 		} catch (err) {
	// 			console.error('Usuario no autenticado.\n' + err);
	// 		} finally {
	// 			dispatch('STOP_LOADING');
	// 		}
	// 	}
	// 	loadUser();
	// }, []);

	return (
		<DispatchContext.Provider value={dispatch}>
			<StateContext.Provider value={state}>{children}</StateContext.Provider>
		</DispatchContext.Provider>
	);
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
