import express from "express"
import { getHindiTechFeeds } from "../controllers/Tech/HindiTech.js";
import { getEnglishTechFeeds } from "../controllers/Tech/EnglishTech.js";
import { getGujratiTechFeeds } from "../controllers/Tech/GujratiTech.js";

const router =  express.Router();


router.get('/HindiTechFeeds', getHindiTechFeeds)
router.get('/EnglishTechFeeds',getEnglishTechFeeds)
router.get('/GujratiTechFeeds',getGujratiTechFeeds)

export default router