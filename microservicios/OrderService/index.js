const express = require("express");
const axios = require("axios");
const { v4: uuid } = require("uuid");

const app = express();
app.use(express.json());

const orders = [];

// Crear orden
app.post("/orders", async (req, res) => {
  try {
    const { customerId, menuId } = req.body;

    // Validar cliente
    const customerResponse = await axios.get(
      `http://localhost:3001/customers/${customerId}`
    );

    // Validar producto
    const menuResponse = await axios.get(
      `http://localhost:3002/menu/${menuId}`
    );

    const order = {
      id: uuid(),
      customer: customerResponse.data,
      item: menuResponse.data,
      total: menuResponse.data.price,
      createdAt: new Date()
    };

    orders.push(order);

    res.status(201).json(order);

  } catch (error) {
    res.status(400).json({
      error: "Servicio Fallo"
    });
  }
});

// Listar órdenes
app.get("/orders", (req, res) => {
  res.json(orders);
});

app.listen(3003, () => {
  console.log("Order Service running on port 3003");
});