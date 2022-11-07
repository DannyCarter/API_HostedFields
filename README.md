# Getting Started with HostedFields

## Requirments

Download [Node.js](https://nodejs.org/en/download/) if you don't already have it installled.

If you do have it downloded use ` node -v` in your terminal to double check.

## Running the appliation

Once you've confirmed you have Node use the following steps to run the application.

1. Using the terminal, navigate to the project folder and run ` npm install`, this will install all required packages.

2. Create a `.env` file in the project folder. Copy the contents of the ` outsideCredintials.env` file into your new `.env` file and insert your Braintree sandbox credentials.

3. In the terminal, be sure you're in the project folder and run `node server.js` to start the server.

4. In your web browser, visit the following PORT to view the application

```
localhost:3000
```

## Creating a Transaction

Once the server is running you'll be presented with a `Payment Form`, which uses [Hosted Fields](https://developer.paypal.com/braintree/docs/guides/hosted-fields/overview).

Fill out the form with your desired information and use card number `4012000077777777`

Once you've completed the form, click `SUBMIT HERE` and you'll be presented with a page that will tell you if your transaction attempt was successful or not.

## Display the last 90 days of transactions

Once you've reached the page that informs you of the transaction's status you're also presented with the option to create `another transaction` or display the last `90 days of transactions`

If you choose to display the last `90 days of transactions` you'll also be given the option to create `another transaction`.

## Testing

Using the test card `5105105105105100` will result in a transaction failed message and prompt user to try again.
