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

const Jobs = ({ jobs }: JobsProps) => {
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [filteredJobsByCompanyName, setFilteredJobsByCompanyName] = useState<
    Jobs[]
  >([]);
  const [filteredRecentJobs, setFilteredRecentJobs] = useState<Jobs[]>([]);

  useMemo(() => {
    const filteredJobs = jobs.filter(
      (job) => job.companyName === selectedCompanyName
    );

    setFilteredJobsByCompanyName(filteredJobs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanyName]);

  const companyNames = jobs.map((job) => job.companyName);

  const getHourDiff = (date1: number, date2: number) => {
    console.log("date", date1, date2);
    const diffInMs = Math.abs(date2 - date1); // diff in milliseconds
    const diffInHours = diffInMs / (1000 * 60 * 60); // diff in hours
    return diffInHours;
  };

  const resetFilters = () => {
    setFilteredRecentJobs([]);
    setFilteredJobsByCompanyName([]);
    setSelectedCompanyName("");
  };

  const filterByRecentJobs = () => {
    resetFilters();
    const now = new Date().getTime();
    const recentJobs = jobs.filter((job) => {
      const postingDate = new Date(job.postingDate).getTime();
      if (getHourDiff(now, postingDate) <= 168) {
        // here the code verify if the diff between today and posting job date is minor or equal 7 days
        return job;
      }
    });

    setFilteredRecentJobs(recentJobs);
  };

  const handleSelecteChange = (event: ChangeEvent<HTMLSelectElement>) => {
    resetFilters();
    setSelectedCompanyName(event.target.value); // Take the companyName seleceted by user
  };

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
        <button
          className={styles.recentJobsButton}
          type="button"
          onClick={filterByRecentJobs}
        >
          Get recent jobs
        </button>
        <button className={styles.button} type="button" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>
      <div className={styles.jobsContainer}>
        {filteredRecentJobs.length > 0
          ? filteredRecentJobs.map((job, index) => {
              return index <= 9 ? <JobCard key={job.jobId} {...job} /> : null; // rendering recents posted jobs
            })
          : filteredJobsByCompanyName.length > 0
          ? filteredJobsByCompanyName.map((job, index) => {
              return index <= 9 ? <JobCard key={job.jobId} {...job} /> : null; // if the user filer by companyName
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
