"use strict"

// NOT TESTED YET

const { verifyToken } = require('@stormgle/jtoken-util')

const secret = process.env.AUTH_KEY_SGLEARN;

function authen() {
  return verifyToken(secret);
}

function getUserEnroll(db) {
  return function(req, res, next) {
    const uid = req.user.uid;
    db.enroll.getEnrollList({uid}, (err, data) => {
      if (err) {
        res.status(500).send();
      }
      req.enrolls = data;
      next();
    })
  }
}

function final() {
  return function(req, res) {
    res.status(200).json({data : req.enrolls })
  }
}

module.exports = [authen, getUserEnroll, final]