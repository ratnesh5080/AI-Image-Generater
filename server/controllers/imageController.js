import userModel from "../models/usermodels.js"; // make sure filename matches exactly
import FormData from "form-data";
import axios from "axios";

export const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    // find user
    const user = await userModel.findById(userId);
    if (!user || !prompt) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // check credits
    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No Credit Balance",
        creditBalance: user.creditBalance,
      });
    }

    // prepare form data
    const formData = new FormData();
    formData.append("prompt", prompt);

    // make request to Clipdrop
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API, // ✅ API key in headers
          ...formData.getHeaders(), // ✅ required for multipart
        },
        responseType: "arraybuffer", // ✅ get image buffer
      }
    );

    // convert buffer -> base64
    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // deduct 1 credit
    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    res.json({
      success: true,
      message: "Image Generated",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.error(
      "Error in generateImage:",
      error.response?.data || error.message
    );
    res.json({ success: false, message: error.message });
  }
};
