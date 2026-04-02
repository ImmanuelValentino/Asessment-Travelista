const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = new Database('luckydraw.db');

// SKEMA TABEL SESUAI PDF
db.exec(`
  CREATE TABLE IF NOT EXISTS draws (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_name TEXT NOT NULL,
    staff_id TEXT NOT NULL,
    event_code TEXT NOT NULL,
    event_date TEXT NOT NULL,
    venue_type TEXT NOT NULL,
    seat1 TEXT NOT NULL,
    seat2 TEXT NOT NULL,
    seat3 TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

// Helper untuk generate 3 kursi unik
function generateRandomSeats() {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seats = new Set();
  while (seats.size < 3) {
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const number = Math.floor(Math.random() * 30) + 1;
    seats.add(`${letter}${number}`);
  }
  return Array.from(seats);
}

// ENDPOINT 1: POST /api/check
app.post('/api/check', (req, res) => {
  // Frontend mengirim format camelCase sesuai payload API di PDF
  const { eventCode, date } = req.body;

  // Query ke DB menggunakan nama kolom snake_case
  const stmt = db.prepare('SELECT COUNT(*) AS count FROM draws WHERE event_code = ? AND event_date = ?');
  const result = stmt.get(eventCode, date);

  res.json({
    exists: result.count > 0
  });
});

// ENDPOINT 2: POST /api/draw
app.post('/api/draw', (req, res) => {
  const { staffName, staffId, eventCode, date, venue } = req.body;

  // Pengecekan ganda
  const checkStmt = db.prepare('SELECT COUNT(*) AS count FROM draws WHERE event_code = ? AND event_date = ?');
  if (checkStmt.get(eventCode, date).count > 0) {
    return res.status(400).json({
      success: false,
      message: `Lucky draw has already been conducted for event ${eventCode} on ${date}.`
    });
  }

  // Generate 3 kursi
  const generatedSeats = generateRandomSeats(); // Array, misal: ['A1', 'B2', 'C3']

  // Buat timestamp format ISO 8601 sesuai PDF
  const createdAt = new Date().toISOString();

  // Simpan ke database dengan mapping kolom yang tepat
  const insertStmt = db.prepare(`
    INSERT INTO draws (
      staff_name, staff_id, event_code, event_date, venue_type, 
      seat1, seat2, seat3, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertStmt.run(
    staffName,
    staffId,
    eventCode,
    date,
    venue,
    generatedSeats[0],
    generatedSeats[1],
    generatedSeats[2],
    createdAt
  );


  res.json({
    success: true,
    seats: generatedSeats
  });
});



app.listen(port, () => {
  console.log(`Backend API jalan di http://localhost:${port}`);
});