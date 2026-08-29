const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Insert it right before "if (!process.env.VERCEL) {"
content = content.replace(
  "if (!process.env.VERCEL) {",
  `
// Ensure /api/* always returns JSON 404 if no route matched
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: "NOT_FOUND", message: "API endpoint not found" });
});

if (!process.env.VERCEL) {`
);

fs.writeFileSync('server.ts', content);
console.log("Patched 404 handler");
