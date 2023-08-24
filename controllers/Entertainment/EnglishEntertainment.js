import axios from 'axios'
import {parseString} from 'xml2js'
import he from 'he'
import cheerio from 'cheerio'

const getFeedsNDTV = async() =>{
    try{
        
        const responseNDTV = await axios.get('https://feeds.feedburner.com/ndtvmovies-latest');
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
const getFeedsABP = async() =>{
    try{
        
        const responseABP = await axios.get('https://news.abplive.com/entertainment/television/feed');
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
const getFeedsNews18 = async() =>{
    try{
        
        const responseNews18 = await axios.get('https://www.news18.com/rss/entertainment.xml');
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

export const getEnglishEntertainmentFeeds = async(req,res) => {
    
    try{
        const feedsNews18 = await getFeedsNews18()
        const feedsNDTV = await getFeedsNDTV();
        const feedsABP = await getFeedsABP();

        const allFeeds = [];

        allFeeds.push(feedsNews18)
        allFeeds.push(feedsNDTV)
        allFeeds.push(feedsABP)
        
        const flattenedArray = flattenArrayByPattern(allFeeds);
       
        res.status(200).json(flattenedArray.slice(0,100));
    }
    catch(err){
        res.status(500).json({ error: 'Failed to retrieve and parse feeds' });
    }
} 

