module.exports = {
  async up(db, client) {
    const inserted_codes = [];

    
    db.dropCollection("purchases");
    await db
      .collection("Purchase Order")
      .find()
      .forEach(async function (PurchaseOrder) {
        if(!inserted_codes.includes(PurchaseOrder.OCODE))
        {
          db.collection("purchases").insertOne({
            supplier: PurchaseOrder.SUPPLIER,
            date_purchased: new Date(PurchaseOrder.DATE_PURCHASED),
            order_code: PurchaseOrder.OCODE,
            order_items: [],
          });

          inserted_codes.push(PurchaseOrder.OCODE);
        }
      });

      await db
      .collection("Purchase Order")
      .find()
      .forEach(async function (PurchaseOrder) {
      db.collection("purchases").updateOne(
        { order_code: PurchaseOrder.OCODE },
        {
          $push: {
            order_items: {
              product_code: PurchaseOrder.CODE,
              product_id: PurchaseOrder.material_id,
              purchased_amount: parseFloat(PurchaseOrder.AMOUNT),
              received_amount: parseFloat(PurchaseOrder.AMOUNT),
              unit_price: parseFloat(PurchaseOrder.PRICE),
              status: parseInt(PurchaseOrder.STATUS),
              date_arrived: new Date(PurchaseOrder.DATE_ARRIVED),
            }
          }
        }
      );
      });
    },

  async down(db, client) {
    //try not to go back lmao..
}
}