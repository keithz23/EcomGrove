// features/users/hooks/useUserModals.ts
import { useReducer } from 'react';
import { userModalReducer, initialModalState } from '../reducers/userModal.reducer';

export const useUserModals = () => {
  const [state, dispatch] = useReducer(userModalReducer, initialModalState);
  return { state, dispatch };
};
