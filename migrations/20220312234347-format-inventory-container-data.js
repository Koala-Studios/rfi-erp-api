module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    await db.collection("Inventory").updateMany(
    {},
    {
      $rename: {
        NAME: "name",
        QTY: "quantity",
        CODE: "product_id",
        PRICE: "price",
        REORDER_AMT: "reorder_amount",
        SUPPLIERS: "suppliers",
        LAST_SUPPLIER: "last_supplier",
        FDA_STATUS: "fda_status",
        CPL_HAZARD: "cpl_hazard",
        TTB_STATUS: "ttb_status",
        EU_STATUS: "eu_status",
        ORGANIC: "organic",
        KOSHER: "kosher",
      }
    });

    await db.collection("Inventory").updateMany(
      {},
      [ {"$set": {
        stock: [
          {
              on_hand:  "$quantity",
              supplier_id: "$suppliers",
              batch_code: "OLDSTOCK",
              price: "$price",
          }
        ],
      }
    }]
  )
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
