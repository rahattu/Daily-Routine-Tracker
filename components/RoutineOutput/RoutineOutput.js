import PageHeader from "@/components/PageHeader/PageHeader";
import qr_code from "@/public/Cover.jpg";
import moto from "@/public/moto_2.png";
import styles from "@/styles/RoutineOutputForm.module.css";
import { getDataFromStorage } from "@/utils/temporarySave";
import { militaryTimeToStandardTime } from "@/utils/timeConversion";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdArrowForward, MdDownload } from "react-icons/md";
import ReactToPrint from "react-to-print";
import { generateRoutineData } from "./algo";

const RoutineOutput = () => {
  const ref = useRef();
  const initialData = {
    name: "",
    target: "",
    wakingUpTime: "",
    sleepingTime: "",
    moreActive: "",
  };
  const [formData, setFormData] = useState(initialData);
  const [activities, setActivities] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [finalRoutine, setFinalRoutine] = useState([]);

  // sorting time in ascending order
  activities.sort((a, b) => {
    let timeA = a?.activityStartTime || a?.mainActivityStartTime;
    let timeB = b?.activityStartTime || b?.mainActivityStartTime;
    return timeA.localeCompare(timeB);
  });

  useEffect(() => {
    if (activities.length > 0)
      generateRoutineData(activities, allSubjects, formData, setFinalRoutine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities]);

  useEffect(() => {
    const bioData = getDataFromStorage(localStorage, "routineAccount");

    const basicData = getDataFromStorage(localStorage, "routineInfo");
    if (basicData) {
      setFormData({
        name: bioData?.name || basicData?.name || "",
        target: basicData?.target || "",
        sleepingTime: basicData?.sleepingTime || "",
        wakingUpTime: basicData?.wakingUpTime || "",
        moreActive: basicData?.moreActive || "",
      });

      setAllSubjects([...basicData?.hardSubjects, ...basicData?.easySubjects]);
      setActivities(basicData?.activities || []);
    }
  }, []);
  return (
    <>
      <div ref={ref} className={styles.form_wrapper}>
        <PageHeader text="Routine Maker" />
        <div className={styles.upper_div}>
          <div className={styles.left}>Name: {formData?.name}</div>
          <div className={styles.right}>Target: {formData?.target}</div>
        </div>
        <div className={styles.form}>
          <div className={styles.moto_figure}>
            <Image src={moto} alt="মেধাবী নয় জঘন্য রকমের পরিশ্রমী" />
          </div>

          {finalRoutine.length > 0 ? (
            <TableContainer>
              <Table sx={{ maxWidth: 500 }} className={styles.form}>
                <TableHead>
                  <TableRow className={styles.list_activity_item}>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        // fontSize: "15px",
                        color: "#6a63a9",
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                        background: "#E6FAF8",
                      }}
                      align="center"
                    >
                      Topic
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        // fontSize: "15px",
                        color: "#6a63a9",
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                        background: "#E6FAF8",
                      }}
                      align="center"
                    >
                      Start Time
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        // fontSize: "15px",
                        color: "#6a63a9",
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                        background: "#E6FAF8",
                      }}
                      align="center"
                    >
                      End Time
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {finalRoutine.map((item, idx) => (
                    <TableRow
                      key={idx}
                      sx={{ "&:last-child td, &:last-child th": { border: 1 } }}
                      className={styles.list_activity_item}
                    >
                      <TableCell
                        style={{
                          color: item.color || "",
                          background: item.background || "",
                          fontWeight: "bold",
                        }}
                        align="center"
                      >
                        {item.topicName}
                      </TableCell>
                      <TableCell
                        style={{
                          color: item.color || "",
                          background: item.background || "",
                          fontWeight: "bold",
                        }}
                        align="center"
                      >
                        {militaryTimeToStandardTime(item?.topicStartTime)}
                      </TableCell>
                      <TableCell
                        style={{
                          color: item.color || "",
                          background: item.background || "",
                          fontWeight: "bold",
                        }}
                        align="center"
                      >
                        {militaryTimeToStandardTime(item?.topicEndTime)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </div>

        <div className={styles.indicator}>
          <div className={styles.pair}>
            <div className={styles.item}>
              <span className={styles.box1}></span>
              <p className={styles.box1_p}>Main Activities</p>
            </div>
            <div className={styles.item}>
              <span className={styles.box2}></span>
              <p className={styles.box2_p}>Extra Curricular Activities</p>
            </div>
          </div>
          <div className={styles.pair}>
            <div className={styles.item}>
              <span className={styles.box3}></span>
              <p className={styles.box3_p}>Hard Subjects</p>
            </div>
            <div className={styles.item}>
              <span className={styles.box4}></span>
              <p className={styles.box4_p}>Easy Subjects</p>
            </div>
          </div>
        </div>

        <div className={styles.planner}>
          <div className={styles.planner_left}>
            <p>
              {" "}
              অনলাইন রুটিনের চেয়ে অফলাইন হাতে লেখা প্ল্যানার আরো ভালো। Daily,
              weekly, monthly, yearly planning গোছানোভাবে করতে অর্ডার করুন DWMY
              Planner.
            </p>{" "}
            <MdArrowForward className={styles.arrow} />
          </div>
          <div className={styles.qr_figure} title="Click to visit">
            <a
              href="https://www.rokomari.com/product/261406/dwmy-student-life-planner"
              target="_blank"
            >
              <Image src={qr_code} alt="QR code" layout="fill" />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.btn_div} title="Click to download">
          <ReactToPrint
            trigger={() => (
              <button className={styles.print_btn}>
                {" "}
                <MdDownload
                  style={{
                    marginRight: "10px",
                  }}
                />{" "}
                Download Routine
              </button>
            )}
            content={() => ref.current}
          />
        </div>
      </div>
    </>
  );
};

export default RoutineOutput;
