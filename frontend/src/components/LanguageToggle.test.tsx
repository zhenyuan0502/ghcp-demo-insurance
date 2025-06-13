import { fireEvent, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { renderWithProviders } from '../utils/test-utils';
import { vi } from 'vitest';

// Mock the theme context
const mockToggleTheme = vi.fn();
vi.mock('../App', () => ({
  useThemeContext: () => ({
    mode: 'light',
    toggleTheme: mockToggleTheme
  })
}));

describe('Language Toggle Integration', () => {
  beforeEach(() => {
    mockToggleTheme.mockClear();
  });

  test('renders navbar with Vietnamese by default', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('Bảo Hiểm An Toàn')).toBeInTheDocument();
    expect(screen.getByText('Trang Chủ')).toBeInTheDocument();
    expect(screen.getByText('Báo Giá')).toBeInTheDocument();
    expect(screen.getByText('Bảng Điều Khiển')).toBeInTheDocument();
    expect(screen.getByText('VI')).toBeInTheDocument();
  });

  test('renders navbar with English when language is set to English', () => {
    renderWithProviders(<Navbar />, { language: 'en' });
    expect(screen.getByText('Safe Insurance')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Quote')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  test('language toggle changes displayed language', () => {
    const mockSetLanguage = vi.fn();
    renderWithProviders(<Navbar />, { 
      language: 'vi',
      languageContext: { setLanguage: mockSetLanguage }
    });

    const languageButton = screen.getByRole('button', { name: 'VI' });
    fireEvent.click(languageButton);
    
    expect(mockSetLanguage).toHaveBeenCalledWith('en');
  });
});