import JobCard from "@/components/JobCard";
import styles from "@/styles/Jobs.module.css";
import { Jobs } from "@/utils/types";
import Image from "next/image";

interface JobsProps {
  jobs: Jobs[];
  totalJobs: number;
}

const Jobs = ({ jobs, totalJobs }: JobsProps) => {
  console.log(jobs, totalJobs);

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
      <div className={styles.jobsContainer}>
        {jobs.map((job, index) => {
          return index <= 9 ? <JobCard key={job.jobId} {...job} /> : null;
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
