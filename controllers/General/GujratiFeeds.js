import axios from 'axios'
import {parseString} from 'xml2js'
import he from 'he'
import cheerio from 'cheerio'


const ABPGuj = async() =>  {
    try{
        const responseABPGuj = await axios.get('https://gujarati.abplive.com/news/feed');
        const xmlDataABPGuj = responseABPGuj.data;
        
        let jsonDataABPGuj;
        parseString(xmlDataABPGuj, (err,resultABPGuj) => {
            if(err){
                throw new Error("Failed to parse xml")
            }
            jsonDataABPGuj = resultABPGuj
        })

        let extractedFeedsABPGuj = jsonDataABPGuj.rss.channel[0].item ;
        let extractedDataABPGuj = extractedFeedsABPGuj.map(feed => {
            const title = feed.title[0];
            const encodedText = feed.description[0];
            const decodedText = he.decode(encodedText);
            const descplain = cheerio.load(decodedText)
            const description = descplain.root().text().slice(0,200);
            const link = feed.link[0];
            const imageurl = feed["media:thumbnail"][0].$.url;
            return { title, link, imageurl, description}
        })
        return(extractedDataABPGuj)
    }
    catch(err){
        return([])
    }
}

const GujratSamachar = async() =>{
    try{
        const responseGujaratSamachar = await axios.get('https://www.gujaratsamachar.com/rss/top-stories');
        const xmlDataGujaratSamachar = responseGujaratSamachar.data;
        
        let jsonDataGujaratSamachar;
        parseString(xmlDataGujaratSamachar, (err,resultGujaratSamachar) => {
            if(err){
                throw new Error("Failed to parse xml")
            }
            jsonDataGujaratSamachar = resultGujaratSamachar
        })

        let extractedFeedsGujaratSamachar = jsonDataGujaratSamachar.rss.channel[0].item ;
        let extractedDataGujaratSamachar = extractedFeedsGujaratSamachar.map(feed => {
            const title = feed.title[0];
            const encodedText = feed.description[0];
            const decodedText = he.decode(encodedText);
            const descplain = cheerio.load(decodedText)
            const description = descplain.root().text().slice(0,200);
            const link = feed.link[0];
            const imageurl = feed["enclosure"][0].$.url;
            return { title, link, imageurl, description}
        })
        return(extractedDataGujaratSamachar)
    }
    catch(err){
        return([])
    }
}

const SandeshIndia = async() => {
    try{
        const responseSandeshIndia = await axios.get('https://sandesh.com/rss/india.xml');
        const xmlDataSandeshIndia = responseSandeshIndia.data;
        
        let jsonDataSandeshIndia;
        parseString(xmlDataSandeshIndia, (err,resultSandeshIndia) => {
            if(err){
                throw new Error("Failed to parse xml")
            }
            jsonDataSandeshIndia = resultSandeshIndia
        })

        let extractedFeedsSandeshIndia = jsonDataSandeshIndia.rss.channel[0].item ;
        let extractedDataSandeshIndia = extractedFeedsSandeshIndia.map(feed => {
            const title = feed.title[0];
            const link = feed.link[0];
            const encodedText = feed.description[0];
            const decodedText = he.decode(encodedText);
            const descplain = cheerio.load(decodedText)
            const description = descplain.root().text();
            const imageurl = feed["media:content"][0].$.url;
            return { title, link, imageurl, description} 
        })
        return(extractedDataSandeshIndia)
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


export const getGujratiFeeds = async(req,res) => {
    try{
        const feedsABP = await ABPGuj();
        const feedsGujratSamachar = await GujratSamachar();
        const feedsSandeshIndia = await SandeshIndia();
        
        const allFeeds = [];

        allFeeds.push(feedsABP)
        allFeeds.push(feedsGujratSamachar)
        allFeeds.push(feedsSandeshIndia)

        const flattenedArray = flattenArrayByPattern(allFeeds);
       
        res.status(200).json(flattenedArray);
    }
    catch(err){
        res.status(500).json({ error: 'Failed to retrieve and parse feeds' })
    }
}