import * as cheerio from 'cheerio';

export const scrapeWebpage = async (url: string) => {
  const response = await fetch(url);
  const html = await response.text();
  return cheerio.load(html);
};
