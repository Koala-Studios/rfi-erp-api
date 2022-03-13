module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    await db.collection("Product").updateMany(
    {},
    {
      $rename: {
        NAME: "name",
        PRODUCT_CODE: "product_code",
        REC_DOSE_RATE: "rec_dose_rate",
        COST: "cost",
        PRICE: "price",
        FDA_STATUS: "fda_status",
        CPL_HAZARD: "cpl_hazard",
        FEMA_NUMBER: "fema_number",
        TTB_STATUS: "ttb_status",
        EU_STATUS: "eu_status",
        ORGANIC: "organic",
        KOSHER: "kosher",
        STATUS: "status",
        VERSIONS: "versions",
        APPROVED_VERSION: "approved_version",
        DATE_CREATED: "date_created"
      },
      $unset: {
        ID: "",
        STOCK: "",
      }
    });
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
