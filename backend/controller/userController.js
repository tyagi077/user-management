const client = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const loginPage = (req,res)=>{
     res.render("login", { error: null });
}

const addUser = async (req, res) => {
    const { username, email, password, role, created_by, updated_by } = req.body;
    try {
        const result = await client.query('insert into users(username,email,password,role,created_by,updated_by) values($1,$2,$3,$4,$5,$6) returning id', [username, email, password, role, created_by, updated_by])

        // res.status(201).json({
        //     success: "true",
        //     message: result.rows[0].id
        // })
         res.redirect("/dashboard");
    } catch (err) {
        // res.status(400).json({
        //     success: "false",
        //     message: err.message
        // })
         res.render("addUser", { error: err.message });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await client.query('select id,username,email,role,created_by,created_at,updated_by,updated_at from users where email =$1 and password =$2', [email, password])
        const user = result.rows[0];
        if (!user) {
            res.render("login", { error: "User Not Found" });
            return;
        }
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        })
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/dashboard");
    } catch (err) {
        // res.status(500).json({
        //     success: "false",
        //     message: err.message
        // })
        res.render("login", { error: err.message });

    }
}
const updateUser = async (req, res) => {
    const { role } = req.body;
    const { id } = req.params;
    const requester = req.user;
    try {

        const result = await client.query("select * from users where id =$1", [id]);
        const targetUser = result.rows[0];

        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (requester.role === 'admin' && targetUser.role !== 'user') {
            return res.status(403).json({
                success: false,
                message: 'Admin can only modify users with role "user"',
            });
        }

        // Superadmin can update anyone, admin can update only users
        if (requester.role !== 'admin' && requester.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }


        const updateResult = await client.query(
            'UPDATE users SET role = $1,updated_by=$2 WHERE id = $3 RETURNING id',
            [role, requester.username, id]
        );


        // res.status(200).json({
        //     success: true,
        //     message: `User with ID ${updateResult.rows[0].id} updated`,
        // });
        res.redirect("/dashboard");
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
const deleteUser = async (req, res) => {
    const id = req.params.id;
    const requester = req.user;

    try {
        const result = await client.query("SELECT * FROM users WHERE id = $1", [id]); // ✅ add await
        const targetUser = result.rows[0];

        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (targetUser.role === 'superadmin') {
            return res.status(403).json({ success: false, message: 'Cannot delete superadmin' });
        }

        if (requester.role === 'admin' && targetUser.role !== 'user') {
            return res.status(403).json({ success: false, message: 'Admin can only delete users with role "user"' });
        }

        if (requester.role !== 'admin' && requester.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const deleteResult = await client.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]); // ✅ add await

        res.redirect("/dashboard"); // ✅ redirect to dashboard
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const renderUser= async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query("SELECT id,username,updated_by, created_by,updated_at,created_at,role FROM users WHERE id = $1", [id]);
    const targetUser = result.rows[0];

    if (!targetUser) return res.status(404).send("User not found");

    res.render("editUser", { user: req.user, targetUser });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const dashboardPage=(async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM users ORDER BY id ASC");
    res.render("dashboard", {
      user: req.user,
      users: result.rows
    });
  } catch (err) {
    res.status(500).send("Failed to load dashboard");
  }
});

const addUserForm=((req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).send("Access Denied");
  }
  res.render("addUser", { user: req.user });
});

const logout=((req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});


module.exports = { addUser, loginUser, updateUser, deleteUser ,renderUser,loginPage,dashboardPage,addUserForm,logout}