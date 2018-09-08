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
        res.status(400).send();
      }
      req.enrolls = data;
      next();
    })
  }
}

function getInvoice(db) {
  return function(req, res, next) {
    const enrolls = req.enrolls;
    const invoiceList= enrolls.map(e => e.invoice)
    db.invoice.batchGetInvoices(invoiceList, (err, data) => {
      if (err) {
        res.status(400).send();
      } else {
        req.invoices = {};
        data.forEach(invoice => {
          req.invoices[invoice.number] = invoice
        })
        next();
      }
    })
  }
}

function stickInvoiceToEnroll() {
  return function(req, res, next) {
    req.enrolls.forEach(enroll => {
      enroll.invoice = req.invoices[enroll.invoice];
    })
    next();
  }
}

function final() {
  return function(req, res) {
    res.status(200).json({data : req.enrolls })
  }
}

module.exports = [authen, getUserEnroll, getInvoice, stickInvoiceToEnroll, final]