import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import ClaimForm from './ClaimForm';
import { renderWithProviders } from '../utils/test-utils';

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn()
  }
}));

describe('ClaimForm Component', () => {
  test('renders claim form with main title', () => {
    renderWithProviders(<ClaimForm />);
    
    // Check main title (Vietnamese is default)
    expect(screen.getByText('Mẫu Đơn Yêu Cầu Bồi Thường')).toBeInTheDocument();
  });

  test('renders basic form sections', () => {
    renderWithProviders(<ClaimForm />);
    
    // Check section headers
    expect(screen.getByText('Thông Tin Người Mua Bảo Hiểm')).toBeInTheDocument();
    expect(screen.getByText('Chi Tiết Sự Cố')).toBeInTheDocument();
    expect(screen.getByText('Chi Tiết Yêu Cầu Bồi Thường')).toBeInTheDocument();
    expect(screen.getByText('Cam Kết')).toBeInTheDocument();
  });

  test('renders submit button', () => {
    renderWithProviders(<ClaimForm />);
    
    expect(screen.getByText('Nộp Đơn Yêu Cầu')).toBeInTheDocument();
  });

  test('shows police report number field when police report is filed', async () => {
    renderWithProviders(<ClaimForm />);
    
    // Initially, police report number field should not be visible
    expect(screen.queryByLabelText(/Số Báo Cáo Cảnh Sát/)).not.toBeInTheDocument();
    
    // Check the police report filed checkbox
    const policeReportCheckbox = screen.getByLabelText(/Đã Báo Cáo Cảnh Sát Chưa/);
    fireEvent.click(policeReportCheckbox);
    
    // Now police report number field should be visible
    await waitFor(() => {
      expect(screen.getByLabelText(/Số Báo Cáo Cảnh Sát/)).toBeInTheDocument();
    });
  });

  test('renders key form fields', () => {
    renderWithProviders(<ClaimForm />);
    
    // Check some key fields are present
    expect(screen.getByLabelText(/Họ và Tên/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Số Hợp Đồng/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Địa Chỉ Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ngày Xảy Ra Sự Cố/)).toBeInTheDocument();
  });

  test('displays current date as submission date', () => {
    renderWithProviders(<ClaimForm />);
    
    const today = new Date().toLocaleDateString();
    expect(screen.getByText(new RegExp(today))).toBeInTheDocument();
  });
});