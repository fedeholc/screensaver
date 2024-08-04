import i from "./images2.json";

export async function GET() {

  return Response.json(i);
}