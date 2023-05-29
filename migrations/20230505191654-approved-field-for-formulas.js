module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    await db.collection('formulas').updateMany({},{$set:{ "approved" :false } });

    const products = await db.collection("inventory").find({is_raw: false, status: 4}).toArray();

    for(const product of products) {
      await db.collection("formulas").findOneAndUpdate({product_id: product._id, version: product.approved_version},{$set:{ approved: true}})
    }
  },

  async down(db, client) {
    await db.collection('formulas').updateMany({},{$unset:{ "approved" :"" } });
  }
};
