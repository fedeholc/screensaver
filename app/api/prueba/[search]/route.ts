
import sqlite3 from "sqlite3";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { search: string } }
) {

  //TODO: ojo, tal vez convenga hacer todo con searchParams para la busqueda por el tema de los espacios

  const page = request.nextUrl.searchParams.get("page") || "1";
  const limit = 20;
  const offset = ((parseInt(page) - 1) * limit);

  const db = createDbConnection("./images.db");
  const sql = `SELECT * FROM image WHERE INSTR(url, '${params.search}') >  0 LIMIT ${limit} OFFSET ${offset};`;

  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(sql, [], (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });

    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json(error);
  } finally {
    closeDbConnection(db);
  }
}
function closeDbConnection(db: sqlite3.Database) {
  db.close((error) => {
    if (error) {
      return console.error(error.message);
    } else {
      console.log("Database connection closed");
    }
  });
}

function createDbConnection(filepath: string): sqlite3.Database {
  if (fs.existsSync(filepath)) {
    console.log("Database already exists");
  } else {
    console.log("Creating database");
  }

  return new sqlite3.Database(filepath, (error) => {
    if (error) {
      return console.error(error.message);
    } else {
      console.log("Connection with SQLite has been established");
    }
  });
}

//? con express
/*
const express = require('express');
const sqlite3 = require('sqlite3');
const fs = require('fs');

const app = express();
const port = 3000;

// Ruta GET equivalente
app.get('/search/:search', async (req, res) => {
  const search = req.params.search;
  const page = parseInt(req.query.page || '1', 10);
  const limit = 20;
  const offset = (page - 1) * limit;

  const db = createDbConnection('./images.db');
  const sql = `SELECT * FROM image WHERE INSTR(url, ?) > 0 LIMIT ? OFFSET ?`;

  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(sql, [search, limit, offset], (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    closeDbConnection(db);
  }
});

// Función para cerrar la conexión a la base de datos
function closeDbConnection(db) {
  db.close((error) => {
    if (error) {
      console.error('Error closing the database connection:', error.message);
    } else {
      console.log('Database connection closed');
    }
  });
}

// Función para crear la conexión a la base de datos
function createDbConnection(filepath) {
  if (fs.existsSync(filepath)) {
    console.log('Database already exists');
  } else {
    console.log('Creating database');
  }

  return new sqlite3.Database(filepath, (error) => {
    if (error) {
      console.error('Error connecting to the database:', error.message);
    } else {
      console.log('Connection with SQLite has been established');
    }
  });
}

// Inicia el servidor en el puerto 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
*/