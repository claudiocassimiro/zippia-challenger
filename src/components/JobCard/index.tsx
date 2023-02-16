import styles from "./styles.module.css";
import { Jobs } from "@/utils/types";
import { useWindowSize } from "@/utils/helpers";

const JobCard = (job: Jobs) => {
  const { isMobile } = useWindowSize();
  const numberOfCharToSlice = isMobile ? 112 : 254;

  function removeTags(str: string) {
    // Function thats remove html tags from strings
    return str.replace(/<[^>]*>/g, "");
  }

  return (
    <div className={styles.jobCard}>
      <p className={styles.jobTitle}>{job.jobTitle}</p>
      <p className={styles.jobCompany}>{job.companyName}</p>
      <p className={styles.jobDescription}>{`${removeTags(
        job.jobDescription
      ).slice(0, numberOfCharToSlice)}...`}</p>
    </div>
  );
};

export default JobCard;
