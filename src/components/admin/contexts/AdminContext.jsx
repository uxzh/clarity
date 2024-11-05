import { createContext, useContext, useReducer, useState } from "react";
import { MODELS } from "../../../lib/models";

export const AdminContext = createContext({});

const Provider = AdminContext.Provider;

const modelsReducer = (state, action) => {
  switch (action.type) {
    case 'set':
      return {
        ...state,
        [action.model]: action.data
      };
    case 'add':
      return {
        ...state,
        [action.model]: [...state[action.model], action.data]
      };
    case 'update':
      return {
        ...state,
        [action.model]: state[action.model].map(item => {
          if (item.id === action.data.id) {
            return action.data;
          }
          return item;
        })
      };
    case 'updateMany':
      return {
        ...state,
        [action.model]: state[action.model].map(item => {
          const found = action.data.find(el => el.id === item.id);
          if (found) {
            return found;
          }
          return item;
        })
      };
    case 'delete':
      return {
        ...state,
        [action.model]: state[action.model].filter(item => item.id !== action.id)
      };
    default:
      return state;
  }
      
};

export const AdminProvider = ({children}) => {
  const [data, dispatchData] = useReducer(modelsReducer, {
    [MODELS.users]: [],
    [MODELS.cards]: [],
    [MODELS.reviews]: []
  });
  const [totals, setTotals] = useState({
    [MODELS.users]: null,
    [MODELS.cards]: null,
    [MODELS.reviews]: null,
    [MODELS.replies]: null,
    [MODELS.likes]: null
  })

  return (
    <Provider value={{
      data,
      dispatchData,
      totals,
      setTotals
    }}>
      {children}
    </Provider>
  )
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  return context;
}