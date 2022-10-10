const express = require("express")
const config = require("config")
const app = express()
const port = 3000
const braintree = require("braintree");
const router = express.router()

var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId: config.get("braintree.merchantId"),
    publicKey: config.get("braintree.publicKey"),
    privateKey: config.get("braintree.privateKey")
});
