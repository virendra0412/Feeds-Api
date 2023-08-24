import axios from 'axios'
import {parseString} from 'xml2js'
import he from 'he'
import cheerio from 'cheerio'

const getFeedsNDTV = async() =>{
    try{
        const responseNDTV = await axios.get('https://feeds.feedburner.com/ndtvnews-top-stories');
        const xmlDataNDTV = responseNDTV.data;        
        let jsonDataNDTV;
        parseString(xmlDataNDTV, (err,resultNDTV) => {
            if(err){
                throw new Error("Failed to parse xml")
            }
            jsonDataNDTV = resultNDTV
        })

        let extractedFeedsNDTV = jsonDataNDTV.rss.channel[0].item ;
        let extractedDataNDTV = extractedFeedsNDTV.map(feed => {
            const title = feed.title[0];
            const encodedText = feed["content:encoded"][0];
            const decodedText = he.decode(encodedText);
            const descplain = cheerio.load(decodedText)
            const description = descplain.root().text().slice(0,250);
            const link = feed.link[0];
            const imageurl = feed["media:content"][0].$.url;
            const channel = "NDTV"
            return { title, link, imageurl, description, channel }
        })
        return(extractedDataNDTV)
    }
    catch(err){
        return([])
    }
}


const getFeedsHindustanTimes = async() =>{
    try{
        
        const responseHindustanTimes = await axios.get('https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml');
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


const getFeedsABP = async() =>{
    try{
        const responseABP = await axios.get('https://news.abplive.com/news/india/feed');
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


const flattenArrayByPattern = (arr) => {
    const maxLength = Math.max(...arr.map(subArray => subArray.length));
  
    const flattenedArray = Array.from({ length: maxLength }, (_, i) =>
      arr.map(subArray => subArray[i]).filter(Boolean)
    ).flat();
  
    return flattenedArray;
}

export const getEnglishFeeds = async(req,res) => {
    try{
        const feedsABP = await getFeedsABP();   
        const feedsHindustanTimes = await getFeedsHindustanTimes();
        const feedsNDTV = await getFeedsNDTV();
       
        const allFeeds = [];

        allFeeds.push(feedsABP)
        allFeeds.push(feedsHindustanTimes)
        allFeeds.push(feedsNDTV)
        const flattenedArray = flattenArrayByPattern(allFeeds);
        res.status(200).json(flattenedArray);

    }
    catch(err){
        res.status(500).json({ error: 'Failed to retrieve and parse feeds' });
    }
} 

