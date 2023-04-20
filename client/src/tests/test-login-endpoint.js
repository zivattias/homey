import http from "k6/http";
import { check, sleep } from "k6";

export default function testLogin () {
    // 3. Virtual User code
    const res = http.post("http://127.0.0.1:8000/api/auth/login/", {
        username: "testUser",
        password: "testPass!",
    });
    check(res, { "Status 200": (r) => r.status == 200 });
    sleep(1);
}


// Run w/ 10 VUs for 10s: k6 run --vus 10 --duration 10s test-login-endpoint.js
