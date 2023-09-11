const express = require("express");
const router = express.Router();
const chalk = require("chalk");
const cardsServiceModel = require("../../model/cardsService/cardsService");
const normalizeCard = require("../../model/cardsService/helpers/normalizationCardService");
const cardsValidationService = require("../../validation/cardsValidationService");
const permissionsMiddleware = require("../../middleware/permissionsMiddleware");
const authmw = require("../../middleware/authMiddleware");
const idValidation = require("../../validation/idValidationService");
const CustomError = require("../../utils/CustomError");

// biz only
router.post(
  "/card",
  authmw,
  permissionsMiddleware(true, false),
  async (req, res) => {
    try {
      await cardsValidationService.cardValidation(req.body);
      let normalCard = await normalizeCard(req.body, req.userData._id);
      const dataFromMongoose = await cardsServiceModel.createCard(normalCard);
      res.status(200).json(dataFromMongoose);
    } catch (err) {
      console.log(chalk.red("Card Creation Error:"));
      console.error(err);
      res.status(400).json(err);
    }
  }
);

//http://localhost:8181/api/cards/allCards
// all
//get all cards
router.get("/cards", async (req, res) => {
  try {
    const allCards = await cardsServiceModel.getAllCards();
    if (!allCards) {
      return res.json({ msg: "no cards at the data base" });
    }
    let newCardsArr = JSON.parse(JSON.stringify(allCards));
    for (const card of newCardsArr) {
      if (card.image && card.image.imageFile && card.image.imageFile.data) {
        let tempImage = JSON.parse(JSON.stringify(card.image.imageFile.data));
        const bufferData = Buffer.from(tempImage.data);
        // Convert the Buffer object to a Base64-encoded string
        const base64Data = bufferData.toString("base64");

        card.image.dataStr = base64Data + "";
      }
    }
    res.json(newCardsArr);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/cards/card/:id
// all
//get specific card
router.get("/card/:id", async (req, res) => {
  try {
    await idValidation.idValidation(req.params.id);
    const cardFromDB = await cardsServiceModel.getCardById(req.params.id);
    if (!cardFromDB) {
      return res.status(400).json({ msg: "no card found" });
    }
    let newCardFromDB = JSON.parse(JSON.stringify(cardFromDB));
    if (
      newCardFromDB.image &&
      newCardFromDB.image.imageFile &&
      newCardFromDB.image.imageFile.data
    ) {
      let tempImage = JSON.parse(
        JSON.stringify(newCardFromDB.image.imageFile.data)
      );
      const bufferData = Buffer.from(tempImage.data);
      // Convert the Buffer object to a Base64-encoded string
      const base64Data = bufferData.toString("base64");

      newCardFromDB.image.dataStr = base64Data + "";
    }
    res.json(newCardFromDB);
  } catch (err) {
    res.status(400).json(err);
  }
});

//add / remove from cart
//auth
router.patch("/cart/:id", authmw, async (req, res) => {
  try {
    let cardId = req.params.id;
    await idValidation.idValidation(cardId);
    let currCard = await cardsServiceModel.getCardById(cardId);
    if (!currCard) {
      return res.json({ msg: "No cards found" });
    }
    if (currCard.cart.find((userId) => userId == req.userData._id)) {
      currCard.cart = currCard.cart.filter(
        (userId) => userId != req.userData._id
      );
    } else {
      currCard.cart = [...currCard.cart, req.userData._id];
    }
    let updatedCard = await cardsServiceModel.updateCard(
      cardId,
      await normalizeCard(currCard, currCard.user_id)
    );
    res.status(200).json(updatedCard);
  } catch (err) {
    console.log(chalk.red("Cart Add Error:"));
    console.error(err);
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/cards/rate/:id
//authed
//rate a card
router.patch("/rate/:id", authmw, async (req, res) => {
  try {
    await idValidation.idValidation(req.params.id);
    let card = await cardsServiceModel.getCardById(req.params.id);
    if (!card) {
      throw new CustomError("no card found using this id");
    }
    let { rating } = card;
    for (const userIdInArrayOfCard of rating.ratingUsers) {
      if (req.userData && req.userData._id == userIdInArrayOfCard) {
        throw new CustomError(
          "user already rated this, able to rate only once!"
        );
      }
    }
    let { score } = req.body;
    if (
      typeof score == "number" &&
      score % 1 == 0 &&
      1 <= score &&
      score <= 5
    ) {
      rating.ratingScore += score;
      rating.ratingUsers = [...rating.ratingUsers, req.userData._id];
      card.rating = { ...rating };
      res.status(200).json(await cardsServiceModel.updateCard(card._id, card));
    } else {
      throw new CustomError(
        "invalid rating, please send an object {score:<Number (score between 1 to 5)>}"
      );
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:8181/api/cards/get-card-likes
//authed
//get cart info
router.get("/getcart", authmw, async (req, res) => {
  try {
    let userCardsArr = [];
    let {
      userData: { _id },
    } = req;
    let cardsArr = await cardsServiceModel.getAllCards();
    if (cardsArr.length === 0) {
      return;
    }
    for (const card of cardsArr) {
      let { cart } = card;
      for (const user of cart) {
        if (user == _id) {
          userCardsArr.push(card);
          break;
        }
      }
    }
    let newCardsArr = JSON.parse(JSON.stringify(userCardsArr));
    for (const card of newCardsArr) {
      if (card.image && card.image.imageFile && card.image.imageFile.data) {
        let tempImage = JSON.parse(JSON.stringify(card.image.imageFile.data));
        const bufferData = Buffer.from(tempImage.data);
        // Convert the Buffer object to a Base64-encoded string
        const base64Data = bufferData.toString("base64");

        card.image.dataStr = base64Data + "";
      }
    }
    res.json(newCardsArr);
  } catch (err) {
    res.status(400).json(err);
  }
});

// admin
router.put(
  "/editcard/:id",
  authmw,
  permissionsMiddleware(true, false),
  async (req, res) => {
    try {
      await idValidation.idValidation(req.params.id);
      await cardsValidationService.cardValidation(req.body);
      let normalCard = await normalizeCard(req.body, req.userData._id);
      const cardFromDB = await cardsServiceModel.updateCard(
        req.params.id,
        normalCard
      );
      res.json(cardFromDB);
    } catch (err) {
      console.log(chalk.red("Card Update Error:"));
      console.error(err);
      res.status(400).json(err);
    }
  }
);

// admin
router.delete(
  "/card/:id",
  authmw,
  permissionsMiddleware(true, false),
  async (req, res) => {
    try {
      const cardFromDB = await cardsServiceModel.deleteCard(req.params.id);
      if (cardFromDB) {
        res.json({ msg: "card deleted" });
      }
    } catch (err) {
      console.log(chalk.red("Card Deletion Error:"));
      console.error(err);
      res.status(400).json(err);
    }
  }
);

module.exports = router;
