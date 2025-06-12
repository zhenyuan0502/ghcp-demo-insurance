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
  Chip,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface Quote {
  id: number;
  purchaserName?: string;
  insuredName?: string;
  insuranceType: string;
  coverageAmount: string;
  premium: number | string;
  status: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    fetchQuotes();
  }, []); const fetchQuotes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/quotes`);
      setQuotes(response.data);
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
    if (!selectedQuoteId) return; try {
      await axios.put(`${import.meta.env.VITE_API_URL}/quotes/${selectedQuoteId}/status`, {
        status: status
      });

      // Update the local state
      setQuotes(quotes.map(quote =>
        quote.id === selectedQuoteId
          ? { ...quote, status: status }
          : quote
      )); handleStatusClose();
    } catch (error) {
      console.error('Error updating quote status:', error);
      showSnackbar('Có lỗi xảy ra khi cập nhật trạng thái', 'error');
    }
  };
  const handleDeleteQuote = async (quoteId: number) => {
    setQuoteToDelete(quoteId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteQuote = async () => {
    if (!quoteToDelete) return; try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/quotes/${quoteToDelete}`);

      // Update the local state by removing the deleted quote
      setQuotes(quotes.filter(quote => quote.id !== quoteToDelete));

      console.log('Quote deleted successfully');
      setDeleteDialogOpen(false);
      setQuoteToDelete(null);
      showSnackbar('Xóa báo giá thành công', 'success');
    } catch (error) {
      console.error('Error deleting quote:', error);
      showSnackbar('Có lỗi xảy ra khi xóa báo giá', 'error');
      setDeleteDialogOpen(false);
      setQuoteToDelete(null);
    }
  };

  const cancelDeleteQuote = () => {
    setDeleteDialogOpen(false);
    setQuoteToDelete(null);
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

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
            <TableCell>Hành Động</TableCell>
          </TableRow>
        </TableHead>          <TableBody>
          {quotes && quotes.length > 0 ? quotes.map((quote) => (
            <TableRow key={quote.id}>              <TableCell>
              {quote.purchaserName || 'Khách hàng'}
            </TableCell>
              <TableCell>
                {quote.insuredName || 'Người được bảo hiểm'}
              </TableCell>
              <TableCell style={{ textTransform: 'capitalize' }}>
                {quote.insuranceType}
              </TableCell><TableCell>
                {parseInt(quote.coverageAmount).toLocaleString()} VND
              </TableCell>              <TableCell>
                {Number(quote.premium || 0).toLocaleString()} VND
              </TableCell><TableCell>

                <Chip
                  onClick={(e) => handleStatusClick(e, quote.id)}
                  label={getStatusLabel(quote.status)}
                  color={getStatusColor(quote.status) as any}
                  size="small"
                />
              </TableCell>                <TableCell>
                {new Date(quote.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteQuote(quote.id)}
                  size="small"
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={8} style={{ textAlign: 'center' }}>
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
          Từ chối        </MenuItem>
      </Menu>

      {/* Modern Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteQuote}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{
            color: 'error.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <DeleteIcon />
          Xác nhận xóa báo giá
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa báo giá này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={cancelDeleteQuote}
            variant="outlined"
            color="inherit"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={confirmDeleteQuote}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
