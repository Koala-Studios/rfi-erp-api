module.exports = {
  async up(db, client) {
    const inserted_codes = [];
    const inv_list = await db
      .collection("Inventory")
      .find().toArray();
    for (const inv_item of inv_list) {
      db.collection("formulas").updateMany(
        { product_code: inv_item.product_code },
        { $set: { "product_id": inv_item._id } }
      )
      // .then(() => {
      //   if(inv_item.status === 4 && inv_item.approved_version > 0 ) {
      //     db.collection("formulas").updateOne({_product_id: inv_item._id, version: inv_item.approved_version},{$set: {"approved": true}});
      //   }
      // }
      // );
    };
  },

  async down(db, client) {
    db
      .collection("formulas")
      .updateMany({}, { $unset: { product_id: "" } });
  }
};
