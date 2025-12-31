import { useState, useEffect } from "react";
export function useFetch(apiCall) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        apiCall()
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);
    return { data, loading, error };
}
