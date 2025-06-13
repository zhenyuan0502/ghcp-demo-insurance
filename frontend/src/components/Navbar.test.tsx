import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Navbar from '../components/Navbar';
import { renderWithProviders } from '../utils/test-utils';

// Mock the theme context
const mockToggleTheme = vi.fn();
vi.mock('../App', () => ({
  useThemeContext: () => ({
    mode: 'light',
    toggleTheme: mockToggleTheme
  })
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    mockToggleTheme.mockClear();
  });

  test('renders navbar with correct title', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('Bảo Hiểm An Toàn')).toBeInTheDocument();
  });

  test('renders all navigation links', () => {
    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('Trang Chủ')).toBeInTheDocument();
    expect(screen.getByText('Báo Giá')).toBeInTheDocument();
    expect(screen.getByText('Bảng Điều Khiển')).toBeInTheDocument();
  });

  test('navigation links have correct href attributes', () => {
    renderWithProviders(<Navbar />);
    
    const homeLink = screen.getByText('Trang Chủ').closest('a');
    const quoteLink = screen.getByText('Báo Giá').closest('a');
    const dashboardLink = screen.getByText('Bảng Điều Khiển').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(quoteLink).toHaveAttribute('href', '/quote');
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
  });

  test('renders security icon', () => {
    renderWithProviders(<Navbar />);
    // Since it's an icon, we can check if it exists by looking for the MUI SecurityIcon
    const securityIcon = document.querySelector('[data-testid="SecurityIcon"]');
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  test('renders theme toggle button', () => {
    renderWithProviders(<Navbar />);
    const themeButton = screen.getByRole('button', { name: /chuyển sang chế độ tối/i });
    expect(themeButton).toBeInTheDocument();
  });

  test('renders language toggle button', () => {
    renderWithProviders(<Navbar />);
    const languageButton = screen.getByRole('button', { name: 'VI' });
    expect(languageButton).toBeInTheDocument();
    expect(languageButton).toHaveAttribute('title', 'Chuyển sang tiếng Anh');
  });

  test('calls toggleTheme when theme button is clicked', () => {
    renderWithProviders(<Navbar />);
    const themeButton = screen.getByRole('button', { name: /chuyển sang chế độ tối/i });
    
    fireEvent.click(themeButton);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});