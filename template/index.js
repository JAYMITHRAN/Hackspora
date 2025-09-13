const express = require("express");
const cors = require("cors");
const router = require("./routes/apiRoute");
const jobRouter = require("./routes/jobRoute");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", //any frontend ep can be used
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", router);

app.use("/api/job", jobRouter);
app.listen(process.env.PORT || 5000, () => {
  console.log(`App listening on port ${process.env.PORT} `);
});
