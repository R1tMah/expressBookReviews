/* ──────────────────────────────────────────────────────────────
   PROMISE / ASYNC-AWAIT DEMOS  (Tasks 10 – 13)
   Install axios:   npm install axios
   Start server:    node index.js
   The calls below hit the very API you just built.
   ─────────────────────────────────────────────────────────── */
const axios = require("axios");          // ← add near the top if you prefer

const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("https://rimahapatra7-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/")            
      .then(res => {
        console.log("\nTask 10 – All books:\n", res.data);
        resolve(res.data);
      })
      .catch(err => reject(err));
  });
};


const getBookByISBN = async isbn => {
  try {
    const res = await axios.get(`https://rimahapatra7-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`);
    console.log(`\nTask 11 – Book with ISBN ${isbn}:\n`, res.data);
    return res.data;
  } catch (err) {
    console.error(err.message);
  }
};


const getBooksByAuthor = author => {
  axios
    .get(`https://rimahapatra7-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`)
    .then(res => {
      console.log(`\nTask 12 – Books by ${author}:\n`, res.data);
    })
    .catch(err => console.error(err.message));
};


const getBooksByTitle = async title => {
  try {
    const res = await axios.get(`https://rimahapatra7-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`);
    console.log(`\nTask 13 – Books titled "${title}":\n`, res.data);
  } catch (err) {
    console.error(err.message);
  }
};

/* -------------------------------------------------------------
   Kick them off (comment out after you grab screenshots) */
(async () => {
  await getAllBooks();            // Task 10 screenshot → task10.png
  await getBookByISBN(1);         // Task 11 screenshot → task11.png
  getBooksByAuthor("Unknown");    // Task 12 screenshot → task12.png
  await getBooksByTitle("Fairy tales"); // Task 13 screenshot → task13.png
})();
