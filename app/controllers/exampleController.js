const db = require("../models");
// const Model = db.Model;
// const { Op } = require("sequelize");
const { QueryTypes, NUMBER } = require("sequelize");
const redis = require("ioredis");
const client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST,
);
const jwt = require("jsonwebtoken");

exports.refactoreMe1 = async (req, res) => {
  // function ini sebenarnya adalah hasil survey dri beberapa pertnayaan, yang mana nilai dri jawaban tsb akan di store pada array seperti yang ada di dataset
  try {
    let data = await db.sequelize.query(`select values from "surveys"`, {
      type: QueryTypes.SELECT,
    });

    let dataValue = [];
    data.map((item) => {
      dataValue = rekursifData(item.values, dataValue);
    });

    var resp = dataValue.map((e) => {
      return e.reduce((a, b) => a + b, 0) / 10;
    });

    res.status(200).send({
      statusCode: 200,
      success: true,
      message: "success",
      data: resp,
    });
  } catch {
    res.status(500).send({
      statusCode: 500,
      success: false,
      message: "Something wrong.",
      data: [],
    });
  }
};

function rekursifData(data, result = [], count = 0) {
  if (count == data.length) {
    return result;
  } else {
    if (!result[count]) {
      result[count] = [];
    }
    result[count].push(data[count]);
    return rekursifData(data, result, count + 1);
  }
}

exports.refactoreMe2 = async (req, res) => {
  // function ini untuk menjalakan query sql insert dan mengupdate field "dosurvey" yang ada di table user menjadi true, jika melihat data yang di berikan, salah satu usernnya memiliki dosurvey dengan data false
  const t = await db.sequelize.transaction();
  try {
    let querySurvey = `INSERT INTO surveys ("createdAt","updatedAt","values","userId") 
                                VALUES (NOW(),NOW(),$1,$2)`;
    let { userId, values } = req.body;
    values = values.replace("[", "").replace("]", "").split(",").map(Number);
    userId = Number(userId);

    await db.sequelize.query(querySurvey, {
      type: QueryTypes.INSERT,
      bind: [values, userId],
      transaction: t,
    });

    let queryUser = "UPDATE users SET dosurvey = true where id = $1";
    await db.sequelize.query(queryUser, {
      type: QueryTypes.UPDATE,
      bind: [userId],
      transaction: t,
    });

    await t.commit();

    res.status(201).send({
      statusCode: 201,
      success: true,
      message: "Survey sent successfully!",
      data: null,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).send({
      statusCode: 500,
      success: false,
      message: "Cannot post survey.",
      data: null,
    });
  }
};

// function queryInsertSurvey()
const axios = require("axios");
exports.callmeWebSocket = async (ws, req) => {
  // do something
  let data = await getDataAPi();
  await ws.send(data);
  const interval = setInterval(async () => {
    data = await getDataAPi();
    await ws.send(data);
  }, 180000);
};

async function getDataAPi() {
  const apiUrl = "https://livethreatmap.radware.com/api/map/attacks?limit=10";
  let { data } = await axios.get(apiUrl);
  return data;
}

exports.getDatatoDb = async (req, res) => {
  // do something
  const t = await db.sequelize.transaction();

  try {
    let data = await getDataAPi();
    data = data.flat(1);
    let queryInsertData =
      "INSERT INTO attacks (sourceCountry, destinationCountry, millisecond, type, weight, attackTime) VALUES ";
    data.map(async (item) => {
      queryInsertData += `('${item.sourceCountry}', '${item.destinationCountry}', ${item.millisecond}, '${item.type}', ${item.weight}, '${item.attackTime}'),`;
    });

    queryInsertData = queryInsertData.slice(0, -1);
    queryInsertData += ";";
    await db.sequelize.query(queryInsertData, {
      type: QueryTypes.INSERT,
      transaction: t,
    });
    await t.commit();

    res.status(201).send({
      statusCode: 201,
      success: true,
      message: "Success insert attack data.",
      data: data,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).send({
      statusCode: 500,
      success: false,
      message: "Cannot insert attack data.",
      data: null,
    });
  }
};

exports.getData = async (req, res) => {
  // do something
  try {
    let data = [];
    let cache = await getCache("dataAttack");
    if (cache) {
      data = JSON.parse(cache);
    } else {
      let queryData =
        "SELECT sourceCountry, COUNT(*) AS total FROM attacks GROUP BY sourceCountry ORDER BY total ASC;";

      data = await db.sequelize.query(queryData, {
        type: QueryTypes.SELECT,
      });
    }

    var result = {
      label: [],
      total: [],
    };
    data.map((item) => {
      result.label.push(item.sourcecountry);
      result.total.push(item.total);
    });

    await setCache("dataAttack", data);

    res.status(200).send({
      statusCode: 200,
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

async function getCache(key) {
  try {
    const cacheData = await client.get(key);
    return cacheData;
  } catch (err) {
    return null;
  }
}

function setCache(key, data, ttl = 30) {
  try {
    client.set(key, JSON.stringify(data), "EX", ttl);
  } catch (err) {
    return null;
  }
}
exports.login = async (req, res, next) => {
  try {
    let payload = {
      admin: req.body.role == "1" ? true : false,
    };
    let token = await jwt.sign(payload, process.env.JWT_SECRET);
    res.status(200).send({
      statusCode: 200,
      success: true,
      data: token,
    });
  } catch {
    res.status(500).send({
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};
