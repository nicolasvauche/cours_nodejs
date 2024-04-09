const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const checkProductOwnership = require('../middlewares/checkProductOwnership')
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
 *         userId:
 *           type: integer
 *           description: The product owner's ID
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
 *         userId: 1
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
 * /products/user/{userId}:
 *   get:
 *     summary: Returns a list of products for a specific user
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user's ID to fetch products for
 *     responses:
 *       200:
 *         description: A list of products owned by the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: The specified user was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "User not found"
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
router.get('/user/:userId', productsController.getProductsByUserId)

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
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
router.post('/', auth, productsController.createProduct)

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Updates a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
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
router.put(
  '/:id',
  auth,
  checkProductOwnership,
  productsController.updateProduct
)

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Product successfully deleted"
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
router.delete(
  '/:id',
  auth,
  checkProductOwnership,
  productsController.deleteProduct
)

/**
 * @openapi
 * /products/user/status:
 *   put:
 *     summary: Updates the status to "Invendu" and applies a specified discount to the price of products for the connected user
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reductionRate:
 *                 type: number
 *                 description: The percentage rate of the discount to be applied to the product's price. Must be a positive number less than 100.
 *                 example: 25
 *             required:
 *               - reductionRate
 *     description: |
 *       Updates the status to "Invendu" and applies a discount based on the specified rate to the price of all products owned by the connected user that meet the following criteria:
 *       - The product's creation date is at least 4 hours ago.
 *       - The current status of the product is "En vente".
 *       The reductionRate must be provided in the request body.
 *     responses:
 *       200:
 *         description: Products status and price successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "[n] Product(s) status and price successfully updated"
 *       404:
 *         description: No products found to update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "No product to update"
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
router.put('/user/status', auth, productsController.updateProductsStatus)

module.exports = router
