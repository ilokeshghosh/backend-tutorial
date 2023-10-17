// console.log('This is dummy code');
require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000
const data = {
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
    "blog": "https://lokeshghosh.tech/",
    "location": "Kolkata, India",
    "email": null,
    "hireable": null,
    "bio": null,
    "twitter_username": "i_lokeshghosh",
    "public_repos": 36,
    "public_gists": 0,
    "followers": 6,
    "following": 5,
    "created_at": "2022-03-30T19:06:55Z",
    "updated_at": "2023-10-17T06:35:09Z"
};


app.get('/', (req, res) => {
    res.send('Hello World')
    
})

app.get('/about', (req, res) => {
    res.json({
        'name': 'lokesh ghosh',
        'city': "Kolkata",
        'age': 20
    })

    // res.send('<h1>This is about us page<h1/>');
})


app.get('/github', (req, res) => {
    res.json(data)
})


app.get('/login', (req, res) => {
    res.send('<h1>Please login<h1/>')
})

app.get('/chai', (req, res) => {
    res.send('you got chai')
})
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
    console.log(`Open : http://localhost:${process.env.PORT}/`);
})