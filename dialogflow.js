const dialogflow = require('@google-cloud/dialogflow');
const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
var nodemailer = require("nodemailer");
const express = require("express")
const cors = require("cors");
require('dotenv').config();

const MODEL_NAME = "gemini-1.5-pro";
const API_KEY = process.env.API_KEY;

async function runChat(queryText) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // console.log(genAI)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 50,
    };

    const chat = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chat.sendMessage(queryText);
    const response = result.response;
    return response.text();
}

const app = express();
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`Path ${req.path} with Method ${req.method}`);
    next();
});
app.get('/', (req, res) => {
    res.sendStatus(200);
    res.send("Status Okay")
});
app.use(cors());



const PORT = process.env.PORT || 3000;

app.post("/webhook", async (req, res) => {
    var id = (res.req.body.session).substr(43);
    // console.log(id)
    const agent = new WebhookClient({ request: req, response: res });


    function studentData(agent) {
        const {
            name,
            number,
            email,
            gender,
            city,
            address,
            nic,
            dob
        } = agent.parameters;

        const dateObject = new Date(dob);
        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1; // Months are zero-based, so we add 1
        const day = dateObject.getDate();
        const DOB = `${day}-${month}-${year}`


        agent.add(`Understood! Here's a response confirming enrollment without mentioning a specific course: 

      "Hello ${name.name}!
      
      Great news! 🎉 You've been successfully enrolled in a course at Saylani Welfare!
      
      We're thrilled to have you on board and can't wait for you to start your learning journey. You'll receive all the necessary information and updates regarding the course at your Gmail address: ${email}.
      
      If you have any questions or need further assistance, feel free to reach out to us. Happy learning!
      
      Best regards,
      Saylani Welfare Team"
      `)
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "muddussir1247@gmail.com",
                pass: process.env.EMAIL_PASS,
            },
        });

        var maillist = ["hammadn788@gmail.com", email]
        var mailOptions = {
            from: "mzainali1199@gmail.com",
            to: maillist,
            subject: "SMIT Course",
            html: `
            <!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Course Enrollment Confirmation</title>
            
                <style>
                    /* General Styles */
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f7f7f7;
                        margin: 0;
                        padding: 0;
                        color: #333;
                    }
            
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        border: 2px solid #1f3b76;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                    }
            
            
                    /* Header Styles */
                    .header {
                        background-color: #1f3b76;
                        color: #ffffff;
                        text-align: center;
                        padding: 20px;
                        border-top-left-radius: 8px;
                        border-top-right-radius: 8px;
                    }
            
                    .header h1 {
                        margin: 0;
                        font-size: 32px;
                        letter-spacing: 2px;
                    }
            
                    .header p {
                        margin-top: 5px;
                        font-size: 18px;
                        font-style: italic;
                    }
            
                    /* Content Styles */
                    .content {
                        padding: 30px;
                    }
            
                    .content p {
                        line-height: 1.6;
                        margin-bottom: 20px;
                    }
            
                    .highlight {
                        color: #e74c3c;
                    }
            
                    /* Info Styles */
                    .info {
                        margin-top: 17px;
                        padding: 7px;
                        background-color: #f9f9f9;
                        border-left: 5px solid #1f3b76;
                        border-bottom-left-radius: 8px;
                        border-bottom-right-radius: 8px;
                    }
            
                    .info p {
                        font-size: 14px;
                    }
            
                    /* Footer Styles */
                    .footer {
                        background-color: #1f3b76;
                        color: #ffffff;
                        text-align: center;
                        padding: 15px;
                        font-size: 14px;
                        border-bottom-left-radius: 8px;
                        border-bottom-right-radius: 8px;
                    }
            
                    .footer a {
                        color: #ffffff;
                        text-decoration: none;
                    }
            
                    .footer a:hover {
                        text-decoration: underline;
                    }
            
                    /* Address Styles */
                    .address {
                        border: 2px solid #1f3b76;
                        border-radius: 8px;
                        padding: 15px;
                        margin-top: 20px;
                    }
            
                    .address h2 {
                        color: #1f3b76;
                        font-size: 20px;
                        margin-bottom: 10px;
                    }
            
                    .address table {
                        width: 100%;
                        border-collapse: collapse;
                    }
            
                    .address th,
                    .address td {
                        text-align: left;
                        padding: 8px;
                        border-bottom: 1px solid #dddddd;
                    }
            
                    .address th {
                        width: 30%;
                        color: #1f3b76;
                    }
                </style>
            </head>
            
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Saylani SMIT</h1>
                        <p>Your Journey Begins Here</p>
                    </div>
                    <div class="content">
                        <p>Dear ${name.name},</p>
                        <p>Congratulations! You have successfully enrolled in the following course. We are excited to have you on
                            board and look forward to helping you achieve your learning goals.</p>
                        <div class="address">
                            <h2>Your Enrollment Details:</h2>
                            <table>
                                <tr>
                                    <th>Name</th>
                                    <td> ${name.name}</td>
                                </tr>
                                <tr>
                                    <th>Number</th>
                                    <td>${number}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td> ${email} </td>
                                </tr>
                                <tr>
                                    <th>Gender</th>
                                    <td> ${gender} </td>
                                </tr>
                                <tr>
                                    <th>City</th>
                                    <td> ${city} </td>
                                </tr>
                                <tr>
                                    <th>NIC</th>
                                    <td>${nic}</td>
                                </tr>
                                <tr>
                                    <th>Date of Birth</th>
                                    <td>${DOB}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="info">
                            <p><strong>Note:</strong> Please make sure to bring a copy of your ID card on the first day of the
                                course. If you have any questions or need further assistance, please do not hesitate to contact us
                                at <a href="mailto:support@saylani.org">support@saylani.org</a>.</p>
                        </div>
                        <p>We look forward to seeing you!</p>
                        <p>Best Regards,<br>Saylani SMIT Team</p>
                    </div>
                    <div class="footer">
                        &copy; 2024 Saylani Welfare International Trust<br>
                    </div>
                </div>
            </body>
            
            </html>`,
            text: `${name.name}, email ${email} , gender ${gender}, phone ${number}, address ${address['street-address']} , DOB ${DOB}, nic ${nic}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

    }


    async function fallback() {
        let action = req.body.queryResult.action;
        let queryText = req.body.queryResult.queryText;

        if (action === 'input.unknown') {
            let result = await runChat(queryText);
            agent.add(result);
            console.log(result)
        } else {
            agent.add(result);
            console.log(result)
        }
    }


    let intentMap = new Map();
    intentMap.set('fallback', fallback);
    intentMap.set('studentData', studentData);
    agent.handleRequest(intentMap);
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});