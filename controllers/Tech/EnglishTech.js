import axios from 'axios'
import {parseString} from 'xml2js'
import he from 'he'
import cheerio from 'cheerio'

const getFeedsHindustanTimes = async() => {
    try{
        const responseHindustanTimes = await axios.get('https://www.hindustantimes.com/feeds/rss/technology/rssfeed.xml');
        const xmlDataHindustanTimes = responseHindustanTimes.data;        
        let jsonDataHindustanTimes;
        parseString(xmlDataHindustanTimes, (err,resultHindustanTimes) => {
            if(err){
                throw new Error("Failed to parse xml")
            }
            jsonDataHindustanTimes = resultHindustanTimes
        })
        let extractedFeedsHindustanTimes = jsonDataHindustanTimes.rss.channel[0].item ;
        let extractedDataHindustanTimes = extractedFeedsHindustanTimes.map(feed => {
            const title = feed.title[0];
            const encodedText = feed.description[0];
            const decodedText = he.decode(encodedText);
            const descplain = cheerio.load(decodedText)
            const description = descplain.root().text().slice(0,250);
            const link = feed.link[0];
            const imageurl = feed["media:content"][0].$.url;
            const channel = "Hindustan Times"
            return { title, link, imageurl, description, channel }
        })
        return(extractedDataHindustanTimes)
    }
    catch(err){
        return([])
    }
}

const getFeedsABP = async() => {
    try{
        const responseABP = await axios.get('https://news.abplive.com/technology/feed');
        const xmlDataABP = responseABP.data;        
        let jsonDataABP;
        parseString(xmlDataABP, (err,resultABP) => {
            if(err){
                throw new Error("Failed to parse xml")
            }
            jsonDataABP = resultABP
        })
        let extractedFeedsABP = jsonDataABP.rss.channel[0].item ;
        let extractedDataABP = extractedFeedsABP.map(feed => {
            const title = feed.title[0];
            const encodedText = feed.description[0];
            const decodedText = he.decode(encodedText);
            const descplain = cheerio.load(decodedText)
            const description = descplain.root().text().slice(0,250);
            const link = feed.link[0];
            const imageurl = feed["media:thumbnail"][0].$.url;
            const channel = "ABP"
            return { title, link, imageurl, description, channel }
        })
        return(extractedDataABP)
    }
    catch(err){
        return([])
    }
}

const getFeedsNews18 = async() => {
    try{
        const responseNews18 = await axios.get('https://www.news18.com/rss/tech.xml');
        const xmlDataNews18 = responseNews18.data;        
        let jsonDataNews18;
        parseString(xmlDataNews18, (err,resultNews18) => {
            if(err){
                throw new Error("Failed to parse xml")
            }
            jsonDataNews18 = resultNews18
        })
        let extractedFeedsNews18 = jsonDataNews18.rss.channel[0].item ;
        let extractedDataNews18 = extractedFeedsNews18.map(feed => {
            const title = feed.title[0];
            const encodedText = feed.description[0];
            const decodedText = he.decode(encodedText);
            const descplain = cheerio.load(decodedText)
            const description = descplain.root().text().slice(0,250);
            const link = feed.link[0];
            const imageurl = feed["media:content"][0].$.url;
            const channel = "News18"
            return { title, link, imageurl, description, channel }
        })
        return(extractedDataNews18)
    }
    catch(err){
        return([])
    }
}

const flattenArrayByPattern = (arr) => {
    const maxLength = Math.max(...arr.map(subArray => subArray.length));
  
    const flattenedArray = Array.from({ length: maxLength }, (_, i) =>
      arr.map(subArray => subArray[i]).filter(Boolean)
    ).flat();
  
    return flattenedArray;
}

export const getEnglishTechFeeds = async(req,res) => {
    try{
        const feedsABP = await getFeedsABP();   
        const feedsHindustanTimes = await getFeedsHindustanTimes();
        const feedsNews18 = await getFeedsNews18();

        const allFeeds = [];

        allFeeds.push(feedsABP)
        allFeeds.push(feedsHindustanTimes)
        allFeeds.push(feedsNews18)
        
        const flattenedArray = flattenArrayByPattern(allFeeds);
       
        res.status(200).json(flattenedArray);

    }
    catch(err){
        res.status(500).json({ error: 'Failed to retrieve and parse feeds' });
    }
} 

