module.exports = {
  async up(db, client) {
    db.collection("purchases").updateMany({},{$set: {'status':4}})
  },

  async down(db, client) {
    db.collection("purchases").updateMany({},{$unset: {'status':""}})
  }
};
