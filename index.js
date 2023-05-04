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

// OBTENER DATOS MANTENEDOR USUARIOS

app.get("/api/v1/users", async (req, res) => {
    const resultado = await pool.query("SELECT users.*, categoria.id AS categoria_id, categoria.nombrecategoria FROM users LEFT JOIN categoria ON users.categoria = categoria.id ORDER BY users.id");
    res.json(resultado.rows)
})

// OBTENER DATOS MANTENEDOR PUNTOS

app.get("/api/v1/puntos3", async (req, res) => {
    const resultado = await pool.query("SELECT * from museums order by id");
    res.json(resultado.rows)
})


// OBTENER DATOS USUARIOS PARA EL REGISTRO

app.get("/api/v1/users3", async (req, res) => {
    const resultado = await pool.query("SELECT users.*, categoria.id AS categoria_id, categoria.nombrecategoria FROM users LEFT JOIN categoria ON users.categoria = categoria.id ORDER BY users.id");
    res.json(resultado.rows)
})

// OBTENER DATOS MANTENEDOR PUNTOS

app.get("/api/v1/puntos2", async (req, res) => {
    const resultado = await pool.query(`
        SELECT 
            museums.id, 
            museums.nombre, 
            museums.img, 
            museums.Direccion, 
            museums.Horario, 
            ST_AsGeoJSON(museums.geom) AS geometry,
            museums.categoria, 
            museums.creador,
            categoriapuntos.tipo,
            users.id AS user_id,
            users.name AS user_name
        FROM 
            museums 
            INNER JOIN categoriapuntos ON museums.categoria = categoriapuntos.id 
            INNER JOIN users ON museums.creador = users.id 
        ORDER BY 
            museums.id
    `);
    const features = resultado.rows.map(row => {
        const geometry = JSON.parse(row.geometry);
        return {
            type: 'Feature',
            geometry: geometry ? geometry.coordinates : null,
            id: row.id,
            nombre: row.nombre,
            img: row.img,
            direccion: row.direccion,
            horario: row.horario,
            idcategoria: row.categoria,
            tipo: row.tipo,
            idcreador: row.creador,
            user_id: row.user_id,
            user_name: row.user_name,
        };
    });
    res.json(features);
});


// DATOS PARA PASSPORTCONFIG

app.get("/api/v1/users2", async (req, res) => {
    const { email } = req.query;
    const query = email ? `SELECT * FROM users WHERE email = $1` : `SELECT * FROM users ORDER BY id`;
    const values = email ? [email] : [];
    const resultado = await pool.query(query, values);
    res.json(resultado.rows);
  });

  // OBTENER UNA ID ESPECIFICA DE UN USUARIO (EDITAR, BORRAR, DESERIALISER, deserialize) 

  app.get("/api/v1/users/:id", async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM users WHERE id = $1`;
    const values = [id];
    const resultado = await pool.query(query, values);
    res.json(resultado.rows[0]);
  });

// CARGA PUNTOS MAPA

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

// MANTENEDOR DE USUARIOS

// ELIMINAR EN MANTENEDOR USUARIOS

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

// INGRESAR DATOS MANTENEDOR USUARIO

app.post("/api/v1/users", async (req, res) => {
    const { name, email, password, categoria } = req.body;
    const resultado = await pool.query(
      "INSERT INTO users (name, email, password, categoria) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, email, password, categoria]
    );
    console.log(resultado);
    res.json({});
});


// REGISTRO USUARIOS

app.post("/api/v1/users3", async (req, res) => {
    const { name, email, password } = req.body;
    const resultado = await pool.query(
      "INSERT INTO users (name, email, password, categoria) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, email, password, 3]
    );
    console.log(resultado);
    res.json({});
});


// EDITAR Mantenedor USUARIOS

app.put("/api/v1/users/:id", async (req, res) => {
    const { id, name, email, password, categoria } = req.body;
    const resultado = await pool.query("update users set name=$1, email=$2, password=$3, categoria=$4 where id=$5", [name, email, password, categoria, id]);
    console.log(resultado);
    res.json({});
});


// MANTENEDOR DE PUNTOS MAPA

// INGRESAR DATOS MANTENEDOR PUNTOS

app.post("/api/v1/puntos", async (req, res) => {
    const { nombre, img, direccion, horario, geom, categoria, creador } = req.body;
  
    // Split the coordinates string into an array of longitude and latitude values
    const [lng, lat] = geom.split(',');
  
    const resultado = await pool.query(
      "INSERT INTO museums (nombre, img, direccion, horario, geom, categoria, creador) VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), $7, $8) RETURNING id",
      [nombre, img, direccion, horario, lng, lat, categoria, creador]
    );
  
    console.log(resultado);
    res.json({});
  });

  // ELIMINAR EN MANTENEDOR PUNTOS

app.delete("/api/v1/puntos/:id", async (req, res) => {
    try {
        const { id } = req.params
        const resultado = await pool.query("delete from museums where id=$1 RETURNING id", [id]);
        if (resultado.rows) {
            res.status(200).json({ id: resultado.rows[0].id })
        } else {
            res.status(404).json({ error: "Registro no Existe" })
        }
    } catch (e) {
        res.status(500).json({ error: e })
    }


})

// EDITAR Mantenedor PUNTOS

app.put("/api/v1/puntos/:id", async (req, res) => {
    const { nombre, img, direccion, horario, geom, categoria, creador } = req.body;
    const id = req.params.id;
  
    // Split the coordinates string into an array of longitude and latitude values
    const [lng, lat] = geom.split(',');
  
    const resultado = await pool.query(
      "UPDATE museums SET nombre=$1, img=$2, direccion=$3, horario=$4, geom=ST_SetSRID(ST_MakePoint($5, $6), 4326), categoria=$7, creador=$8 WHERE id=$9",
      [nombre, img, direccion, horario, lng, lat, categoria, creador, id]
    );
    console.log(resultado);
    res.json({});
  });