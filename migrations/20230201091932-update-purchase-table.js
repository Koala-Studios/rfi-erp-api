let ObjectId = require('mongodb').ObjectId;

module.exports = {
  async up(db, client) {
    const inserted_codes = [];

      db.dropCollection("purchases", function (err, res) {
        if (err) {
          console.log("purchases table doesn't exist")
        }
      })
    

    const orders = await db
      .collection("Purchase Order")
      .find()
      .toArray();
      for ( const PurchaseOrder of orders) {
        if(!inserted_codes.includes(PurchaseOrder.OCODE))
        {
          const supplier_id = await db.collection("suppliers").findOne({"name": PurchaseOrder.SUPPLIER})

          db.collection("purchases").insertOne({
            supplier:{ id: supplier_id? supplier_id : 'ERROR' ,name: PurchaseOrder.SUPPLIER },
            date_purchased: PurchaseOrder.DATE_PURCHASED,
            order_code: PurchaseOrder.OCODE,
            order_items: [],
          });

          inserted_codes.push(PurchaseOrder.OCODE);
        }
      };

      await db
      .collection("Purchase Order")
      .find()
      .forEach(async function (PurchaseOrder) {
      db.collection("purchases").updateOne(
        { order_code: PurchaseOrder.OCODE },
        {
          $push: {
            order_items: {
              _id: new ObjectId(),
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
    db.dropCollection("purchases");
}
}