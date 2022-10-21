const gateway = require("../config/credentials");

module.exports = {
	index,
	submitForm,
	transactions,
};

function createResultObject(status) {
	if (status) {
		result = {
			outcome: "Sweet Success!",
			symbol: "＼（＾０＾）ノ",
			message: "Your transaction has been successfully processed!",
			success: true,
		};
	} else {
		result = {
			outcome: "Transaction Failed",
			symbol: "😖",
			message: `Your transaction was unsuccessful. Please provide another payment method and try again.`,
			success: false,
		};
	}
	return result;
}
//clientToken
function index(req, res) {
	gateway.clientToken.generate({}, (err, response) => {
		//console.log(response, "Response", response.clientToken)
		const clientToken = response.clientToken;
		console.log(response, "Response", response.success);
		res.render("index", { token: clientToken });
	});
}

async function submitForm(req, res) {
	//destructring assignment of object to request body properties
	//linked to the index.js form
	const {
		amount,
		payment_method_nonce: paymentMethodNonce,
		cardholderName,
	} = req.body;

	await gateway.customer
		.create({
			//using paymentMethodNonce
			paymentMethodNonce,
			creditCard: {
				//verifying card
				options: {
					verifyCard: true,
				},
			},
		})
		.then((status) => {
			console.log(status.customer.paymentMethods[0].token);
			console.log(status.success);
			//if(true) create valid result obj
			if (status) {
				lifeCycleStatus = {
					//HTML > function
					settlement: createResultObject(status.success),
					token: status.customer.paymentMethods[0].token,
				};
			} else {
				console.error(status);
				lifeCycleStatus = {
					settlement: createResultObject(!status.success),
				};
				res.render("checkout", { settlement: lifeCycleStatus.settlement });
			}
		});

	await gateway.transaction
		.sale({
			//create transaction using paymentMethodToken
			amount,
			paymentMethodToken: lifeCycleStatus.token,
			options: {
				//storing in vault
				submitForSettlement: true,
				storeInVaultOnSuccess: true,
			},
		})
		.then((result) => {
			if (result.success) {
				console.log(result.success);
				res.render("checkout", { settlement: lifeCycleStatus.settlement });
			} else {
				console.error(result);
				res.render("checkout", { settlement: lifeCycleStatus.settlement });
			}
		});
}

//transctions.ejs
async function transactions(req, res) {
	const today = new Date();
	const timeframe = new Date();
	timeframe.setDate(today.getDate() - 90);
	//[empty obj]
	const query = [];

	await gateway.transaction.search(
		//req search of txns based on timeframe
		(search) => {
			search.createdAt().min(timeframe);
		},
		(err, results) => {
			if (err) console.error(`Did not find any transactions: ${err}`);
			results.each(async (err, transactions) => {
				if (err) console.error(err);
				console.log(transactions.creditCard.cardholderName);
				resultObj = {
					transactionId: transactions.id,
					type: transactions.type,
					status: transactions.status,
					amount: transactions.amount,
					cardholderName: transactions.creditCard.cardholderName,
					customer: transactions.customer.id,
					method: transactions.creditCard.cardType,
					date: transactions.createdAt.split("T")[0],
				};
				//push obj into query arr
				await query.push(resultObj);
			});
		}
	);
	//set Timeout to wait for data to render
	const checkSearch = () => {
		setTimeout(function () {
			res.render("transactions", { query: query });
		}, 5000);
	};
	checkSearch();
}
