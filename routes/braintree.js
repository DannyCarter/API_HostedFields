const express = require('express');
const router = express.Router();
const braintreeCtrl = require('../controllers/braintree')

router.get('/', braintreeCtrl.index);
router.post('/', braintreeCtrl.submitForm)
router.get('/transactions/', braintreeCtrl.transactions)


module.exports = router;