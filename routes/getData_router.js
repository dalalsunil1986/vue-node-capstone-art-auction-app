const express = require("express");
const router = express.Router();
const getDataController = require("../controllers/getDataController");

router.get("/ownauctions", getDataController.getOwnAuctions);
router.get("/singlauction", getDataController.getSingleAuction);
router.get("/all", getDataController.getAllAuctions);
router.get("/user", getDataController.getUser);
router.get("/watching", getDataController.getWatching);
router.get("/conversations", getDataController.getConversations);
router.get("/chat", getDataController.getChat);
router.post("/filter", getDataController.filter);
router.get("/ownreviews", getDataController.getOwnReviews);
router.get("/ownsales", getDataController.getOwnSales);
router.get("/otheruserreviews", getDataController.otherUserReviews);
router.get("/otherUserSales", getDataController.otherUserSales);

module.exports = router;
