const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://6905b069ee3d0d14c13361c0.mockapi.io/product';

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    author: string;
}

export const todoAPI = {
    async getAll(): Promise<Todo[]> {
        try {
            const res = await fetch(API_URL, { cache: 'no-store' });
            if (!res.ok) {
                const errorText = await res.text();
                console.error('API Error:', errorText);
                throw new Error(`Failed to fetch todos: ${res.status}`);
            }
            return res.json();
        } catch (error) {
            console.error('Get all todos error:', error);
            throw error;
        }
    },

    async create(todo: Omit<Todo, 'id'>): Promise<Todo> {
        try {
            console.log('Creating todo:', todo);
            console.log('API URL:', API_URL);

            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todo),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('API Error:', errorText);
                throw new Error(`Failed to create todo: ${res.status} - ${errorText}`);
            }

            const result = await res.json();
            console.log('Created todo:', result);
            return result;
        } catch (error) {
            console.error('Create todo error:', error);
            throw error;
        }
    },

    async update(id: string, todo: Partial<Todo>): Promise<Todo> {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todo),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('API Error:', errorText);
                throw new Error(`Failed to update todo: ${res.status}`);
            }

            return res.json();
        } catch (error) {
            console.error('Update todo error:', error);
            throw error;
        }
    },

    async delete(id: string): Promise<void> {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('API Error:', errorText);
                throw new Error(`Failed to delete todo: ${res.status}`);
            }
        } catch (error) {
            console.error('Delete todo error:', error);
            throw error;
        }
    },
};
