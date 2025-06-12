import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Snackbar,
    Alert,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { InsuranceTable, Quote } from './index';

// Mock data for demonstration
const mockQuotes: Quote[] = [
    {
        id: 1,
        purchaserName: 'Khách hàng NĐ - Tuổi 222 - Nghề nghiệp Giáo viên',
        insuredName: 'Khách hàng NĐ - Tuổi 222 - Nghề nghiệp Giáo viên',
        insuranceType: 'travel',
        coverageAmount: '1000000000',
        premium: '5460000',
        status: 'pending',
        createdAt: '2025-06-12',
    },
    {
        id: 2,
        purchaserName: 'Phạm Thu Duyên',
        insuredName: 'Phạm Thu Duyên',
        insuranceType: 'health',
        coverageAmount: '1500000000',
        premium: '10200000',
        status: 'pending',
        createdAt: '2025-06-12',
    },
    {
        id: 3,
        purchaserName: 'Hoàng Vân Em',
        insuredName: 'Hoàng Vân Em',
        insuranceType: 'life',
        coverageAmount: '3000000000',
        premium: '12750000',
        status: 'approved',
        createdAt: '2025-06-12',
    },
    {
        id: 4,
        purchaserName: 'Đỗ Thị Phương',
        insuredName: 'Đỗ Thị Phương',
        insuranceType: 'auto',
        coverageAmount: '800000000',
        premium: '10200000',
        status: 'rejected',
        createdAt: '2025-06-12',
    },
    {
        id: 5,
        purchaserName: 'Nguyễn Văn An',
        insuredName: 'Nguyễn Văn An',
        insuranceType: 'life',
        coverageAmount: '2000000000',
        premium: '8500000',
        status: 'approved',
        createdAt: '2025-06-12',
    },
];

const DashboardExample: React.FC = () => {
    const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [quoteToDelete, setQuoteToDelete] = useState<number | null>(null);
    const [selectedQuotes, setSelectedQuotes] = useState<Quote[]>([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    // Simulate loading data
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleStatusChange = async (quoteId: number, status: string) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setQuotes(quotes.map(quote =>
                quote.id === quoteId
                    ? { ...quote, status: status }
                    : quote
            ));

            showSnackbar('Cập nhật trạng thái thành công', 'success');
        } catch (error) {
            console.error('Error updating quote status:', error);
            showSnackbar('Có lỗi xảy ra khi cập nhật trạng thái', 'error');
        }
    };

    const handleDeleteQuote = (quoteId: number) => {
        setQuoteToDelete(quoteId);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteQuote = async () => {
        if (!quoteToDelete) return;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setQuotes(quotes.filter(quote => quote.id !== quoteToDelete));
            showSnackbar('Xóa báo giá thành công', 'success');
        } catch (error) {
            console.error('Error deleting quote:', error);
            showSnackbar('Có lỗi xảy ra khi xóa báo giá', 'error');
        } finally {
            setDeleteDialogOpen(false);
            setQuoteToDelete(null);
        }
    };

    const cancelDeleteQuote = () => {
        setDeleteDialogOpen(false);
        setQuoteToDelete(null);
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleEditQuote = (quote: Quote) => {
        // Navigate to edit form or open edit modal
        console.log('Edit quote:', quote);
        showSnackbar(`Mở form chỉnh sửa cho ${quote.purchaserName}`, 'success');
    };

    const handleViewQuote = (quote: Quote) => {
        // Navigate to detail view or open detail modal
        console.log('View quote:', quote);
        showSnackbar(`Xem chi tiết báo giá ${quote.id}`, 'success');
    };

    const handleSelectionChange = (selectedQuotes: Quote[]) => {
        setSelectedQuotes(selectedQuotes);
        console.log('Selected quotes:', selectedQuotes);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Bảng Điều Khiển - Generic Table Demo
            </Typography>

            {selectedQuotes.length > 0 && (
                <Box sx={{ mb: 2 }}>
                    <Alert severity="info">
                        Đã chọn {selectedQuotes.length} báo giá
                    </Alert>
                </Box>
            )}

            <Card>
                <CardContent>
                    <InsuranceTable
                        quotes={quotes}
                        loading={loading}
                        selectable={true}
                        onSelectionChange={handleSelectionChange}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteQuote}
                        onEdit={handleEditQuote}
                        onView={handleViewQuote}
                    />
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
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

export default DashboardExample;
