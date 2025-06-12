// Export main components
export { default as GenericTable } from './GenericTable';
export type { TableColumn, TableAction, GenericTableProps } from './GenericTable';

export { default as InsuranceTable } from './InsuranceTable';
export type { Quote, InsuranceTableProps } from './InsuranceTable';

// Export utilities
export {
    formatters,
    defaultStatusConfig,
    insuranceTypeConfig,
    createInsuranceColumns,
    createCommonActions,
    tablePresets
} from './tableUtils';
export type { StatusConfig } from './tableUtils';
