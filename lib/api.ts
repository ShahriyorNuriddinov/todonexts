const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    author: string;
}

export const todoAPI = {
    async getAll(): Promise<Todo[]> {
        const res = await fetch(API_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch todos');
        return res.json();
    },

    async create(todo: Omit<Todo, 'id'>): Promise<Todo> {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo),
        });
        if (!res.ok) throw new Error('Failed to create todo');
        return res.json();
    },

    async update(id: string, todo: Partial<Todo>): Promise<Todo> {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo),
        });
        if (!res.ok) throw new Error('Failed to update todo');
        return res.json();
    },

    async delete(id: string): Promise<void> {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete todo');
    },
};
