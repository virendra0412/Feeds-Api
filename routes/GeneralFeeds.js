import express from "express"
import { getHindiFeeds } from "../controllers/General/HindiFeeds.js";
import { getEnglishFeeds} from "../controllers/General/EnglishFeeds.js";
import { getGujratiFeeds } from "../controllers/General/GujratiFeeds.js";

const router =  express.Router();

router.get('/HindiFeeds', getHindiFeeds)

router.get('/EnglishFeeds', getEnglishFeeds)

router.get('/GujratiFeeds', getGujratiFeeds)

export default router;