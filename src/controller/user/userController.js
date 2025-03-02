// import { User } from '../../models/index.js';

// const getAll = async (req, res) => {
//     try {
//         const users = await User.findAll();
//         res.status(200).send({ data: users, message: "Successfully fetched data" });
//     } catch (e) {
//         res.status(500).json({ error: 'Failed to fetch users' });
//     }
// }

// const create = async (req, res) => {
//     try {
//         const body = req.body;
//         if (!body?.email || !body?.name || !body?.password) {
//             return res.status(400).send({ message: "Invalid payload" }); // Changed to 400
//         }
//          // Use upsert to prevent duplicate email error
//          const [user, created] = await User.upsert({
//             name: body.name,
//             email: body.email,
//             password: body.password
//         });
//         res.status(201).send({ data: users, message: "Successfully created user" });
//     } catch (e) {
//         res.status(500).json({ error: 'Failed to create user' }); // Changed error message
//     }
// }

// const update = async (req, res) => {
//     try {
//         const { id = null } = req.params;
//         const body = req.body;
//         const oldUser  = await User.findOne({ where: { id } });
//         if (!oldUser ) {
//             return res.status(404).send({ message: "User  not found" }); // Changed to 404
//         }
//         oldUser .name = body.name;
//         oldUser .password = body.password || oldUser .password;
//         oldUser .email = body.email;
//         await oldUser .save(); // Added await
//         res.status(200).send({ data: oldUser , message: "User  updated successfully" }); // Changed to 200
//     } catch (e) {
//         res.status(500).json({ error: 'Failed to update user' }); // Changed error message
//     }
// }

// const deleteById = async (req, res) => { // Fixed spelling
//     try {
//         const { id = null } = req.params;
//         const oldUser  = await User.findOne({ where: { id } });
//         if (!oldUser ) {
//             return res.status(404).send({ message: "User  not found" }); // Changed to 404
//         }
//         await oldUser .destroy(); // Added await
//         res.status(200).send({ message: "User  deleted successfully" }); // Changed to 200
//     } catch (e) {
//         res.status(500).json({ error: 'Failed to delete user' }); // Changed error message
//     }
// }

// const getById = async (req, res) => {
//     try {
//         const { id = null } = req.params;
//         const user = await User.findOne({ where: { id } });
//         if (!user) {
//             return res.status(404).send({ message: "User  not found" }); // Changed to 404
//         }
//         res.status(200).send({ message: "User  fetched successfully", data: user }); // Changed to 200
//     } catch (e) {
//         res.status(500).json({ error: 'Failed to fetch user' }); // Changed error message
//     }
// }

// export const userController = {
//     getAll,
//     create,
//     getById,
//     deleteById, // Fixed spelling
//     update
// }



import { User } from '../../models/index.js';

const getAll = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).send({ data: users, message: "Successfully fetched data" });
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
const create = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({ message: "Invalid payload" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({ data: user, message: "User created successfully" });
    } catch (e) {
        res.status(500).json({ error: "Failed to create user", details: e.message });
    }
};


const update = async (req, res) => {
    try {
        const { id = null } = req.params;
        const body = req.body;
        const oldUser = await User.findOne({ where: { id } });
        if (!oldUser) {
            return res.status(404).send({ message: "User not found" });
        }
        oldUser.name = body.name;
        oldUser.password = body.password || oldUser.password;
        oldUser.email = body.email;
        await oldUser.save();
        res.status(200).send({ data: oldUser, message: "User updated successfully" });
    } catch (e) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

const deleteById = async (req, res) => {
    try {
        const { id = null } = req.params;
        const oldUser = await User.findOne({ where: { id } });
        if (!oldUser) {
            return res.status(404).send({ message: "User not found" });
        }
        await oldUser.destroy();
        res.status(200).send({ message: "User deleted successfully" });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

const getById = async (req, res) => {
    try {
        const { id = null } = req.params;
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ message: "User fetched successfully", data: user });
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

export const userController = {
    getAll,
    create,
    getById,
    deleteById,
    update
};
