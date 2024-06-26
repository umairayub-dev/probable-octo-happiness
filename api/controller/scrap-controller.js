const axios = require('axios');
const cheerio = require('cheerio');
const html2json = require('html2json').html2json;

module.exports = class ScrapController {
    static async getInfo(abtData, maxPages = 10, startPage = 0) {
        let results = [];
        let count = startPage;

        while (count < startPage + maxPages) {
            const url = `https://www.google.com/search?q=${abtData}&start=${count}`;
            const response = await axios(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12'
                }
            });

            const html = response.data;
            let $ = cheerio.load(html);
            let searchRes = $(`a`);
            let final = html2json(searchRes.toString()).child;

            results = results.concat(filterInstagramUrls(final));

            count++;
        }

        return { totalProfiles: results.length, profiles: results };
    }
}

const filterInstagramUrls = (data) => {
    return data
        .filter(item => 
            item.attr && 
            item.attr.href && 
            item.attr.href.includes('instagram.com') && 
            item.attr.href.includes('url=') && 
            !item.attr.href.includes('google.com') &&
            !item.attr.href.includes('/search?q=') &&
            !item.attr.href.includes('site:instagram.com'))
        .map(item => {
            const urlMatch = item.attr.href.match(/url=([^&]*)/);
            return urlMatch ? decodeURIComponent(urlMatch[1]) : null;
        })
        .filter(url => url && url.includes('instagram.com'));
};
