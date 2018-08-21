"use strict"

require('dotenv').config()

const db = require('database-test-helper')
const enrolldb = require('enrolldb-test-helper')

db.start().add({enrolldb}).init(() => {
  const app = require('./app.local')
  const PORT = process.env.PORT_LOCAL_ENROLL || 3200;
  const httpServer = require('http').createServer(app);
  httpServer.listen(PORT)
  console.log(`\n# ENROLL-SERVICES is running at http://localhost:${PORT}\n`);
});