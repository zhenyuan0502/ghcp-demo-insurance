import React, { useState } from 'react';
import { Menu, MenuItem, Chip } from '@mui/material';
import GenericTable, { TableColumn, TableAction } from './GenericTable';
import {
    formatters,
    defaultStatusConfig,
    insuranceTypeConfig,
    createCommonActions,
    tablePresets
} from './tableUtils';
import { useLanguage } from '../i18n/LanguageContext';

// Insurance Quote interface
export interface Quote {
    id: number;
    purchaserName?: string;
    insuredName?: string;
    insuranceType: string;
    coverageAmount: string;
    premium: number | string;
    status: string;
    createdAt: string;
}

export interface InsuranceTableProps {
    quotes: Quote[];
    onStatusChange?: (quoteId: number, status: string) => void;
    onDelete?: (quoteId: number) => void;
    onEdit?: (quote: Quote) => void;
    onView?: (quote: Quote) => void;
    loading?: boolean;
    selectable?: boolean;
    onSelectionChange?: (selectedQuotes: Quote[]) => void;
}

const InsuranceTable: React.FC<InsuranceTableProps> = ({
    quotes,
    onStatusChange,
    onDelete,
    onEdit,
    onView,
    loading = false,
    selectable = false,
    onSelectionChange,
}) => {
    const { language } = useLanguage();
    const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

    // Handle status change click
    const handleStatusClick = (event: React.MouseEvent<HTMLElement>, quote: Quote) => {
        event.stopPropagation();
        setStatusMenuAnchor(event.currentTarget);
        setSelectedQuote(quote);
    };

    const handleStatusClose = () => {
        setStatusMenuAnchor(null);
        setSelectedQuote(null);
    };

    const handleStatusUpdate = (status: string) => {
        if (selectedQuote && onStatusChange) {
            onStatusChange(selectedQuote.id, status);
        }
        handleStatusClose();
    };

    // Define custom columns with status click handler
    const columns: TableColumn<Quote>[] = [
        {
            id: 'purchaserName',
            label: 'Tên bên mua bảo hiểm',
            render: (value: any) => value || 'Khách hàng',
        },
        {
            id: 'insuredName',
            label: 'Tên được bảo hiểm',
            render: (value: any) => value || 'Người được bảo hiểm',
        },
        {
            id: 'insuranceType',
            label: 'Loại Bảo Hiểm',
            render: (value: string) => formatters.status(value, insuranceTypeConfig),
        },
        {
            id: 'coverageAmount',
            label: 'Số Tiền Bảo Hiểm',
            align: 'right',
            format: formatters.currency,
        },
        {
            id: 'premium',
            label: 'Phí Bảo Hiểm',
            align: 'right',
            format: formatters.currency,
        },
        {
            id: 'status',
            label: 'Trạng Thái',
            align: 'center',
            sortable: false,
            render: (value: string, row: Quote) => {
                const statusInfo = defaultStatusConfig[value] || defaultStatusConfig.default;
                return React.createElement(Chip, {
                    onClick: onStatusChange ? (e: React.MouseEvent<HTMLElement>) => handleStatusClick(e, row) : undefined,
                    label: statusInfo.label,
                    color: statusInfo.color as any,
                    size: 'small',
                    sx: { cursor: onStatusChange ? 'pointer' : 'default' }
                });
            },
        },
        {
            id: 'createdAt',
            label: 'Ngày',
            format: formatters.date,
        },
    ];

    // Define actions
    const actions: TableAction<Quote>[] = createCommonActions(
        language,
        onEdit,
        onDelete ? (quote: Quote) => onDelete(quote.id) : undefined,
        onView
    );

    return (
        <>
            <GenericTable
                data={quotes}
                columns={columns}
                actions={actions}
                title="Danh sách báo giá bảo hiểm"
                loading={loading}
                emptyMessage="Không có dữ liệu báo giá"
                selectable={selectable}
                onSelectionChange={onSelectionChange}
                {...tablePresets.standard}
            />

            {/* Status Change Menu */}
            {onStatusChange && (
                <Menu
                    anchorEl={statusMenuAnchor}
                    open={Boolean(statusMenuAnchor)}
                    onClose={handleStatusClose}
                >
                    <MenuItem onClick={() => handleStatusUpdate('pending')}>
                        {React.createElement(Chip, {
                            label: 'Chờ duyệt',
                            color: 'warning',
                            size: 'small',
                            sx: { mr: 1, pointerEvents: 'none' }
                        })}
                        Chờ duyệt
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusUpdate('approved')}>
                        {React.createElement(Chip, {
                            label: 'Đã duyệt',
                            color: 'success',
                            size: 'small',
                            sx: { mr: 1, pointerEvents: 'none' }
                        })}
                        Duyệt
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusUpdate('rejected')}>
                        {React.createElement(Chip, {
                            label: 'Từ chối',
                            color: 'error',
                            size: 'small',
                            sx: { mr: 1, pointerEvents: 'none' }
                        })}
                        Từ chối
                    </MenuItem>
                </Menu>
            )}
        </>
    );
};

export default InsuranceTable;
