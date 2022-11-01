# Getting Started with HostedFields

## Requirments
Download [Node.js](https://nodejs.org/en/download/) if you don't already have it installled.

If you do have it downloded use ``` node -v``` in your terminal to double check.

## Running the appliation

Once you've confirmed you hae Node use the following steps to run the application.

1. Using the terminal, navigate to the project folder and run ``` npm install```, this will install all required packages.

2. Create a ```.env``` file in the project folder. Copy the contents of the ``` outsideCreditials.env``` file into your new ```.env``` file and insert your Braintree sandbox credentials.

3. In the terminal, be sure you're in the project folder and run ```node server.js``` to start the server.

4. In your web browser, visit ```localhost:3000``` to view the application