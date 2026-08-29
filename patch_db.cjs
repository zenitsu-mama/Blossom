const fs = require('fs');

let content = fs.readFileSync('src/db.ts', 'utf8');

content = content.replace(
  /const client = createClient\({\n\s*url: 'file:' \+ dbPath\n\s*}\);/g,
  `const url = process.env.DATABASE_URL || ('file:' + dbPath);
    const authToken = process.env.DATABASE_AUTH_TOKEN;
    
    const client = createClient({
      url,
      ...(authToken ? { authToken } : {})
    });`
);

content = content.replace(
  /const freshClient = createClient\({\n\s*url: 'file:' \+ dbPath\n\s*}\);/g,
  `const url = process.env.DATABASE_URL || ('file:' + dbPath);
        const authToken = process.env.DATABASE_AUTH_TOKEN;
        const freshClient = createClient({
          url,
          ...(authToken ? { authToken } : {})
        });`
);

fs.writeFileSync('src/db.ts', content);
console.log("Patched src/db.ts");
