import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useConfig } from '../config/ConfigContext';

const DataTable = ({ data, onDataChange }) => {
  const config = useConfig();
  const [jsonData, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/dbSetup.json");
      const jsonData = await response.json();
      setData(jsonData);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const response = await fetch(`/api/data/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      onDataChange();
    } else {
      console.error("Error deleting data.");
    }
  };

  const selectRecord = async (id) => {
    const response = await fetch(`/api/data/select/${id}`, {
      method: "PUT",
    });
    if (response.ok) {
      onDataChange();
    } else {
      console.error("Error updating data.");
    }
  };

  const formatColumnName = (col) => {
    return col
      .replace(/[^a-zA-Z]+/g, ' ')
      .toUpperCase()
  };

  return (
    <div className="mt-4 w-full overflow-hidden rounded-lg border border-gray-300">
      <table className="w-full bg-white dark:bg-black">
        <thead>
          <tr>
            {["ID", ...jsonData.map((col) => (col.name)), "Actions"].map((col, index, array) => (
              <th 
                className={`border-b border-r p-2 ${
                  index === 0 ? 'rounded-tl-lg' : ''
                } ${
                  index === array.length - 1 ? 'rounded-tr-lg border-r-0' : ''
                }`}
                key={col}
              >
                {formatColumnName(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((record, rowIndex) => (
              <tr key={record.id}>
                <td className="border-r border-b p-2">{record.id}</td>
                {jsonData.map((col) => {
                  const columnName = col.name.trim();
                  const cellValue = record[columnName] || "";

                  return (
                    <td className="border-r border-b p-2" key={columnName}>
                      {columnName === "password" || columnName === "pw" ? (
                        <span>********</span>
                      ) : (
                        cellValue
                      )}
                    </td>
                  );
                })}
                <td className={`border-b p-2`}>
                  {record.selected === "YES" ? (
                    <Button className="mr-2 bg-red-800 hover:bg-red-500">Selected</Button>
                  ) : (
                    <Button onClick={() => selectRecord(record.id)} className="mr-2">
                      Select
                    </Button>
                  )}
                  <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={config.tableColumns.split(",").length + 2} 
                className="border-b text-center p-2"
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;