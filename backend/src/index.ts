import firebase from "./config/FirebaseConfig";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

//Using Cors to allow cross-origin requests
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(require("./routes/router"));

app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Route not found",
    });
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});