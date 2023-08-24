import express from "express"
import { getGujratiSportsFeeds } from '../controllers/Sports/GujartiSports.js'
import { getEnglishSportsFeeds } from "../controllers/Sports/EnglishSports.js";
import { getHindiSportsFeeds } from "../controllers/Sports/HindiSports.js";

const router =  express.Router();

router.get('/GujartiSportsFeeds', getGujratiSportsFeeds)
router.get('/EnglishSportsFeeds', getEnglishSportsFeeds)
router.get('/HindiSportsFeeds', getHindiSportsFeeds)


export default router