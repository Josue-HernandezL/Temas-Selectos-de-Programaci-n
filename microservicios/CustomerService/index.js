const express = require("express");
const { v4: uuid } = require("uuid");

const app = express();
app.use(express.json());

const customers = [];

// Crear cliente
app.post("/customers", (req, res) => {
  const customer = {
    id: uuid(),
    name: req.body.name
  };

  customers.push(customer);
  res.status(201).json(customer);
});

// Obtener cliente
app.get("/customers/:id", (req, res) => {
  const customer = customers.find(c => c.id === req.params.id);
  if (!customer) return res.status(404).json({ error: "Customer not found" });

  res.json(customer);
});

app.listen(3001, () => {
  console.log("Customer Service running on port 3001");
});