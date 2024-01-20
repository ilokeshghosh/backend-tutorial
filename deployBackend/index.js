const express = require('express')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 3000

const gitData = {
    "login": "ilokeshghosh",
    "id": 102693885,
    "node_id": "U_kgDOBh77_Q",
    "avatar_url": "https://avatars.githubusercontent.com/u/102693885?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/ilokeshghosh",
    "html_url": "https://github.com/ilokeshghosh",
    "followers_url": "https://api.github.com/users/ilokeshghosh/followers",
    "following_url": "https://api.github.com/users/ilokeshghosh/following{/other_user}",
    "gists_url": "https://api.github.com/users/ilokeshghosh/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/ilokeshghosh/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/ilokeshghosh/subscriptions",
    "organizations_url": "https://api.github.com/users/ilokeshghosh/orgs",
    "repos_url": "https://api.github.com/users/ilokeshghosh/repos",
    "events_url": "https://api.github.com/users/ilokeshghosh/events{/privacy}",
    "received_events_url": "https://api.github.com/users/ilokeshghosh/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Lokesh Ghosh",
    "company": null,
    "blog": "lokeshghosh.vercel.app/",
    "location": "Kolkata, India",
    "email": null,
    "hireable": null,
    "bio": null,
    "twitter_username": "i_lokeshghosh",
    "public_repos": 42,
    "public_gists": 0,
    "followers": 4,
    "following": 5,
    "created_at": "2022-03-30T19:06:55Z",
    "updated_at": "2024-01-20T05:37:36Z"
  }

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/github',(req,res)=>{
    res.json(gitData)
})

app.get('/login',(req,res)=>{
    res.send('<h1>please login at chai or code</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening on port : http://localhost:${port}`)
})