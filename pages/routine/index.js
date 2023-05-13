import RoutineInputForm from "@/components/AdditionalData/RoutineInputForm";
import styles from "@/styles/Home.module.css";
import Head from "next/head";

export default function RoutinePage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Routine App - Routine</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <RoutineInputForm />
      </main>
    </div>
  );
}
