const data = require('./restaurant');

async  function load_products() {
    const PRODUCTS_URL = "http://localhost:3000/products"
    const remoteProducts = await (await fetch(PRODUCTS_URL)).json();

    const localProducts = data.all.products;
    const diffProducts = diffByKey(remoteProducts, "code", data.all.products, "code")

    localProducts.forEach(product => {
        if (diffProducts.has(product.code)) {
            console.log("Load this product", product)
            fetch(PRODUCTS_URL, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            }).then(data => {
                console.log(data)
            })
        }
    })
}

async  function load_product_presentations() {
    const PRODUCTS_URL = "http://localhost:3000/products"
    const products = await (await fetch(PRODUCTS_URL)).json();
    const productIdByCode = {}
    products.forEach(product => {
        productIdByCode[product.code] = product.id
    });

    console.log("AFTER FETCH PRODUCT");
    
    const PRODUCT_PRESENTATIONS_URL = "http://localhost:3000/productPresentations"
    const remoteProductPresentations = await (await fetch(PRODUCT_PRESENTATIONS_URL)).json();

    const localProductPresentations = data.all.productPresentations;
    console.log(remoteProductPresentations);

    const resultDiff = diffProductPresentationCollections(remoteProductPresentations, localProductPresentations)

    localProductPresentations.forEach(productPresentation => {
        if (resultDiff.has(productPresentation.productCode + productPresentation.unitOfMeasure)) {
            console.log("Load this productPresentation", productPresentation)
            // populate product id
            const postProductPresentation = {...productPresentation, productId: productIdByCode[productPresentation.productCode]}
            console.log(postProductPresentation)

            fetch(PRODUCT_PRESENTATIONS_URL, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postProductPresentation)
            }).then(data => {
                console.log(data)
            })
        }
    })
}

async  function load_categories() {
    const CATEGORIES_URL = "http://localhost:3000/categories"
    const remoteCats = await (await fetch(CATEGORIES_URL)).json();
    const localCats = data.all.categories;
    const diffCategories = diffByKey(remoteCats, "code", localCats, "code")

    localCats.forEach(category => {
        if (diffCategories.has(category.code)) {
            console.log("Load this category", category)
            fetch(CATEGORIES_URL, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(category)
            }).then(data => {
                console.log(data)
            })
        }
    })
}

function diffByKey(firstCollection, fKey, secondCollection, sKey) {
    const setFirstCollection = new Set(firstCollection.map(d => d[fKey]))
    
    const setSecondCollection = new Set(secondCollection.map(d => d[fKey]))

    return getDifference(setSecondCollection, setFirstCollection)
}

function diffProductPresentationCollections(remoteCollection, localCollection) {
    const remoteDataSet = new Set(remoteCollection.map(d => d.Product.code + d.unitOfMeasure))
    
    const localDataSet = new Set(localCollection.map(d => d.productCode + d.unitOfMeasure))

    return getDifference(localDataSet, remoteDataSet)
}

function getDifference(setA, setB) {
    return new Set(
        [...setA].filter(e => !setB.has(e))
    );
}


load_categories();
load_products();
load_product_presentations();
