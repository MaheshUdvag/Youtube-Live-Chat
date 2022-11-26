import Express from "express";
import mongoose from "mongoose";
import Message from "./message.model.js";
import dotenv from "dotenv";
import compression from "compression";

dotenv.config();

const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(compression());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let changeStream;
mongoose.connection
  .once("open", async () => {
    console.log("connection success");
  })
  .on("error", (error) => console.error("Error:", error));

const db = mongoose.connection;

app.delete("/clean", (req, res) => {
  Message.deleteMany({})
    .then(() => res.send("success"))
    .catch((e) => res.send(e));
});

app.post("/add-message", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;

  if (!name || !message) {
    res.status(400);
    res.send({ message: "Name and message are required" });
  }

  const msg = new Message({
    name,
    message,
  });

  msg
    .save()
    .then((message) => res.send(message))
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: "Please provide a valid name and message" });
    });
});

app.get("/", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
    Connection: "keep-alive",
  });
  const msgCollection = db.collection("message");
  changeStream = msgCollection.watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      res.write("data: " + JSON.stringify(messageDetails) + "\n\n");
      res.flush();
    }
  });

  res.on("close", () => {
    console.log("close");
    changeStream.close();
    res.end();
  });
});

app.listen(process.env.PORT || 5000, () => console.log("running"));