import { ChangeEvent } from "react";
import styles from "./styles.module.css";

interface SelectJobByCompanyProps {
  selectedCompanyName: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  companyNames: string[];
}

const SelectJobByCompany = ({
  selectedCompanyName,
  onChange,
  companyNames,
}: SelectJobByCompanyProps) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>Select an option:</label>
      <select
        className={styles.select}
        value={selectedCompanyName}
        onChange={onChange}
      >
        <option value="">Select a company</option>
        {companyNames.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectJobByCompany;
