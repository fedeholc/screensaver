
import sqlite3 from "sqlite3";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { Image } from "@/app/types/db/Image";
export const dynamic = 'force-static'


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const db = createDbConnection("./images.db");
  const sql = `SELECT image.id, image.url, image.description, image.source, image.albumId, image.authorId from image INNER join album on image.albumId = album.id WHERE album.id = "${params.id}";`;
  console.log(params);
  try {
    const rows: Image[] = await new Promise<Image[]>((resolve, reject) => {
      db.all(sql, [], (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows as Image[]);
        }
      });
    });
    //TODO: habría que validar con zod que las rows sean del tipo Image?

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