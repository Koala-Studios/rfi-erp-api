const ObjectId = require('mongodb').ObjectId;
// const { ObjectId } = require('bson');
module.exports = {
  async up(db, client) {
    const inserted_codes = [];
    await db
      .collection("inventory")
      .find()
      .forEach(function (Material) {
        db.collection("Purchase_Order").updateMany(
          { CODE: Material.product_code },
          { $set: { "material_id": Material._id } }
        );
      });

    const orders = await db
      .collection("Purchase_Order")
      .find()
      .toArray();
    for (const PurchaseOrder of orders) {
      if (!inserted_codes.includes(PurchaseOrder.OCODE)) {
        const supplier = await db.collection("suppliers").findOne({ "code": getSupplier(PurchaseOrder.SUPPLIER) })
        console.log(getSupplier(PurchaseOrder.SUPPLIER), supplier)
        db.collection("purchases").insertOne({
          supplier: supplier ? { _id: supplier ? supplier._id : 'error', code: supplier ? supplier.code : 'ERROR' } : null,
          date_purchased: PurchaseOrder.DATE_PURCHASED,
          order_code: PurchaseOrder.OCODE,
          order_items: [],
        });

        inserted_codes.push(PurchaseOrder.OCODE);
      }
    };
    const purchase_orders = await db
      .collection("Purchase_Order")
      .find().toArray();
    for (const PurchaseOrder of purchase_orders) {
      db.collection("purchases").updateOne(
        { order_code: PurchaseOrder.OCODE },
        {
          $push: {
            order_items: {
              _id: new ObjectId().toHexString(),
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
    };
  },

  async down(db, client) {
    db.dropCollection("purchases");
  }
}

const getSupplier = (code) => {
  switch (code) {
    case 'MIRITZ':
      return 'MCI';

    case 'VIGON':
    case "Vigon":
      return 'VIG';

    case 'FMI':
      return 'FMI';

    case 'EXLLENTIA':
    case "EXELLENTIA":
      return 'EXC';

    // case x:
    //   return 'REA';

    case "VENTOS":
      return 'VEN';

    case "Bedoukian":
      return 'BED';

    // case x:
    //   return 'MU1';

    case 'PENTA':
      return 'PEN';

    case "ADVANCEDBIOTECH":
      return 'ADB';
    default:
      return 'ERROR';
  }

}