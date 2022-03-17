module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    await db
    .collection("Product")
    .find()
    .forEach(async function (Product) {
        db.collection("products").insertOne({
          product_code: Product.PRODUCT_CODE,
          name: Product.NAME,
          versions: parseInt(Product.VERSIONS),
          approved_version: parseInt(Product.APPROVED_VERSION),
          cost: parseFloat(Product.COST),
          cpl_hazard: [],
          date_created: new Date(Product.DATE_CREATED),
          eu_status: parseInt(Product.EU_STATUS),
          fda_status: parseInt(Product.FDA_STATUS),
          rec_dose_rate: parseFloat(Product.REC_DOSE_RATE),
          status: parseInt(Product.STATUS),
          ttb_status: parseInt(Product.TTB_STATUS),
          fda_ratings: parseInt(Product.FDA_RATINGS),
          fema_number: parseInt(Product.fema_number),
          cas_number: Product.cas_number,
          organic: null,
          kosher: null,
        });
    });
  },

  async down(db, client) {
    db.dropCollection("products");
  },
};
