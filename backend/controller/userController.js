const client = require("../config/db")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const addUser = async (req, res) => {
    const { username, email, password, role, created_by, updated_by } = req.body;
    try {
        const result = await client.query('insert into users(username,email,password,role,created_by,updated_by) values($1,$2,$3,$4,$5,$6) returning id', [username, email, password, role, created_by, updated_by])

        res.status(201).json({
            success: "true",
            message: result.rows[0].id
        })
    } catch (err) {
        res.status(400).json({
            success: "false",
            message: err.message
        })
    }
}
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await client.query('select id,username,email,role,created_by,created_at,updated_by,updated_at from users where email =$1 and password =$2', [email, password])
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        })
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token
        });
    } catch (err) {
        res.status(500).json({
            success: "false",
            message: err.message
        })
    }
}

const updateUser = async (req, res) => {
    const { role } = req.body;
    const { id } = req.params;
    const requester = req.user;
    try {

        const result = await client.query("select * from user where id =$1", [id]);
        const targetUser = result.rows[0];

        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // access
        if (requester.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only admins can update users' });
        }

        if (targetUser.role === 'admin') {
            return res.status(403).json({ success: false, message: 'Admins cannot modify other admins' });
        }


        const updateResult = await client.query(
            'UPDATE users SET role = $1,updated_by=$2 WHERE id = $3 RETURNING id',
            [role, requester.username, id]
        );


        res.status(200).json({
            success: true,
            message: `User with ID ${updateResult.rows[0].id} updated`,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
const deleteUser = async (req, res) => {
    const id = req.params;
    const requester = req.user;
    try {
        const result = client.query("select * from users where id =$1", [id]);
        const targetUser = result.rows[0];
        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // access
        if (requester.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only admins can delete users' });
        }

        if (targetUser.role === 'admin') {
            return res.status(403).json({ success: false, message: 'Admins cannot delete other admins' });
        }

        const updatedResult = client.query("delete from users where id =$1", [id]);


        res.status(200).json({
            success: true,
            message: `User with ID ${updatedResult.rows[0].id} deleted`,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

module.exports = { addUser, loginUser, updateUser, deleteUser }