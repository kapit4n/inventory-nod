'use strict';

const now = () => new Date();

async function clearSeedData(queryInterface, Sequelize) {
  const { Op } = Sequelize;
  await queryInterface.bulkDelete('CatalogTemplateProducts', {}, {});
  await queryInterface.bulkDelete('CatalogTemplateCategories', {}, {});
  await queryInterface.bulkDelete('CatalogTemplates', {
    slug: { [Op.in]: ['supermarket', 'chicken-store', 'butcher-shop', 'clothing-store', 'bakery', 'hardware-store'] }
  }, {});
}

function productImgPath(profileSlug, productName) {
  const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `assets/vendei/catalog/${profileSlug}/${slug}.svg`;
}

// ─── Template definitions ──────────────────────────────────────────────

const templates = [
  {
    name: 'Supermarket', slug: 'supermarket', description: 'Groceries, beverages and household products',
    businessType: 'supermarket',
    capabilities: ['BARCODE', 'WEIGHT_PRODUCTS', 'DISCOUNTS', 'CUSTOMERS', 'TAX_CALCULATION', 'LOYALTY'],
    receiptConfig: { paperWidth: 80, headerLines: ['Mi Supermarket'], footerLines: ['Gracias por su compra'] },
    posConfig: { catalogColumns: 4, showProductImages: true, quickProducts: [], defaultSellingMode: 'UNIT' },
    categories: [
      { name: 'Beverages', code: 'TPL-SM-C01', description: 'Drinks and juices', sortOrder: 0 },
      { name: 'Dairy', code: 'TPL-SM-C02', description: 'Milk, cheese and yogurt', sortOrder: 1 },
      { name: 'Snacks', code: 'TPL-SM-C03', description: 'Chips, cookies and treats', sortOrder: 2 },
      { name: 'Groceries', code: 'TPL-SM-C04', description: 'Rice, pasta, oil and staples', sortOrder: 3 },
      { name: 'Cleaning', code: 'TPL-SM-C05', description: 'Detergents and cleaning supplies', sortOrder: 4 },
    ],
    products: [
      { name: 'Coca Cola 2L', description: 'Gaseosa cola', catCode: 'TPL-SM-C01', price: 12, uom: 'UNIT', stock: 100, sortOrder: 0 },
      { name: 'Pepsi 2L', description: 'Gaseosa cola', catCode: 'TPL-SM-C01', price: 11, uom: 'UNIT', stock: 80, sortOrder: 1 },
      { name: 'Milk 1L', description: 'Leche entera', catCode: 'TPL-SM-C02', price: 7, uom: 'L', stock: 60, sortOrder: 2 },
      { name: 'Cheddar Cheese 200g', description: 'Queso cheddar', catCode: 'TPL-SM-C02', price: 14, uom: 'G', stock: 30, sortOrder: 3 },
      { name: 'Yogurt 500ml', description: 'Yogurt natural', catCode: 'TPL-SM-C02', price: 8, uom: 'ML', stock: 40, sortOrder: 4 },
      { name: 'Potato Chips 150g', description: 'Papas fritas', catCode: 'TPL-SM-C03', price: 9, uom: 'UNIT', stock: 50, sortOrder: 5 },
      { name: 'Chocolate Cookies 200g', description: 'Galletas de chocolate', catCode: 'TPL-SM-C03', price: 8, uom: 'UNIT', stock: 45, sortOrder: 6 },
      { name: 'Rice 1kg', description: 'Arroz blanco', catCode: 'TPL-SM-C04', price: 8, uom: 'KG', stock: 70, sortOrder: 7 },
      { name: 'Sugar 1kg', description: 'Azucar refinada', catCode: 'TPL-SM-C04', price: 7, uom: 'KG', stock: 65, sortOrder: 8 },
      { name: 'Cooking Oil 1L', description: 'Aceite vegetal', catCode: 'TPL-SM-C04', price: 12, uom: 'L', stock: 55, sortOrder: 9 },
      { name: 'Spaghetti 500g', description: 'Fideos espagueti', catCode: 'TPL-SM-C04', price: 5, uom: 'G', stock: 40, sortOrder: 10 },
      { name: 'Bread Loaf', description: 'Pan de molde', catCode: 'TPL-SM-C04', price: 6, uom: 'UNIT', stock: 30, sortOrder: 11 },
      { name: 'Laundry Detergent 1L', description: 'Detergente liquido', catCode: 'TPL-SM-C05', price: 18, uom: 'L', stock: 35, sortOrder: 12 },
      { name: 'Toilet Paper 4-pack', description: 'Papel higienico', catCode: 'TPL-SM-C05', price: 14, uom: 'PACK', stock: 50, sortOrder: 13 },
      { name: 'Dish Soap 500ml', description: 'Jabon para platos', catCode: 'TPL-SM-C05', price: 6, uom: 'ML', stock: 40, sortOrder: 14 },
    ],
  },
  {
    name: 'Chicken Store', slug: 'chicken-store', description: 'Chicken products, combos and sides',
    businessType: 'chicken-store',
    capabilities: ['BARCODE', 'COMBOS', 'DISCOUNTS', 'CUSTOMERS', 'TAX_CALCULATION'],
    receiptConfig: { paperWidth: 80, headerLines: ['Pollos Don Pedro'], footerLines: ['Vengan pronto!'] },
    posConfig: { catalogColumns: 3, showProductImages: true, quickProducts: [], defaultSellingMode: 'UNIT' },
    categories: [
      { name: 'Whole Chicken', code: 'TPL-CH-C01', description: 'Whole and grilled chicken', sortOrder: 0 },
      { name: 'Chicken Cuts', code: 'TPL-CH-C02', description: 'Breast, wings, thighs and fillets', sortOrder: 1 },
      { name: 'Combos', code: 'TPL-CH-C03', description: 'Meal combos with sides', sortOrder: 2 },
      { name: 'Sides', code: 'TPL-CH-C04', description: 'French fries, coleslaw and more', sortOrder: 3 },
      { name: 'Sauces', code: 'TPL-CH-C05', description: 'Spicy, BBQ and other sauces', sortOrder: 4 },
    ],
    products: [
      { name: 'Whole Chicken', description: 'Pollo entero', catCode: 'TPL-CH-C01', price: 35, uom: 'KG', stock: 25, sortOrder: 0 },
      { name: 'Grilled Chicken', description: 'Pollo a la brasa', catCode: 'TPL-CH-C01', price: 40, uom: 'UNIT', stock: 15, sortOrder: 1 },
      { name: 'Chicken Breast', description: 'Pechuga de pollo', catCode: 'TPL-CH-C02', price: 32, uom: 'KG', stock: 20, sortOrder: 2 },
      { name: 'Chicken Wings', description: 'Alitas de pollo', catCode: 'TPL-CH-C02', price: 25, uom: 'KG', stock: 18, sortOrder: 3 },
      { name: 'Chicken Thigh', description: 'Muslo de pollo', catCode: 'TPL-CH-C02', price: 22, uom: 'KG', stock: 20, sortOrder: 4 },
      { name: 'Chicken Fillet', description: 'Filete de pollo', catCode: 'TPL-CH-C02', price: 36, uom: 'KG', stock: 15, sortOrder: 5 },
      { name: 'Chicken Combo', description: 'Combo: pollo + papas + ensalada', catCode: 'TPL-CH-C03', price: 55, uom: 'UNIT', stock: 20, sortOrder: 6 },
      { name: 'Family Chicken Combo', description: 'Combo familiar: 2 pollos + papas + ensalada', catCode: 'TPL-CH-C03', price: 95, uom: 'UNIT', stock: 10, sortOrder: 7 },
      { name: 'Kids Combo', description: 'Combo infantil: alitas + papas + jugo', catCode: 'TPL-CH-C03', price: 35, uom: 'UNIT', stock: 15, sortOrder: 8 },
      { name: 'French Fries', description: 'Papas fritas', catCode: 'TPL-CH-C04', price: 12, uom: 'UNIT', stock: 30, sortOrder: 9 },
      { name: 'Coleslaw', description: 'Ensalada coleslaw', catCode: 'TPL-CH-C04', price: 8, uom: 'UNIT', stock: 20, sortOrder: 10 },
      { name: 'Mashed Potatoes', description: 'Pure de papas', catCode: 'TPL-CH-C04', price: 10, uom: 'UNIT', stock: 15, sortOrder: 11 },
      { name: 'Spicy Sauce', description: 'Salsa picante', catCode: 'TPL-CH-C05', price: 5, uom: 'UNIT', stock: 40, sortOrder: 12 },
      { name: 'BBQ Sauce', description: 'Salsa barbacoa', catCode: 'TPL-CH-C05', price: 5, uom: 'UNIT', stock: 35, sortOrder: 13 },
      { name: 'Garlic Sauce', description: 'Salsa de ajo', catCode: 'TPL-CH-C05', price: 5, uom: 'UNIT', stock: 30, sortOrder: 14 },
    ],
  },
  {
    name: 'Butcher Shop', slug: 'butcher-shop', description: 'Fresh meats, cuts and sausages',
    businessType: 'butcher',
    capabilities: ['WEIGHT_PRODUCTS', 'LOT_TRACKING', 'EXPIRATION', 'DISCOUNTS', 'CUSTOMERS', 'TAX_CALCULATION'],
    receiptConfig: { paperWidth: 80, headerLines: ['Carniceria Don Carlos'], footerLines: ['Carne fresca del dia'] },
    posConfig: { catalogColumns: 3, showProductImages: true, quickProducts: [], defaultSellingMode: 'WEIGHT' },
    categories: [
      { name: 'Beef', code: 'TPL-BC-C01', description: 'Res y cortes de res', sortOrder: 0 },
      { name: 'Pork', code: 'TPL-BC-C02', description: 'Cerdo y cortes de cerdo', sortOrder: 1 },
      { name: 'Poultry', code: 'TPL-BC-C03', description: 'Pollo y pavo', sortOrder: 2 },
      { name: 'Sausages', code: 'TPL-BC-C04', description: 'Embutidos y chorizos', sortOrder: 3 },
      { name: 'Marinades', code: 'TPL-BC-C05', description: 'Adobos y marinadas', sortOrder: 4 },
    ],
    products: [
      { name: 'Beef Steak', description: 'Bistec de res', catCode: 'TPL-BC-C01', price: 45, uom: 'KG', stock: 20, sortOrder: 0 },
      { name: 'Ground Beef', description: 'Carne molida', catCode: 'TPL-BC-C01', price: 38, uom: 'KG', stock: 25, sortOrder: 1 },
      { name: 'Beef Ribs', description: 'Costillas de res', catCode: 'TPL-BC-C01', price: 42, uom: 'KG', stock: 15, sortOrder: 2 },
      { name: 'Pork Loin', description: 'Lomo de cerdo', catCode: 'TPL-BC-C02', price: 35, uom: 'KG', stock: 20, sortOrder: 3 },
      { name: 'Pork Chops', description: 'Chuletas de cerdo', catCode: 'TPL-BC-C02', price: 32, uom: 'KG', stock: 18, sortOrder: 4 },
      { name: 'Chicken Breast', description: 'Pechuga de pollo', catCode: 'TPL-BC-C03', price: 30, uom: 'KG', stock: 25, sortOrder: 5 },
      { name: 'Whole Chicken', description: 'Pollo entero', catCode: 'TPL-BC-C03', price: 22, uom: 'KG', stock: 30, sortOrder: 6 },
      { name: 'Turkey Breast', description: 'Pechuga de pavo', catCode: 'TPL-BC-C03', price: 50, uom: 'KG', stock: 10, sortOrder: 7 },
      { name: 'Chorizo', description: 'Chorizo criollo', catCode: 'TPL-BC-C04', price: 28, uom: 'KG', stock: 15, sortOrder: 8 },
      { name: 'Longaniza', description: 'Longaniza artesanal', catCode: 'TPL-BC-C04', price: 25, uom: 'KG', stock: 12, sortOrder: 9 },
      { name: 'Morcilla', description: 'Morcilla', catCode: 'TPL-BC-C04', price: 20, uom: 'KG', stock: 10, sortOrder: 10 },
      { name: 'Adobo Mix', description: 'Mezcla de adobo', catCode: 'TPL-BC-C05', price: 15, uom: 'UNIT', stock: 20, sortOrder: 11 },
      { name: 'BBQ Marinade', description: 'Marinada para asado', catCode: 'TPL-BC-C05', price: 18, uom: 'UNIT', stock: 15, sortOrder: 12 },
      { name: 'Garlic Paste', description: 'Pasta de ajo', catCode: 'TPL-BC-C05', price: 12, uom: 'UNIT', stock: 20, sortOrder: 13 },
      { name: 'Chimichurri', description: 'Chimichurri casero', catCode: 'TPL-BC-C05', price: 20, uom: 'UNIT', stock: 10, sortOrder: 14 },
    ],
  },
  {
    name: 'Clothing Store', slug: 'clothing-store', description: 'Apparel, shoes and accessories',
    businessType: 'clothing',
    capabilities: ['BARCODE', 'PRODUCT_VARIANTS', 'DISCOUNTS', 'CUSTOMERS', 'TAX_CALCULATION', 'LOYALTY'],
    receiptConfig: { paperWidth: 80, headerLines: ['Moda Express'], footerLines: ['Cambios dentro de 30 dias'] },
    posConfig: { catalogColumns: 4, showProductImages: true, quickProducts: [], defaultSellingMode: 'VARIANT' },
    categories: [
      { name: 'T-Shirts', code: 'TPL-CL-C01', description: 'Camisetas y remeras', sortOrder: 0 },
      { name: 'Pants', code: 'TPL-CL-C02', description: 'Pantalones y jeans', sortOrder: 1 },
      { name: 'Dresses', code: 'TPL-CL-C03', description: 'Vestidos y faldas', sortOrder: 2 },
      { name: 'Shoes', code: 'TPL-CL-C04', description: 'Zapatos y calzado', sortOrder: 3 },
      { name: 'Accessories', code: 'TPL-CL-C05', description: 'Accesorios y complementos', sortOrder: 4 },
    ],
    products: [
      { name: 'Basic T-Shirt', description: 'Camiseta basica', catCode: 'TPL-CL-C01', price: 45, uom: 'UNIT', stock: 50, sortOrder: 0 },
      { name: 'Polo Shirt', description: 'Camisa polo', catCode: 'TPL-CL-C01', price: 65, uom: 'UNIT', stock: 30, sortOrder: 1 },
      { name: 'Graphic Tee', description: 'Camiseta estampada', catCode: 'TPL-CL-C01', price: 55, uom: 'UNIT', stock: 40, sortOrder: 2 },
      { name: 'Slim Jeans', description: 'Jeans slim fit', catCode: 'TPL-CL-C02', price: 120, uom: 'UNIT', stock: 25, sortOrder: 3 },
      { name: 'Cargo Pants', description: 'Pantalon cargo', catCode: 'TPL-CL-C02', price: 95, uom: 'UNIT', stock: 20, sortOrder: 4 },
      { name: 'Chinos', description: 'Pantalon chino', catCode: 'TPL-CL-C02', price: 85, uom: 'UNIT', stock: 22, sortOrder: 5 },
      { name: 'Summer Dress', description: 'Vestido de verano', catCode: 'TPL-CL-C03', price: 110, uom: 'UNIT', stock: 15, sortOrder: 6 },
      { name: 'Pencil Skirt', description: 'Falda lápiz', catCode: 'TPL-CL-C03', price: 75, uom: 'UNIT', stock: 18, sortOrder: 7 },
      { name: 'Sneakers', description: 'Zapatillas deportivas', catCode: 'TPL-CL-C04', price: 150, uom: 'UNIT', stock: 20, sortOrder: 8 },
      { name: 'Formal Shoes', description: 'Zapatos formales', catCode: 'TPL-CL-C04', price: 180, uom: 'UNIT', stock: 12, sortOrder: 9 },
      { name: 'Sandals', description: 'Sandalias', catCode: 'TPL-CL-C04', price: 65, uom: 'UNIT', stock: 25, sortOrder: 10 },
      { name: 'Belt', description: 'Cinturon de cuero', catCode: 'TPL-CL-C05', price: 45, uom: 'UNIT', stock: 30, sortOrder: 11 },
      { name: 'Cap', description: 'Gorra', catCode: 'TPL-CL-C05', price: 35, uom: 'UNIT', stock: 40, sortOrder: 12 },
      { name: 'Socks 3-pack', description: 'Calcetines surtidos', catCode: 'TPL-CL-C05', price: 25, uom: 'PACK', stock: 50, sortOrder: 13 },
      { name: 'Scarf', description: 'Bufanda', catCode: 'TPL-CL-C05', price: 40, uom: 'UNIT', stock: 20, sortOrder: 14 },
    ],
  },
  {
    name: 'Bakery', slug: 'bakery', description: 'Breads, pastries, cakes and desserts',
    businessType: 'bakery',
    capabilities: ['WEIGHT_PRODUCTS', 'COMBOS', 'DISCOUNTS', 'CUSTOMERS', 'TAX_CALCULATION', 'LOYALTY'],
    receiptConfig: { paperWidth: 57, headerLines: ['Panaderia La Delicia'], footerLines: ['Hecho con amor'] },
    posConfig: { catalogColumns: 3, showProductImages: true, quickProducts: [], defaultSellingMode: 'UNIT' },
    categories: [
      { name: 'Breads', code: 'TPL-BK-C01', description: 'Pan francés, pan de molde y más', sortOrder: 0 },
      { name: 'Pastries', code: 'TPL-BK-C02', description: 'Croissants, pastelitos y empanadas', sortOrder: 1 },
      { name: 'Cakes', code: 'TPL-BK-C03', description: 'Tortas y pasteles', sortOrder: 2 },
      { name: 'Cookies', code: 'TPL-BK-C04', description: 'Galletas, muffins y donas', sortOrder: 3 },
      { name: 'Beverages', code: 'TPL-BK-C05', description: 'Cafe, te y chocolate caliente', sortOrder: 4 },
    ],
    products: [
      { name: 'French Bread', description: 'Pan frances', catCode: 'TPL-BK-C01', price: 3, uom: 'UNIT', stock: 50, sortOrder: 0 },
      { name: 'White Bread Loaf', description: 'Pan de molde blanco', catCode: 'TPL-BK-C01', price: 8, uom: 'UNIT', stock: 30, sortOrder: 1 },
      { name: 'Whole Wheat Bread', description: 'Pan integral', catCode: 'TPL-BK-C01', price: 10, uom: 'UNIT', stock: 20, sortOrder: 2 },
      { name: 'Croissant', description: 'Croissant de mantequilla', catCode: 'TPL-BK-C02', price: 5, uom: 'UNIT', stock: 25, sortOrder: 3 },
      { name: 'Cheese Pastry', description: 'Pastelito de queso', catCode: 'TPL-BK-C02', price: 6, uom: 'UNIT', stock: 20, sortOrder: 4 },
      { name: 'Apple Pie Slice', description: 'Rebanada de tarta de manzana', catCode: 'TPL-BK-C02', price: 12, uom: 'UNIT', stock: 15, sortOrder: 5 },
      { name: 'Ham & Cheese Pastry', description: 'Pastelito de jamon y queso', catCode: 'TPL-BK-C02', price: 7, uom: 'UNIT', stock: 20, sortOrder: 6 },
      { name: 'Chocolate Cake', description: 'Torta de chocolate', catCode: 'TPL-BK-C03', price: 15, uom: 'UNIT', stock: 10, sortOrder: 7 },
      { name: 'Vanilla Cake', description: 'Torta de vainilla', catCode: 'TPL-BK-C03', price: 14, uom: 'UNIT', stock: 10, sortOrder: 8 },
      { name: 'Tres Leches Cake', description: 'Torta tres leches', catCode: 'TPL-BK-C03', price: 18, uom: 'UNIT', stock: 8, sortOrder: 9 },
      { name: 'Cookies Assorted 6pc', description: 'Galletas surtidas', catCode: 'TPL-BK-C04', price: 10, uom: 'PACK', stock: 25, sortOrder: 10 },
      { name: 'Muffin Blueberry', description: 'Muffin de arandanos', catCode: 'TPL-BK-C04', price: 8, uom: 'UNIT', stock: 18, sortOrder: 11 },
      { name: 'Donut Glazed', description: 'Rosquilla glaseada', catCode: 'TPL-BK-C04', price: 5, uom: 'UNIT', stock: 30, sortOrder: 12 },
      { name: 'Coffee Regular', description: 'Cafe regular', catCode: 'TPL-BK-C05', price: 6, uom: 'UNIT', stock: 100, sortOrder: 13 },
      { name: 'Hot Chocolate', description: 'Chocolate caliente', catCode: 'TPL-BK-C05', price: 7, uom: 'UNIT', stock: 80, sortOrder: 14 },
    ],
  },
  {
    name: 'Hardware Store', slug: 'hardware-store', description: 'Tools, building materials and electrical supplies',
    businessType: 'hardware',
    capabilities: ['BARCODE', 'VARIABLE_QUANTITY', 'DISCOUNTS', 'CUSTOMERS', 'TAX_CALCULATION'],
    receiptConfig: { paperWidth: 80, headerLines: ['Ferreteria Industrial'], footerLines: ['Garantia en todos nuestros productos'] },
    posConfig: { catalogColumns: 4, showProductImages: true, quickProducts: [], defaultSellingMode: 'UNIT' },
    categories: [
      { name: 'Tools', code: 'TPL-HW-C01', description: 'Hand tools and power tools', sortOrder: 0 },
      { name: 'Fasteners', code: 'TPL-HW-C02', description: 'Screws, nails and bolts', sortOrder: 1 },
      { name: 'Building', code: 'TPL-HW-C03', description: 'Cement, bricks and pipes', sortOrder: 2 },
      { name: 'Electrical', code: 'TPL-HW-C04', description: 'Cables, bulbs and switches', sortOrder: 3 },
      { name: 'Paint', code: 'TPL-HW-C05', description: 'Paints, brushes and supplies', sortOrder: 4 },
    ],
    products: [
      { name: 'Hammer', description: 'Martillo de uña', catCode: 'TPL-HW-C01', price: 65, uom: 'UNIT', stock: 20, sortOrder: 0 },
      { name: 'Screwdriver Set', description: 'Juego de destornilladores', catCode: 'TPL-HW-C01', price: 45, uom: 'PACK', stock: 15, sortOrder: 1 },
      { name: 'Pliers', description: 'Alicates universales', catCode: 'TPL-HW-C01', price: 38, uom: 'UNIT', stock: 18, sortOrder: 2 },
      { name: 'Tape Measure 5m', description: 'Cinta metrica 5 metros', catCode: 'TPL-HW-C01', price: 25, uom: 'UNIT', stock: 25, sortOrder: 3 },
      { name: 'Screws Assorted 100pc', description: 'Tornillos surtidos', catCode: 'TPL-HW-C02', price: 18, uom: 'PACK', stock: 40, sortOrder: 4 },
      { name: 'Nails 1kg', description: 'Clavos various', catCode: 'TPL-HW-C02', price: 15, uom: 'KG', stock: 35, sortOrder: 5 },
      { name: 'Bolts M8 50pc', description: 'Tornillos hexagonales M8', catCode: 'TPL-HW-C02', price: 22, uom: 'PACK', stock: 30, sortOrder: 6 },
      { name: 'Cement 50kg', description: 'Semento Portland', catCode: 'TPL-HW-C03', price: 48, uom: 'KG', stock: 50, sortOrder: 7 },
      { name: 'Brick (standard)', description: 'Ladrillo estandar', catCode: 'TPL-HW-C03', price: 3, uom: 'UNIT', stock: 200, sortOrder: 8 },
      { name: 'PVC Pipe 1m', description: 'Tubo PVC 1 metro', catCode: 'TPL-HW-C03', price: 12, uom: 'UNIT', stock: 40, sortOrder: 9 },
      { name: 'Electrical Cable 10m', description: 'Cable electrico 10 metros', catCode: 'TPL-HW-C04', price: 35, uom: 'UNIT', stock: 30, sortOrder: 10 },
      { name: 'Light Bulb LED 9W', description: 'Bombillo LED 9W', catCode: 'TPL-HW-C04', price: 15, uom: 'UNIT', stock: 50, sortOrder: 11 },
      { name: 'Paint White 1L', description: 'Pintura blanca 1 litro', catCode: 'TPL-HW-C05', price: 45, uom: 'L', stock: 25, sortOrder: 12 },
      { name: 'Paint Roller Set', description: 'Juego de rodillos', catCode: 'TPL-HW-C05', price: 28, uom: 'PACK', stock: 20, sortOrder: 13 },
      { name: 'Sandpaper 10-pack', description: 'Lija various', catCode: 'TPL-HW-C05', price: 12, uom: 'PACK', stock: 35, sortOrder: 14 },
    ],
  },
];

// ─── Seeder ─────────────────────────────────────────────────────────────

module.exports = {
  async up(queryInterface, Sequelize) {
    await clearSeedData(queryInterface, Sequelize);

    const db = require('../models');
    const { CatalogTemplate, CatalogTemplateCategory, CatalogTemplateProduct } = db;

    for (const tmpl of templates) {
      const template = await CatalogTemplate.create({
        name: tmpl.name,
        slug: tmpl.slug,
        description: tmpl.description,
        businessType: tmpl.businessType,
        active: true,
        capabilities: tmpl.capabilities,
        receiptConfig: tmpl.receiptConfig,
        posConfig: tmpl.posConfig,
        createdAt: now(),
        updatedAt: now(),
      });

      const catIdMap = new Map();
      for (const cd of tmpl.categories) {
        const cat = await CatalogTemplateCategory.create({
          catalogTemplateId: template.id,
          name: cd.name,
          code: cd.code,
          description: cd.description,
          sortOrder: cd.sortOrder,
          createdAt: now(),
          updatedAt: now(),
        });
        catIdMap.set(cd.code, cat.id);
      }

      for (const pd of tmpl.products) {
        const catId = catIdMap.get(pd.catCode) || null;
        await CatalogTemplateProduct.create({
          catalogTemplateId: template.id,
          catalogTemplateCategoryId: catId,
          name: pd.name,
          description: pd.description,
          code: pd.code,
          img: productImgPath(tmpl.slug, pd.name),
          price: pd.price,
          cost: Math.round(pd.price * 0.65 * 100) / 100,
          uom: pd.uom,
          stock: pd.stock,
          sortOrder: pd.sortOrder,
          createdAt: now(),
          updatedAt: now(),
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await clearSeedData(queryInterface, Sequelize);
  },
};
