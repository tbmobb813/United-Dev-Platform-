import React, { useMemo, useState, ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DataTableColumn<T = Record<string, unknown>> {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  className?: string;
  headerClassName?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DataTableProps<T = Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationConfig | false;
  rowSelection?: RowSelectionConfig<T>;
  rowKey?: string | ((record: T) => string);
  onRow?: (record: T, index: number) => React.HTMLAttributes<unknown>;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  sticky?: boolean;
  emptyText?: React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  onSort?: (field: string, direction: 'asc' | 'desc' | null) => void;
  onFilter?: (filters: Record<string, unknown>) => void;
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  onChange?: (page: number, pageSize: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface RowSelectionConfig<T = Record<string, unknown>> {
  type?: 'checkbox' | 'radio';
  selectedRowKeys?: React.Key[];
  onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  onSelect?: (
    record: T,
    selected: boolean,
    selectedRows: T[],
    nativeEvent: unknown
  ) => void;
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  getCheckboxProps?: (
    record: T
  ) => { disabled?: boolean } & Record<string, unknown>;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  field: string | null;
  direction: SortDirection;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  pagination = false,
  rowSelection,
  rowKey = 'id',
  onRow,
  className = '',
  size = 'medium',
  bordered = false,
  striped = false,
  hoverable = true,
  sticky = false,
  emptyText = 'No data',
  sortable = true,
  filterable: _filterable = false,
  onSort,
  onFilter: _onFilter,
}: DataTableProps<T>) => {
  const [sortState, setSortState] = useState<SortState>({
    field: null,
    direction: null,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    rowSelection?.selectedRowKeys || []
  );

  const getRowKey = (record: T, index: number): React.Key => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    // Coerce to React.Key to satisfy TypeScript; prefer string keys from data but fall back to index
    return (record[rowKey as keyof T] as unknown as React.Key) || index;
  };

  const handleSort = (field: string) => {
    if (!sortable) {
      return;
    }

    let direction: SortDirection = 'asc';

    if (sortState.field === field) {
      if (sortState.direction === 'asc') {
        direction = 'desc';
      } else if (sortState.direction === 'desc') {
        direction = null;
      }
    }

    setSortState({ field: direction ? field : null, direction });

    if (onSort) {
      onSort(field, direction);
    }
  };

  const sortedData = useMemo(() => {
    if (!sortState.field || !sortState.direction || onSort) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortState.field!];
      const bValue = b[sortState.field!];

      if (aValue === bValue) {
        return 0;
      }

      const isAsc = sortState.direction === 'asc';

      if (aValue === null || aValue === undefined) {
        return isAsc ? -1 : 1;
      }
      if (bValue === null || bValue === undefined) {
        return isAsc ? 1 : -1;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return isAsc ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      return isAsc ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [data, sortState, onSort]);

  const paginatedData = useMemo(() => {
    if (!pagination) {
      return sortedData;
    }

    const { current, pageSize } = pagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;

    return sortedData.slice(start, end);
  }, [sortedData, pagination]);

  const handleRowSelection = (
    record: T,
    selected: boolean,
    nativeEvent: React.ChangeEvent<unknown>
  ) => {
    const key = getRowKey(record, 0);
    let newSelectedKeys: React.Key[];

    if (rowSelection?.type === 'radio') {
      newSelectedKeys = selected ? [key] : [];
    } else {
      newSelectedKeys = selected
        ? [...selectedRowKeys, key]
        : selectedRowKeys.filter(k => k !== key);
    }

    setSelectedRowKeys(newSelectedKeys);

    if (rowSelection?.onChange) {
      const selectedRows = data.filter(item =>
        newSelectedKeys.includes(getRowKey(item, 0))
      );
      rowSelection.onChange(newSelectedKeys, selectedRows);
    }

    if (rowSelection?.onSelect) {
      const selectedRows = data.filter(item =>
        newSelectedKeys.includes(getRowKey(item, 0))
      );
      rowSelection.onSelect(
        record,
        selected,
        selectedRows,
        nativeEvent.nativeEvent
      );
    }
  };

  const handleSelectAll = (
    selected: boolean,
    _nativeEvent: React.ChangeEvent<unknown>
  ) => {
    const newSelectedKeys = selected
      ? paginatedData.map((record, index) => getRowKey(record, index))
      : [];

    setSelectedRowKeys(newSelectedKeys);

    if (rowSelection?.onChange) {
      const selectedRows = selected ? [...paginatedData] : [];
      rowSelection.onChange(newSelectedKeys, selectedRows);
    }

    if (rowSelection?.onSelectAll) {
      const selectedRows = selected ? [...paginatedData] : [];
      const changeRows = [...paginatedData];
      rowSelection.onSelectAll(selected, selectedRows, changeRows);
    }
  };

  const renderCell = (
    column: DataTableColumn<T>,
    record: T,
    index: number
  ): ReactNode => {
    if (column.render) {
      const value = column.dataIndex ? record[column.dataIndex] : record;
      return column.render(value, record, index) as ReactNode;
    }

    if (column.dataIndex) {
      return record[column.dataIndex] as unknown as ReactNode;
    }

    return null;
  };

  const getSortIcon = (column: DataTableColumn<T>) => {
    if (!column.sortable && !sortable) {
      return null;
    }

    const isActive = sortState.field === (column.dataIndex || column.key);
    const direction = isActive ? sortState.direction : null;

    return (
      <span className='datatable__sort-icon'>
        <span
          className={`datatable__sort-up ${
            direction === 'asc' ? 'datatable__sort-up--active' : ''
          }`}
        >
          ▲
        </span>
        <span
          className={`datatable__sort-down ${
            direction === 'desc' ? 'datatable__sort-down--active' : ''
          }`}
        >
          ▼
        </span>
      </span>
    );
  };

  const isRowSelected = (record: T, index: number) => {
    const key = getRowKey(record, index);
    return selectedRowKeys.includes(key);
  };

  const isIndeterminate = () => {
    const selectedCount = selectedRowKeys.length;
    const totalCount = paginatedData.length;
    return selectedCount > 0 && selectedCount < totalCount;
  };

  const isAllSelected = () => {
    if (paginatedData.length === 0) {
      return false;
    }
    return paginatedData.every((record, index) => {
      const key = getRowKey(record, index);
      return selectedRowKeys.includes(key);
    });
  };

  const tableClasses = [
    'datatable',
    `datatable--${size}`,
    bordered ? 'datatable--bordered' : '',
    striped ? 'datatable--striped' : '',
    hoverable ? 'datatable--hoverable' : '',
    sticky ? 'datatable--sticky' : '',
    loading ? 'datatable--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (loading) {
    return (
      <div className={tableClasses}>
        <div className='datatable__loading'>
          <div className='datatable__spinner' />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={tableClasses}>
      <div className='datatable__wrapper'>
        <table className='datatable__table'>
          <thead className='datatable__head'>
            <tr>
              {rowSelection && (
                <th className='datatable__selection-cell'>
                  {rowSelection.type !== 'radio' && (
                    <input
                      type='checkbox'
                      checked={isAllSelected()}
                      ref={input => {
                        if (input) {
                          input.indeterminate = isIndeterminate();
                        }
                      }}
                      onChange={e => handleSelectAll(e.target.checked, e)}
                      className='datatable__checkbox'
                    />
                  )}
                </th>
              )}
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`
                    datatable__header-cell
                    ${column.headerClassName || ''}
                    ${
                      column.sortable || sortable
                        ? 'datatable__header-cell--sortable'
                        : ''
                    }
                    ${
                      column.align
                        ? `datatable__header-cell--${column.align}`
                        : ''
                    }
                  `}
                  style={{ width: column.width }}
                  onClick={() => {
                    if (column.sortable || sortable) {
                      handleSort(column.dataIndex || column.key);
                    }
                  }}
                >
                  <div className='datatable__header-content'>
                    <span>{column.title}</span>
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='datatable__body'>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (rowSelection ? 1 : 0)}
                  className='datatable__empty-cell'
                >
                  <div className='datatable__empty'>{emptyText}</div>
                </td>
              </tr>
            ) : (
              paginatedData.map((record, index) => {
                const key = getRowKey(record, index);
                const selected = isRowSelected(record, index);
                const rowProps = onRow ? onRow(record, index) : {};

                return (
                  <tr
                    key={key}
                    className={`
                      datatable__row
                      ${selected ? 'datatable__row--selected' : ''}
                      ${rowProps.className || ''}
                    `}
                    {...rowProps}
                  >
                    {rowSelection && (
                      <td className='datatable__selection-cell'>
                        <input
                          type={rowSelection.type || 'checkbox'}
                          checked={selected}
                          onChange={e =>
                            handleRowSelection(record, e.target.checked, e)
                          }
                          className='datatable__checkbox'
                          {...(rowSelection.getCheckboxProps?.(record) || {})}
                        />
                      </td>
                    )}
                    {columns.map(column => (
                      <td
                        key={column.key}
                        className={`
                          datatable__cell
                          ${column.className || ''}
                          ${
                            column.align
                              ? `datatable__cell--${column.align}`
                              : ''
                          }
                        `}
                      >
                        {renderCell(column, record, index)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className='datatable__pagination'>
          <DataTablePagination {...pagination} />
        </div>
      )}
    </div>
  );
};

interface DataTablePaginationProps extends PaginationConfig {}

const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  current,
  pageSize,
  total,
  showSizeChanger = false,
  showQuickJumper: _showQuickJumper = false,
  showTotal,
  onChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (current - 1) * pageSize + 1;
  const endIndex = Math.min(current * pageSize, total);

  const handlePageChange = (page: number) => {
    if (page !== current && onChange) {
      onChange(page, pageSize);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (newPageSize !== pageSize && onChange) {
      onChange(1, newPageSize);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > 4) {
        pages.push('...');
      }

      // Show pages around current
      const start = Math.max(2, current - 2);
      const end = Math.min(totalPages - 1, current + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < totalPages - 3) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className='datatable-pagination'>
      {showTotal && (
        <div className='datatable-pagination__total'>
          {showTotal(total, [startIndex, endIndex])}
        </div>
      )}

      <div className='datatable-pagination__controls'>
        <button
          type='button'
          disabled={current === 1}
          onClick={() => handlePageChange(current - 1)}
          className='datatable-pagination__button'
        >
          Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            type='button'
            disabled={page === '...'}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            className={`
              datatable-pagination__button
              ${
                typeof page === 'number' && page === current
                  ? 'datatable-pagination__button--active'
                  : ''
              }
              ${page === '...' ? 'datatable-pagination__ellipsis' : ''}
            `}
          >
            {page}
          </button>
        ))}

        <button
          type='button'
          disabled={current === totalPages}
          onClick={() => handlePageChange(current + 1)}
          className='datatable-pagination__button'
        >
          Next
        </button>
      </div>

      {showSizeChanger && (
        <div className='datatable-pagination__size-changer'>
          <select
            value={pageSize}
            onChange={e => handlePageSizeChange(Number(e.target.value))}
            className='datatable-pagination__size-select'
          >
            {[10, 20, 50, 100].map(size => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default DataTable;
