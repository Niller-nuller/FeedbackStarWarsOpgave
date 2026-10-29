async function api(path, { body, headers, ...options} = {}) {
    const res = await fetch(`/api${path}`, {
        ...options,
        headers: {
            ...(body !== undefined && { 'Content-Type': 'application/json' }),
            ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const err = await res.json().catch((err) => ({}));
        throw new Error(err.error || `Request failed with status ${res.status}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

const users = await api('/users');
await api('/users', {method: 'POST', body: JSON.stringify(users)});