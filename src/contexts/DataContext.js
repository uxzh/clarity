import React, {createContext, useState} from 'react';

// Create the data context
export const DataContext = createContext();

const Provider = DataContext.Provider;

export const DataProvider = ({children}) => {
    const [topCards, setTopCards] = useState(null);

    return (
        <Provider value={{
            topCards, setTopCards
        }}>
            {children}
        </Provider>
    );
};
