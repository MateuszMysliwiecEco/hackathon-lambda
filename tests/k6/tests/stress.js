import login from "../requests/login.js";

const users = [
    {'name':'QA Performance 1', 'email':'qaecoonline@ecoonline.com', 'password':'Test@123456', 'company code':'ecodemo', 'locale':'en'},
    {'name':'QA Performance 2', 'email':'qaecoonline+1@ecoonline.com', 'password':'Test@123456', 'company code':'ecodemo', 'locale':'en'},
    {'name':'QA Performance 3', 'email':'qaecoonline+2@ecoonline.com', 'password':'Test@123456', 'company code':'ecodemo', 'locale':'en'}
]

export let options = {
    scenarios: {
        stress_test: {
            executor: 'per-vu-iterations',
            vus: users.length,
            iterations: 1
        }
    },
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2000ms
    },
  };

export default function () {
  login(users)
}