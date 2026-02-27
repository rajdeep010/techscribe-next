"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { User, UserState } from "@/lib/types";
import { userReducer } from "@/reducer/UserReducer";


const initialUserState: User = {
    id: '1234',
    name: 'rajdeep',
    email: 'rajdeep@gmail.com',
    role: 'admin',
    avatar: 'https://github.com/shadcn.png',
    dob: '1990-01-15',
    language: 'english'
}

const UserContext = createContext<any | undefined>(undefined);


export function UserProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(userReducer, initialUserState);

    const setUser = (user: User) => {
        dispatch({ type: "SET_USER", payload: user });
    }

    useEffect(() => {
        setUser(initialUserState);
    }, [])
    return (
        <UserContext.Provider
            value={{
                ...state,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}