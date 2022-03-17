module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    const inserted_codes = [];
    await db.renameCollection("Purchase Order","Purchase Order Old");
    await db
      .collection("Purchase Order Old")
      .find()
      .forEach(async function (PurchaseOrder) {
        if(!inserted_codes.includes(PurchaseOrder.OCODE))
        {
          db.collection("Purchase Order").insertOne({
            supplier: PurchaseOrder.SUPPLIER,
            date_purchased: new Date(PurchaseOrder.DATE_PURCHASED),
            order_code: PurchaseOrder.OCODE,
            order_items: [],
          });

          inserted_codes.push(PurchaseOrder.OCODE);
        }
      });

      await db
      .collection("Purchase Order Old")
      .find()
      .forEach(async function (PurchaseOrder) {
      db.collection("Purchase Order").updateOne(
        { order_code: PurchaseOrder.OCODE },
        {
          $push: {
            order_items: {
              product_code: PurchaseOrder.CODE,
              amount: parseFloat(PurchaseOrder.AMOUNT),
              price: parseFloat(PurchaseOrder.PRICE),
              status: parseInt(PurchaseOrder.STATUS),
              date_arrived: new Date(PurchaseOrder.DATE_ARRIVED),
            }
          }
        }
      );
      });
    },

  async down(db, client) {
    await db.collection("Purchase Order").drop();
    await db.renameCollection("Purchase Order Old", "Purchase Order");
  },
};
