export const config = {
  matcher: "/",
};

export default async function middleware(request: Request): Promise<Response | undefined> {
  const accept = request.headers.get("accept") ?? "";
  if (!accept.includes("text/markdown")) return undefined;

  const mdUrl = new URL("/resolvio.md", request.url);
  const res = await fetch(mdUrl.toString());
  const content = await res.text();

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Markdown-Tokens": String(Math.ceil(content.length / 4)),
    },
  });
}
