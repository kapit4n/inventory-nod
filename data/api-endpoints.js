'use strict';

/**
 * Catalog of HTTP routes (inventory-nod). Keep in sync with routes/*.js and app.js.
 */
module.exports = {
  groups: [
    {
      id: 'meta',
      title: 'Server',
      routes: [
        { method: 'GET', path: '/', description: 'API root JSON banner' },
        { method: 'GET', path: '/api/endpoints', description: 'Machine-readable list of routes (this catalog)' },
        { method: 'GET', path: '/api-docs', description: 'Swagger UI (interactive OpenAPI)' },
      ],
    },
    {
      id: 'upload',
      title: 'Uploads',
      routes: [
        {
          method: 'POST',
          path: '/products/upload-image',
          description: 'Multipart product image upload',
        },
        { method: 'POST', path: '/uploads/product-image', description: 'Alias for product image upload' },
      ],
    },
    {
      id: 'products',
      title: 'Products',
      routes: [
        { method: 'GET', path: '/products', description: 'List products (?include=inventoryLots optional)' },
        { method: 'POST', path: '/products', description: 'Create product' },
        { method: 'GET', path: '/products/addToInventory', description: 'Add stock (?id, amount, expiryDate?, batchCode?)' },
        { method: 'GET', path: '/products/reduceInventory', description: 'Reduce stock / FEFO lots (?id, amount)' },
        { method: 'GET', path: '/products/updateTotalSelled', description: 'Increment revenue sold total (?id, amount)' },
        { method: 'GET', path: '/products/updateQuantitySelled', description: 'Increment quantity sold (?id, amount)' },
        { method: 'GET', path: '/products/:id', description: 'Get product (?include=inventoryLots)' },
        { method: 'PUT', path: '/products/:id', description: 'Update product' },
        { method: 'DELETE', path: '/products/:id', description: 'Delete product' },
      ],
    },
    {
      id: 'presentations',
      title: 'Product presentations',
      routes: [
        { method: 'GET', path: '/productPresentations', description: 'List presentations' },
        { method: 'POST', path: '/productPresentations', description: 'Create presentation' },
        { method: 'GET', path: '/productPresentations/:id', description: 'Get presentation' },
        { method: 'PUT', path: '/productPresentations/:id', description: 'Update presentation' },
        { method: 'DELETE', path: '/productPresentations/:id', description: 'Delete presentation' },
      ],
    },
    {
      id: 'clients',
      title: 'Clients (customers)',
      routes: [
        { method: 'GET', path: '/clients', description: 'List clients' },
        { method: 'POST', path: '/clients', description: 'Create client' },
        { method: 'GET', path: '/clients/:id', description: 'Get client' },
        { method: 'PUT', path: '/clients/:id', description: 'Update client' },
        { method: 'DELETE', path: '/clients/:id', description: 'Delete client' },
      ],
    },
    {
      id: 'cashiers',
      title: 'Cashiers',
      routes: [
        { method: 'GET', path: '/cashiers', description: 'List cashiers' },
        { method: 'POST', path: '/cashiers', description: 'Create cashier' },
        { method: 'GET', path: '/cashiers/:id', description: 'Get cashier' },
        { method: 'PUT', path: '/cashiers/:id', description: 'Update cashier' },
        { method: 'DELETE', path: '/cashiers/:id', description: 'Delete cashier' },
      ],
    },
    {
      id: 'categories',
      title: 'Categories',
      routes: [
        { method: 'GET', path: '/categories', description: 'List categories' },
        { method: 'POST', path: '/categories', description: 'Create category' },
        { method: 'GET', path: '/categories/:id', description: 'Get category' },
        { method: 'PUT', path: '/categories/:id', description: 'Update category' },
        { method: 'DELETE', path: '/categories/:id', description: 'Delete category' },
      ],
    },
    {
      id: 'vendors',
      title: 'Vendors',
      routes: [
        { method: 'GET', path: '/vendors', description: 'List vendors' },
        { method: 'POST', path: '/vendors', description: 'Create vendor' },
        { method: 'GET', path: '/vendors/:id', description: 'Get vendor' },
        { method: 'PUT', path: '/vendors/:id', description: 'Update vendor' },
        { method: 'DELETE', path: '/vendors/:id', description: 'Delete vendor' },
      ],
    },
    {
      id: 'uom',
      title: 'Units of measure',
      routes: [
        { method: 'GET', path: '/unitOfMeasures', description: 'List units' },
        { method: 'POST', path: '/unitOfMeasures', description: 'Create unit' },
        { method: 'GET', path: '/unitOfMeasures/:id', description: 'Get unit' },
        { method: 'PUT', path: '/unitOfMeasures/:id', description: 'Update unit' },
        { method: 'DELETE', path: '/unitOfMeasures/:id', description: 'Delete unit' },
      ],
    },
    {
      id: 'orders',
      title: 'Orders',
      routes: [
        { method: 'GET', path: '/orders', description: 'List orders' },
        { method: 'POST', path: '/orders', description: 'Create order' },
      ],
    },
    {
      id: 'orderDetails',
      title: 'Order details',
      routes: [
        { method: 'GET', path: '/orderDetails', description: 'List order lines' },
        { method: 'POST', path: '/orderDetails', description: 'Create order line' },
      ],
    },
    {
      id: 'purchaseItems',
      title: 'Purchase items',
      routes: [
        { method: 'GET', path: '/purchase-items', description: 'List (?filter[where][productId]=)' },
        { method: 'POST', path: '/purchase-items', description: 'Create purchase line (expiryDate?, batchCode?)' },
        { method: 'PUT', path: '/purchase-items/:id', description: 'Update purchase line' },
        { method: 'DELETE', path: '/purchase-items/:id', description: 'Delete purchase line' },
      ],
    },
    {
      id: 'inventoryLots',
      title: 'Inventory lots',
      routes: [
        { method: 'GET', path: '/inventory-lots', description: 'List lots (?productId= required)' },
        { method: 'POST', path: '/inventory-lots', description: 'Receive stock into a dated lot' },
        { method: 'GET', path: '/inventory-lots/:id', description: 'Get lot' },
        { method: 'DELETE', path: '/inventory-lots/:id', description: 'Remove lot and adjust stock' },
      ],
    },
  ],
};
