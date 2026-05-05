const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// ===== ملفات البيانات =====
const PRODUCTS_FILE = 'products.json';
const ORDERS_FILE = 'orders.json';
const TICKETS_FILE = 'tickets.json';

// ===== دوال مساعدة =====
function readData(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}

function writeData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ===== المنتجات =====
app.get('/products', (req, res) => {
  res.json(readData(PRODUCTS_FILE));
});

app.post('/add-product', (req, res) => {
  const products = readData(PRODUCTS_FILE);
  products.push(req.body);
  writeData(PRODUCTS_FILE, products);
  res.json({ success: true });
});

// ===== الطلبات =====
app.get('/orders', (req, res) => {
  res.json(readData(ORDERS_FILE));
});

app.post('/order', (req, res) => {
  const orders = readData(ORDERS_FILE);
  const newOrder = {
    ...req.body,
    status: 'pending',
    time: new Date().toLocaleString()
  };
  orders.push(newOrder);
  writeData(ORDERS_FILE, orders);
  res.json({ success: true });
});

app.post('/complete-order', (req, res) => {
  let orders = readData(ORDERS_FILE);
  orders = orders.map(o => {
    if (o.time === req.body.time) {
      o.status = 'done';
    }
    return o;
  });
  writeData(ORDERS_FILE, orders);
  res.json({ success: true });
});

// ===== الدعم =====
app.get('/tickets', (req, res) => {
  res.json(readData(TICKETS_FILE));
});

app.post('/send-ticket', (req, res) => {
  const tickets = readData(TICKETS_FILE);
  const newTicket = {
    ...req.body,
    reply: null,
    time: new Date().toLocaleString()
  };
  tickets.push(newTicket);
  writeData(TICKETS_FILE, tickets);
  res.json({ success: true });
});

app.post('/reply-ticket', (req, res) => {
  let tickets = readData(TICKETS_FILE);
  tickets = tickets.map(t => {
    if (t.time === req.body.time) {
      t.reply = req.body.reply;
    }
    return t;
  });
  writeData(TICKETS_FILE, tickets);
  res.json({ success: true });
});

app.post('/delete-ticket', (req, res) => {
  let tickets = readData(TICKETS_FILE);
  tickets = tickets.filter(t => t.time !== req.body.time);
  writeData(TICKETS_FILE, tickets);
  res.json({ success: true });
});

// ===== التشغيل (المهم لRender) =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});