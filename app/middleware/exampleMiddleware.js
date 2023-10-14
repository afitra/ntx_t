const db = require("../models");
// const model = db.model;
const jwt = require("jsonwebtoken");
exampleMiddlewareFunction = (req, res, next) => {
  // do something
  try {
    let decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    if (!decode) {
      throw new Error("Anda harus login");
    }
    req.decode = decode;
    next();
  } catch (error) {
    return res.status(401).send({
      statusCode: 401,
      success: false,
      data: null,
    });
  }
};

isAdmin = (req, res, next) => {
  try {
    if (!req.decode.admin) {
      throw new Error("Anda tidak memiliki akses fitur ini");
    }

    next();
  } catch (error) {
    return res.status(401).send({
      statusCode: 401,
      success: false,
      data: null,
    });
  }
};

const verify = {
  exampleMiddlewareFunction: exampleMiddlewareFunction,
  isAdmin,
};

module.exports = verify;
