
import sqlite3 from "sqlite3";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
 ) {

  //TODO: ojo, tal vez convenga hacer todo con searchParams para la busqueda por el tema de los espacios

  const search = request.nextUrl.searchParams.get("search") || "";

  const page = request.nextUrl.searchParams.get("page") || "1";
  const limit = 20;
  const offset = ((parseInt(page) - 1) * limit);

  const db = createDbConnection("./images.db");
  const sql = `SELECT * FROM image WHERE INSTR(url, '${search}') >  0 LIMIT ${limit} OFFSET ${offset};`;

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