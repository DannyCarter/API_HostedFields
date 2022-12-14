(function () {
	var clientToken = document.getElementById("client-token").innerText;
	var form = document.querySelector("#payment-form");
	var hiddenNonceInput = document.querySelector("#nonce");
	var submit = document.querySelector('button[type="submit"]');

	braintree.client.create(
		{
			authorization: clientToken,
		},
		function (clientErr, clientInstance) {
			if (clientErr) {
				console.error(clientErr, "err");
				return;
			}
			//(properties)objs -> options.
			braintree.hostedFields.create(
				{
					client: clientInstance,
					styles: {
						input: {
							"font-size": "14px",
						},
						"input.invalid": {
							color: "red",
						},
						"input.valid": {
							color: "green",
						},
					},
					fields: {
						number: {
							container: "#card-number",
							placeholder: " 1111-2222-3333-4444",
						},
						cvv: {
							container: "#cvv",
							placeholder: " 123",
						},
						expirationDate: {
							container: "#expiration-date",
							placeholder: " 03/28",
						},
						postalCode: {
							container: "#postal-code",
							placeholder: " 90210",
						}
					},
				},
				
				function (hostedFieldsErr, hostedFieldsInstance) {
					if (hostedFieldsErr) {
						console.error(hostedFieldsErr);
						return;
					}
					submit.removeAttribute("disabled");
					form.addEventListener("submit",
						function (event) {
							event.preventDefault();

							//payload obj(concept), sending or receiving success from a function or request
							hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
								if (tokenizeErr) {
									console.log(tokenizeErr);
									alert(tokenizeErr.code);
									return;
								}
								hiddenNonceInput.value = payload.nonce;
								alert("Payment Processing...");
								console.log("Got a nonce: " + payload.nonce);
								form.submit();
							});
						},
						false
					);
				}
			);
		}
	);
})();
