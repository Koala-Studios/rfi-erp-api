module.exports = {
  async up(db, client) {
    //db.renameCollection("products","Product");
    await db
      .collection("Product")
      .find()
      .forEach(async function (Product) {
          db.collection("products").insertOne({
            product_code: Product.product_code,
            versions: parseInt(Product.versions),
            approved_version: parseInt(Product.approved_version),
            cost: parseFloat(Product.cost),
            cpl_hazard: [],
            date_created: new Date(Product.date_created),
            eu_status: parseInt(Product.eu_status),
            fda_status: parseInt(Product.fda_status),
            rec_dose_rate: parseFloat(Product.rec_dose_rate),
            status: parseInt(Product.status),
            ttb_status: parseInt(Product.ttb_status),
            fda_ratings: parseInt(Product.fda_ratings),
            fema_number: parseInt(Product.fema_number),
            cas_number: Product.cas_number,
            organic: null,
            kosher: null,
          });
      });
  },

  async down(db, client) {
    db.dropCollection("products");
  }
};