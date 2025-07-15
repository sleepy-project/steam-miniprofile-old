本仓库已弃用, 请移步 **[sleepy-project/steam-profile-json](https://github.com/sleepy-project/steam-profile-json)**

---

# steam-miniprofile

sleepy 使用的 steam miniprofile 反代部署

## 自托管

```sh
cd backend
npm i
npm run start
# service -> :3000
```

然后修改服务端 `util.steam_api_url` 配置为 `http(s)://your-instance/miniprofile/` 即可
