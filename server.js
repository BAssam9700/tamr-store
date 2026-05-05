const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

/* =========================
   🧠 البيانات (مؤقتة)
========================= */
let orders = [];
let supports = [];

/* =========================
   📦 المنتجات
========================= */
app.get('/products', (req, res) => {
  try {
    const data = fs.readFileSync('products.json','utf8');
    res.json(JSON.parse(data));
  } catch {
    res.json([]);
  }
});

app.post('/add-product', (req, res) => {
  const newProduct = req.body;

  let products = [];
  try {
    products = JSON.parse(fs.readFileSync('products.json','utf8'));
  } catch {}

  products.push(newProduct);

  fs.writeFileSync('products.json', JSON.stringify(products,null,2));

  res.json({message:"تم إضافة المنتج ✅"});
});

/* =========================
   🛒 الطلبات (Checkout)
========================= */
app.post('/order', (req, res) => {
  orders.push({
    id: Date.now(),
    items: req.body,
    status: "جديد",
    date: new Date()
  });

  res.json({message:"تم الطلب ✅"});
});

app.get('/orders', (req, res) => {
  res.json(orders);
});

/* تغيير حالة الطلب */
app.post('/order-status', (req, res) => {
  const {id, status} = req.body;

  orders = orders.map(o=>{
    if(o.id == id){
      o.status = status;
    }
    return o;
  });

  res.json({message:"تم تحديث الحالة ✅"});
});

/* =========================
   📩 الدعم الفني
========================= */

/* إرسال تذكرة */
app.post('/support', (req, res) => {
  supports.push({
    id: Date.now(),
    user: req.body.user,
    title: req.body.title,
    message: req.body.message,
    reply: "",
    date: new Date()
  });

  res.json({message:"تم إرسال التذكرة ✅"});
});

/* عرض التذاكر */
app.get('/support-list', (req, res) => {
  res.json(supports);
});

/* رد الأدمن */
app.post('/reply', (req, res) => {
  const {id, reply} = req.body;

  supports = supports.map(s=>{
    if(s.id == id){
      s.reply = reply;
    }
    return s;
  });

  res.json({message:"تم الرد ✅"});
});

/* حذف التذكرة */
app.post('/delete-ticket', (req, res) => {
  const {id} = req.body;

  supports = supports.filter(s=>s.id != id);

  res.json({message:"تم حذف التذكرة 🗑️"});
});

/* =========================
   🚀 تشغيل السيرفر
========================= */
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});