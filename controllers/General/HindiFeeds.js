import axios from 'axios'
import {parseString} from 'xml2js'
import he from 'he'
import cheerio from 'cheerio'

const getFeedsABP = async() => {
    try{
        const responseABP = await axios.get('https://www.abplive.com/news/india/feed');
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

const getFeedsIndiaTv =  async() => {
    try{
        const responseIndiaTv = await axios.get('https://www.indiatv.in/rssnews/topstory-india.xml')
        const xmlDataIndiaTV = responseIndiaTv.data

        let jsonDataIndiaTv;

        parseString(xmlDataIndiaTV, (err, resultIndiaTv) => {
            if(err){
                throw new Error('Failed to parse XML')
            }
            jsonDataIndiaTv = resultIndiaTv
        })

        let extractedFeedsIndiaTv = jsonDataIndiaTv.rss.channel[0].item
        const extractedDataIndiaTv = extractedFeedsIndiaTv.map(feed => {
            const title = feed.title[0]
            const link = feed.link[0]
            const encodedText = feed.description[0]
            const decodedText = he.decode(encodedText);
            const descplain = cheerio.load(decodedText)
            const description = descplain.root().text();
            const regex = /<img[^>]+src="([^">]+)"/g;
            const match = regex.exec(encodedText);
            const imageurl = match ? match[1] : null;
            const channel = "India Tv"
            return{ title, link, imageurl, description, channel }
        })
        return(extractedDataIndiaTv)
    }
    catch(err){
        []
    }
}

const getFeedsNews18 = async() => {
    try {
        const responseNews18 = await axios.get('https://hindi.news18.com/rss/khabar/nation/nation.xml');
        const xmlDatanews18 = responseNews18.data;
    
        let jsonDataNews18;

        parseString(xmlDatanews18, (err, resultNews18) => {
          if (err) {
            throw new Error('Failed to parse XML');
          }
          jsonDataNews18 = resultNews18
        });
        
        const extractedFeedsNews18 = jsonDataNews18.rss.channel[0].item
        const extractedDataNews18 = extractedFeedsNews18.map(feed => {
            const title = feed.title[0]
            const link = feed.link[0]
            const imageurl = feed["media:content"][0].$.url
            const description = feed.description[0]
            const  channel = "News 18"
            return{ title, link, imageurl, description, channel }
        })
        return(extractedDataNews18)
    }
    catch(err) {
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

export const getHindiFeeds = async(req,res) => {
    try {
        const feedsABP = await getFeedsABP();   
        const feedsIndiaTv = await getFeedsIndiaTv();
        const feedsNews18 = await getFeedsNews18();
        
        const allFeeds = [];

        allFeeds.push(feedsABP)
        allFeeds.push(feedsIndiaTv)
        allFeeds.push(feedsNews18)
        
        const flattenedArray = flattenArrayByPattern(allFeeds);
       
        res.status(200).json(flattenedArray);
    }
    catch(err) {
        res.status(500).json({msg : "Failed to retrive feeds"})
    }   
}

