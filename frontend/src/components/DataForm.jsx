import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import validator from "validator";
import { apiCall } from '../lib/api';

const DataForm = ({ onDataAdded }) => {
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});
  const object = data.reduce((obj, value) => {
    obj[value.name] = "";
    return obj;
  }, {});
  const [formData, setFormData] = useState(object);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/dbSetup.json"); // Note the leading '/'
      const jsonData = await response.json();
      setData(jsonData);
    };

    fetchData();
  }, []);

  const handleChange = (e, options, isOptional = false) => {
    const { name, value } = e.target;
    const newErrors = {};

    // Validate - skip validation if field is optional and empty
    if (value.trim() !== '' || !isOptional) {
      if (!validator[options.name](value, options.options)) {
        newErrors[name] = "Invalid value";
      } else {
        newErrors[name] = "";
      }
    } else {
      newErrors[name] = "";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiCall(`/api/data`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      onDataAdded(); // Notify the table to refresh
      setFormData(object);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  const formatColumnName = (col) => {
    return col
      .replace(/[^a-zA-Z]+/g, " ") // Replace non-letter characters with spaces
      .toUpperCase();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {data.map((col) => {
        var formValue = formData[col.name];
        var type = "text";
        if (col.name === "password" || col.name === "pw") {
          type = "password";
        }
        
        const isOptional = col.optional === true;
        const placeholder = isOptional 
          ? `${formatColumnName(col.name)} (Optional)`
          : formatColumnName(col.name);
          
        return (
          <div key={col.name}>
            <Input
              required={!isOptional}
              type={type}
              key={col.name}
              name={col.name}
              placeholder={placeholder}
              value={formValue || ""}
              onChange={(e) => {
                handleChange(e, col.validator, isOptional);
              }}
            />{errors[col.name] && <span className="text-red-500 font-semibold">{errors[col.name]}</span>}
          </div>
        );
      })}
      <Button type="submit">Add Connection</Button>
    </form>
  );
};

export default DataForm;
