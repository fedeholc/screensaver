
import sqlite3 from "sqlite3";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-static'


export async function GET(
  request: Request

) {
  const db = createDbConnection("./images.db");
  const sql = `SELECT album.id from album ORDER BY RANDOM() LIMIT 1;`;

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
    console.log("rows", rows);
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