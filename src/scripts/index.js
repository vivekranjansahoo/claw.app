const connectDB = require("../config/db-config");
const { fetchNews } = require("./newsapi");


async function main() {
    try {
        await connectDB();
        console.log("Running script...")
        await fetchNews();
        process.exit(0);
    } catch (error) {
        console.log(error);
    }
}

main();