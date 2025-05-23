import { userModel } from "../Models/userModel.js";
import transporter from "../Utils/sendMail.js";
// import nodemailer from "nodemailer"


// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.MY_GMAIL,       // Your Gmail
//     pass: process.env.MY_PASSWORD    // Your Gmail App Password
//   }
// });

export const adminVerifySeller = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    const seller = await userModel.findById(id);
    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ message: "Seller not found or not a seller" });
    }

    if (seller.isVerified) {
      return res.status(400).json({ message: "Seller is already verified" });
    }

    seller.isVerified = true;
    await seller.save();

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: seller.email,
      subject: 'Premium Properties - Seller Account Verified',
      text: `Hi ${seller.name || "Seller"},\n\nYour seller account has been successfully verified. You can now post properties on Premium Properties.\n\nThank you,\nTeam Premium Properties`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Seller verified successfully and email sent",
      seller
    });
  } catch (error) {
    console.error("Error verifying seller:", error);
    return res.status(500).json({ message: "Error verifying seller", error });
  }
};

