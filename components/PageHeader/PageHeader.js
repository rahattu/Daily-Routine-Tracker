import logo from "@/public/prep_stone_logo.png";
import styles from "@/styles/PageHeader.module.css";
import Image from "next/image";

const PageHeader = ({ text = "Daily Life Planner" }) => {
  return (
    <div className={styles.headWrapper}>
      <div className={styles.logoWrapper}>
        <Image src={logo} alt="Prep stone logo" layout="responsive" />
      </div>
      <h2>{text}</h2>
    </div>
  );
};

export default PageHeader;
