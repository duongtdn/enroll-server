"use strict"

const { verifyToken } = require('@stormgle/jtoken-util')

const secret = process.env.AUTH_KEY_SGLEARN;
function authen() {
  return verifyToken(secret);
}

function checkEnroll(db) {
  return function(req, res, next) {
    const uid = req.user.uid;
    const courseId = req.body.courseId;
    db.enroll.getEnroll({uid, courseId}, function(err, data) {
      if (err) {
        console.log(err)
        res.status(400).json({error: 'bad request'})
      } else {
        if (data.status && (data.status === 'studying' || data.status === 'completed') ) {
          res.status(304).json({message: 'not update'})
          return
        }
        if (data.status && data.status === 'active') {
          next()
          return
        }
        res.status(403).json({error: 'not activated yet'})
      }
    })
  }
}

function update(db) {
  return function(req, res) {
    const uid = req.user.uid;
    const courseId = req.body.courseId;
    const status = req.body.status;
    db.enroll.setStatus(
      {uid, courseId, status},
      (err, data) => {
        if (err) {
          console.log(err)
          res.status(400).json({error: 'bad request'})
        } else {
          res.status(200).json({status: 200})
        }
      }
    )
  }
}

module.exports = [authen, checkEnroll, update]