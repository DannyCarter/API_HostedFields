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
	const { amount, payment_method_nonce: paymentMethodNonce } = req.body;
	try {
		await gateway.customer
			.create({
				paymentMethodNonce,
				creditCard: {
					options: {
						verifyCard: true,
					},
				},
			})
			.then((status) => {
				if (status.success) {
					console.log(status.success);
					settlement = {
						response: createResultObject(status.success),
						token: status.customer.paymentMethods[0].token,
					};
				} else {
					console.log(status);
					const creditCardErrors = status.errors.deepErrors();
					console.log(creditCardErrors, "this is where the error happened");
					(settlement = createResultObject(status.success)),
						res.render("checkout", { settlement: settlement });
				}
			});
		await gateway.transaction
			.sale({
				amount,
				paymentMethodToken: settlement.token,
				options: {
					submitForSettlement: true,
					storeInVaultOnSuccess: true,
				},
			})
			.then((result) => {
				if (result.success) {
					console.log(result.success);
					res.render("checkout", { settlement: settlement.response });
				} else {
					console.error(result);
					res.render("checkout", { settlement: settlement.response });
				}
			});
	} catch (err) {
		console.error(err);
	}
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
				resultObj = {
					transactionId: transactions.id,
					type: transactions.type,
					status: transactions.status,
					amount: transactions.amount,
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
