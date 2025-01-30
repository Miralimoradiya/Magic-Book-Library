// TableComponent.jsx
import React from "react";
import FormatDate from "./FormatDate";
import NodataBook from "../resusable/NodataBook"

const TableComponent = ({ data, columns }) => {
  const styles = {
    tableContainer: {
      overflowX: "auto",
    },
    table: {
      textAlign: "center",
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0",
      border: "2px solid #ccc",
      borderRadius: "12px",
    },
    header: {
      padding: "12px 16px",
      textAlign: "center",
      borderBottom: "2px solid #ccc",
      borderRight: "2px solid #ccc",
      fontWeight: "bold",
    },
    headerLast: {
      padding: "12px 16px",
      textAlign: "left",
      borderRight: "none",
      borderBottom: "2px solid #ccc",
      fontWeight: "bold",
    },
    cell: {
      padding: "12px 16px",
      borderBottom: "2px solid #ccc",
      borderRight: "2px solid #ccc",
      wordWrap: "break-word",
      maxWidth: "176px",
    },
    cellLast: {
      padding: "12px 16px",
      borderBottom: "2px solid #ccc",
      borderRight: "none",
      wordWrap: "break-word",
      maxWidth: "176px",
    },
    row: {
      cursor: "pointer",
    },
    rowHover: {
      backgroundColor: "#f0f0f0",
    },
  };

  if (!data || data.length === 0) {
    return  <>
    <NodataBook
                noDataMessage="No Data Available"
              />
    </> ;
  }
  const lastRowIndex = data.length - 1;
  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col, colIndex) => (
              <th
                key={col.key}
                style={
                  colIndex === columns.length - 1
                    ? styles.headerLast
                    : styles.header
                }
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              style={rowIndex % 2 === 0 ? styles.row : {}}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.rowHover.backgroundColor)
              }
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={col.key}
                  style={
                    rowIndex === lastRowIndex
                      ? colIndex === columns.length - 1
                        ? {
                            ...styles.cellLast,
                            borderBottom: "none",
                            borderRight: "none",
                          }
                        : { ...styles.cell, borderBottom: "none" }
                      : colIndex === columns.length - 1
                      ? styles.cellLast
                      : styles.cell
                  }
                >
                  {col.render ? (
                    col.render(item)
                  ) : col.key.includes("date") ? (
                    <FormatDate dateString={item[col.key]} />
                  ) : (
                    item[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
