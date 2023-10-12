import http from 'k6/http';
import { check } from 'k6';

const users = [
    {'name':'QA Performance 1', 'email':'qaecoonline@ecoonline.com', 'password':'Test@123456', 'company code':'ecodemo', 'locale':'en'},
    {'name':'QA Performance 2', 'email':'qaecoonline+1@ecoonline.com', 'password':'Test@123456', 'company code':'ecodemo', 'locale':'en'},
    {'name':'QA Performance 3', 'email':'qaecoonline+2@ecoonline.com', 'password':'Test@123456', 'company code':'ecodemo', 'locale':'en'}]

export let options = {
    scenarios: {
        stress_test: {
            executor: 'per-vu-iterations',
            vus: users.length,
            iterations: 1
        }
    }
  };

export default function () {

// *** Step 1 - Navigate to Platform login page 

    let getResponse = http.get('https://platform.test.ecoonline.com');
    console.log('GET Response:', JSON.stringify(getResponse.cookies));
    // Check if the GET request was successful.
    check(getResponse, {
        'GET Request Successful - Step 1': (response) => response.status === 200,
    });

    //Grab XHRF Token
    // // let xhrfToken = getResponse.cookies['XSRF-TOKEN'];
    // let xsrfValue = xhrfToken[0]['value']
    // console.log(`XHRF TOKE IS : ${xsrfValue}`)

// *** Step 2 - Naviagte to Select Company code page
    
    let response = http.get('https://auth.test.ecoonline.net/auth/select-organisation')
    // Check if the GET request was successful.
    check(getResponse, {
        'GET Request Successful - Step 2': (response) => response.status === 200,
    });
    // Grab XHRF token
   let xsrf_token = response.cookies['XSRF-TOKEN'][0].value;
    console.log(`Final XHRF Token is****** : ${xsrf_token}`)

// *** Step 3 - Enter Company Code
    response = http.post(
        'https://auth.test.ecoonline.net/auth/select-organisation',
        '{"organisation_identifier":"ecodemo"}',
        {
          headers:{
            'X-XSRF-TOKEN': decodeURIComponent(xsrf_token),
            'Content-Type': 'application/json',
          },
          redirects: 2,
        })
        check(response, {
            'POST Request Successful - Step 3': (response) => response.status === 200,
        });


// *** Step 4 - Get Login Page 2 (Email Id and Password page for EcoDemo company)
    response = http.get(
        'https://auth.test.ecoonline.net/oauth/authorize?client_id=ad55bfdc-d129-400d-a58e-7b14ade80404&nonce=AIkN7QQLibCUKX7Q&redirect_uri=https%3A%2F%2Fplatform.test.ecoonline.com%2Fauth%2Fservices%2Fecoid%2Fcallback&response_type=code&scope=openid%20email%20profile%20ecoid%3Aorganisation&state=lvih4Kk5pi5QQswFsKcMC8MymiPHBgZ2s7nTOKvI&ui_locales=',
        {

        })
        check(response, {
            'GET Request Successful - Step 4': (response) => response.status === 200,
        });
        // Grab XHRF Token
    let xsrf_token1 = response.cookies['XSRF-TOKEN'][0].value;

    var user = users[__VU-1];
    var loginRequestBody = '{"username":"' + user.email + '","password":"' + user.password + '"}'

// *** Step5 - Enter Login Credentials
    response = http.post(
        'https://auth.test.ecoonline.net/auth/organisations/ceb2d0ef-03b9-41d7-bac7-eee61366b8d6/connections/461af26b-1e1e-4055-a859-3ef68da2df1a/login',
        loginRequestBody,
        {
        headers:{
            'X-XSRF-TOKEN': decodeURIComponent(xsrf_token1),
            'Content-Type': 'application/json',
        },
        })
    check(response, {
        'POST Request Successful - Step 5': (response) => response.status == 200, // if login is unsuccessful (ex. wrong credentials, response status is 401 unathorised)
    });
}