const gateway = require('../config/credentials')

module.exports = {
    index,
    submitForm,
    transactions,
}

function createResultObject(status) {
    if (status) {
        result = {
            status: 'Sweet Success!',
            symbol: '＼（＾０＾）ノ',
            message:
                'Your transaction has been successfully processed!',
            success: true
        };
    } else {
        result = {
            status: 'Transaction Failed',
            symbol: '😖',
            message: `Your transaction was unsuccessful. Please provide another payment method and try again.`,
            success: false
        };
    }
    return result;
}

function index(req, res) {
    gateway.clientToken.generate({}, (err, response) => {
        const clientToken = response.clientToken;
        res.render('index', { token: clientToken });
    });
}

async function submitForm(req, res) {
    //destructring assignment of object to request body properties
    const { amount, payment_method_nonce: paymentMethodNonce } = req.body

    await gateway.customer.create({
        paymentMethodNonce,
        creditCard: {
            options: {
                verifyCard: true
            }
        }
    }).then(status => {
        if (status) {
            console.error(status)
            settlement = {
                settlement: createResultObject(status.success),
            }
            res.render('checkout', { settlement: settlement.settlement })
        } else {
            settlement = {
                settlement: createResultObject(status.success),
                token: status.customer.paymentMethods[0].token
            }
        }
    })
    gateway.transaction.sale({
        amount,
        paymentMethodToken: settlement.token,
        options: {
            submitForSettlement: true,
            storeInVaultOnSuccess: true
        }
    }).then(result => {
        if (result.success) {
            console.log(result.success)
            res.render('checkout', { settlement: settlement.settlement })

        } else {
            console.error(result)
            res.render('checkout', { settlement: settlement.settlement })
        }
    })

}

async function transactions(req, res, next) {
    const today = new Date();
    const timeframe = new Date();
    timeframe.setDate(today.getDate() - 90);
    const query = [];
   
    await gateway.transaction.search((search) => {
        search.createdAt().min(timeframe)
    }, (err, results) => {
        if (err) console.error(`Did not find any transactions: ${err}`)
        const obj = results.each(async (err, transactions) => {
            if (err) console.error(err)
            resultObj = {
                transactionId: transactions.id,
                type: transactions.type,
                status: transactions.status,
                amount: transactions.amount,
                customer: transactions.customer.id,
                method: transactions.creditCard.cardType,
                date: transactions.createdAt.split('T')[0]
            }
            await query.push(resultObj)
             res.render('show', { query: query })
             return next();
        })
    })
}




