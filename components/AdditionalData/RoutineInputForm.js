import RoundedFormButton from "@/components/FormButton/RoundedFormButton";
import PageHeader from "@/components/PageHeader/PageHeader";
import styles from "@/styles/RoutineInputForm.module.css";
import { getDataFromStorage, saveToLocalStorage } from "@/utils/temporarySave";
import { militaryTimeToStandardTime } from "@/utils/timeConversion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

const RoutineInputForm = () => {
  const router = useRouter();
  const initialData = {
    name: "",
    target: "",
    wakingUpTime: "",
    sleepingTime: "",
    moreActive: "",
  };

  const initialWarning = {
    wakingUpTime: false,
    sleepingTime: false,
    mainActivity: false,
    ecaActivity: false,
  };

  const [formData, setFormData] = useState(initialData);
  const [errFormData, setErrFormData] = useState(initialData);
  const [hardSubjects, setHardSubjects] = useState([]);
  const [easySubjects, setEasySubjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const warningText = "AM/PM ব্যবহারে সতর্কতা অবলম্বন করুন!";
  const [showWarning, setShowWarning] = useState(initialWarning);

  const mainActivityOptions = [
    "Coaching",
    "Private",
    "College",
    "Batch",
    "School",
    "University",
  ];
  const [mainActivity, setMainActivity] = useState({
    activityName: "",
    activityStartTime: "",
    activityEndTime: "",
    activityType: "main",
    color: "#EC637D",
    background: "#FCEAEE",
  });
  const [newActivity, setNewActivity] = useState({
    activityName: "",
    activityStartTime: "",
    activityEndTime: "",
    activityType: "eca",
    color: "#28D2C8",
    background: "#E6FAF8",
  });

  const [newHardSubject, setNewHardSubject] = useState({
    sub: "",
    color: "#58D48A",
    background: "#F3FCF7",
  });
  const [newEasySubject, setNewEasySubject] = useState({
    sub: "",
    color: "#F49C35",
    background: "#FEF4E8",
  });

  const checkValidation = (e, setState) => {
    const { name, value } = e.target;
    setShowWarning(initialWarning);
  };

  const handleSubChange = (e) => {
    const { name, value } = e.target;
    if (name === "hardSubject") {
      setNewHardSubject((prv) => ({ ...prv, sub: value }));
    } else {
      setNewEasySubject((prv) => ({ ...prv, sub: value }));
    }
  };

  const handleAddSubject = (e, isHard = false) => {
    e.preventDefault();
    if (isHard) {
      if (hardSubjects.length >= 5) {
        return alert("❌ Maximum 5 hard subjects can be added");
      }
      if (!newHardSubject.sub)
        return alert("❌ Please enter a hard subject name!");

      setHardSubjects((prv) => [...prv, newHardSubject]);
      setNewHardSubject({
        sub: "",
        color: "#58D48A",
        background: "#F3FCF7",
      });
    } else {
      if (easySubjects.length >= 5) {
        return alert("❌ Maximum 5 easy subjects can be added!");
      }
      if (!newEasySubject.sub)
        return alert("❌ Please enter a easy subject name!");
      setEasySubjects((prv) => [...prv, newEasySubject]);
      setNewEasySubject({
        sub: "",
        color: "#F49C35",
        background: "#FEF4E8",
      });
    }
  };

  const handleDeleteSubject = (value, isHard = false) => {
    if (isHard) {
      const newSubjects = hardSubjects.filter((item) => item !== value);
      setHardSubjects(newSubjects);
    } else {
      const newSubjects = easySubjects.filter((item) => item !== value);
      setEasySubjects(newSubjects);
    }
  };

  const handleChangeActivity = (e, activityType) => {
    const { name, value } = e.target;
    if (activityType === "main") {
      setShowWarning({ mainActivity: true });
      setMainActivity((prv) => ({
        ...prv,
        [name]: value,
      }));
    } else {
      setShowWarning({ ecaActivity: true });
      setNewActivity((prv) => ({
        ...prv,
        [name]: value,
      }));
    }
  };

  const clearActivity = (isMainActivity = false) => {
    if (isMainActivity) {
      setMainActivity({
        activityName: "",
        activityStartTime: "",
        activityEndTime: "",
        activityType: "main",
        color: "#EC637D",
        background: "#FCEAEE",
      });
    } else {
      setNewActivity({
        activityName: "",
        activityStartTime: "",
        activityEndTime: "",
        activityType: "eca",
        color: "#28D2C8",
        background: "#E6FAF8",
      });
    }
    document.getElementById(
      isMainActivity ? "mainActivityName" : "activityName"
    ).value = "";
    document.getElementById(
      isMainActivity ? "mainActivityStartTime" : "activityStartTime"
    ).value = "";
    document.getElementById(
      isMainActivity ? "mainActivityEndTime" : "activityEndTime"
    ).value = "";
  };

  const addActivity = (isMainActivity = false) => {
    setShowWarning(initialWarning);
    const timeExists = false;
    activities.forEach((item) => {
      const s_time = item.activityStartTime || item.mainActivityStartTime;
      const e_time = item.activityEndTime || item.mainActivityEndTime;
      if (
        s_time === newActivity.activityStartTime ||
        e_time === newActivity.activityEndTime ||
        s_time === mainActivity.activityStartTime ||
        e_time === mainActivity.activityEndTime
      ) {
        timeExists = true;
      }
    });

    if (timeExists) {
      alert("Start or End time already exists!");
      return;
    } else {
      if (isMainActivity) {
        if (
          !mainActivity.activityName ||
          !mainActivity.activityStartTime ||
          !mainActivity.activityEndTime
        )
          return alert("Please fill all the fields");

        const exists = activities.find(
          (item) => item.activityName === mainActivity.activityName
        );
        if (exists) {
          alert("Activity name already exists");
        }

        setActivities((prv) => [...prv, mainActivity]);
        clearActivity(true);
      } else {
        if (
          !newActivity?.activityName ||
          !newActivity?.activityStartTime ||
          !newActivity?.activityEndTime
        )
          return alert("Please fill all the fields");

        const exists = activities.find(
          (item) => item.activityName === newActivity.activityName
        );
        if (exists) {
          alert("Activity already exists");
          return;
        }

        setActivities((prv) => [...prv, newActivity]);
        clearActivity();
      }
    }
  };

  const deleteActivity = (idx) => {
    const newActivities = [...activities];
    newActivities.splice(idx, 1);
    setActivities(newActivities);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowWarning({ [name]: true });
    setFormData((prv) => ({
      ...prv,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!activities.length) return alert("Please add at least one activity");
      if (!hardSubjects.length)
        return alert("Please add at least one hard subject");
      if (!easySubjects.length)
        return alert("Please add at least one easy subject");
      const newData = {
        name: formData?.name.trim() || "",
        target: formData?.target.trim() || "",
        sleepingTime: formData?.sleepingTime || "",
        wakingUpTime: formData?.wakingUpTime || "",
        moreActive: formData?.moreActive || "",
        activities: activities || [],
        hardSubjects: hardSubjects || [],
        easySubjects: easySubjects || [],
      };

      saveToLocalStorage("routineInfo", newData);
      router.push("/routine/output");
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    const confirm = window.confirm("Are you sure you want to reset?");
    if (!confirm) return;
    setFormData(initialData);
    setActivities([]);
    setHardSubjects([]);
    setEasySubjects([]);
    localStorage.removeItem("routineInfo");
  };

  useEffect(() => {
    const bioData = getDataFromStorage(localStorage, "routineAccount");
    const basicData = getDataFromStorage(localStorage, "routineInfo");
    if (bioData && !basicData) {
      setFormData((prv) => ({ ...prv, name: bioData?.name || "" }));
    }
    if (basicData) {
      setFormData({
        name: bioData?.name || basicData?.name || "",
        target: basicData?.target || "",
        sleepingTime: basicData?.sleepingTime || "",
        wakingUpTime: basicData?.wakingUpTime || "",
        moreActive: basicData?.moreActive || "",
      });

      setActivities(basicData?.activities || []);
      setHardSubjects(basicData?.hardSubjects || []);
      setEasySubjects(basicData?.easySubjects || []);
    }
  }, []);

  return (
    <>
      <div className={styles.form_wrapper}>
        <PageHeader />
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3
            style={{
              textAlign: "center",
            }}
          >
            Routine Information
          </h3>
          <div className={styles.form_group}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              className={styles.input}
              value={formData?.name}
              placeholder="e.g. MD ARIFUL HASAN"
              onChange={handleChange}
              onBlur={(e) => checkValidation(e, setErrFormData)}
              disabled
              required
            />
          </div>
          {errFormData.name && (
            <div className={styles.error}> &#9888; {errFormData.name}</div>
          )}

          <div className={styles.form_group}>
            <label htmlFor="target">Target</label>
            <input
              type="text"
              name="target"
              id="target"
              className={styles.input}
              value={formData?.target}
              onChange={handleChange}
              onBlur={(e) => checkValidation(e, setErrFormData)}
              required
            />
          </div>
          {errFormData.wakingUpTime && (
            <div className={styles.error}>
              {" "}
              &#9888; {errFormData.wakingUpTime}
            </div>
          )}

          <div className={styles.form_group}>
            <label htmlFor="wakingUpTime">Waking Up Time</label>
            <input
              type="time"
              name="wakingUpTime"
              id="wakingUpTime"
              className={styles.input}
              value={formData?.wakingUpTime}
              onChange={handleChange}
              onBlur={(e) => checkValidation(e, setErrFormData)}
              required
            />
          </div>
          {(showWarning?.wakingUpTime || showWarning?.sleepingTime) && (
            <div className={styles.error}> &#9888; {warningText}</div>
          )}
          {errFormData.wakingUpTime && (
            <div className={styles.error}>
              {" "}
              &#9888; {errFormData.wakingUpTime}
            </div>
          )}

          <div className={styles.form_group}>
            <label htmlFor="sleepingTime">Sleeping Time</label>
            <input
              type="time"
              name="sleepingTime"
              id="sleepingTime"
              className={styles.input}
              value={formData?.sleepingTime}
              onChange={handleChange}
              onBlur={(e) => checkValidation(e, setErrFormData)}
              required
            />
          </div>
          {(showWarning?.wakingUpTime || showWarning?.sleepingTime) && (
            <div className={styles.error}> &#9888; {warningText}</div>
          )}

          {errFormData.sleepingTime && (
            <div className={styles.error}>
              {" "}
              &#9888; {errFormData.sleepingTime}
            </div>
          )}

          {/* activities start */}
          {activities.length > 0 && (
            <ul className={styles.list_activity}>
              <h4 className={styles.activity_heading}>Activities</h4>
              {activities.map((item, idx) => (
                <span className={styles.list_activity_item} key={idx}>
                  <li>
                    <strong>
                      {idx + 1}. {item?.activityName || item?.mainActivityName}{" "}
                      time:
                    </strong>{" "}
                    From{" "}
                    {militaryTimeToStandardTime(
                      item?.activityStartTime || item?.mainActivityStartTime
                    )}{" "}
                    to{" "}
                    {militaryTimeToStandardTime(
                      item?.activityEndTime || item?.mainActivityEndTime
                    )}{" "}
                  </li>
                  <span
                    className={styles.dlt_icon}
                    title="Remove activity from list"
                  >
                    <MdClose onClick={() => deleteActivity(idx)} />
                  </span>
                </span>
              ))}
            </ul>
          )}
          {/* main activity start */}
          <div className={styles.form_group}>
            <div>
              <label htmlFor="activityName">Activity Name (Main)</label>
              <select
                name="activityName"
                id="mainActivityName"
                value={mainActivity?.activityName}
                onChange={(e) => handleChangeActivity(e, "main")}
              >
                <option value="">--Select Activity--</option>
                {mainActivityOptions.map((item, idx) => (
                  <option value={item} key={idx}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.half_width}>
              <div>
                <label htmlFor="activityStartTime">Start Time</label>
                <input
                  type="time"
                  name="activityStartTime"
                  id="mainActivityStartTime"
                  className={styles.input}
                  value={mainActivity?.activityStartTime}
                  onChange={(e) => handleChangeActivity(e, "main")}
                />
              </div>
              <div>
                <label htmlFor="activityEndTime">End Time</label>
                <input
                  type="time"
                  name="activityEndTime"
                  id="mainActivityEndTime"
                  className={styles.input}
                  value={mainActivity?.activityEndTime}
                  onChange={(e) => handleChangeActivity(e, "main")}
                />
              </div>
            </div>
            {showWarning?.mainActivity && (
              <div className={styles.error}> &#9888; {warningText}</div>
            )}
            <div className={styles.add_btn_div}>
              <button
                title="Add new activity"
                type="button"
                className={styles.add_btn}
                onClick={() => addActivity(true)}
              >
                {" "}
                Add to Routine +
              </button>
            </div>
          </div>
          {/* main activity end */}
          {/* ECA activity start */}
          <div className={styles.form_group}>
            <div>
              <label htmlFor="activityName">Extra Curricular Activity</label>
              <input
                type="text"
                name="activityName"
                id="activityName"
                placeholder="e.g. GYM, Sports, Reading, Coding, etc."
                className={styles.input}
                value={newActivity?.activityName}
                onChange={(e) => handleChangeActivity(e, "eca")}
              />
            </div>
            <div className={styles.half_width}>
              <div>
                <label htmlFor="activityTime">Start Time</label>
                <input
                  type="time"
                  name="activityStartTime"
                  id="activityStartTime"
                  className={styles.input}
                  value={newActivity?.activityStartTime}
                  onChange={(e) => handleChangeActivity(e, "eca")}
                />
              </div>
              <div>
                <label htmlFor="activityTime">End Time</label>
                <input
                  type="time"
                  name="activityEndTime"
                  id="activityEndTime"
                  className={styles.input}
                  value={newActivity?.activityEndTime}
                  onChange={(e) => handleChangeActivity(e, "eca")}
                />
              </div>
            </div>
            {showWarning?.ecaActivity && (
              <div className={styles.error}> &#9888; {warningText}</div>
            )}
            <div className={styles.add_btn_div}>
              <button
                title="Add new activity"
                type="button"
                className={styles.add_btn}
                onClick={() => addActivity(false)}
              >
                {" "}
                Add to Routine +
              </button>
            </div>
          </div>
          {/* activities end */}

          {/* hard subject list */}
          {hardSubjects.length > 0 && (
            <div className={styles.sub_wrapper}>
              <h4 className={styles.activity_heading}>
                Hard Subjects (Max: 5)
              </h4>
              <div className={styles.list_subject}>
                {hardSubjects.map((item, idx) => (
                  <span className={styles.list_subject_item} key={idx}>
                    <span>{item?.sub}</span>
                    <span
                      className={styles.dlt_icon}
                      title="Remove hard subject from list"
                    >
                      <MdClose
                        onClick={() => handleDeleteSubject(item, true)}
                      />
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* hard subjects start */}
          <div className={styles.form_group}>
            <span className={styles.sub_head}>
              <label htmlFor="hardSubjects">Add New Hard Subject</label>
            </span>
            <input
              type="text"
              name="hardSubject"
              id="hardSubject"
              className={styles.input}
              value={newHardSubject?.sub}
              placeholder="Add any subject"
              onChange={handleSubChange}
            />
            <div className={styles.add_btn_div}>
              <button
                className={styles.add_btn}
                onClick={(e) => handleAddSubject(e, true)}
              >
                Add to Routine +
              </button>
            </div>
          </div>
          {/* hard subjects end */}
          {/* Easy subjects */}
          {easySubjects.length > 0 && (
            <div className={styles.sub_wrapper}>
              <h4 className={styles.activity_heading}>
                Easy Subjects (Max: 5)
              </h4>
              <div className={styles.list_subject}>
                {easySubjects.map((item, idx) => (
                  <span className={styles.list_subject_item} key={idx}>
                    <span>{item?.sub}</span>
                    <span
                      className={styles.dlt_icon}
                      title="Remove easy subject from list"
                    >
                      <MdClose
                        onClick={() => handleDeleteSubject(item, false)}
                      />
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* easy subjects start */}
          <div className={styles.form_group}>
            <span className={styles.sub_head}>
              <label htmlFor="easySubject">Add New Easy Subject</label>
            </span>
            <input
              type="text"
              name="easySubject"
              id="easySubject"
              className={styles.input}
              value={newEasySubject?.sub}
              placeholder="new subject add"
              onChange={handleSubChange}
            />
            <div className={styles.add_btn_div}>
              <button
                className={styles.add_btn}
                onClick={(e) => handleAddSubject(e, false)}
              >
                Add to Routine +
              </button>
            </div>
          </div>
          {/* easy subjects end */}
          <div className={styles.form_group}>
            <label>When are you more active?</label>
            <span className={styles.radio_opt}>
              <input
                name="moreActive"
                type="radio"
                id="moreActive"
                value="day"
                disabled={formData?.wakingUpTime ? false : true}
                onChange={handleChange}
                checked={formData?.moreActive === "day"}
                required
              />
              {formData?.wakingUpTime ? (
                <label htmlFor="day">Day</label>
              ) : (
                <label>Please provide your waking up time</label>
              )}
            </span>
            <span className={styles.radio_opt}>
              <input
                name="moreActive"
                type="radio"
                id="moreActive"
                value="night"
                disabled={formData?.sleepingTime ? false : true}
                onChange={handleChange}
                checked={formData?.moreActive === "night"}
                required
              />
              {formData?.sleepingTime ? (
                <label htmlFor="night">Night</label>
              ) : (
                <label>Please provide your sleeping time</label>
              )}
            </span>
          </div>

          <div className={styles.btn_group}>
            <RoundedFormButton
              type="button"
              value="Reset"
              color="#ed4141"
              bgColor="#fff"
              onClick={handleReset}
            />
            <RoundedFormButton
              type="submit"
              value="Create"
              color="#006e60"
              bgColor="#fff"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default RoutineInputForm;
