import express from "express";

const app = express();

app.use(express.json());

app.post("/hooks/catch/:userId/:zapId", (req, res) => {

})

app.listen(3000)