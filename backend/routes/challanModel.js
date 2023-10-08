const express = require('express');
const router = express.Router();
const Challan = require('../models/challanModel.js');
const SMSLog = require('../models/smsLogModel.js');
// Example route to get all challans
router.get('/', async (req, res) => {
    try {
        const challans = await Challan.find();
        res.json(challans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Route to add a new challan
router.post('/add', async (req, res) => {
    const { challanId, vehicleNumber, violationType, amount, dueDate, ownerDetails } = req.body;

    // Create a new Challan instance using the received data
    const newChallan = new Challan({
        challanId,
        vehicleNumber,
        violationType,
        amount,
        dueDate,
        ownerDetails,
        paymentStatus: 'Unpaid',  // Default value
        reminderSent: false       // Default value
    });

    try {
        const savedChallan = await newChallan.save();
        res.status(201).json(savedChallan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/add', async (req, res) => {
    var { challanId, vehicleNumber, violationType, amount, dueDate, ownerDetails, issueDate, paymentStatus } = req.body;
    // Find and update the challan
    try {
        const updatedChallan = await Challan.findOneAndUpdate(
            { challanId },
            { vehicleNumber, violationType, amount, dueDate, ownerDetails, issueDate, paymentStatus },
            { new: true }
        );
        res.status(200).json(updatedChallan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
    


const plivo = require('plivo');
const cron = require('node-cron');

const PLIVO_AUTH_ID = 'UserId';       // Your Plivo Auth ID
const PLIVO_AUTH_TOKEN = 'Auth'; // Your Plivo Auth Token
const  	PLIVO_SRC_NUMBER = '+91999999999'; // Your Plivo number

const client = new plivo.Client(PLIVO_AUTH_ID, PLIVO_AUTH_TOKEN);

function sendSMSReminder(to, message) {
    return client.messages.create({
        src: PLIVO_SRC_NUMBER,
        dst: to,
        text: message,
        url: 'https://<yourdomain>.com/sms_status/'
    });
}

async function logSMS(to, message, relatedChallanId, status = 'Pending') {
    try {
        const smsLog = new SMSLog({
            mobileNumber: to,
            messageContent: message,
            deliveryStatus: status,
            relatedChallan: relatedChallanId
        });
        await smsLog.save();
        console.log(`Logged SMS to ${to}.`);
    } catch (error) {
        console.error('Error logging SMS:', error);
    }
}


// Schedule the job to run weekly (e.g., every Monday at 9am)
cron.schedule('37 01 * * *', async () => {
    try {
        // Fetch all unpaid challans
        const unpaidChallans = await Challan.find({ paymentStatus: 'Unpaid' });

        for (let challan of unpaidChallans) {
            // const message = `Dear ${challan.ownerDetails.name}, please pay your pending challan with ID ${challan.challanId}.`;
			const message = `Dear ${challan.ownerDetails.name}, 
Your vehicle with number ${challan.vehicleNumber} has been issued a challan with ID ${challan.challanId} on ${new Date(challan.issueDate).toLocaleDateString()}. 
You have been cited for a ${challan.violationType} violation. 
Please make the necessary payment of Rupees ${challan.amount} at the earliest to avoid further penalties. Thank you. Telangana Police`;


            // Send SMS reminder
            const response = await sendSMSReminder(challan.ownerDetails.mobileNumber, message);
            console.log(response);

			await logSMS(challan.ownerDetails.mobileNumber, message, challan._id);


            // (Optional) Update the challan to mark the reminder as sent
            challan.reminderSent = true;
            await challan.save();
        }

        console.log('Reminders sent successfully!');
    } catch (err) {
        console.error('Error sending reminders:', err);
    }
});



const ANSWER_URL = 'https://chargeanswer.s3.ap-south-1.amazonaws.com/plivo_silence.xml';


function makeCall(to) {

    
	return new Promise((resolve, reject) => {
        client.calls.create(
            PLIVO_SRC_NUMBER,
            to,
            ANSWER_URL,
            {
                answerMethod: "GET",
            }
        ).then(function (response) {
            console.log(response);
            const callUuid = response.requestUuid;
            resolve(callUuid);
        }, function (err) {
            reject(err);
        });
    });
}

async function speakToCall(requestUuid, text) {
    return client.calls.speakText(
        requestUuid, 
        text,
        {
            voice: "WOMAN",
            language: "en-GB",
            legs: "aleg",
            loop: true,
            mix: false
        }    
        
    );
}

// Schedule the job to run weekly (e.g., every Monday at 10am)
cron.schedule('37 01 * * *', async () => {
    try {
        // Fetch all unpaid challans
        const unpaidChallans = await Challan.find({ paymentStatus: 'Unpaid' });

        for (let challan of unpaidChallans) {
            // Make the call
            const requestUuid = await makeCall(challan.ownerDetails.mobileNumber);

            console.log("Retrieved requestUuid:", requestUuid);
            console.log("Reminder Call sent to", challan.ownerDetails.mobileNumber);
            const message = `Dear ${challan.ownerDetails.name}, 
Your vehicle with number ${challan.vehicleNumber} has been issued a challan with ID ${challan.challanId} on ${new Date(challan.issueDate).toLocaleDateString()}. 
You have been cited for a ${challan.violationType} violation. 
Please make the necessary payment of Rupees ${challan.amount} at the earliest to avoid further penalties. Thank you. Telangana Police`;
            setTimeout(async () => {
                // Speak text to the initiated call
                await speakToCall(requestUuid, message);
            }, 10000); // Waits for 5 seconds before speaking. Adjust as needed.
        }

        console.log('Reminder calls made successfully!');
    } catch (err) {
        console.error('Error making reminder calls:', err);
    }
});



module.exports = router;
