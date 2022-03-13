module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    
    let inserted_codes = [];

    db.createCollection("Purchase Order New");
    await db
      .collection("Purchase Order")
      .find()
      .forEach(async function (PurchaseOrder) {
        if (inserted_codes.includes((PurchaseOrder.OCODE).toString())) {
          console.log("this code exists", PurchaseOrder.OCODE)
          await db.collection("Production Order New").updateOne(
            { order_code: PurchaseOrder.OCODE },
            {
              $push: {
                $order_items: {
                  amount: PurchaseOrder.AMOUNT,
                  price: PurchaseOrder.PRICE,
                  status: PurchaseOrder.STATUS,
                  date_arrived: PurchaseOrder.DATE_ARRIVED,
                },
              },
            }
          );
        } else {
          await db.collection("Purchase Order New").insertOne({
            supplier: PurchaseOrder.SUPPLIER,
            date_purchased: PurchaseOrder.DATE_PURCHASED,
            order_code: PurchaseOrder.OCODE,
            order_items: [
              {
                amount: PurchaseOrder.AMOUNT,
                price: PurchaseOrder.PRICE,
                status: PurchaseOrder.STATUS,
                date_arrived: PurchaseOrder.DATE_ARRIVED,
              },
            ],
          });
          inserted_codes.push(PurchaseOrder.OCODE);
          console.log(inserted_codes);
        }
        // const result = await db.collection("Purchase Order New").findOne({ "order_code" : {$regex : PurchaseOrder.OCODE} },async function(err, result) {
        //   if (err) {
        //     console.log(err);
        //   }
        //   console.log(result)
        //   if (result) {
        //     await db.collection("Production Order New").updateOne(
        //       { order_code: PurchaseOrder.OCODE },
        //       {
        //         $push: {
        //           $order_items: {
        //             amount: PurchaseOrder.AMOUNT,
        //             price: PurchaseOrder.PRICE,
        //             status: PurchaseOrder.STATUS,
        //             date_arrived: PurchaseOrder.DATE_ARRIVED,
        //           },
        //         },
        //       }
        //     );
        //   } else {
        //     await db.collection("Purchase Order New").insertOne({
        //       supplier: PurchaseOrder.SUPPLIER,
        //       date_purchased: PurchaseOrder.DATE_PURCHASED,
        //       order_code: PurchaseOrder.OCODE,
        //       order_items: [
        //         {
        //           amount: PurchaseOrder.AMOUNT,
        //           price: PurchaseOrder.PRICE,
        //           status: PurchaseOrder.STATUS,
        //           date_arrived: PurchaseOrder.DATE_ARRIVED,
        //         },
        //       ],
        //     });
        //   }
        // });
      });
  },

  async down(db, client) {
    db.collection("Purchase Order New").drop();
  },
};
