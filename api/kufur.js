import fetch from "node-fetch";
import Filter from "bad-words";

export const config = { runtime: "edge" }; // Vercel uyumlu

const filter = new Filter();

export default async function handler(req, res) {
  const { kelime } = req.query;

  if (!kelime) {
    return new Response(JSON.stringify({ error: "kelime parametresi gerekli" }), { status: 400 });
  }

  try {
    // Hugging Face linkinden Türkçe küfür listesi çekiliyor
    const url = "https://huggingface.co/api/resolve-cache/models/zeytokg/Byte/0ce31de8ffef355e1ff9b49a1b8aa96133cfe633/kara%20ku%CC%88fu%CC%88r%20listesi%20data.txt";
    const response = await fetch(url);
    const text = await response.text();

    const turkceKufurler = text.split(/\s+/).filter(Boolean);

    // Türkçe küfürleri filtreye ekle
    filter.addWords(...turkceKufurler);

    // Küfür kontrolü ve temizlenmiş hali
    const kufurVar = filter.isProfane(kelime);
    const temiz = filter.clean(kelime);

    return new Response(JSON.stringify({
      kufurVar,
      kelime,
      temiz
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
