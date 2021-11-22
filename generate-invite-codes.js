const db = require("./db.js");

if (db.getUserInviteCodes("adamqureshi").length === 0) {
  db.generateInviteCodes(5, "adamqureshi");
}

console.log("db.getInviteCodes()", db.getInviteCodes("adamqureshi"));