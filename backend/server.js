const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const port = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: 'win-server',
  user: 'cs2302012',
  password: 'cs2302012',
  database: 'cs2302012',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Health check
app.get('/', (req, res) => {
  res.send('Leave Management API running.');
});

// ======================== LOGIN ========================
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    if (user.role === 'employee') {
      const [balance] = await pool.query(
        'SELECT * FROM employee_leave_status WHERE id = ?',
        [user.id]
      );
      user.leave_balance = balance[0];
    }

    res.json(user);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ======================== EMPLOYEE ========================
app.get('/employee/leave-balance/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    const [result] = await pool.query(
      'SELECT * FROM employee_leave_status WHERE id = ?',
      [userId]
    );

    if (!result.length) {
      return res.status(404).json({ error: 'Leave balance not found' });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/employee/leaves/:userId', async (req, res) => {
  try {
    const [leaves] = await pool.query(
      `SELECT lr.*, 
       DATEDIFF(lr.to_date, lr.from_date) + 1 AS days,
       u.name AS user_name
       FROM leave_requests lr
       JOIN users u ON lr.user_id = u.id
       WHERE lr.user_id = ?
       ORDER BY lr.from_date DESC`,
      [req.params.userId]
    );
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/employee/apply-leave', async (req, res) => {
  try {
    const { userId, leaveType, fromDate, toDate, reason } = req.body;

    if (!userId || !leaveType || !fromDate || !toDate || !reason) {
      console.log("Missing fields in request:", req.body);
      return res.status(400).json({ error: 'All fields (userId, leaveType, fromDate, toDate, reason) are required.' });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

    if (days <= 0) {
      return res.status(400).json({ error: 'Invalid date range' });
    }

    // ✅ Call the get_remaining_leave function
    const [[result]] = await pool.query('SELECT get_remaining_leave(?, ?) AS remaining', [userId, leaveType]);

    const available = result.remaining;

    if (available === null || available === -1) {
      return res.status(400).json({ error: `Invalid leave type: ${leaveType}` });
    }

    if (days > available) {
      return res.status(400).json({
        error: `Insufficient ${leaveType} leave balance. Available: ${available}, Requested: ${days}`
      });
    }

    // ✅ Insert leave request
    await pool.query(
      `INSERT INTO leave_requests (user_id, leave_type, from_date, to_date, reason, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [userId, leaveType, fromDate, toDate, reason]
    );

    res.status(200).json({ message: 'Leave request submitted successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to apply for leave. Please try again later.' });
  }
});


    // Apply leave through stored procedure
    await pool.query(
      'CALL apply_leave(?, ?, ?, ?, ?)',
      [userId, leaveType, fromDate, toDate, reason]
    );

    res.json({ message: 'Leave applied successfully' });
  } catch (err) {
    console.error('Apply leave error:', err);
    res.status(400).json({ error: err.sqlMessage || 'Failed to apply leave' });
  }
});

// ======================== ADMIN ========================
app.get('/admin/leave-requests', async (req, res) => {
  try {
    const [requests] = await pool.query(`
      SELECT 
        lr.id AS leave_id,
        lr.user_id,
        u.name AS employee_name,
        lr.leave_type,
        lr.from_date,
        lr.to_date,
        lr.reason,
        lr.status,
        get_leave_days(lr.to_date, lr.from_date) AS days,
        CASE
          WHEN lr.leave_type = 'casual' THEN els.casual_leave
          WHEN lr.leave_type = 'sick' THEN els.sick_leave
          WHEN lr.leave_type = 'paid' THEN els.paid_leave
          WHEN lr.leave_type = 'maternity' THEN els.maternity_leave
        END AS available_leaves
      FROM leave_requests lr
      JOIN users u ON lr.user_id = u.id
      LEFT JOIN employee_leave_status els ON lr.user_id = els.id
      ORDER BY lr.from_date DESC
    `);

    res.json(requests);
  } catch (err) {
    console.error('Error fetching leave requests:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/admin/approve-leave', async (req, res) => {
  try {
    const { leaveId, adminId } = req.body;
    await pool.query('CALL approve_leave(?, ?)', [leaveId, adminId]);
    res.json({ message: 'Leave approved' });
  } catch (err) {
    res.status(400).json({ error: err.sqlMessage });
  }
});

app.post('/admin/reject-leave', async (req, res) => {
  try {
    const { leaveId, adminId, remarks } = req.body;
    await pool.query('CALL reject_leave(?, ?, ?)', [leaveId, adminId, remarks]);
    res.json({ message: 'Leave rejected' });
  } catch (err) {
    res.status(400).json({ error: err.sqlMessage });
  }
});

app.get('/admin/employees', async (req, res) => {
  try {
    const [employees] = await pool.query(
      'SELECT id, name, email, role FROM users'
    );
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/admin/employees', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );

    await pool.query(
      'INSERT INTO leave_balance (user_id) VALUES (?)',
      [result.insertId]
    );

    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.sqlMessage });
  }
});

app.delete('/admin/employees/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: err.sqlMessage });
  }
});

// ======================== START SERVER ========================
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
