import JobCard from "@/components/JobCard";
import SelectJobByCompany from "@/components/SelectJobByCompany";
import styles from "@/styles/Jobs.module.css";
import { Jobs } from "@/utils/types";
import Image from "next/image";
import { ChangeEvent, useMemo, useState } from "react";

interface JobsProps {
  jobs: Jobs[];
  totalJobs: number;
}

const Jobs = ({ jobs, totalJobs }: JobsProps) => {
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [filteredJobsByCompanyName, setFilteredJobsByCompanyName] = useState<
    Jobs[]
  >([]);

  useMemo(() => {
    const filteredJobs = jobs.filter(
      (job) => job.companyName === selectedCompanyName
    );

    setFilteredJobsByCompanyName(filteredJobs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanyName]);

  const companyNames = jobs.map((job) => job.companyName);

  const handleSelecteChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompanyName(event.target.value); // Take the companyName seleceted by user
  };

  const resetFilters = () => {
    setFilteredJobsByCompanyName([]);
    setSelectedCompanyName("");
  };

  // console.log("filteredJobsByCompanyName", filteredJobsByCompanyName);
  // console.log(jobs, totalJobs);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Image
          src="/zippia-icon.webp"
          alt="icon of zippia"
          width={152}
          height={36}
        />
      </header>
      <div className={styles.containerFilters}>
        <SelectJobByCompany
          selectedCompanyName={selectedCompanyName}
          onChange={handleSelecteChange}
          companyNames={companyNames}
        />
        <button className={styles.button} type="button" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>
      <div className={styles.jobsContainer}>
        {filteredJobsByCompanyName.length > 0
          ? filteredJobsByCompanyName.map((job, index) => {
              return index <= 9 ? <JobCard key={job.jobId} {...job} /> : null; // rendering all job cards
            })
          : jobs.map((job, index) => {
              return index <= 9 ? <JobCard key={job.jobId} {...job} /> : null; // rendering all job cards
            })}
      </div>
    </div>
  );
};

export default Jobs;

export async function getServerSideProps() {
  // SSR
  const res = await fetch("https://www.zippia.com/api/jobs/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      companySkills: true,
      dismissedListingHashes: [],
      fetchJobDesc: true,
      jobTitle: "Business Analyst",
      locations: [],
      numJobs: 20,
      previousListingHashes: [],
    }),
  });

  const { jobs, totalJobs } = await res.json();

  return { props: { jobs, totalJobs } };
}
