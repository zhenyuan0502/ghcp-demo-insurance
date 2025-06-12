-- Initialize the insurance database
-- This script runs when the PostgreSQL container starts for the first time

-- Create the quote table (insurance quotes)
CREATE TABLE IF NOT EXISTS quote (
    id SERIAL PRIMARY KEY,
    purchaser_name VARCHAR(100),
    insured_name VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    insurance_type VARCHAR(20) NOT NULL,
    coverage_amount VARCHAR(20) NOT NULL,
    age INTEGER NOT NULL,
    premium DECIMAL(15,0), -- VND currency has no decimal places
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quote_email ON quote(email);
CREATE INDEX IF NOT EXISTS idx_quote_insurance_type ON quote(insurance_type);
CREATE INDEX IF NOT EXISTS idx_quote_status ON quote(status);
CREATE INDEX IF NOT EXISTS idx_quote_created_at ON quote(created_at);
-- Insert sample data for 10 Vietnamese users (VND currency)
INSERT INTO quote (purchaser_name, insured_name, email, phone, insurance_type, coverage_amount, age, premium, status) VALUES
('Nguyễn Văn An', 'Nguyễn Văn An', 'nguyen.van.an@example.com', '0912345678', 'life', '2000000000', 30, 8500000, 'approved'),
('Trần Thị Bình', 'Trần Thị Bình', 'tran.thi.binh@example.com', '0987654321', 'auto', '1000000000', 25, 12750000, 'pending'),
('Lê Minh Cường', 'Lê Minh Cường', 'le.minh.cuong@example.com', '0901234567', 'home', '4000000000', 45, 11000000, 'approved'),
('Phạm Thu Duyên', 'Phạm Thu Duyên', 'pham.thu.duyen@example.com', '0923456789', 'health', '1500000000', 35, 10200000, 'pending'),
('Hoàng Văn Em', 'Hoàng Văn Em', 'hoang.van.em@example.com', '0934567890', 'life', '3000000000', 28, 12750000, 'approved'),
('Đỗ Thị Phượng', 'Đỗ Thị Phượng', 'do.thi.phuong@example.com', '0945678901', 'auto', '800000000', 32, 10200000, 'rejected'),
('Vũ Quang Giang', 'Vũ Quang Giang', 'vu.quang.giang@example.com', '0956789012', 'home', '5000000000', 52, 16250000, 'approved'),
('Ngô Thị Hương', 'Ngô Thị Hương', 'ngo.thi.huong@example.com', '0967890123', 'health', '2500000000', 29, 17000000, 'pending'),
('Bùi Văn Ích', 'Bùi Văn Ích', 'bui.van.ich@example.com', '0978901234', 'life', '1800000000', 38, 9775000, 'approved'),
('Đinh Thị Kiều', 'Đinh Thị Kiều', 'dinh.thi.kieu@example.com', '0989012345', 'auto', '1200000000', 27, 15300000, 'pending');
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO insurance_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO insurance_user;
