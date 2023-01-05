module.exports = {
  async up(db, client) {
    await db
    .collection("Product")
    .find()
    .forEach(async function (Product) {
      if((Product.PRODUCT_CODE).includes('FL')) {
        db.collection("inventory").insertOne({
          product_code: Product.PRODUCT_CODE,
          name: Product.NAME,
          
          date_created: new Date(Product.DATE_CREATED),
          is_raw_mat: false,
          for_sale: true,
          versions: parseInt(Product.VERSIONS),
          approved_version: parseInt(Product.APPROVED_VERSION),
          status: parseInt(Product.STATUS),
          rec_dose_rate: parseFloat(Product.REC_DOSE_RATE),
          cost: parseFloat(Product.COST),
          stock:[ {
            on_hand: parseFloat(0),
            on_order: parseFloat(0),
            quarantine: parseFloat(0),
            allocated: parseFloat(0),
            batch_code: "OLDSTOCK",
            cost: parseFloat(Product.Cost)
          }],
          regulatory:
          {
            cpl_hazard: [],
            kosher: null,
            organic: null,
            eu_status: parseInt(Product.EU_STATUS),
            ttb_status: parseInt(Product.TTB_STATUS),
            fda_status: parseInt(Product.FDA_RATINGS),
            fema_number: parseInt(Product.fema_number),
          },
          cas_number: Product.cas_number
        });
      } else {
        db.collection("inventory").findOneAndUpdate({product_code: { $eq: Product.PRODUCT_CODE} },
          { $set: {
          versions: parseInt(Product.VERSIONS),
          approved_version: parseInt(Product.APPROVED_VERSION),
          status: parseInt(Product.STATUS),
          rec_dose_rate: parseFloat(Product.REC_DOSE_RATE),
        } });
      }
    });
  },

  
  // async up(db, client) {
  //   await db
  //   .collection("Product")
  //   .find()
  //   .forEach(async function (Product) {
  //       db.collection("products").insertOne({
  //         product_code: Product.PRODUCT_CODE,
  //         name: Product.NAME,
  //         versions: parseInt(Product.VERSIONS),
  //         approved_version: parseInt(Product.APPROVED_VERSION),
  //         cost: parseFloat(Product.COST),
  //         cpl_hazard: [],
  //         date_created: new Date(Product.DATE_CREATED),
  //         eu_status: parseInt(Product.EU_STATUS),
  //         fda_status: parseInt(Product.FDA_STATUS),
  //         rec_dose_rate: parseFloat(Product.REC_DOSE_RATE),
  //         status: parseInt(Product.STATUS),
  //         ttb_status: parseInt(Product.TTB_STATUS),
  //         fda_ratings: parseInt(Product.FDA_RATINGS),
  //         fema_number: parseInt(Product.fema_number),
  //         cas_number: Product.cas_number,
  //         organic: null,
  //         kosher: null,
  //       });
  //   });
  // },

  async down(db, client) {
    // db.dropCollection("products");
  },
};
