import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Server is ready')
})

app.get('/api/jokes', (req, res) => {

    const jokes = [
        {
            "id": 0,
            "title": "Fast Tomato",
            "description": "Why did the tomato turn red? Because it saw the salad dressing!"
        },
        {
            "id": 1,
            "title": "Musical Pun",
            "description": "Why did the musical note go to therapy? It had too many issues with its scales."
        },
        {
            "id": 2,
            "title": "Chatty Coffee",
            "description": "How does a coffee cup say goodbye? It says, 'It's time to espresso myself elsewhere.'"
        },
        {
            "id": 3,
            "title": "Forgetful Fruit",
            "description": "Why did the banana go to therapy? It couldn't peel with its emotions."
        },
        {
            "id": 4,
            "title": "Socially Awkward Computer",
            "description": "Why was the computer cold? It left its Windows open."
        }
    ]

    res.send(jokes)

})


app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`)
})