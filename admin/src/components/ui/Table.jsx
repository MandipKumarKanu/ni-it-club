import { twMerge } from "tailwind-merge";

const Table = ({ headers, children, className }) => {
  return (
    <div
      className={twMerge("overflow-x-auto border-brutal bg-white", className)}
    >
      <table className="w-full text-left border-collapse">
        <thead className="bg-ni-neon border-b-4 border-black">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="p-4 font-bold text-black border-r-4 border-black last:border-r-0"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children, className }) => (
  <tr
    className={twMerge(
      "border-b-4 border-black last:border-b-0 hover:bg-gray-50",
      className
    )}
  >
    {children}
  </tr>
);

export const TableCell = ({ children, className }) => (
  <td
    className={twMerge(
      "p-4 border-r-4 border-black last:border-r-0",
      className
    )}
  >
    {children}
  </td>
);

export default Table;
