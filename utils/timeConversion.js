import moment from "moment";

export const militaryTimeToStandardTime = (time) => {
  if (!time) return;
  const [hours, minutes] = time.split(":");
  const hour = +hours; // convert to number
  if (hour > 12) {
    return `${hour - 12}:${minutes} PM`;
  } else if (hour === 12) {
    return `${hour}:${minutes} PM`;
  } else if (+hour === 0) {
    return `12:${minutes} AM`;
  } else {
    return `${hour}:${minutes} AM`;
  }
};

export const next30Minutes = (time) => {
  let newTime = moment(time, "HH:mm").add(30, "minutes").format("HH:mm");
  return newTime;
};

export const next29Minutes = (time) => {
  let newTime = moment(time, "HH:mm").add(29, "minutes").format("HH:mm");
  return newTime;
};

export const next1Minutes = (time) => {
  let newTime = moment(time, "HH:mm").add(1, "minutes").format("HH:mm");
  return newTime;
};

export const differenceBetweenTwoTime = (startTime, endTime) => {
  let difference = moment
    .duration(moment(endTime, "HH:mm").diff(moment(startTime, "HH:mm")))
    .asMinutes();
  return difference;
};

export const modifyTime = (time, isEndTime) => {
  if (!time) return;
  const [hours, minutes] = time.split(":");
  let hour = +hours; // convert to number
  let minute = +minutes; // convert to number

  // Formatting the modified time
  let modifiedTime =
    hour.toString().padStart(2, "0") + ":" + minute.toString().padStart(2, "0");

  return modifiedTime;
};

export const checkMinimumDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return;

  const [startHour, startMinute] = startTime.split(":");
  const [endHour, endMinute] = endTime.split(":");

  let startTotalMinutes = +startHour * 60 + +startMinute;
  let endTotalMinutes = +endHour * 60 + +endMinute;

  if (startTime === endTime) {
    return false;
  } else if (startTime < endTime) {
    let durationInMinutes = endTotalMinutes - startTotalMinutes;
    let durationInHours = durationInMinutes / 60;

    return durationInHours >= 5;
  } else {
    let durationInMinutes;

    if (endTotalMinutes >= startTotalMinutes) {
      durationInMinutes = endTotalMinutes - startTotalMinutes;
    } else {
      durationInMinutes = endTotalMinutes + 1440 - startTotalMinutes; // Adding 24 hours (1440 minutes)
    }

    let durationInHours = durationInMinutes / 60;

    return durationInHours >= 5;
  }
};

export const calculateTimeSlots = (startTime, endTime) => {
  if (!startTime || !endTime) return;

  const [startHour, startMinute] = startTime.split(":");
  const [endHour, endMinute] = endTime.split(":");

  let startTotalMinutes = +startHour * 60 + +startMinute;
  let endTotalMinutes = +endHour * 60 + +endMinute;

  let durationInMinutes;

  if (endTotalMinutes >= startTotalMinutes) {
    durationInMinutes = endTotalMinutes - startTotalMinutes;
  } else {
    durationInMinutes = endTotalMinutes + 1440 - startTotalMinutes; // Adding 24 hours (1440 minutes)
  }

  let timeSlots = Math.ceil(durationInMinutes / 30);

  return timeSlots;
};

export const convertTo24 = (time) => {
  let timearr = time.split(":");
  let hour = parseInt(timearr[0]);
  let minutes = parseInt(timearr[1]);

  if (hour == 12) {
    hour = 0;
  }
  if (timearr[2] == "PM") {
    hour = hour + 12;
  }

  return { hour: hour, minutes: minutes };
};

export const convertTo12 = (time) => {
  const [hours, minutes] = time.split(":");
  let hh = +hours; // convert to number
  let mm = +minutes; // convert to number
  let ampm = hh >= 12 ? "PM" : "AM";

  hh = hh % 12 || 12;

  return hh + ":" + mm + ":" + ampm;
};

export const roundStartTime = (hh, mm) => {
  if (mm < 30) {
    mm = 0;
  } else if (mm > 30) {
    mm = 30;
  }

  return { hour: hh, minutes: mm };
};

export const roundEndTime = (hh, mm) => {
  if (mm < 30) {
    mm = 30;
  } else if (mm > 30) {
    mm = 0;
    hh = hh + 1 == 24 ? 0 : hh + 1;
  }

  return { hour: hh, minutes: mm };
};

export const minutesToHour = (minutes) => {
  let hh = Math.floor(minutes / 60);
  let mm = minutes - hh * 60;
  return { hour: hh, minutes: mm };
};

export const toMinutes = (hh, mm) => {
  // console.log("🚀 ~ file: timeConversion.js:179 ~ toMinutes ~ hh:", hh, mm);
  return hh * 60 + mm;
};
