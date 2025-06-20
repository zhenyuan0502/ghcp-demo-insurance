import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import ClaimForm from './ClaimForm';
import { renderWithProviders } from '../utils/test-utils';
import * as helpers from '../utils/helpers';

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn()
  }
}));

// Mock the helpers
vi.spyOn(helpers, 'validateEmail').mockImplementation((email) => email.includes('@'));
vi.spyOn(helpers, 'validatePhone').mockImplementation((phone) => phone.length >= 10);

describe('ClaimForm Component', () => {
  test('renders claim form with all sections', () => {
    renderWithProviders(<ClaimForm />);
    
    // Check main title (Vietnamese is default)
    expect(screen.getByText('Mẫu Đơn Yêu Cầu Bồi Thường')).toBeInTheDocument();
    
    // Check section headers
    expect(screen.getByText('Thông Tin Người Mua Bảo Hiểm')).toBeInTheDocument();
    expect(screen.getByText('Chi Tiết Sự Cố')).toBeInTheDocument();
    expect(screen.getByText('Chi Tiết Yêu Cầu Bồi Thường')).toBeInTheDocument();
    expect(screen.getByText('Tài Liệu Hỗ Trợ')).toBeInTheDocument();
    expect(screen.getByText('Thông Tin Ngân Hàng Để Chi Trả')).toBeInTheDocument();
    expect(screen.getByText('Cam Kết')).toBeInTheDocument();
  });

  test('renders all required form fields', () => {
    renderWithProviders(<ClaimForm />);
    
    // Policyholder Information fields (Vietnamese labels)
    expect(screen.getByLabelText(/Họ và Tên/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Số Hợp Đồng/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Số Điện Thoại/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Địa Chỉ Email/)).toBeInTheDocument();
    
    // Incident Details fields
    expect(screen.getByLabelText(/Ngày Xảy Ra Sự Cố/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Thời Gian Xảy Ra Sự Cố/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Địa Điểm Xảy Ra Sự Cố/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mô Tả Những Gì Đã Xảy Ra/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Loại Yêu Cầu Bồi Thường/)).toBeInTheDocument();
    
    // Claim Details fields
    expect(screen.getByLabelText(/Chi Phí Thiệt Hại Ước Tính/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tài Sản\/Vật Phẩm Bị Ảnh Hưởng/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Đã Báo Cáo Cảnh Sát Chưa/)).toBeInTheDocument();
    
    // Banking Information fields
    expect(screen.getByLabelText(/Tên Ngân Hàng/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tên Chủ Tài Khoản/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Số Tài Khoản/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mã Swift\/BIC/)).toBeInTheDocument();
    
    // Declaration fields
    expect(screen.getByLabelText(/Tôi xác nhận rằng thông tin được cung cấp là chính xác/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Chữ Ký/)).toBeInTheDocument();
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

  test('shows validation errors for empty required fields', async () => {
    renderWithProviders(<ClaimForm />);
    
    // Click submit without filling any fields
    const submitButton = screen.getByText('Nộp Đơn Yêu Cầu');
    fireEvent.click(submitButton);
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/Please fill in all required fields/)).toBeInTheDocument();
    });
  });

  test('shows error for invalid email format', async () => {
    renderWithProviders(<ClaimForm />);
    
    // Fill in all required fields with invalid email
    fireEvent.change(screen.getByLabelText(/Họ và Tên/), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Số Hợp Đồng/), { target: { value: 'POL123456' } });
    fireEvent.change(screen.getByLabelText(/Số Điện Thoại/), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Địa Chỉ Email/), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/Ngày Xảy Ra Sự Cố/), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByLabelText(/Thời Gian Xảy Ra Sự Cố/), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText(/Địa Điểm Xảy Ra Sự Cố/), { target: { value: 'Test Location' } });
    fireEvent.change(screen.getByLabelText(/Mô Tả Những Gì Đã Xảy Ra/), { target: { value: 'Test description' } });
    
    // Select claim type
    const claimTypeSelect = screen.getByLabelText(/Loại Yêu Cầu Bồi Thường/);
    fireEvent.mouseDown(claimTypeSelect);
    const autoOption = screen.getByText('Ô Tô');
    fireEvent.click(autoOption);
    
    fireEvent.change(screen.getByLabelText(/Chi Phí Thiệt Hại Ước Tính/), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/Tài Sản\/Vật Phẩm Bị Ảnh Hưởng/), { target: { value: 'Car damage' } });
    fireEvent.change(screen.getByLabelText(/Tên Ngân Hàng/), { target: { value: 'Test Bank' } });
    fireEvent.change(screen.getByLabelText(/Tên Chủ Tài Khoản/), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Số Tài Khoản/), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Chữ Ký/), { target: { value: 'John Doe' } });
    
    // Check confirmation checkbox
    fireEvent.click(screen.getByLabelText(/Tôi xác nhận rằng thông tin được cung cấp là chính xác/));
    
    // Mock invalid email validation
    vi.mocked(helpers.validateEmail).mockReturnValue(false);
    
    // Click submit
    const submitButton = screen.getByText('Nộp Đơn Yêu Cầu');
    fireEvent.click(submitButton);
    
    // Should show email validation error
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/)).toBeInTheDocument();
    });
  });

  test('shows error when confirmation checkbox is not checked', async () => {
    renderWithProviders(<ClaimForm />);
    
    // Fill in all required fields but don't check confirmation
    fireEvent.change(screen.getByLabelText(/Họ và Tên/), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Số Hợp Đồng/), { target: { value: 'POL123456' } });
    fireEvent.change(screen.getByLabelText(/Số Điện Thoại/), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Địa Chỉ Email/), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Ngày Xảy Ra Sự Cố/), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByLabelText(/Thời Gian Xảy Ra Sự Cố/), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText(/Địa Điểm Xảy Ra Sự Cố/), { target: { value: 'Test Location' } });
    fireEvent.change(screen.getByLabelText(/Mô Tả Những Gì Đã Xảy Ra/), { target: { value: 'Test description' } });
    
    // Select claim type
    const claimTypeSelect = screen.getByLabelText(/Loại Yêu Cầu Bồi Thường/);
    fireEvent.mouseDown(claimTypeSelect);
    const autoOption = screen.getByText('Ô Tô');
    fireEvent.click(autoOption);
    
    fireEvent.change(screen.getByLabelText(/Chi Phí Thiệt Hại Ước Tính/), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/Tài Sản\/Vật Phẩm Bị Ảnh Hưởng/), { target: { value: 'Car damage' } });
    fireEvent.change(screen.getByLabelText(/Tên Ngân Hàng/), { target: { value: 'Test Bank' } });
    fireEvent.change(screen.getByLabelText(/Tên Chủ Tài Khoản/), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Số Tài Khoản/), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Chữ Ký/), { target: { value: 'John Doe' } });
    
    // Don't check confirmation checkbox - leave it unchecked
    
    // Click submit
    const submitButton = screen.getByText('Nộp Đơn Yêu Cầu');
    fireEvent.click(submitButton);
    
    // Should show confirmation error
    await waitFor(() => {
      expect(screen.getByText(/Bạn phải xác nhận thông tin là chính xác/)).toBeInTheDocument();
    });
  });

  test('displays current date as submission date', () => {
    renderWithProviders(<ClaimForm />);
    
    const today = new Date().toLocaleDateString();
    expect(screen.getByText(new RegExp(today))).toBeInTheDocument();
  });
});