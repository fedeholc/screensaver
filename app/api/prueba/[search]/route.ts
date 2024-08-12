
import sqlite3 from "sqlite3";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { search: string } }
) {
  const searchParams = request.nextUrl.searchParams.get("page")

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

/**
 export async function GET(
  request: Request,
  { params }: { params: { search: string, page?: string, limit?: string } }
) {
  const db = createDbConnection("./images.db");

  // Obtener los parámetros de paginación
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10);
  const offset = (page - 1) * limit;

  const sql = `SELECT * FROM image WHERE INSTR(url, '${params.search}') > 0 LIMIT ${limit} OFFSET ${offset};`;

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
 */