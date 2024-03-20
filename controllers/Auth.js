const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");

const MOTP = require("../models/mobOTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch");
const crypto = require("crypto");
const { randomBytes } = require("random-bytes");

require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { email, password, mobileNumber, otp, motp } = req.body;
    console.log(email);
    console.log(password);
    console.log(otp);
    console.log(motp);
    console.log(mobileNumber);
    if (!email || !password || !mobileNumber) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    const response1 = await MOTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    console.log(response);
    console.log(response1);

    if (response.length === 0 && response1.length === 0) {
      return res.status(400).json({
        success: false,
        message: "The OTP is invalid",
      });
    } else if (otp !== response[0].otp && motp !== response1[0].motp) {
      return res.status(400).json({
        success: false,
        message: "The otp is invalid",
      });
    }

    const Password = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      mobileNumber,
      Password,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "User registred successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registred. Please try again later",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required details carefully",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registred",
      });
    }

    if (await bcrypt.compare(password, user.Password)) {
      // console.log("done")
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      //save token to user document in database
      user.token = token;
      await user.save();
      user.Password = undefined;
      localStorage.setItem("authToken", token);

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      // res.json({ success: true, user, token });

      console.log(user);
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User Login Success",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure Please Try Again Later",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have middleware to extract user details from the token
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.token = null; // Assuming the token field in the user document is called 'token'
    await user.save();

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "USer Already Exist",
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP body", otpBody);
    res.status(200).json({
      success: true,
      message: "Otp sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.sendmobileOtp = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    const checkUserPresent = await User.findOne({ mobileNumber });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exist",
      });
    }

    var motp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const otpPayload = { mobileNumber, motp };
    const otpBody = await MOTP.create(otpPayload);
    console.log("Otp body", otpBody);

    res.status(200).json({
      success: true,
      message: "Phone verification Otp sent successfully",
      motp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `This email : ${email} is not Registred with us enter a valid or signup`,
      });
    }

    const token = crypto.randomBytes(20).toString("hex");

    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        expiresIn: Date.now() + 360000,
      },
      { new: true }
    );

    localStorage.setItem("PasswordResetToken", token);

    console.log("Details", updateDetails);
    const url = `http://localhost:3000/password-reset/${token}`;

    await mailSender(email, "Password Reset", `Reset your password ${url}`);

    res.cookie("token", token).status(200).json({
      success: true,
      token,

      message: "User Login Success",
    });

    // return res.status(200).json({
    //   success: true,
    //   message: "Password Reset url send successfully",
    //   updateDetails,
    // });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "Problem in updating password",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Should be same",
      });
    }

    const userDetails = await User.findOne({ token });
    console.log(userDetails);
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      });
    }

    if (!userDetails.expiresIn > Date.now()) {
      return res.status(403).json({
        success: false,
        message: "Token is Expired, Please Regenerate Your Token",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword },
      { new: true }
    );

    console.log("Done");

    return res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    });
  }
};

// exports.sendmobileOtp = async (req, res) => {
//   const accountSid = "AC1e0b07629df3e9fd14b07d06f7646433";
//   const authToken = "9014f61278728c84d58ed5027073cf0a";

//   const { mobileNumber } = req.body;
//   try {
//     const client = twilio(accountSid, authToken);
//     var otp = otpGenerator.generate(6, {
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     });

//     const message = `Your OTP is ${otp}`;
//     console.log(otp);
//     console.log(mobileNumber);

//     await client.messages.create({
//       body: message,
//       from: "+16262834514",
//       to: mobileNumber,
//     });

//     // console.log(otp);
//     // console.log(mobileNumber)

//     res.status(200).json({
//       success: true,
//       message: "OTP send successfully",
//       otp,
//     });
//   } catch (error) {
//     res.status(404).json({
//       success: false,
//       message: "Problem in sending otp to moblie number",
//     });
//   }
// };
