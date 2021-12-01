const db = require("./db.js");
db.generateInviteCodes(20, "adamqureshi");
console.log("db.getInviteCodes()", db.getInviteCodes("adamqureshi"));