export const timeForToday = (value) => {
  const today = new Date();
  const timeValue = new Date(value);

  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60
  );
  if (betweenTime < 1) return "방금전";
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년전`;
};

export const days = ["일", "월", "화", "수", "목", "금", "토"];

export const foodTypes = [
  { id: 1, type: "아침" },
  { id: 2, type: "아점" },
  { id: 3, type: "점심" },
  { id: 4, type: "점저" },
  { id: 5, type: "저녁" },
  { id: 6, type: "야식" },
  { id: 7, type: "디저트" },
];
