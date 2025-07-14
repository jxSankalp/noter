const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function fetchPageTitle(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    return $("title").text() || "Untitled";
  } catch {
    return "Untitled";
  }
};
