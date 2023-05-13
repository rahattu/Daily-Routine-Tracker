import RoundedFormButton from "@/components/FormButton/RoundedFormButton";
import PageHeader from "@/components/PageHeader/PageHeader";
import styles from "@/styles/Register.module.css";
import { getDataFromStorage, saveToLocalStorage } from "@/utils/temporarySave";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Register = () => {
  const router = useRouter();
  const initialData = {
    name: "",
    email: "",
    institution: "",
    batch: "",
    country: "",
    dialCode: "",
    phone: "",
    numLength: 0,
  };

  const [formData, setFormData] = useState(initialData);
  const [errFormData, setErrFormData] = useState(initialData);

  const batches = [
    { id: 1, title: "JSC" },
    { id: 2, title: "SSC" },
    { id: 3, title: "HSC" },
  ];

  const checkValidation = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      if (!value) {
        setErrFormData((prev) => ({
          ...prev,
          [name]: "Name required!",
        }));
      } else if (value.length < 3) {
        setErrFormData((prev) => ({ ...prev, [name]: "Name is too short!" }));
      } else {
        setErrFormData((prev) => ({ ...prev, [name]: "" }));
      }
    } else if (name === "email") {
      if (!value) {
        setErrFormData((prev) => ({ ...prev, [name]: "Email required!" }));
      } else if (!value.includes("@")) {
        setErrFormData((prev) => ({ ...prev, [name]: "Invalid email!" }));
      } else {
        setErrFormData((prev) => ({ ...prev, [name]: "" }));
      }
    } else if (name === "phone") {
      if (!value) {
        setErrFormData((prev) => ({
          ...prev,
          [name]: `Phone number required!`,
        }));
      } else if (value.length !== +formData.numLength) {
        setErrFormData((prev) => ({
          ...prev,
          [name]: `Phone number must be ${formData.numLength} digits`,
        }));
      } else {
        setErrFormData((prev) => ({ ...prev, [name]: "" }));
      }
    }
    // else if (name === "country") {
    //   if (!value) {
    //     setErrFormData((prev) => ({
    //       ...prev,
    //       [name]: "Select a country!",
    //     }));
    //   } else {
    //     setErrFormData((prev) => ({ ...prev, [name]: "" }));
    //   }
    // }
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   if (name === "phone") {
  //     if (!value) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         dialCode: "+88",
  //         // country: "bangladesh",
  //         numLength: 11,
  //       }));
  //       return;
  //     }
  //     let countryName = value.split("+")[0];
  //     let countryDialCode = value.split("+")[1];
  //     setFormData((prev) => ({
  //       ...prev,
  //       dialCode: "+" + countryDialCode.split("*")[0],
  //       country: countryName,
  //       numLength: countryDialCode.split("*")[1],
  //     }));
  //     setFormData((prev) => ({
  //       ...prev,
  //       dialCode: "+88",
  //       country: "bangladesh",
  //       numLength: 11,
  //     }));
  //   } else {
  //     setFormData((prev) => ({ ...prev, [name]: value }));
  //   }
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!value) {
        setFormData((prev) => ({
          ...prev,
          dialCode: "+88",
          country: "bangladesh",
          numLength: 11,
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        phone: value,
        dialCode: "+88",
        country: "bangladesh",
        numLength: 11,
      }));
    } else {
      if (!value) {
        setFormData((prev) => ({
          ...prev,
          [name]: "",
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    setErrFormData(initialData);
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("institution").value = "";
    document.getElementById("batch").value = "";
    // document.getElementById("country").value = "";
    document.getElementById("phone").value = "";
    localStorage.removeItem("routineAccount");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const invalidData = Object.values(errFormData).filter((item) => item);
      if (invalidData.length > 0) {
        alert("Please fill up the form correctly!");
        return;
      }

      saveToLocalStorage("routineAccount", formData);
      router.push("/routine");
    } catch (err) {
      console.log("❌ Error in Register.js/handleSubmit \n", err);
    }
  };

  useEffect(() => {
    const data = getDataFromStorage(localStorage, "routineAccount");
    if (data) {
      setFormData({
        ...data,
        dialCode: "+88",
        numLength: 11,
        country: "bangladesh",
      });
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
            Create Account
          </h3>
          <p
            style={{
              textAlign: "center",
              paddingBottom: "10px",
            }}
          >
            <small>একাউন্ট খুলে নিজের গোছানো লাইফের শুরু করো এখনই.....</small>
          </p>
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
              onBlur={checkValidation}
              required
            />
          </div>
          {errFormData.name && (
            <div className={styles.error}> &#9888; {errFormData.name}</div>
          )}

          <div className={styles.form_group}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              className={styles.input}
              value={formData?.email}
              placeholder="e.g. mdahtotul@gmail.com"
              onChange={handleChange}
              onBlur={checkValidation}
              required
            />
          </div>
          {errFormData.email && (
            <div className={styles.error}> &#9888; {errFormData.email}</div>
          )}
          <div className={styles.form_group}>
            <label htmlFor="institution">Institution</label>
            <input
              type="text"
              name="institution"
              id="institution"
              className={styles.input}
              value={formData?.institution}
              placeholder="e.g. BAF SHAHEEN SCHOOL & COLLEGE"
              onChange={handleChange}
              onBlur={checkValidation}
              required
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="batch">Batch</label>
            <select
              name="batch"
              id="batch"
              value={formData?.batch}
              onChange={handleChange}
              required
            >
              <option value="">--Select Batch--</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.title}>
                  {batch.title}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.form_group}>
            <label htmlFor="batch">Phone</label>
            <input
              type="number"
              name="phone"
              id="phone"
              className={`${styles.input}`}
              placeholder="01XXXXXXXXX"
              value={formData?.phone}
              onChange={handleChange}
              onBlur={checkValidation}
              // disabled={!formData?.dialCode}
              required
            />
          </div>

          {errFormData.phone && (
            <div className={styles.error}> &#9888; {errFormData.phone}</div>
          )}

          {/* <div className={styles.form_group}>
            <label htmlFor="country">Country</label>
            <select
              name="country"
              id="country"
              onChange={handleChange}
              value={`${formData?.country}${formData?.dialCode}*${formData?.numLength}`}
              required
            >
              <option value="">--Select Country--</option>
              {countryData.map((item, idx) => (
                <option
                  key={idx}
                  value={`${item.name.common}${
                    item.idd.root + item.idd.suffixes[0] + "*" + item.uniqueLen
                  }`}
                >
                  {item.name.common} ({item.idd.root + item.idd.suffixes[0]})
                </option>
              ))}
            </select>
          </div> */}

          {/* <div className={styles.form_group}>
            <label htmlFor="batch">Phone</label>
            <span className={`${styles.input} ${styles.number}`}>
              {formData?.dialCode}
              <input
                type="number"
                name="phone"
                id="phone"
                className="hide_numbers_arrow"
                placeholder="+880 xxxxxxxxx"
                value={formData?.phone}
                onChange={handleChange}
                onBlur={checkValidation}
                disabled={!formData?.dialCode}
                required
              />
            </span>
          </div> */}

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
              value="Sign Up"
              color="#006e60"
              // bgColor="#addabb"
              bgColor="#fff"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
