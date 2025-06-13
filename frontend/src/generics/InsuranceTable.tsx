import React, { useState } from 'react';
import { Menu, MenuItem, Chip } from '@mui/material';
import GenericTable, { TableColumn, TableAction } from './GenericTable';
import {
    formatters,
    getDefaultStatusConfig,
    getInsuranceTypeConfig,
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
    const { language, t } = useLanguage();
    const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

    // Get status and insurance type configs for current language
    const statusConfig = getDefaultStatusConfig(language);
    const insTypeConfig = getInsuranceTypeConfig(language);

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
            render: (value: string) => formatters.status(value, insTypeConfig),
        },
        {
            id: 'coverageAmount',
            label: t.table.columns.coverageAmount,
            align: 'right',
            format: formatters.currency,
        },
        {
            id: 'premium',
            label: t.table.columns.premium,
            align: 'right',
            format: formatters.currency,
        },
        {
            id: 'status',
            label: t.table.columns.status,
            align: 'center',
            sortable: false,
            render: (value: string, row: Quote) => {
                const statusInfo = statusConfig[value] || statusConfig.default;
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
            label: t.table.columns.createdAt,
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
                title={t.table.title}
                loading={loading}
                emptyMessage={t.table.emptyMessage}
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
                            label: t.dashboard.status.pending,
                            color: 'warning',
                            size: 'small',
                            sx: { mr: 1, pointerEvents: 'none' }
                        })}
                        {t.dashboard.statusActions.markPending}
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusUpdate('approved')}>
                        {React.createElement(Chip, {
                            label: t.dashboard.status.approved,
                            color: 'success',
                            size: 'small',
                            sx: { mr: 1, pointerEvents: 'none' }
                        })}
                        {t.dashboard.statusActions.approve}
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusUpdate('rejected')}>
                        {React.createElement(Chip, {
                            label: t.dashboard.status.rejected,
                            color: 'error',
                            size: 'small',
                            sx: { mr: 1, pointerEvents: 'none' }
                        })}
                        {t.dashboard.statusActions.reject}
                    </MenuItem>
                </Menu>
            )}
        </>
    );
};

export default InsuranceTable;
