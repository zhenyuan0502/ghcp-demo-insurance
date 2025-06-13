import React from 'react';
import { Chip, Typography } from '@mui/material';
import { TableColumn, TableAction } from './GenericTable';
import { getTranslations, Language } from '../i18n/translations';

// Status configuration interface
export interface StatusConfig {
    [key: string]: {
        label: string;
        color: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
        variant?: 'filled' | 'outlined';
    };
}

// Default status configuration for insurance quotes - uses dictionary for translations
export const getDefaultStatusConfig = (language: Language): StatusConfig => {
    const t = getTranslations(language);
    return {
        pending: {
            label: t.dashboard.status.pending,
            color: 'warning',
        },
        approved: {
            label: t.dashboard.status.approved,
            color: 'success',
        },
        rejected: {
            label: t.dashboard.status.rejected,
            color: 'error',
        },
        expired: {
            label: t.dashboard.status.expired,
            color: 'default',
        },
        default: {
            label: t.dashboard.status.unknown,
            color: 'default',
        },
    };
};

// Insurance type configuration generator - uses dictionary for translations
export const getInsuranceTypeConfig = (language: Language): StatusConfig => {
    const t = getTranslations(language);
    return {
        health: {
            label: t.insuranceTypes.health,
            color: 'success',
            variant: 'outlined',
        },
        life: {
            label: t.insuranceTypes.life,
            color: 'primary',
            variant: 'outlined',
        },
        auto: {
            label: t.insuranceTypes.auto,
            color: 'info',
            variant: 'outlined',
        },
        home: {
            label: t.insuranceTypes.home,
            color: 'warning',
            variant: 'outlined',
        },
        travel: {
            label: t.insuranceTypes.travel,
            color: 'secondary',
            variant: 'outlined',
        },
        default: {
            label: t.insuranceTypes.other,
            color: 'default',
            variant: 'outlined',
        },
    };
};

// Default configurations for backward compatibility (using Vietnamese as default)
export const defaultStatusConfig: StatusConfig = getDefaultStatusConfig('vi');
export const insuranceTypeConfig: StatusConfig = getInsuranceTypeConfig('vi');

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

    // Boolean formatter that accepts language for translations
    boolean: (value: any, language: Language = 'vi'): React.ReactNode => {
        const t = getTranslations(language);
        return (
            <Chip
                label={value ? t.table.boolean.yes : t.table.boolean.no}
                color={value ? 'success' : 'default'}
                size="small"
                variant="outlined"
            />
        );
    },
};

// Pre-configured column sets for common use cases - uses dictionary for translations
export const createInsuranceColumns = (language: Language = 'vi'): TableColumn[] => {
    const t = getTranslations(language);
    const insuranceTypeConfig = getInsuranceTypeConfig(language);
    
    return [
        {
            id: 'purchaserName',
            label: t.table.columns.purchaserName,
            render: (value: any) => value || t.table.defaultValues.customer,
        },
        {
            id: 'insuredName',
            label: t.table.columns.insuredName,
            render: (value: any) => value || t.table.defaultValues.insuredPerson,
        },
        {
            id: 'insuranceType',
            label: t.table.columns.insuranceType,
            render: (value: string) => formatters.status(value, insuranceTypeConfig),
        },
        {
            id: 'coverageAmount',
            label: t.table.columns.coverageAmount,
            align: 'right' as const,
            format: formatters.currency,
        },
        {
            id: 'premium',
            label: t.table.columns.premium,
            align: 'right' as const,
            format: formatters.currency,
        },
        {
            id: 'status',
            label: t.table.columns.status,
            align: 'center' as const,
            render: (value: string) => formatters.status(value, getDefaultStatusConfig(language)),
            sortable: false,
        },
        {
            id: 'createdAt',
            label: t.table.columns.createdAt,
            format: formatters.date,
        },
    ];
};

// Helper function to create common actions - uses dictionary for translations
export const createCommonActions = <T,>(
    language: Language = 'vi',
    onEdit?: (row: T) => void,
    onDelete?: (row: T) => void,
    onView?: (row: T) => void,
    customActions?: TableAction<T>[]
): TableAction<T>[] => {
    const t = getTranslations(language);
    const actions: TableAction<T>[] = [];

    if (onView) {
        actions.push({
            label: t.table.actions.viewDetails,
            onClick: onView,
            color: 'info',
        });
    }

    if (onEdit) {
        actions.push({
            label: t.table.actions.edit,
            onClick: onEdit,
            color: 'primary',
        });
    }

    if (onDelete) {
        actions.push({
            label: t.table.actions.delete,
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
