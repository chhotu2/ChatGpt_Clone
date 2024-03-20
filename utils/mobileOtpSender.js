const twilio = require("twilio");

const mobileOtpSender = async (mobileNumber, message) => {
  try {
    // const client = twilio(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
    // const accountSid = process.env.ACCOUNTSID;
    // const authToken = process.env.AUTHTOKEN;
    const client = twilio(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

    const info = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: mobileNumber,
    });
    return info;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};

module.exports = mobileOtpSender;
