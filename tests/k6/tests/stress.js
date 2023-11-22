import login from "../requests/login.js";
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from 'k6/data';

const csvData = new SharedArray('another data name', function () {
    return papaparse.parse(open('../data/data.csv'), { header: true }).data;
  });

export let options = {
    scenarios: {
        stress_test: {
            executor: 'per-vu-iterations',
            vus: csvData.length,
            iterations: 1
        }
    },
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% of requests should be below 1000ms
    },
  };

export default function () {
  login(csvData)
}
