const express = require("express");
const neo4j = require("neo4j-driver");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Connect to Neo4j Aura (CLOUD)
const driver = neo4j.driver(
  "neo4j+s://5738474a.databases.neo4j.io",
  neo4j.auth.basic("5738474a", "CIhtZoa0qwzFWJaARUKB0PLX7mgaKHNNrRixDwC3Jpw")
);

// ✅ Test route
app.get("/test", async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      "RETURN 'Neo4j connected!' AS message"
    );
    res.send(result.records[0].get("message"));
  } catch (err) {
    console.error(err);
    res.send("Connection failed");
  } finally {
    await session.close();
  }
});

// 🔥 FINAL PRODUCTS ROUTE
app.get("/products", async (req, res) => {
  const session = driver.session();
  const category = req.query.category;

  try {
    let result;

    if (category) {
      // ✅ For pages like makeup.html
      result = await session.run(
        `
        MATCH (p:Product)-[:BELONGS_TO]->(c:Category {name: $category})
        RETURN p
        `,
        { category }
      );
    } else {
      // 🔥 For shop.html → exclude Makeup
      result = await session.run(
        `
        MATCH (p:Product)-[:BELONGS_TO]->(c:Category)
        WHERE c.name <> "Makeup"
        RETURN p
        `
      );
    }

    const products = result.records.map(record => {
      const p = record.get("p").properties;

      return {
        name: p.name,
        price: p.price.low,
        image: p.image
      };
    });

    res.json(products);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching products");
  } finally {
    await session.close();
  }
});

// ✅ Add product
app.post("/add-product", async (req, res) => {
  const session = driver.session();
  const { name, price } = req.body;

  try {
    await session.run(
      "CREATE (p:Product {name: $name, price: $price})",
      { name, price }
    );

    res.send("Product added");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding product");
  } finally {
    await session.close();
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});