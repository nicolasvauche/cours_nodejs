const express = require('express')
const router = express.Router()
const defaultController = require('../controllers/defaultController')
const auth = require('../middlewares/auth')

/**
 * @openapi
 * tags:
 *   name: Default
 *   description: API default endpoints, like home
 */

/**
 * @openapi
 * /:
 *   get:
 *     summary: Returns a welcome message
 *     tags: [Default]
 *     description: Returns the welcome message
 *     responses:
 *       200:
 *         description: A welcome message in JSON format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                    description: The welcome message
 *                    example: Welcome to BakeAPI!
 *                 documentation:
 *                    description: The path to the Swagger documentation
 *                    example: /api-docs
 */
router.get('/', defaultController.index)

router.get('/protected', auth, defaultController.protected)

module.exports = router
