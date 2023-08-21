import { validationResult } from 'express-validator'
import { deleteImageIfError, getImageUrl, deleteImage } from '../utils/file.js'
import getDataFromDB from '../utils/getDataFromDB.js'

export const getAdminPage = async (req, res, next) => {
    try {
        res.render('admin/adminPage', {
            pageTitle: 'Admin',
        })
    } catch (err) {
        next(err)
    }
}

export const getProdTypePage = async (req, res, next) => {
    try {
        const { types } = await getDataFromDB(
            req.db.productTypes,
            req.db.productBrands
        )
        res.render('admin/prodType', {
            pageTitle: `Mahsulot turi qo'shish`,
            errorMessage: null,
            types,
        })
    } catch (err) {
        next(err)
    }
}

export const createType = async (req, res, next) => {
    try {
        const { types } = await getDataFromDB(
            req.db.productTypes,
            req.db.productBrands
        )
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.render('admin/prodType', {
                pageTitle: `Mahsulot turi qo'shish`,
                errorMessage: errors.array()[0].msg,
                types,
            })
        }
        let { name } = req.body
        name = name.toLowerCase()
        const type = await req.db.productTypes.findOne({
            where: { name: `${name}` },
        })
        if (type) {
            return res.render('admin/prodType', {
                pageTitle: `Mahsulot turi qo'shish`,
                errorMessage: `${name} oldin qo'shilgan`,
                types,
            })
        }
        await req.db.productTypes.create({ name })
        res.redirect('/admin/type')
    } catch (err) {
        next(err)
    }
}

export const deleteType = async (req, res, next) => {
    try {
        const { typeId } = req.body
        await req.db.productTypes.destroy({ where: { id: parseInt(typeId) } })
        res.redirect('/admin/type')
    } catch (err) {
        next(err)
    }
}

export const getProdBrandPage = async (req, res, next) => {
    try {
        const { brands } = await getDataFromDB(
            req.db.productTypes,
            req.db.productBrands
        )
        res.render('admin/prodBrand', {
            pageTitle: `Mahsulot brandi qo'shish`,
            errorMessage: null,
            brands,
        })
    } catch (err) {
        next(err)
    }
}

export const createBrand = async (req, res, next) => {
    try {
        const { brands } = await getDataFromDB(
            req.db.productTypes,
            req.db.productBrands
        )
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.render('admin/prodBrand', {
                pageTitle: `Mahsulot brandi qo'shish`,
                errorMessage: errors.array()[0].msg,
                brands,
            })
        }
        let { name } = req.body
        name = name.toLowerCase()
        const brand = await req.db.productBrands.findOne({
            where: { name: `${name}` },
        })
        if (brand) {
            return res.render('admin/prodBrand', {
                pageTitle: `Mahsulot brandi qo'shish`,
                errorMessage: `${name} oldin qo'shilgan`,
                brands,
            })
        }
        await req.db.productBrands.create({ name })
        res.redirect('/admin/brand')
    } catch (err) {
        next(err)
    }
}

export const deleteBrand = async (req, res, next) => {
    try {
        const { brandId } = req.body
        await req.db.productBrands.destroy({ where: { id: parseInt(brandId) } })
        res.redirect('/admin/prodBrand')
    } catch (err) {
        next(err)
    }
}

export const getAddProduct = async (req, res, next) => {
    try {
        const { brands, types } = await getDataFromDB(
            req.db.productTypes,
            req.db.productBrands
        )
        res.render('admin/addProduct', {
            pageTitle: 'Mahsulot qo`shish',
            validationErrors: [],
            product: {
                name: '',
                price: '',
                top: '',
                brandId: '',
                typeId: '',
                imageUrl: '',
            },
            hasError: null,
            types,
            brands,
        })
    } catch (err) {
        next(err)
    }
}

export const createProduct = async (req, res, next) => {
    try {
        const { brands, types } = getDataFromDB
        let { name, price, top, brandId, typeId, ...productInfo } = req.body
        const errors = validationResult(req)
        const images = req.files
        const imageUrl = getImageUrl(images)
        let imageError = null
        if (imageUrl.length <= 0) {
            imageError = true
        }
        if (!errors.isEmpty() || imageError || !typeId) {
            if (imageUrl.length > 0) {
                deleteImageIfError(imageUrl)
            }
            return res.render('admin/addProduct', {
                pageTitle: 'Mahsulot qo`shish',
                validationErrors: errors.array(),
                product: {
                    name,
                    price,
                    top,
                    brandId,
                    typeId,
                    imageUrl,
                },
                hasError: true,
                types,
                brands,
            })
        }
        brandId = parseInt(brandId)
        typeId = parseInt(typeId)
        top = top === 'top' ? true : false
        const data = []
        for (let i = 0; i < productInfo.title.length; i++) {
            const title = productInfo.title[i]
            const description = productInfo.description[i]
            data.push({ title, description })
        }
        const product = await req.db.products.create({
            name,
            price,
            productBrandId: brandId ? brandId : null,
            productTypeId: typeId,
            top,
        })
        imageUrl.forEach((img) => {
            req.db.images.create({
                imageUrl: img,
                productId: product.id,
            })
        })
        if (productInfo) {
            data.forEach((i) => {
                req.db.productInfo.create({
                    title: i.title,
                    description: i.description,
                    productId: product.id,
                })
            })
        }
        res.redirect('/')
    } catch (err) {
        next(err)
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const { prodId } = req.body
        const product = await req.db.products.findOne({
            where: { id: prodId },
            include: req.db.images,
        })
        await req.db.products.destroy({
            where: { id: prodId },
        })
        const orders = await req.db.orders.findAll({ include: ['products'] })
        for (const order of orders) {
            const orderProducts = order.products
            const index = orderProducts.findIndex(
                (orderProduct) => orderProduct.id === prodId
            )
            if (index !== -1) {
                // Remove the product from the order's products array
                orderProducts.splice(index, 1)

                if (orderProducts.length === 0) {
                    // If the order's products array is empty, delete the entire order
                    await order.destroy({ where: { id: order.id } })
                }
            }
        }
        const imageUrl = product.images.map((img) => {
            return img.imageUrl
        })
        deleteImage(imageUrl)
        res.redirect('/')
    } catch (err) {
        next(err)
    }
}

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await req.db.orders.findAll({ include: ['products'] })
        const updatedOrders = await Promise.all(
            orders.map(async (order) => {
                // Fetch 'products' array for each order
                const products = order.products

                if (products.length === 0) {
                    // If the order's products array is empty, delete the entire order
                    await order.destroy({ where: { id: order.id } })
                }

                // Fetch images for each product in 'products' array
                let orderItem
                const productsWithImages = await Promise.all(
                    products.map(async (product) => {
                        product.images = await product.getImages()
                        orderItem = product.orderItem
                        return product
                    })
                )
                // Update 'products' array of the current order with products containing 'images' property
                order.products = productsWithImages
                order.orderItem = orderItem

                // Return updated order object
                return order
            })
        )
        res.render('admin/allOrders', {
            pageTitle: 'Admin',
            orders: updatedOrders,
        })
    } catch (err) {
        next(err)
    }
}
