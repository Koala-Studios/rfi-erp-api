module.exports = {
  async up(db, client) {
    const inserted_codes = [];

    await db
    .collection("inventory")
    .find()
    .forEach(function (Material) {
          db.collection("Purchase Order").updateMany(
            { CODE: Material.product_code }, 
            { $set: { "material_id": Material._id } }
          );
    });

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
              amount: parseFloat(PurchaseOrder.AMOUNT),
              price: parseFloat(PurchaseOrder.PRICE),
              status: parseInt(PurchaseOrder.STATUS),
              date_arrived: new Date(PurchaseOrder.DATE_ARRIVED),
              product_id: PurchaseOrder.material_id
            }
          }
        }
      );
      });
    },

  async down(db, client) {
    db.dropCollection("purchases");

    await db.collection("Purchase Order")
    .updateMany({},{ $unset: {material_id: ""  } });
  },
};
