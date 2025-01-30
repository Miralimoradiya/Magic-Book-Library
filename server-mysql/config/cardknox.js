// server-mysql/config/cardknox.js
const axios = require('axios');

async function processCardknoxPayment(amount, cardNumber, cardExpiration, cvv, name) {
    try {
        const url = 'https://x1.cardknox.com/gatewayjson';

        const requestData = {
            xExp: cardExpiration,
            xKey: process.env.CARDKNOX_API_KEY,
            xVersion: '4.5.9',
            xSoftwareName: 'Library Management System',
            xSoftwareVersion: '1.0.0',
            xCommand: 'cc:sale',
            xAmount: amount,
            xCardNum: cardNumber,
            xCVV: cvv,
            xName: name,
            xAllowDuplicate: true
        };

        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'xKey': process.env.CARDKNOX_API_KEY,
            },
        });
        if (response.data.xResult === 'A') {
            return response.data;
        } else {
            console.log(response.data)
            console.log('Transaction Declined:', response.data.xError);
            return response.data
        }
    } catch (error) {
        console.error('Error processing payment:', error.message);
    }
}

// const amount = 1.00;
// const cardNumber = '4242424242424242';
// const cardExpiration = '1225';
// const cvv = '123';

// processCardknoxPayment(amount, cardNumber, cardExpiration, cvv);

module.exports = { processCardknoxPayment }