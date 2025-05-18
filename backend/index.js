const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "secret123";


function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/register', async (req, res) => {
  const { name, email, tc, birth_date, password } = req.body;
  const role = "user";

  if (!name || !email || !tc || !birth_date || !password) {
    return res.status(400).json({ message: "Eksik bilgi gönderildi" });
  }

  try {
    const [existingUsers] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Bu e-mail zaten kayıtlı" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (name, email, tc, birth_date, password, role) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, tc, birth_date, hashedPassword, role]
    );

    res.status(201).json({ message: "Kayıt başarılı" });
  } catch (err) {
    console.error("Register Hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});



app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  if (users.length === 0) return res.status(401).json({ error: "Invalid email or password." });

  const user = users[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials." });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token, user: { id: user.id, role: user.role } });
});

app.get("/menu", async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM menu");
  res.json(rows);
});

app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, tc, birth_date FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.json(rows[0]); // id'yi de döndür
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

app.get("/tables", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT table_number, is_reserved, reserved_by, id FROM tables");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Masalar alınamadı" });
  }
});

app.get("/api/orders", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const [rows] = await db.execute(`
    SELECT o.id, u.name AS user, m.name AS item, o.quantity, m.price 
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN menu m ON o.item_id = m.id
  `);
  res.json(rows);
});

app.post("/api/orders/deliver/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM orders WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Sipariş silinemedi" });
  }
});
app.delete("/api/menu/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM menu WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Ürün silinemedi" });
  }
});



app.post("/cart", authenticateToken, async (req, res) => {
  const { itemId, quantity = 1 } = req.body;

  try {

    const [existing] = await db.execute(
      "SELECT * FROM cart WHERE user_id = ? AND item_id = ?",
      [req.user.id, itemId]
    );

    if (existing.length > 0) {

      await db.execute(
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND item_id = ?",
        [quantity, req.user.id, itemId]
      );
    } else {

      await db.execute(
        "INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, ?)",
        [req.user.id, itemId, quantity]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Cart insert/update error:", err);
    res.status(500).json({ error: "Cart işlem hatası" });
  }
});


app.get("/cart", authenticateToken, async (req, res) => {
  const [rows] = await db.execute(
    "SELECT m.name, m.price FROM cart c JOIN menu m ON c.item_id = m.id WHERE c.user_id = ?",
    [req.user.id]
  );
  res.json(rows);
});

app.post("/cart/increase", authenticateToken, async (req, res) => {
  const { item_id } = req.body;
  try {
    await db.execute(
      "UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND item_id = ?",
      [req.user.id, item_id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to increase quantity" });
  }
});

app.post("/cart/decrease", authenticateToken, async (req, res) => {
  const { item_id } = req.body;
  try {
    await db.execute(
      "UPDATE cart SET quantity = GREATEST(quantity - 1, 1) WHERE user_id = ? AND item_id = ?",
      [req.user.id, item_id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to decrease quantity" });
  }
});


app.get("/orders", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const [rows] = await db.execute(
    "SELECT u.name AS user, m.name, m.price FROM cart c JOIN users u ON c.user_id = u.id JOIN menu m ON c.item_id = m.id"
  );
  res.json(rows);
});

app.delete("/orders/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM orders WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});


app.get("/api/users", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Yetkisiz erişim" });
  }

  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, tc, birth_date, role FROM users ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Kullanıcılar alınamadı:", err);
    res.status(500).json({ error: "Veritabanı hatası" });
  }
});


app.delete("/api/users/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Yetkisiz erişim" });
  }

  const { id } = req.params;
  try {
    await db.execute("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Kullanıcı silme hatası:", err);
    res.status(500).json({ error: "Kullanıcı silinemedi" });
  }
});




app.get("/reservations", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM reservations");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

app.post("/reserve", authenticateToken, async (req, res) => {
  const { tableNumber, dateTime } = req.body;

  if (!tableNumber || !dateTime) {
    return res.status(400).json({ error: "Eksik bilgi gönderildi" });
  }

  try {
    
    const [existing] = await db.execute(
      "SELECT table_number FROM tables WHERE reserved_by = ?",
      [req.user.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: `Zaten ${existing[0].table_number} numaralı masayı rezerve ettiniz.` });
    }

   
    const [check] = await db.execute(
      "SELECT is_reserved FROM tables WHERE table_number = ?",
      [tableNumber]
    );

    if (check.length === 0) {
      return res.status(404).json({ error: "Masa bulunamadı" });
    }

    if (check[0].is_reserved) {
      return res.status(400).json({ error: "Bu masa zaten rezerve edilmiş" });
    }

 
    await db.execute(
      "INSERT INTO reservations (user_id, table_number, date_time) VALUES (?, ?, ?)",
      [req.user.id, tableNumber, new Date(dateTime)]
    );

    await db.execute(
      "UPDATE tables SET is_reserved = TRUE, reserved_by = ? WHERE table_number = ?",
      [req.user.id, tableNumber]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Rezervasyon hatası:", err);
    res.status(500).json({ error: "Rezervasyon başarısız" });
  }
});


app.get("/api/user-has-reservation", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM tables WHERE reserved_by = ?",
      [req.user.id]
    );
    res.json({ hasReservation: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: "Rezervasyon kontrol hatası" });
  }
});




app.post("/cancel-reservation", authenticateToken, async (req, res) => {
  const { tableNumber } = req.body;

  try {
   
    const [rows] = await db.execute(
      "SELECT reserved_by FROM tables WHERE table_number = ?",
      [tableNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Masa bulunamadı" });
    }

    if (rows[0].reserved_by !== req.user.id) {
      return res.status(403).json({ error: "Bu masa sizin tarafınızdan rezerve edilmedi" });
    }


    await db.execute(
      "UPDATE tables SET is_reserved = FALSE, reserved_by = NULL WHERE table_number = ?",
      [tableNumber]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Rezervasyon iptal hatası:", err);
    res.status(500).json({ error: "İptal başarısız" });
  }
});

app.post("/cancel-reservation-byadmin", authenticateToken, async (req, res) => {
 
  const { tableNumber } = req.body;
  try {
    await db.execute("UPDATE tables SET is_reserved = 0, reserved_by = NULL WHERE table_number = ?", [tableNumber]);
    res.json({ success: true });
  } catch (err) {
    console.error("Rezervasyon iptali hatası:", err);
    res.status(500).json({ error: "İptal edilemedi" });
  }
});


app.post("/api/confirm-order", authenticateToken, async (req, res) => {
  try {
    const [cartItems] = await db.execute(
      "SELECT item_id, quantity FROM cart WHERE user_id = ?",
      [req.user.id]
    );

    for (const item of cartItems) {
      await db.execute(
        "INSERT INTO orders (user_id, item_id, quantity) VALUES (?, ?, ?)",
        [req.user.id, item.item_id, item.quantity]
      );
    }

    await db.execute("DELETE FROM cart WHERE user_id = ?", [req.user.id]);

    res.sendStatus(200);
  } catch (err) {
    console.error("Order confirmation failed:", err);
    res.status(500).json({ error: "Order confirmation failed" });
  }
});

app.get("/api/cash", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Yetkisiz erişim" });

  try {
    const [rows] = await db.execute(`
      SELECT 
        u.name AS customer_name,
        t.table_number,
        m.name AS item_name,
        o.quantity,
        (m.price * o.quantity) AS total_price
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN tables t ON t.reserved_by = u.id
      JOIN menu m ON o.item_id = m.id
      ORDER BY o.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Kasa verisi hatası:", err);
    res.status(500).json({ error: "Kasa verisi getirilemedi" });
  }
});

const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


app.post("/menu", authenticateToken, upload.single("image"), async (req, res) => {
  const { name, price, category } = req.body;
  const image = req.file ? "/uploads/" + req.file.filename : null;

  if (!name || !price || !category || !image) {
    return res.status(400).json({ error: "Tüm alanlar zorunlu." });
  }

  try {
    await db.execute(
      "INSERT INTO menu (name, price, category, image) VALUES (?, ?, ?, ?)",
      [name, price, category, image]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Ürün ekleme hatası:", err);
    res.status(500).json({ error: "Ürün eklenemedi." });
  }
});


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.listen(3001, () => console.log("JWT Auth Server running on http://localhost:3001"));