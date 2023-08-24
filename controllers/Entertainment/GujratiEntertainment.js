import axios from 'axios'
import {parseString} from 'xml2js'
import he from 'he'
import cheerio from 'cheerio'

const getFeedsABP = async() =>{
    try{
        
        const responseABPGuj = await axios.get('https://gujarati.abplive.com/entertainment/feed');
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
                const description = descplain.root().text().slice(0,250);
                const link = feed.link[0];
                const imageurl = feed["media:thumbnail"][0].$.url;
                const channel = "ABP"
                return { title, link, imageurl, description, channel }
            })
        return(extractedDataABPGuj)            
    }
    catch(err){
        return([])
    }
}

const getFeedsSandesh = async() =>{
    try{
        const responseSandesh = await axios.get('https://sandesh.com/rss/entertainment.xml');
        const xmlDataSandesh = responseSandesh.data;
        
        let jsonDataSandesh;
        parseString(xmlDataSandesh, (err,resultSandesh) => {
            if(err){
                throw new Error("Failed to parse xml")
            }
            jsonDataSandesh = resultSandesh
        })

        let extractedFeedsSandesh = jsonDataSandesh.rss.channel[0].item ;
        let extractedDataSandesh = extractedFeedsSandesh.map(feed => {
            const title = feed.title[0];
            const link = feed.link[0];
            const encodedText = feed.description[0];
            const decodedText = he.decode(encodedText);
            const descplain = cheerio.load(decodedText)
            const description = descplain.root().text().slice(0,250);
            const imageurl = feed["media:content"][0].$.url;
            const channel = "Sandesh"
            return { title, link, imageurl, description , channel } 
        })
        return(extractedDataSandesh)
    }
    catch(err){
        return([])
    }
}

const getFeedsGujaratSamachar = async() =>{
    try{
        
        const responseGujaratSamachar = await axios.get('https://www.gujaratsamachar.com/rss/category/entertainment');
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
            const description = descplain.root().text().slice(0,250);
            const link = feed.link[0];
            const imageurl = feed["enclosure"][0].$.url;
            const channel = "Gujarat Samachar"
            return { title, link, imageurl, description , channel }
        })
        return(extractedDataGujaratSamachar)
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

export const getGujratiEntertainmentFeeds = async(req,res) => {
    try{
        const feedsABP = await getFeedsABP();
        const feedsGujratSamachar = await getFeedsGujaratSamachar();
        const feedsSandesh = await getFeedsSandesh();
        
        const allFeeds = [];

        allFeeds.push(feedsABP)
        allFeeds.push(feedsGujratSamachar)
        allFeeds.push(feedsSandesh)

        const flattenedArray = flattenArrayByPattern(allFeeds);
       
        res.status(200).json(flattenedArray);
    }
    catch(err){
        res.status(500).json({ error: 'Failed to retrieve and parse feeds' })
    }
}