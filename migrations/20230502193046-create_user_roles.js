module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    await db.collection('user_roles').insertMany(
      [{
        "name": "Member",
        "permissions": [
          "project_page",
          "inventory_page"
        ]
      },{
        "name": "Admin",
        "permissions": [
          "admin"
        ]
      },
      {
        "name": "Flavorist",
        "permissions": [
          "project_page",
          "inventory_page",
          "materials_page",
          "inventorystock_page",
          "products_page",
          "development_page",
          "customers_page",
          "suppliers_page",
        ]
      },
      {
        "name": "Purchasing",
        "permissions": [
          "inventory_page",
          "purchaseorder_page",
          "inventorystock_page",
          "forecast_page",
          "products_page",
          "suppliers_page",
          "stockcount_page"
        ]
      },
      {
        "name": "Batching",
        "permissions": [
          "inventory_page",
          "inventorystock_page",
          "forecast_page",
          "products_page",
          "customers_page",
          "suppliers_page",
        ]
      },
      {
        "name": "Warehouse",
        "permissions": [
          "inventory_page",
          "purchaseorder_page",
          "inventorystock_page",
          "forecast_page",
          "products_page",
        ]
      },
      {
        "name": "QC",
        "permissions": [
          "inventory_page",
          "purchaseorder_page",
          "inventorystock_page",
          "products_page",
          //TODO: ADD QC PAGE.
        ]
      },
      {
        "name": "Sales",
        "permissions": [
          "project_page",
          "purchaseorder_page",
          "products_page",
          "customers_page"
        ]
      },
      ]
    )
    
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    
    await db.dropCollection('user_roles');
  }
};
