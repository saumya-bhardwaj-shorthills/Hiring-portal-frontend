import axios from 'axios';
const B = 'http://localhost:8000/api';

export async function signup(opts) {
  const { data } = await axios.post(`${B}/signup/`, opts);
  return data.token;
}

export async function login(opts) {
  const { data } = await axios.post(`${B}/login/`, opts);
  return data.token;
}

export async function msLogin(graphToken) {
  const { data } = await axios.post(
    `${B}/ms-login/`,
    {},
    { headers:{ Authorization: `Bearer ${graphToken}` } }
  );
  return data.token;
}
