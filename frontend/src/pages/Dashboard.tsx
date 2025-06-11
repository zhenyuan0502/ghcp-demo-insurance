import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip, Box,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import { apiService, Quote } from '../services/apiService';

const Dashboard: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);
  const fetchQuotes = async () => {
    try {
      const quotes = await apiService.getAllQuotes();
      setQuotes(quotes);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const handleStatusClick = (event: React.MouseEvent<HTMLDivElement>, quoteId: number) => {
    console.log('handleStatusClick called with quoteId:', quoteId);
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedQuoteId(quoteId);
  };

  const handleStatusClose = () => {
    console.log('handleStatusClose called');
    setAnchorEl(null);
    setSelectedQuoteId(null);
  };

  const updateQuoteStatus = async (status: string) => {
    console.log('updateQuoteStatus called with status:', status, 'for quote:', selectedQuoteId);
    if (!selectedQuoteId) return;
    try {
      await apiService.updateQuoteStatus(selectedQuoteId, status);

      // Update the local state
      setQuotes(quotes.map(quote =>
        quote.id === selectedQuoteId
          ? { ...quote, status: status }
          : quote
      ));

      handleStatusClose();
    } catch (error) {
      console.error('Error updating quote status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>      <Typography variant="h4" component="h1" gutterBottom>
      Bảng Điều Khiển Bảo Hiểm
    </Typography>      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">
                Tổng Báo Giá
              </Typography>
              <Typography variant="h4" color="primary">
                {quotes.length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>              <Typography variant="h6" component="h2">
              Báo Giá Chờ Duyệt
            </Typography>
              <Typography variant="h4" color="warning.main">
                {quotes.filter(q => q.status === 'pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>              <Typography variant="h6" component="h2">
              Báo Giá Đã Duyệt
            </Typography>
              <Typography variant="h4" color="success.main">
                {quotes.filter(q => q.status === 'approved').length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <TableContainer component={Paper}>        <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên bên mua bảo hiểm</TableCell>
            <TableCell>Tên được bảo hiểm</TableCell>
            <TableCell>Loại Bảo Hiểm</TableCell>
            <TableCell>Số Tiền Bảo Hiểm</TableCell>
            <TableCell>Phí Bảo Hiểm</TableCell>
            <TableCell>Trạng Thái</TableCell>
            <TableCell>Ngày</TableCell>
          </TableRow>
        </TableHead>          <TableBody>
          {quotes && quotes.length > 0 ? quotes.map((quote) => (
            <TableRow key={quote.id}>
              <TableCell>
                {quote.purchaserName || `${quote.firstName} ${quote.lastName}`}
              </TableCell>
              <TableCell>
                {quote.insuredName || `${quote.firstName} ${quote.lastName}`}
              </TableCell>
              <TableCell style={{ textTransform: 'capitalize' }}>
                {quote.insuranceType}
              </TableCell><TableCell>
                {parseInt(quote.coverageAmount).toLocaleString()} VND
              </TableCell>
              <TableCell>
                {quote.premium?.toFixed(2) || 'N/A'} VND
              </TableCell>                <TableCell>

                <Chip
                  onClick={(e) => handleStatusClick(e, quote.id)}
                  label={getStatusLabel(quote.status)}
                  color={getStatusColor(quote.status) as any}
                  size="small"
                />
              </TableCell>                <TableCell>
                {new Date(quote.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={7} style={{ textAlign: 'center' }}>
                Không có dữ liệu báo giá
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </TableContainer>      {/* Status Change Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleStatusClose}
      >
        <MenuItem onClick={() => updateQuoteStatus('pending')}>
          <Chip
            label="Chờ duyệt"
            color="warning"
            size="small"
            sx={{ mr: 1, pointerEvents: 'none' }}
          />
          Chờ duyệt
        </MenuItem>
        <MenuItem onClick={() => updateQuoteStatus('approved')}>
          <Chip
            label="Đã duyệt"
            color="success"
            size="small"
            sx={{ mr: 1, pointerEvents: 'none' }}
          />
          Duyệt
        </MenuItem>
        <MenuItem onClick={() => updateQuoteStatus('rejected')}>
          <Chip
            label="Từ chối"
            color="error"
            size="small"
            sx={{ mr: 1, pointerEvents: 'none' }}
          />
          Từ chối
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Dashboard;
