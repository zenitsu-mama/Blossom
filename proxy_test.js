const getDb = async () => ({
  execute: async (query) => `Executed ${query}`,
  transaction: async (mode) => ({ mode, commit: async () => 'committed' })
});

const db = new Proxy({}, {
  get: (target, prop) => async (...args) => {
    const actualDb = await getDb();
    return actualDb[prop](...args);
  }
});

async function test() {
  console.log(await db.execute("SELECT 1"));
  const tx = await db.transaction("write");
  console.log(await tx.commit());
}
test();
