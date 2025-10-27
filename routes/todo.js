const express = require("express");
const router = express.Router();

router.get("/", async(req,res) => {
    res.send("정상 반응중임");
});

module.exports = router;