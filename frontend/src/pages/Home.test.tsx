import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Home from '../pages/Home';
import { renderWithProviders } from '../utils/test-utils';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Home Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders main heading', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('Chào Mừng Đến Với Bảo Hiểm An Toàn')).toBeInTheDocument();
  });

  test('renders subtitle', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('Đối tác tin cậy cho các giải pháp bảo hiểm toàn diện')).toBeInTheDocument();
  });

  test('renders get quote button', () => {
    renderWithProviders(<Home />);
    const quoteButton = screen.getByText('Nhận Báo Giá Miễn Phí');
    expect(quoteButton).toBeInTheDocument();
  });

  test('navigates to quote page when quote button is clicked', () => {
    renderWithProviders(<Home />);
    const quoteButton = screen.getByText('Nhận Báo Giá Miễn Phí');
    
    fireEvent.click(quoteButton);
    expect(mockNavigate).toHaveBeenCalledWith('/quote');
  });

  test('renders all insurance type cards', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('Bảo Hiểm Nhân Thọ')).toBeInTheDocument();
    expect(screen.getByText('Bảo Hiểm Ô Tô')).toBeInTheDocument();
    expect(screen.getByText('Bảo Hiểm Nhà Ở')).toBeInTheDocument();
  });

  test('renders insurance type descriptions', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('Bảo vệ tương lai tài chính của gia đình bạn')).toBeInTheDocument();
    expect(screen.getByText('Bảo hiểm toàn diện cho xe của bạn')).toBeInTheDocument();
    expect(screen.getByText('Bảo vệ ngôi nhà và tài sản của bạn')).toBeInTheDocument();
  });

  test('renders insurance type icons', () => {
    renderWithProviders(<Home />);
    
    // Check that SVG icons are present
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });
});