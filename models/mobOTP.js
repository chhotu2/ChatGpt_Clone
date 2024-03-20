const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/tenplates/emailVerification");
const mobileOtpSender = require("../utils/mobileOtpSender");

const MOTPSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
  },

  motp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
});

async function sendVerificationMobile(mobileNumber, otp) {
  try {
    const otpResponse = await mobileOtpSender(
      mobileNumber,
      "Your OTP is ",
      otp
    );

    console.log(
      "Mobile Number Verifaction OTP sent successfully",
      otpResponse.response
    );
  } catch (error) {
    console.log(
      "Error occure while sending otp  for mobile number verification",
      error
    );
  }
}

MOTPSchema.pre("save", async function (next) {
  console.log("New document saved to database");

  if (this.isNew) {
    await sendVerificationMobile(this.mobileNumber, this.otp);
  }
  next();
});

const OTP = mongoose.model("MOTP", MOTPSchema);
module.exports = OTP;
