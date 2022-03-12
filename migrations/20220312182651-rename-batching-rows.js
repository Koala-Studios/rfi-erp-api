module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    await db.collection("Batching").updateMany(
      {},
      {
        $rename: {
          PRODUCT_CODE: "product_code",
          QTY: "quantity",
          DATE_CREATED: "date_created",
          STATUS: "status",
          ID: "product_id",
          BATCH_CODE: "batch_code",
        },
      }
    );
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
