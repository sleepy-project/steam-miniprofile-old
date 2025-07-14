// server.js
// where your node app starts

// init project
const fetch = require("node-fetch");
const steamID = require('steamid');
const express = require("express");
const app = express();
start = new Date().toISOString();
let distinctCount = 0;

// we've started you off with Express
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
// app.use(express.static("public"));

// http://expressjs.com/en/starter/ba-sic-routing.html
app.get("/", function (request, response) {
  // response.sendFile(__dirname + "/index.html");
  response.send(`
steam-miniprofile-proxy
<br/>
https://github.com/sleepy-project/steam-miniprofile
<br/>
Requests count since ${start} (UTC): ${distinctCount}

`);
});

app.get("/miniprofile/:steamid", function (request, response) {
  const requestedSteamId = request.params.steamid;
  const language = request.query.l || "schinese";
  const appId = request.query.appId;

  console.log("Processing SteamID:", requestedSteamId);

  // SteamID 转换
  let bigIntdSteamId;
  try {
    bigIntdSteamId = new steamID(requestedSteamId).getBigIntID();
  } catch (e) {
    console.error("SteamID conversion error:", e);
    return response.status(400).send("Invalid SteamID format");
  }

  const convertedSteamId = Number(bigIntdSteamId & BigInt(0xFFFFFFFF));

  // 构建目标 URL
  let targetUrl = `https://steamcommunity.com/miniprofile/${convertedSteamId}?l=${language}`;
  if (appId) targetUrl += `&appid=${appId}`;

  // 请求计数（可选）
  distinctCount++;

  console.log(`[#${distinctCount}] Proxying to:`, targetUrl);

  // 代理请求
  fetch(targetUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0"
    }
  })
    .then(res => {
      // 处理响应头
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
        ...Object.fromEntries(res.headers.entries())
      };
      response.set(headers);

      // 返回内容
      return res.text();
    })
    .then(data => response.send(data))
    .catch(err => {
      console.error("Proxy error:", err);
      response.status(500).send("Proxy error");
    });
});

// 监听 :3000
const listener = app.listen(3000, function () {
  console.log("Steam Miniprofile Proxy is running on :" + listener.address().port);
});
