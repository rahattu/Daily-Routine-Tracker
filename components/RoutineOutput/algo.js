import {
  convertTo12,
  convertTo24,
  minutesToHour,
  modifyTime,
  next30Minutes,
  roundEndTime,
  roundStartTime,
  toMinutes,
} from "@/utils/timeConversion";

const generateRoutineData = (
  rawActivities = [],
  allSubjects,
  formData,
  setFinalRoutine
) => {
  const { moreActive } = formData;
  const routineData = [];
  let slots = [];

  function initSlots() {
    slots = [];
    for (let i = 0; i < 24; i++) {
      slots.push([false, i + ":00", "Blank"]);
      slots.push([false, i + ":30", "Blank"]);
    }
  }

  initSlots();

  function allocateSlotMinutes(startMinutes, endMinutes, activityName) {
    let convertedTime = minutesToHour(startMinutes);
    let startIdx = convertedTime.hour * 2 + (convertedTime.minutes == 30);

    if (startMinutes > endMinutes) {
      for (let i = startIdx; i < slots.length; i++) {
        slots[i][0] = true;
        slots[i][2] = activityName;
      }

      let occupySlots = endMinutes / 30;

      for (let i = 0; i < occupySlots; i++) {
        slots[i][0] = true;
        slots[i][2] = activityName;
      }
      return;
    }

    let diff = endMinutes - startMinutes;
    let occupySlots = diff / 30;

    for (let i = startIdx; i < startIdx + occupySlots; i++) {
      slots[i][0] = true;
      slots[i][2] = activityName;
    }
  }

  function showFreeSlots() {
    let count = 0;
    for (let i = 0; i < slots.length; i++) {
      if (slots[i][0] == false) {
        let time = slots[i][1];
        let time12h = convertTo12(time);
        count++;
      }
    }

    return count;
  }

  let activities = [];
  let activitiesUpdated = [];

  activities.push([
    convertTo12(formData?.sleepingTime),
    convertTo12(formData?.wakingUpTime),
    "Sleep",
  ]);
  rawActivities.forEach((el) => {
    activities.push([
      convertTo12(el?.activityStartTime),
      convertTo12(el?.activityEndTime),
      el?.activityName,
    ]);
  });

  function allocateActivities() {
    let sleepIdx;
    for (let i = 0; i < activities.length; i++) {
      let activity = activities[i];
      let startTime = activity[0];
      let endTime = activity[1];
      let name = activity[2];

      startTime = convertTo24(startTime);
      endTime = convertTo24(endTime);
      if (name === "Sleep") {
        sleepIdx = i;
      }

      startTime = roundStartTime(startTime.hour, startTime.minutes);
      endTime = roundEndTime(endTime.hour, endTime.minutes);

      let startMinutes = toMinutes(startTime.hour, startTime.minutes);
      let endMinutes = toMinutes(endTime.hour, endTime.minutes);

      activitiesUpdated.push([startMinutes, endMinutes, name]);

      allocateSlotMinutes(startMinutes, endMinutes, name);
    }
    return sleepIdx;
  }

  function allocateActivitiesAgain(activitiesUpdated) {
    initSlots();
    for (let i = 0; i < activitiesUpdated.length; i++) {
      let startMinutes = activitiesUpdated[i][0];
      let endMinutes = activitiesUpdated[i][1];
      let name = activitiesUpdated[i][2];
      allocateSlotMinutes(startMinutes, endMinutes, name);
    }
  }

  let sleepIdx = allocateActivities();

  let freeSlots = showFreeSlots();

  let totalSub = allSubjects.length;
  let modifiedSleepTime = formData?.sleepingTime;

  if (totalSub > freeSlots) {
    let diff = totalSub - freeSlots;
    while (diff--) {
      modifiedSleepTime = next30Minutes(modifiedSleepTime);
    }
  }

  if (totalSub > freeSlots) {
    let need = totalSub - freeSlots;
    while (need > 0) {
      need--;

      activitiesUpdated[sleepIdx][0] =
        (activitiesUpdated[sleepIdx][0] + 30) % 1440;
    }
    allocateActivitiesAgain(activitiesUpdated);
    freeSlots = showFreeSlots();
  }

  const availableSlots = slots.filter((slot) => slot[0] === false);
  let slotIdx = 0;
  let subIdx = 0;

  if (moreActive === "day") {
    for (let i = 0; i < availableSlots.length; i++) {
      if (formData?.wakingUpTime <= modifyTime(availableSlots[i][1])) {
        slotIdx = i;
        break;
      }
    }
  } else {
    for (let i = 0; i < availableSlots.length; i++) {
      if ("18:00" <= modifyTime(availableSlots[i][1])) {
        slotIdx = i;
        break;
      }
    }
  }

  while (freeSlots--) {
    availableSlots[slotIdx][0] = true;
    availableSlots[slotIdx][2] = allSubjects[subIdx]?.sub;
    routineData.push({
      topicName: allSubjects[subIdx]?.sub,
      topicStartTime: modifyTime(availableSlots[slotIdx][1]),
      topicEndTime: next30Minutes(availableSlots[slotIdx][1]),
      topicType: "subject",
      color: allSubjects[subIdx].color,
      background: allSubjects[subIdx].background,
    });

    if (slotIdx < availableSlots.length - 1) {
      slotIdx++;
    } else {
      slotIdx = 0;
    }
    if (subIdx < allSubjects.length - 1) {
      subIdx++;
    } else {
      subIdx = 0;
    }
  }

  rawActivities.forEach((el) =>
    routineData.push({
      topicName: el?.activityName,
      topicStartTime: el?.activityStartTime,
      topicEndTime: el?.activityEndTime,
      topicType: el.activityType,
      color: el?.color,
      background: el?.background,
    })
  );
  routineData.push({
    topicName: "Sleeping Time",
    topicStartTime: modifiedSleepTime,
    topicEndTime: formData?.wakingUpTime,
    topicType: "main",
    color: "#EC637D",
    background: "#FCEAEE",
  });

  const data1 = [];
  const data2 = [];
  routineData.forEach((el) => {
    if (el?.topicStartTime >= formData?.wakingUpTime) {
      data1.push(el);
    } else {
      data2.push(el);
    }
  });

  data1.sort((a, b) => {
    return a.topicStartTime.localeCompare(b.topicStartTime);
  });
  data2.sort((a, b) => {
    return a.topicStartTime.localeCompare(b.topicStartTime);
  });

  setFinalRoutine([...data1, ...data2]);
};

export { generateRoutineData };
