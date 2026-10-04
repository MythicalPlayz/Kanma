import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    // first get accessToken from localStorage, if it exists
    const [accessToken, setAccessToken] = useState(() => {
        return localStorage.getItem('accountToken') || null;
    });


    // if there is a token we try to refresh the token if success then we can continue otherwise we will logout the user
    const RefreshToken = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/account/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
               // If the refresh is successful, and the token is valid, we can continue to use the app
            }
            else {
                // If the refresh fails, we log out the user
                setAccessToken(null);
                localStorage.removeItem('accountToken');
            }
        }
        catch (error) {
            console.error('Error refreshing token:', error);
            // logout the user if there is an error refreshing the token
            setAccessToken(null);
            localStorage.removeItem('accountToken');
        }
    };

    // run this function on user opening the site
    useEffect(() => {
        if (accessToken) {
            RefreshToken();
        }
    }, [accessToken]);

    return (
        <UserContext.Provider
            value={{
                accessToken,
                setAccessToken,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function getAccountContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('getAccountContext must be used within a UserProvider');
    }
    return context;
}
