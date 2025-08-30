import Filter from "bad-words";
import turkceKufurler from "../data/turkce_kufurler.json" assert { type: "json" };

export const config = { runtime: "edge" };

const filter = new Filter();
filter.addWords(...turkceKufurler);

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const kelime = searchParams.get("kelime");

  if (!kelime) {
    return new Response(JSON.stringify({ error: "kelime parametresi gerekli" }), { status: 400 });
  }

  const kufurVar = filter.isProfane(kelime);
  const temiz = filter.clean(kelime);

  return new Response(JSON.stringify({
    kufurVar,
    kelime,
    temiz
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
