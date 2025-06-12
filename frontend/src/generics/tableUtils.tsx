import React from 'react';
import { Chip, Typography } from '@mui/material';
import { TableColumn, TableAction } from './GenericTable';

// Status configuration interface
export interface StatusConfig {
    [key: string]: {
        label: string;
        color: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
        variant?: 'filled' | 'outlined';
    };
}

// Default status configuration for insurance quotes
export const defaultStatusConfig: StatusConfig = {
    pending: {
        label: 'Chờ duyệt',
        color: 'warning',
    },
    approved: {
        label: 'Đã duyệt',
        color: 'success',
    },
    rejected: {
        label: 'Từ chối',
        color: 'error',
    },
    expired: {
        label: 'Hết hạn',
        color: 'default',
    },
    default: {
        label: 'Không xác định',
        color: 'default',
    },
};

// Insurance type configuration
export const insuranceTypeConfig: StatusConfig = {
    health: {
        label: 'Sức khỏe',
        color: 'success',
        variant: 'outlined',
    },
    life: {
        label: 'Nhân thọ',
        color: 'primary',
        variant: 'outlined',
    },
    auto: {
        label: 'Xe cộ',
        color: 'info',
        variant: 'outlined',
    },
    home: {
        label: 'Nhà ở',
        color: 'warning',
        variant: 'outlined',
    },
    travel: {
        label: 'Du lịch',
        color: 'secondary',
        variant: 'outlined',
    },
    default: {
        label: 'Khác',
        color: 'default',
        variant: 'outlined',
    },
};

// Common formatters
export const formatters = {
    currency: (value: any): string => {
        if (value === null || value === undefined) return '0 VND';
        const numValue = typeof value === 'string' ? parseInt(value) : value;
        return `${numValue.toLocaleString()} VND`;
    },

    date: (value: any): string => {
        if (!value) return '';
        return new Date(value).toLocaleDateString('vi-VN');
    },

    datetime: (value: any): string => {
        if (!value) return '';
        return new Date(value).toLocaleString('vi-VN');
    },

    status: (value: string, statusConfig?: StatusConfig): React.ReactNode => {
        const config = statusConfig || defaultStatusConfig;
        const statusInfo = config[value] || config.default;

        return (
            <Chip
                label={statusInfo.label}
                color={statusInfo.color as any}
                size="small"
                variant={statusInfo.variant || 'filled'}
            />
        );
    },

    percentage: (value: any): string => {
        if (value === null || value === undefined) return '0%';
        return `${Number(value).toFixed(2)}%`;
    },

    truncate: (value: any, maxLength: number = 50): React.ReactNode => {
        if (!value) return '';
        const str = value.toString();
        if (str.length <= maxLength) return str;

        return (
            <Typography
                variant="body2"
                title={str}
                sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: maxLength * 8, // Approximate width
                }}
            >
                {str.substring(0, maxLength)}...
            </Typography>
        );
    },

    boolean: (value: any): React.ReactNode => {
        return (
            <Chip
                label={value ? 'Có' : 'Không'}
                color={value ? 'success' : 'default'}
                size="small"
                variant="outlined"
            />
        );
    },
};

// Pre-configured column sets for common use cases
export const createInsuranceColumns = (): TableColumn[] => [
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
        align: 'right' as const,
        format: formatters.currency,
    },
    {
        id: 'premium',
        label: 'Phí Bảo Hiểm',
        align: 'right' as const,
        format: formatters.currency,
    },
    {
        id: 'status',
        label: 'Trạng Thái',
        align: 'center' as const,
        render: (value: string) => formatters.status(value, defaultStatusConfig),
        sortable: false,
    },
    {
        id: 'createdAt',
        label: 'Ngày',
        format: formatters.date,
    },
];

// Helper function to create common actions
export const createCommonActions = <T,>(
    onEdit?: (row: T) => void,
    onDelete?: (row: T) => void,
    onView?: (row: T) => void,
    customActions?: TableAction<T>[]
): TableAction<T>[] => {
    const actions: TableAction<T>[] = [];

    if (onView) {
        actions.push({
            label: 'Xem chi tiết',
            onClick: onView,
            color: 'info',
        });
    }

    if (onEdit) {
        actions.push({
            label: 'Chỉnh sửa',
            onClick: onEdit,
            color: 'primary',
        });
    }

    if (onDelete) {
        actions.push({
            label: 'Xóa',
            onClick: onDelete,
            color: 'error',
        });
    }

    if (customActions) {
        actions.push(...customActions);
    }

    return actions;
};

// Table configuration presets
export const tablePresets = {
    dense: {
        dense: true,
        pagination: true,
        defaultRowsPerPage: 25,
        rowsPerPageOptions: [10, 25, 50, 100],
    },

    standard: {
        dense: false,
        pagination: true,
        defaultRowsPerPage: 10,
        rowsPerPageOptions: [5, 10, 25, 50],
    },

    compact: {
        dense: true,
        pagination: false,
        stickyHeader: true,
        maxHeight: 400,
    },

    fullScreen: {
        dense: false,
        pagination: true,
        stickyHeader: true,
        maxHeight: '70vh',
        defaultRowsPerPage: 50,
        rowsPerPageOptions: [25, 50, 100, 200],
    },
};
