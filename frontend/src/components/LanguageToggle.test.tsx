import { fireEvent, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { renderWithProviders } from '../utils/test-utils';
import { vi } from 'vitest';
import { getTranslations } from '../i18n/translations';

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
    const viTranslations = getTranslations('vi');
    renderWithProviders(<Navbar />);
    expect(screen.getByText(viTranslations.navbar.title)).toBeInTheDocument();
    expect(screen.getByText(viTranslations.navbar.home)).toBeInTheDocument();
    expect(screen.getByText(viTranslations.navbar.quote)).toBeInTheDocument();
    expect(screen.getByText(viTranslations.navbar.dashboard)).toBeInTheDocument();
    expect(screen.getByText('VI')).toBeInTheDocument();
  });

  test('renders navbar with English when language is set to English', () => {
    const enTranslations = getTranslations('en');
    renderWithProviders(<Navbar />, { language: 'en' });
    expect(screen.getByText(enTranslations.navbar.title)).toBeInTheDocument();
    expect(screen.getByText(enTranslations.navbar.home)).toBeInTheDocument();
    expect(screen.getByText(enTranslations.navbar.quote)).toBeInTheDocument();
    expect(screen.getByText(enTranslations.navbar.dashboard)).toBeInTheDocument();
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