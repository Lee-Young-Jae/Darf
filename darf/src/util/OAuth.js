const CLIENT_ID = "aa7db4556bd6d650e2c052510c7855da";
const REDIRECT_URL = "http://localhost:3065/api/user/callback/kakao";

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code`;
