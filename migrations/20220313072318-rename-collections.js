module.exports = {
  async up(db, client) {
    // TODO write your migration here.

    await db.collection("batchings").drop();
    await db.renameCollection("Batching", "batchings");
  },

  async down(db, client) {
    await db.renameCollection("batchings", "Batching");
  },
};
