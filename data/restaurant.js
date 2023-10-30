const all = {
    products: [
        {
            id: 1,
            name: "Coke",
            description: "Coke",
            code: "Coke",
            img: "coke.jpg",
            categoryId: 1,
            createdAt: "2023-09-27T19:29:08.000Z",
            updatedAt: "2023-10-17T00:45:18.000Z",
            Category: {
                id: 1,
                name: "Beverage",
                code: "BEV",
                description: "Beverage",
                img: "drinks.jpg",
                createdAt: "2023-09-27T19:28:06.000Z",
                updatedAt: "2023-10-17T00:38:35.000Z"
            }
        },
        {
            id: 2,
            name: "Pique Macho",
            description: "Pique macho",
            code: "PIQUE",
            img: "pique-macho.jpg",
            categoryId: 2,
            createdAt: "2023-09-27T19:29:44.000Z",
            updatedAt: "2023-10-17T00:46:43.000Z",
            Category: {
                id: 2,
                name: "Food",
                code: "FOOD",
                description: "Food",
                img: "foods.jpg",
                createdAt: "2023-09-27T19:28:24.000Z",
                updatedAt: "2023-10-17T00:39:02.000Z"
            }
        },
        {
            id: 3,
            name: "Sillpancho",
            description: "Sillpancho",
            code: "SILL",
            img: "silpancho.jpg",
            categoryId: 2,
            createdAt: "2023-09-27T19:30:37.000Z",
            updatedAt: "2023-10-17T00:47:23.000Z",
            Category: {
                id: 2,
                name: "Food",
                code: "FOOD",
                description: "Food",
                img: "foods.jpg",
                createdAt: "2023-09-27T19:28:24.000Z",
                updatedAt: "2023-10-17T00:39:02.000Z"
            }
        },
        {
            id: 4,
            name: "Pollo Spiedo",
            description: "Pollo Spiedo",
            code: "SPIE",
            img: "spiedo.jpg",
            categoryId: 2
        },
        {
            id: 5,
            name: "Pollo Broaster",
            description: "Pollo Broaster",
            code: "BROA",
            img: "broaster.jpg",
            categoryId: 2
        }
    ],
    categories: [
        {
            id: 1,
            name: "Beverage",
            code: "BEV",
            description: "Beverage",
            img: "drinks.jpg",
            createdAt: "2023-09-27T19:28:06.000Z",
            updatedAt: "2023-10-17T00:38:35.000Z"
        },
        {
            id: 2,
            name: "Food",
            code: "FOOD",
            description: "Food",
            img: "foods.jpg",
            createdAt: "2023-09-27T19:28:24.000Z",
            updatedAt: "2023-10-17T00:39:02.000Z"
        }
    ],
    productPresentations: [
        {
            id: 1,
            unitOfMeasure: "units",
            productId: 1,
            productCode: "Coke",
            quantity: 10,
            brand: "COKE",
            currentPrice: 14,
            createdAt: "2023-09-27T19:32:43.000Z",
            updatedAt: "2023-09-27T19:32:43.000Z",
            Product: {
                id: 1,
                name: "Coke",
                description: "Coke",
                code: "Coke",
                img: "coke.jpg",
                categoryId: 1,
                createdAt: "2023-09-27T19:29:08.000Z",
                updatedAt: "2023-10-17T00:45:18.000Z"
            }
        },
        {
            id: 2,
            unitOfMeasure: "units",
            productId: 2,
            productCode: "PIQUE",
            quantity: 50,
            brand: "FOOD",
            currentPrice: 12,
            createdAt: "2023-09-27T19:33:03.000Z",
            updatedAt: "2023-09-27T19:33:03.000Z",
            Product: {
                id: 2,
                name: "Pique Macho",
                description: "Pique macho",
                code: "PIQUE",
                img: "pique-macho.jpg",
                categoryId: 2,
                createdAt: "2023-09-27T19:29:44.000Z",
                updatedAt: "2023-10-17T00:46:43.000Z"
            }
        },
        {
            id: 3,
            unitOfMeasure: "units",
            productId: 3,
            productCode: "SILL",
            quantity: 100,
            brand: "FOOD",
            currentPrice: 10,
            createdAt: "2023-09-27T19:33:34.000Z",
            updatedAt: "2023-09-27T19:33:34.000Z",
            Product: {
                id: 3,
                name: "Sillpancho",
                description: "Sillpancho",
                code: "SILL",
                img: "silpancho.jpg",
                categoryId: 2,
                createdAt: "2023-09-27T19:30:37.000Z",
                updatedAt: "2023-10-17T00:47:23.000Z"
            }
        },
        {
            id: 4,
            unitOfMeasure: "units",
            productId: 4,
            productCode: "SPIE",
            quantity: 25,
            brand: "FOOD",
            currentPrice: 12
        },
        {
            id: 5,
            unitOfMeasure: "units",
            productId: 5,
            productCode: "BROA",
            quantity: 25,
            brand: "FOOD",
            currentPrice: 14
        }
    ]
}

module.exports = {all};