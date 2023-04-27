const express = require("express")
const pg = require("pg")
const cors = require('cors')
const app = express()
const { Pool } = pg;
app.use(express.json());
app.use(cors());

// const pool = new Pool({
//     host: "localhost",
//     user: "postgres",
//     database: "diurno",
//     password: "12345",
//     port: 5432
// })

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    database: "final",
    password: "12345",
    port: 5432
})

app.listen(4000)

app.get("/api/v1/users", async (req, res) => {
    const resultado = await pool.query("SELECT users.*, categoria.nombrecategoria FROM users LEFT JOIN categoria ON users.categoria = categoria.id ORDER BY users.id");
    res.json(resultado.rows)
})

app.get("/api/v1/puntos2", async (req, res) => {
    const resultado = await pool.query("SELECT id, nombre, img, Direccion, Horario, ST_AsGeoJSON(geom) AS geometry FROM museums order by id");
    const features = resultado.rows.map(row => {
        const geometry = JSON.parse(row.geometry);
        return {
            type: 'Feature',
            geometry: geometry ? geometry.coordinates : null,
            id: row.id,
            nombre: row.nombre,
            img: row.img,
            direccion: row.direccion,
            horario: row.horario        
        };
    });
    res.json(features);
});

app.get("/api/v1/users2", async (req, res) => {
    const { email } = req.query;
    const query = email ? `SELECT * FROM users WHERE email = $1` : `SELECT * FROM users ORDER BY id`;
    const values = email ? [email] : [];
    const resultado = await pool.query(query, values);
    res.json(resultado.rows);
  });

  app.get("/api/v1/users/:id", async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM users WHERE id = $1`;
    const values = [id];
    const resultado = await pool.query(query, values);
    res.json(resultado.rows[0]);
  });

app.get("/api/v1/puntos", async (req, res) => {
    const resultado = await pool.query(
        "SELECT id, nombre, img, Direccion, Horario, ST_AsGeoJSON(geom) AS geometry FROM museums order by id"
    );
    const geojsonData = {
        type: "FeatureCollection",
        features: resultado.rows.map((feature) => ({
            type: "Feature",
            geometry: JSON.parse(feature.geometry),
            properties: {
                id: feature.id,
                nombre: feature.nombre,
                img: feature.img,
                Direccion: feature.direccion,
                Horario: feature.horario,
            },
        })),
    };
    res.json(geojsonData);
});

app.delete("/api/v1/users/:id", async (req, res) => {
    try {
        const { id } = req.params
        const resultado = await pool.query("delete from users where id=$1 RETURNING id", [id]);
        if (resultado.rows) {
            res.status(200).json({ id: resultado.rows[0].id })
        } else {
            res.status(404).json({ error: "Registro no Existe" })
        }
    } catch (e) {
        res.status(500).json({ error: e })
    }


})

// INGRESAR DATOS

app.post("/api/v1/users", async (req, res) => {
    const { name, email, password } = req.body;
    const resultado = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      [name, email, password]
    );
    console.log(resultado);
    res.json({});
  });


// PRUEBA REGISTRO

app.post("/api/v1/users", async (req, res) => {
    const { name, email, password } = req.body;
    const resultado = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id", [name, email, password]);
    console.log(resultado);
    res.json({});
});


// EDITAR

app.put("/api/v1/users/:id", async (req, res) => {
    const { id, name, email } = req.body;
    const resultado = await pool.query("update users set name =$1, email=$2 where id=$3", [name, email, id]);
    console.log(resultado),
        res.json({})

})