const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// ملفات البيانات
const DATA_FILE = path.join(__dirname, 'data.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const TICKETS_FILE = path.join(__dirname, 'tickets.json');

// تحميل البيانات
function load(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ====== المنتجات ======
app.get('/products', (req, res) => {
  const products = load(DATA_FILE);
  res.json(products);
});

// ====== الطلبات ======
app.get('/orders', (req, res) => {
  const orders = load(ORDERS_FILE);
  res.json(orders);
});

app.post('/orders', (req, res) => {
  const orders = load(ORDERS_FILE);
  const newOrder = req.body;

  newOrder.id = Date.now();
  orders.push(newOrder);

  save(ORDERS_FILE, orders);
  res.json({ success: true });
});

// ====== التذاكر ======
app.get('/tickets', (req, res) => {
  const tickets = load(TICKETS_FILE);
  res.json(tickets);
});

app.post('/tickets', (req, res) => {
  const tickets = load(TICKETS_FILE);

  const newTicket = {
    id: Date.now(),
    message: req.body.message,
    reply: null
  };

  tickets.push(newTicket);
  save(TICKETS_FILE, tickets);

  res.json({ success: true });
});

// ====== الرد على التذكرة ======
app.post('/reply', (req, res) => {
  const { id, reply } = req.body;
  const tickets = load(TICKETS_FILE);

  const ticket = tickets.find(t => t.id == id);
  if (ticket) {
    ticket.reply = reply;
    save(TICKETS_FILE, tickets);
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// ====== حذف التذكرة ======
app.delete('/tickets/:id', (req, res) => {
  let tickets = load(TICKETS_FILE);

  tickets = tickets.filter(t => t.id != req.params.id);

  save(TICKETS_FILE, tickets);
  res.json({ success: true });
});

// ====== تشغيل السيرفر (المهم 👇) ======
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});