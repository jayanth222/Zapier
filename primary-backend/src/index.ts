import express from "express";
import cors from "cors"
import { userRouter } from "./router/userRouter";
import { zapRouter } from "./router/zapRouter";

const app = express();

app.use(express.json())
app.use(cors())

app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);

app.get("/", (req, res) => {
    res.send("Health check")
})

app.listen(3001, () => {
    console.log("backend started and listening on port 3001")
});