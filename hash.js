const bcrypt = require('bcryptjs');

async function run() {
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    const hashes = await bcrypt.hash('natureza',salt);
    console.log(hashes);
};

run();