// Mock API service for StackBlitz demo
export interface Quote {
    id: number;
    firstName: string;
    lastName: string;
    purchaserName?: string;
    insuredName?: string;
    email: string;
    phone: string;
    insuranceType: string;
    coverageAmount: string;
    age: number;
    premium?: number;
    status: string;
    createdAt: string;
}

// Simulate database with localStorage
const STORAGE_KEY = 'insurance_quotes';

class MockAPIService {
    private getQuotes(): Quote[] {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    private saveQuotes(quotes: Quote[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    }

    private calculatePremium(insuranceType: string, coverageAmount: string, age: number): number {
        const baseRates = {
            'life': 50,
            'auto': 100,
            'home': 150,
            'health': 200
        };

        const coverageMultiplier = {
            '100000': 1,
            '250000': 1.5,
            '500000': 2,
            '1000000': 3
        };

        const ageMultiplier = age < 25 ? 1.5 : age > 65 ? 1.3 : 1;

        const baseRate = baseRates[insuranceType as keyof typeof baseRates] || 100;
        const coverage = coverageMultiplier[coverageAmount as keyof typeof coverageMultiplier] || 1;

        return Math.round(baseRate * coverage * ageMultiplier);
    }

    async getAllQuotes(): Promise<Quote[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return this.getQuotes();
    }

    async createQuote(quoteData: Omit<Quote, 'id' | 'premium' | 'status' | 'createdAt'>): Promise<Quote> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const quotes = this.getQuotes();
        const newQuote: Quote = {
            ...quoteData,
            id: quotes.length + 1,
            premium: this.calculatePremium(quoteData.insuranceType, quoteData.coverageAmount, quoteData.age),
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        quotes.push(newQuote);
        this.saveQuotes(quotes);
        return newQuote;
    }

    async updateQuoteStatus(id: number, status: string): Promise<Quote> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const quotes = this.getQuotes();
        const quoteIndex = quotes.findIndex(q => q.id === id);

        if (quoteIndex === -1) {
            throw new Error('Quote not found');
        }

        quotes[quoteIndex].status = status;
        this.saveQuotes(quotes);
        return quotes[quoteIndex];
    }

    async deleteQuote(id: number): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const quotes = this.getQuotes();
        const filteredQuotes = quotes.filter(q => q.id !== id);
        this.saveQuotes(filteredQuotes);
    }
}

export const mockAPI = new MockAPIService();

// Initialize with some sample data if localStorage is empty
if (!localStorage.getItem(STORAGE_KEY)) {
    const sampleQuotes: Quote[] = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '(555) 123-4567',
            insuranceType: 'auto',
            coverageAmount: '250000',
            age: 30,
            premium: 150,
            status: 'approved',
            createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@email.com',
            phone: '(555) 987-6543',
            insuranceType: 'life',
            coverageAmount: '500000',
            age: 28,
            premium: 100,
            status: 'pending',
            createdAt: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
        }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleQuotes));
}
