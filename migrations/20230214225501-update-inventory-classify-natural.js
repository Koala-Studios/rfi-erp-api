module.exports = {
  async up(db, client) {
    db.collection("inventory").updateMany({name : { $in : [/Nat\./, /NAT\./, /Nat/] }}, {$set : {"regulatory.fda_status" : "Natural"} })
  },

  async down(db, client) {
    db.collection("inventory").updateMany({name : { $in : [/Nat\./, /NAT\./, /Nat/] }}, {$set : {"regulatory.fda_status" : null} })
  }
};
