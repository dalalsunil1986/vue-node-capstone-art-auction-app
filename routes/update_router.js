const express = require("express");
const router = express.Router();
const updateController = require("../controllers/updateController");

router.post("/description", updateController.updateDescription);
router.post("/picture", updateController.updatePicture);
router.post("/newauction", updateController.newAuction);
router.post("/addWatching", updateController.addFavorites);
router.post("/removeWatching", updateController.removeFavorites);
router.post("/makebid", updateController.makeBid);
router.post("/sendmessage", updateController.sendMessage);
router.post("/deleteConversation", updateController.deleteConversation);
router.post("/renewpost", updateController.renewPost);
router.post("/deletepost", updateController.deletePost);
router.post("/makereview", updateController.makereview);

module.exports = router;
