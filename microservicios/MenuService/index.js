const express = require("express");
const { v4: uuid } = require("uuid");

const app = express();
app.use(express.json());

const menu = [];

// Crear producto
app.post("/menu", (req, res) => {
  const item = {
    id: uuid(),
    name: req.body.name,
    price: req.body.price
  };

  menu.push(item);
  res.status(201).json(item);
});

// Obtener producto
app.get("/menu/:id", (req, res) => {
  const item = menu.find(m => m.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found" });

  res.json(item);
});

app.listen(3002, () => {
  console.log("Menu Service running on port 3002");
});