import login from "./requests/login.js";
import suppliers from "./requests/suppliers.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const config = require('./config.js');

export default function() {
    console.log('Eco Plus performance testing, version: ' + config.version)
    const JWTToken = login();
    suppliers(JWTToken);
};

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }