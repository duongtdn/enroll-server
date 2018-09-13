"use strict"

// NOT TESTED YET

const { verifyToken } = require('@stormgle/jtoken-util')

const secret = process.env.AUTH_KEY_SGLEARN;

function authen() {
  return verifyToken(secret);
}

function getEnroll(db) {
  return function(req, res, next) {
    const courseId = req.params && req.params.course;
    const uid = req.user.uid;
    db.enroll.getEnroll({uid, courseId}, (err, data) => {
      req.enroll = data;
      console.log(data);
      next();
    })
  }
}

function final() {
  return function(req, res) {
    res.status(200).json({data : req.enroll })
  }
}

module.exports = [authen, getEnroll, final]