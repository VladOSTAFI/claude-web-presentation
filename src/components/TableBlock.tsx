interface TableBlockProps {
  headers: string[];
  rows: string[][];
}

export default function TableBlock({ headers, rows }: TableBlockProps) {
  return (
    <div
      className="overflow-x-auto rounded-xl border border-border-subtle"
      role="region"
      aria-label="Data table"
      tabIndex={0}
    >
      <table className="w-full min-w-[600px] border-collapse text-left">
        <thead>
          <tr className="bg-secondary">
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="border-b border-border-subtle px-4 py-3 text-sm font-medium text-text-primary md:px-6 md:py-4 md:text-base"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border-subtle last:border-b-0 transition-colors duration-200 hover:bg-secondary/50"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-3 text-sm text-text-secondary md:px-6 md:py-4 md:text-base"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
