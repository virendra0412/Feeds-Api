import express from "express"
import { getHindiEntertainmentFeeds } from "../controllers/Entertainment/HindiEntertainment.js";
import { getEnglishEntertainmentFeeds } from "../controllers/Entertainment/EnglishEntertainment.js";
import { getGujratiEntertainmentFeeds } from "../controllers/Entertainment/GujratiEntertainment.js";

const router =  express.Router();


router.get('/HindiEntertainmentFeeds', getHindiEntertainmentFeeds)
router.get('/EnglishEntertainmentFeeds',getEnglishEntertainmentFeeds)
router.get('/GujratiEntertainmentFeeds',getGujratiEntertainmentFeeds)

export default router