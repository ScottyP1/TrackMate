'use client'

import { useContext, useEffect } from 'react';
import { Context as AuthContext } from '@/context/AuthContext';

export default function useFetchUserAccount() {
    const { state, loadTokenAndUser } = useContext(AuthContext)
    useEffect(() => {
        if (!state.user) {
            loadTokenAndUser();
        }
    }, [state.user])
}