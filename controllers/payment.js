const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "tgvvyqxn3mddsb8j",
  publicKey: "hwjhq49bfpkf46c7",
  privateKey: "237bd556069be563b108b98cd0b5edd1",
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    // pass clientToken to your front-end
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(response);
    }
  });
};

exports.processTransaction = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    }
  );
};
