import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("scratch-codes");
  const { code, action } = await req.json();

  if (!code) {
    return new Response(JSON.stringify({ error: "missing code" }), { status: 400 });
  }

  const existing = await store.get(code);

  if (action === "check") {
    return new Response(JSON.stringify({ used: !!existing }), { status: 200 });
  }

  if (action === "redeem") {
    if (existing) {
      return new Response(JSON.stringify({ ok: false }), { status: 200 });
    }
    await store.set(code, "used");
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "bad action" }), { status: 400 });
};
