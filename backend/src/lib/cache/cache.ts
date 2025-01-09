export interface Cache<T> {
    get(key: string): Promise<T | null>;
    set(key: string, value: T, ttlMs?: number): Promise<void>;
}


export class MemoryCache<T> implements Cache<T> {
    private cache: Map<string, { value: T; expiry: number | null }> = new Map();

    async get(key: string): Promise<T | null> {
        const entry = this.cache.get(key);

        if (!entry) return null;

        const { value, expiry } = entry;

        if (expiry && Date.now() > expiry) {
            this.cache.delete(key)
            return null;
        }

        return value;
    }

    async set(key: string, value: T, ttlMs?: number): Promise<void> {
        const expiry = ttlMs ? Date.now() + ttlMs : null;
        this.cache.set(key, { value, expiry });
    }
}
