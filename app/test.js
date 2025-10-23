// app/test.js
const http = require("http");
const options = { hostname: "localhost", port: 3000, path: "/", method: "GET" };
const req = http.request(options, (res) => {
	console.log("status", res.statusCode);
	process.exit(res.statusCode === 200 ? 0 : 1);
});
req.on("error", () => process.exit(1));
req.end();
