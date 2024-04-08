const express = require('express')
const router = express.Router()
const productsController = require('../controllers/productsController')

/**
 * @openapi
 * tags:
 *   name: Products
 *   description: Products management
 * components:
 *   schemas:
 *     ProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the product
 *         status:
 *           type: string
 *           description: The status of the product (En vente, Invendu)
 *       required:
 *         - name
 *         - price
 *         - status
 *       example:
 *         name: Baguette rustique
 *         price: 1.25
 *         status: En vente | Invendu
 *     ProductResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The product's ID
 *         name:
 *           type: string
 *           description: The product's name
 *         price:
 *           type: number
 *           format: float
 *           description: The product's price
 *         status:
 *           type: string
 *           description: The product's status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the product was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the product was last updated
 *       example:
 *         id: 1
 *         name: Baguette rustique
 *         price: 1.25
 *         status: En vente | Invendu
 *         createdAt: '2021-04-12T07:20:50.52Z'
 *         updatedAt: '2021-04-12T07:20:50.52Z'
 */

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Returns a list of all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductResponse'
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Internal Server Error"
 */
router.get('/', productsController.getAllProducts)

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get a product by its ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Product not found"
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Internal Server Error"
 */
router.get('/:id', productsController.getProductById)

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Internal Server Error"
 */
router.post('/', productsController.createProduct)

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Updates a product
 *     tags: [Products]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Internal Server Error"
 */
router.put('/:id', productsController.updateProduct)

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product successfully deleted
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Product not found"
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Internal Server Error"
 */
router.delete('/:id', productsController.deleteProduct)

module.exports = router