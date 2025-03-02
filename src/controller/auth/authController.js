

import { User } from "../../models/index.js";
import { generateToken } from "../../security/jwt-util.js";
import bcrypt from "bcrypt";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if email and password are provided
    if (!email || !password) {
      return res.status(400).send({ message: "Email and password are required." });
    }

    // 2. Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // 3. Compare the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send({ message: "Invalid password." });
    }

    // 4. Generate JWT token
    const token = generateToken({ user: user.toJSON() });

    // 5. Prepare user data (exclude password)
    const userData = user.toJSON();
    delete userData.password;

    // 🔑 **6. Ensure `role` exists in the user model**
    const userRole = userData.role || "user"; // Default to 'user' if role is missing

    // 7. Return token, user data, and role
    return res.status(200).send({
      data: {
        access_token: token,
        user: userData,
        role: userRole, // 🟢 This ensures the frontend knows the user role
      },
      message: "Successfully logged in.",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to login." });
  }
};

const init = async (req, res) => {
  try {
    const user = req.user.user;
    delete user.password;
    res.status(201).send({ data: user, message: "Successfully fetched current user." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch user." });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body; // 🟢 Add role during registration (default: user)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role, // Ensure role is saved in the DB
    });

    const userData = newUser.toJSON();
    delete userData.password;

    res.status(201).json({
      message: "User registered successfully!",
      user: userData,
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({
      message: "Error registering user",
      error: err.message,
    });
  }
};

export const authController = {
  login,
  init,
  register,
};
















// import { User } from "../../models/index.js";
// import { generateToken } from "../../security/jwt-util.js";
// import bcrypt from "bcrypt";

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1. Check if email and password are provided
//     if (!email || !password) {
//       return res
//         .status(400)
//         .send({ message: "Email and password are required." });
//     }

//     // 2. Find the user by email
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(404).send({ message: "User not found." });
//     }

//     // 3. Compare the provided password with the hashed password in the DB
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return res.status(401).send({ message: "Invalid password." });
//     }

//     // 4. Generate a token using your existing JWT utility
//     const token = generateToken({ user: user.toJSON() });

//     // 5. Remove sensitive data from user object
//     const userData = user.toJSON();
//     delete userData.password;

//     // 6. Return the token AND the user data
//     return res.status(200).send({
//       data: {
//         access_token: token,
//         user: userData,
//       },
//       message: "Successfully logged in.",
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Failed to login." });
//   }
// };

// // Init function
// const init = async (req, res) => {
//   try {
//     const user = req.user.user; // Assuming user is attached to req by middleware
//     delete user.password; // Remove password from user object
//     res
//       .status(201)
//       .send({ data: user, message: "Successfully fetched current user." });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Failed to fetch user." });
//   }
// };

// const register = async (req, res) => {
//   try {
//     // 1. Destructure fields from the request body
//     const { name, email, password } = req.body;

//     // 2. Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 3. Create a new user record in the database
//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     // 4. Remove the password field before sending the response
//     const userData = newUser.toJSON();
//     delete userData.password;

//     // 5. Send the response with the new user data
//     res.status(201).json({
//       message: "User registered successfully!",
//       user: userData,
//     });
//   } catch (err) {
//     console.error("Error registering user:", err);
//     res.status(500).json({
//       message: "Error registering user",
//       error: err.message,
//     });
//   }
// };

// // Exporting the controller
// export const authController = {
//   login,
//   init,
//   register,
// };
