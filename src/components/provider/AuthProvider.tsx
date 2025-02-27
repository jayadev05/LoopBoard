'use client';

//since sessionprovider relies on useContext under the hood, we have to put 'use client' on top

import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
    children: React.ReactNode;
}

export default function AuthProvider({children}:AuthProviderProps){
    return <SessionProvider>{children}</SessionProvider>
}