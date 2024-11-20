"use client"

import { useEffect, useState } from "react";

export function useLoad<P = unknown>(fn: () => Promise<P>, deps: unknown[] = []) {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const [data, setData] = useState<P | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        setData(null)
        setLoading(true)
        fn().then((r: P) => {
            setData(r)
            setLoading(false)
            setError(false)
        }).catch(() => {
            setData(null)
            setError(true)
            setLoading(false)
        })
    }, [reload, ...deps])

    return {
        data,
        error,
        loading,
        reload: () => setReload(!reload)
    }
}
