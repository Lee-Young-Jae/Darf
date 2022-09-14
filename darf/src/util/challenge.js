const condition = [
  {
    id: 1,
    title: "기록을 그룹에 10회 공유한다",
    conditionCheckFunc: () => {},
  },
  {
    id: 2,
    title: "몸무게를 10회 기록한다",
    conditionCheckFunc: () => {},
  },
  {
    id: 3,
    title: "식단을 10회 기록한다",
    conditionCheckFunc: () => {},
  },
  {
    id: 4,
    title: "운동을 10회 기록한다",
    conditionCheckFunc: () => {},
  },
  {
    id: 5,
    title: "챌린지를 5회 성공했다",
    conditionCheckFunc: () => {},
  },
];

export const checkProgressChallenge = () => {
  const challenge = window.localStorage.getItem("challenge");

  if (!challenge) {
    window.localStorage.setItem("challenge", [condition.length.map((e) => [])]);
    return;
  }

  JSON.parse(challenge).map((challenge) => {});

  return;
};

// 구현 방법?

// 프론트 단에서 검증하지말고
// 백엔드로 요청보내서 백엔드에서 검증해서 값을 돌려주는 api를 만드는게 구현하기 더 쉬울듯...?

// 예 userId를 dispatch
// 백엔드에서 여러 항목을 검증 후 성공한 항목 배열을 res <- [1,3,4,6...] 이렇게? [{title: "", isSuccess: false}, ...] 이렇게?
// 프론트에선 그걸 받아서 뿌려주기 (유틸 함수로 만들어서 성공 배열을 리턴받는다.)
// 프론트에선 profile.js에서 dispatch를 할지 모든 에서 dispatch를 할지 고민

//장단점?
// 장점: 모든 페이지에서 dispatch를 하면 성공 여부를 실시간으로 추적 가능 <- 달성했다고 message 보낼 수 있음
// 단점: 리소스가 많이 들고 관리가 쉽지 않음

// 백엔드에선 userChallenge DB모델을 새로 만드는게 나을까? <- 이방법이 완성도 측면에선 더 나을지도...?
