const express = require("express");
const { dbConnection } = require("./DB/connection");
const messageModel = require("./DB/model");
const { redisClient } = require("./DB/connection");
const AsyncHandler = require("express-async-handler");
const os = require("os");
// const Redis = require("redis");
// const redisClient = Redis.createClient({
//   url: "redis://default:YEXEyXMovGE4KpSZiajjWbUtz0JMBMpD@redis-19901.c44.us-east-1-2.ec2.redns.redis-cloud.com:19901",
// });
// (async () => {
//   await redisClient.connect();
// })();

const app = express();
const port = process.env.PORT;
const defaultWaiting = 200;

app.use(express.json());
dbConnection();

// function setOrGet(key, cb) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let data = await redisClient.hGet("cash", key);
//       if (data) return resolve(JSON.parse(data));
//       data = await cb();
//       redisClient.rPush("list", key);
//       const count = await redisClient.lLen("list");
//       if (count > 5) {
//         const x = await redisClient.lPop("list");
//         redisClient.HDEL("cash", x);
//       }
//       redisClient.hSet("cash", key, JSON.stringify(data));
//       resolve(data);
//     } catch (error) {
//       reject(error);
//     }
//   });
// }
function setOrGet(key, cb) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await redisClient.lRange("lists", 0, -1);
      if (data) {
        for (let el of data) {
          el = JSON.parse(el);
          if (el["key"] === key) {
            return resolve(el["value"]);
          }
        }
      }
      data = await cb();
      redisClient.lPush("lists", JSON.stringify({ key, value: data }));
      redisClient.lTrim("lists", 0, 4);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

app.get("/get", async (req, res) => {
  console.log("helo");
  const doctors = await setOrGet(`getAll`, async () => {
    const response = await fetch(`https://dummyjson.com/products`);
    const data = await response.json();
    return data;
  });

  res.status(200).send({ data: doctors });
});
app.get("/", async (req, res) => {
  console.log(`from host ${os.hostname}`);
  res.status(200).send({ message: "jj world" });
});

app.post(
  "/",
  AsyncHandler(async (req, res) => {
    console.log("helo");
    const message = await messageModel.create({ content: req.body.content });
    if (!message) {
      return res.status(400).send({ error: "content is required" });
    }
    res.status(201).send({ data: message });
  })
);

app.use((err, req, res, next) => {
  res.status(400).json({
    Message: err.message,
    stack: err.stack,
  });
});

app.listen(port, () => {
  console.log("server running");
});
