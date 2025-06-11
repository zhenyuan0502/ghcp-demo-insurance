import axios from 'axios';
import { mockAPI, Quote } from './mockAPI';

// Check if we're in StackBlitz environment
const isStackBlitz = window.location.hostname.includes('stackblitz') ||
    window.location.hostname.includes('webcontainer') ||
    process.env.REACT_APP_USE_MOCK_API === 'true';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class APIService {
    async getAllQuotes(): Promise<Quote[]> {
        if (isStackBlitz) {
            return mockAPI.getAllQuotes();
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/api/quotes`);
            return response.data;
        } catch (error) {
            console.warn('API unavailable, falling back to mock data');
            return mockAPI.getAllQuotes();
        }
    }

    async createQuote(quoteData: any): Promise<Quote> {
        if (isStackBlitz) {
            return mockAPI.createQuote(quoteData);
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/quote`, quoteData);
            return response.data;
        } catch (error) {
            console.warn('API unavailable, falling back to mock data');
            return mockAPI.createQuote(quoteData);
        }
    }

    async updateQuoteStatus(id: number, status: string): Promise<Quote> {
        if (isStackBlitz) {
            return mockAPI.updateQuoteStatus(id, status);
        }

        try {
            const response = await axios.put(`${API_BASE_URL}/api/quotes/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.warn('API unavailable, falling back to mock data');
            return mockAPI.updateQuoteStatus(id, status);
        }
    }

    async deleteQuote(id: number): Promise<void> {
        if (isStackBlitz) {
            return mockAPI.deleteQuote(id);
        }

        try {
            await axios.delete(`${API_BASE_URL}/api/quotes/${id}`);
        } catch (error) {
            console.warn('API unavailable, falling back to mock data');
            return mockAPI.deleteQuote(id);
        }
    }
}

export const apiService = new APIService();
export type { Quote };
