import { ReactNode } from 'react';

interface ResponsiveTableProps<T> {
  data: T[];
  // Desktop: standard table
  tableView: ReactNode;
  // Mobile: card view
  mobileCardRender: (item: T) => ReactNode;
}

export function ResponsiveTable<T>({
  data,
  tableView,
  mobileCardRender
}: ResponsiveTableProps<T>) {
  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            {mobileCardRender(item)}
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        {tableView}
      </div>
    </>
  );
}
