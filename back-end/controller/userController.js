import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import cloudinary from '../config/cloudinaryConfig.js';
import fs from 'fs/promises'
import { Console } from 'console';


const userRegister = async (req, res) => {
  try {
    const { name, email, gender, mobile, password } = req.body;
    let imageUrl;

    if (req.file) {
      imageUrl = req.file.path;
    } else { 
      return res.status(400).send({
        message: "Profile photo is required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        message: "Email is already registered",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      gender,
      mobile,
      password: hashpassword,
      imageUrl,
    });
    const result = await user.save();

    // JWT token
    const { _id } = result.toJSON();
    const token = jwt.sign({ _id }, "secret");

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.send({
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send({
      message: "Failed to register user",
      error,
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).send({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ _id: user._id }, "secret", { expiresIn: "1d" });

    res.send({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        mobile: user.mobile,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send({
      message: "Failed to login user",
      error,
    });
  }
};
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        message: "Invalid email or password",
      });
    }
    if (user.isAdmin ==false) {
      return res.status(400).send({
        message: "Only admins are allowed",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ _id: user._id }, "secret", { expiresIn: "1d" });

    res.send({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        mobile: user.mobile,
        imageUrl: user.imageUrl,
        isAdmin:user.isAdmin
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send({
      message: "Failed to login user",
      error,
    });
  }
};


const getUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({
      message: "Failed to fetch users",
      error,
    });
  }
};


const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, gender, mobile } = req.body;
   
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new Error('Authorization header is missing');
    }

    console.log("autherization header:",authorizationHeader);
    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      throw new Error('Token is missing from the authorization header');
    }
    console.log("token is:",token);

    const decodedToken = jwt.verify(token, "secret");
    const userId = decodedToken._id;
console.log("decoded id:",decodedToken);
console.log("user id",userId);

    if (!userId || typeof userId !== 'string') {
      throw new Error('User ID is undefined or not a string');
    }

    const user = await User.findById(id);
     
    console.log("user is :",user);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    console.log(`Decoded ID: ${String(userId)}, DB ID: ${String(user._id)}`);
    if (userId.toString() !== String(user._id)) {
      return res.status(403).send({
        message: "Forbidden",
      });
    }
    

    if (name) user.name = name;
    if (email) user.email = email;
    if (gender) user.gender = gender;
    if (mobile) user.mobile = mobile;

    if (req.file) {
      try {
        const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
        user.imageUrl = cloudinaryResult.secure_url;
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return res.status(500).send({
          message: 'Failed to upload image to Cloudinary',
          error: error.message,
        });
      }
    } else {
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    console.error("Error updating user:", error);
    if (!res.headersSent) {
      res.status(500).send({
        message: "Failed to update user",
        error: error.message,
      });
    }
  }
};


const searchUser = async (req, res) => {
  const searchTerm = req.query.search; 
  try {
    const users = await User.find({ $or: [{ name: { $regex: searchTerm, $options: 'i' } }] });
    if (!users.length) {
      return res.status(404).json({ message: 'No users found matching the search criteria' });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Failed to search users', error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

export default{
  userRegister,
  userLogin,
  getUser,
  adminLogin,
  updateUser,
  searchUser,
  deleteUser
}
