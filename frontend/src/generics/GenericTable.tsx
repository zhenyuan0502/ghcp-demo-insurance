import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel,
    Checkbox,
    IconButton,
    Menu,
    MenuItem,
    Chip,
    Box,
    Typography,
    TablePagination,
    Tooltip,
    alpha,
    useTheme
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { visuallyHidden } from '@mui/utils';

// Generic types for table configuration
export interface TableColumn<T = any> {
    id: keyof T | string;
    label: string;
    minWidth?: number;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    format?: (value: any, row: T) => React.ReactNode;
    render?: (value: any, row: T) => React.ReactNode;
}

export interface TableAction<T = any> {
    label: string;
    icon?: React.ReactNode;
    onClick: (row: T) => void;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    disabled?: (row: T) => boolean;
    hidden?: (row: T) => boolean;
}

export interface GenericTableProps<T = any> {
    data: T[];
    columns: TableColumn<T>[];
    actions?: TableAction<T>[];
    title?: string;
    loading?: boolean;
    emptyMessage?: string;
    selectable?: boolean;
    onSelectionChange?: (selectedRows: T[]) => void;
    pagination?: boolean;
    rowsPerPageOptions?: number[];
    defaultRowsPerPage?: number;
    dense?: boolean;
    stickyHeader?: boolean;
    maxHeight?: number | string;
    onRowClick?: (row: T) => void;
    getRowId?: (row: T) => string | number;
    customRowProps?: (row: T) => object;
}

type Order = 'asc' | 'desc';

function GenericTable<T extends Record<string, any>>({
    data,
    columns,
    actions = [],
    title,
    loading = false,
    emptyMessage = 'Không có dữ liệu',
    selectable = false,
    onSelectionChange,
    pagination = false,
    rowsPerPageOptions = [5, 10, 25, 50],
    defaultRowsPerPage = 10,
    dense = false,
    stickyHeader = false,
    maxHeight,
    onRowClick,
    getRowId = (row: T) => row.id || JSON.stringify(row),
    customRowProps
}: GenericTableProps<T>) {
    const theme = useTheme();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof T | string>('');
    const [selected, setSelected] = useState<(string | number)[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [actionRow, setActionRow] = useState<T | null>(null);

    // Sorting logic
    const handleRequestSort = (property: keyof T | string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedData = React.useMemo(() => {
        if (!orderBy) return data;

        return [...data].sort((a, b) => {
            const aValue = getNestedValue(a, orderBy);
            const bValue = getNestedValue(b, orderBy);

            if (aValue < bValue) {
                return order === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [data, order, orderBy]);

    // Helper function to get nested values
    const getNestedValue = (obj: any, path: string | keyof T): any => {
        return path.toString().split('.').reduce((value, key) => value?.[key], obj);
    };

    // Selection logic
    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = sortedData.map(row => getRowId(row));
            setSelected(newSelected);
            onSelectionChange?.(sortedData);
        } else {
            setSelected([]);
            onSelectionChange?.([]);
        }
    };

    const handleRowSelect = (row: T) => {
        const rowId = getRowId(row);
        const selectedIndex = selected.indexOf(rowId);
        let newSelected: (string | number)[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, rowId);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
        const selectedRows = sortedData.filter(row => newSelected.includes(getRowId(row)));
        onSelectionChange?.(selectedRows);
    };

    const isSelected = (row: T) => selected.indexOf(getRowId(row)) !== -1;

    // Pagination logic
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Actions menu logic
    const handleActionClick = (event: React.MouseEvent<HTMLElement>, row: T) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setActionRow(row);
    };

    const handleActionClose = () => {
        setAnchorEl(null);
        setActionRow(null);
    };

    const handleActionItemClick = (action: TableAction<T>) => {
        if (actionRow) {
            action.onClick(actionRow);
        }
        handleActionClose();
    };

    // Get paginated data
    const paginatedData = pagination
        ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : sortedData;

    const numSelected = selected.length;
    const rowCount = data.length;

    const visibleActions = actionRow
        ? actions.filter(action => !action.hidden?.(actionRow))
        : [];

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            {title && (
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                </Box>
            )}

            <TableContainer sx={{ maxHeight: maxHeight || (stickyHeader ? 440 : undefined) }}>
                <Table
                    stickyHeader={stickyHeader}
                    size={dense ? 'small' : 'medium'}
                    aria-labelledby="tableTitle"
                >
                    <TableHead>
                        <TableRow>
                            {selectable && (
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        indeterminate={numSelected > 0 && numSelected < rowCount}
                                        checked={rowCount > 0 && numSelected === rowCount}
                                        onChange={handleSelectAllClick}
                                        inputProps={{
                                            'aria-label': 'select all items',
                                        }}
                                    />
                                </TableCell>
                            )}

                            {columns.map((column) => (
                                <TableCell
                                    key={column.id.toString()}
                                    align={column.align || 'left'}
                                    style={{ minWidth: column.minWidth }}
                                    sortDirection={orderBy === column.id ? order : false}
                                >
                                    {column.sortable !== false ? (
                                        <TableSortLabel
                                            active={orderBy === column.id}
                                            direction={orderBy === column.id ? order : 'asc'}
                                            onClick={() => handleRequestSort(column.id)}
                                        >
                                            {column.label}
                                            {orderBy === column.id ? (
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            ) : null}
                                        </TableSortLabel>
                                    ) : (
                                        column.label
                                    )}
                                </TableCell>
                            ))}

                            {actions.length > 0 && (
                                <TableCell align="center" style={{ width: 60 }}>
                                    Hành Động
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                                    align="center"
                                >
                                    <Typography>Đang tải...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                                    align="center"
                                >
                                    <Typography color="textSecondary">{emptyMessage}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((row, index) => {
                                const isItemSelected = isSelected(row);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                const rowProps = customRowProps?.(row) || {};

                                return (
                                    <TableRow
                                        hover
                                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                                        role={selectable ? "checkbox" : undefined}
                                        aria-checked={selectable ? isItemSelected : undefined}
                                        tabIndex={-1}
                                        key={getRowId(row)}
                                        selected={isItemSelected}
                                        sx={{
                                            cursor: onRowClick ? 'pointer' : 'default',
                                            ...(isItemSelected && {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                            }),
                                        }}
                                        {...rowProps}
                                    >
                                        {selectable && (
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    onChange={() => handleRowSelect(row)}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                        )}

                                        {columns.map((column) => {
                                            const value = getNestedValue(row, column.id);
                                            return (
                                                <TableCell
                                                    key={column.id.toString()}
                                                    align={column.align || 'left'}
                                                >
                                                    {column.render
                                                        ? column.render(value, row)
                                                        : column.format
                                                            ? column.format(value, row)
                                                            : value
                                                    }
                                                </TableCell>
                                            );
                                        })}

                                        {actions.length > 0 && (
                                            <TableCell align="center">
                                                <Tooltip title="Tùy chọn">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleActionClick(e, row)}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {pagination && (
                <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số hàng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
                    }
                />
            )}

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleActionClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        minWidth: 120,
                    },
                }}
            >
                {visibleActions.map((action, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => handleActionItemClick(action)}
                        disabled={action.disabled?.(actionRow!)}
                        sx={{
                            color: action.color ? `${action.color}.main` : 'inherit',
                        }}
                    >
                        {action.icon && (
                            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                                {action.icon}
                            </Box>
                        )}
                        {action.label}
                    </MenuItem>
                ))}
            </Menu>
        </Paper>
    );
}

export default GenericTable;
