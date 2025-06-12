# Generic Table Components

This folder contains reusable table components for the insurance application. The components are built with Material-UI and TypeScript, providing a flexible and extensible table system.

## Components

### GenericTable
The main generic table component that can be configured for any data type.

**Features:**
- Sortable columns
- Pagination
- Row selection (single/multiple)
- Custom actions menu
- Loading states
- Empty states
- Sticky headers
- Dense/standard layouts
- Custom row rendering
- Vietnamese localization

### InsuranceTable
A specialized table component for insurance quotes that extends GenericTable with insurance-specific features.

**Features:**
- Pre-configured columns for insurance data
- Status change functionality
- Type-safe insurance quote interface
- Custom status styling

### tableUtils
Utility functions and configurations for table components.

**Includes:**
- Common formatters (currency, date, percentage, etc.)
- Status configurations
- Pre-built column definitions
- Action helpers
- Table presets

## Usage Examples

### Basic Generic Table

```tsx
import { GenericTable, TableColumn } from '../generics';

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

const columns: TableColumn<User>[] = [
  { id: 'name', label: 'Tên' },
  { id: 'email', label: 'Email' },
  { 
    id: 'status', 
    label: 'Trạng thái',
    render: (value) => <Chip label={value} />
  },
];

<GenericTable
  data={users}
  columns={columns}
  pagination={true}
  selectable={true}
  onSelectionChange={(selected) => console.log(selected)}
/>
```

### Insurance Table

```tsx
import { InsuranceTable, Quote } from '../generics';

const quotes: Quote[] = [
  {
    id: 1,
    purchaserName: 'Nguyễn Văn A',
    insuranceType: 'health',
    coverageAmount: '1000000000',
    premium: '5000000',
    status: 'pending',
    createdAt: '2025-06-12',
  }
];

<InsuranceTable
  quotes={quotes}
  onStatusChange={(id, status) => updateStatus(id, status)}
  onEdit={(quote) => editQuote(quote)}
  onDelete={(id) => deleteQuote(id)}
  loading={loading}
/>
```

### Custom Formatters

```tsx
import { formatters } from '../generics';

// Use built-in formatters
const columns = [
  {
    id: 'amount',
    label: 'Số tiền',
    format: formatters.currency,
  },
  {
    id: 'date',
    label: 'Ngày',
    format: formatters.date,
  },
  {
    id: 'isActive',
    label: 'Kích hoạt',
    render: formatters.boolean,
  },
];
```

### Table Presets

```tsx
import { tablePresets } from '../generics';

// Use predefined configurations
<GenericTable
  data={data}
  columns={columns}
  {...tablePresets.dense} // High-density table
/>

<GenericTable
  data={data}
  columns={columns}
  {...tablePresets.fullScreen} // Full-screen table
/>
```

### Custom Actions

```tsx
import { createCommonActions } from '../generics';

const actions = createCommonActions(
  (row) => editItem(row),      // Edit action
  (row) => deleteItem(row),    // Delete action
  (row) => viewItem(row),      // View action
  [
    // Custom actions
    {
      label: 'Download',
      onClick: (row) => downloadItem(row),
      color: 'info',
    }
  ]
);

<GenericTable
  data={data}
  columns={columns}
  actions={actions}
/>
```

## Configuration Options

### GenericTableProps

```tsx
interface GenericTableProps<T> {
  data: T[];                           // Table data
  columns: TableColumn<T>[];           // Column definitions
  actions?: TableAction<T>[];          // Row actions
  title?: string;                      // Table title
  loading?: boolean;                   // Loading state
  emptyMessage?: string;               // Empty state message
  selectable?: boolean;                // Enable row selection
  onSelectionChange?: (rows: T[]) => void; // Selection callback
  pagination?: boolean;                // Enable pagination
  rowsPerPageOptions?: number[];       // Page size options
  defaultRowsPerPage?: number;         // Default page size
  dense?: boolean;                     // Dense layout
  stickyHeader?: boolean;              // Sticky header
  maxHeight?: number | string;         // Table height
  onRowClick?: (row: T) => void;       // Row click handler
  getRowId?: (row: T) => string | number; // Row ID generator
  customRowProps?: (row: T) => object; // Custom row props
}
```

### TableColumn

```tsx
interface TableColumn<T> {
  id: keyof T | string;                // Column identifier
  label: string;                       // Column header
  minWidth?: number;                   // Minimum width
  align?: 'left' | 'center' | 'right'; // Text alignment
  sortable?: boolean;                  // Enable sorting
  format?: (value: any, row: T) => React.ReactNode; // Value formatter
  render?: (value: any, row: T) => React.ReactNode; // Custom renderer
}
```

### TableAction

```tsx
interface TableAction<T> {
  label: string;                       // Action label
  icon?: React.ReactNode;              // Action icon
  onClick: (row: T) => void;           // Click handler
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  disabled?: (row: T) => boolean;      // Conditional disable
  hidden?: (row: T) => boolean;        // Conditional hide
}
```

## Status Configurations

### Default Status Config
- `pending`: Chờ duyệt (warning)
- `approved`: Đã duyệt (success)
- `rejected`: Từ chối (error)
- `expired`: Hết hạn (default)

### Insurance Type Config
- `health`: Sức khỏe (success)
- `life`: Nhân thọ (primary)
- `auto`: Xe cộ (info)
- `home`: Nhà ở (warning)
- `travel`: Du lịch (secondary)

## Table Presets

### Dense
- High-density layout
- 25 rows per page
- Pagination enabled

### Standard
- Normal density
- 10 rows per page
- Pagination enabled

### Compact
- Dense layout
- No pagination
- Sticky header
- Fixed height (400px)

### Full Screen
- Normal density
- 50 rows per page
- Sticky header
- 70vh height

## File Structure

```
generics/
├── GenericTable.tsx          # Main table component
├── InsuranceTable.tsx        # Insurance-specific table
├── tableUtils.tsx            # Utilities and formatters
├── DashboardExample.tsx      # Usage example
├── index.ts                  # Exports
└── README.md                 # This file
```

## Contributing

When adding new features:

1. Keep the GenericTable component generic and reusable
2. Add specialized features to domain-specific components (like InsuranceTable)
3. Add new formatters and utilities to tableUtils
4. Update this README with new examples
5. Ensure TypeScript types are properly defined
6. Test with different data sets and configurations
