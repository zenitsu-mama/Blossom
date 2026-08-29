const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const proxyCode = `
// Database proxy for serverless environments
const db = new Proxy({}, {
  get: (target, prop) => async (...args) => {
    const actualDb = await getDb();
    return (actualDb)[prop](...args);
  }
});
`;

content = content.replace('async function startServer() {\n  const db = await getDb();', proxyCode);

// Find the Vite middleware block which starts with // Vite middleware for development
const endBlockIndex = content.indexOf('  // Vite middleware for development');
if (endBlockIndex === -1) throw new Error("Could not find Vite middleware block");

const startBlock = content.substring(0, endBlockIndex);
let endBlock = content.substring(endBlockIndex);

// endBlock currently contains the closing brace for startServer() at the end, and startServer(); call.
// We need to wrap it correctly.
endBlock = endBlock.replace(/}\n\nstartServer\(\);\n?$/, '');
endBlock = endBlock.replace(/}\nstartServer\(\);\n?$/, '');

const wrappedEndBlock = `
if (!process.env.VERCEL) {
  (async () => {
${endBlock.split('\n').map(line => '  ' + line.replace(/^  /, '')).join('\n')}
  })();
}

export default app;
`;

fs.writeFileSync('server.ts', startBlock + wrappedEndBlock);
console.log("Refactored server.ts");
