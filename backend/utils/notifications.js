const Card = require('../models/Card');
const Comment = require('../models/Comment');
const User = require('../models/User');

// Benachrichtigung wenn Karte abgelaufen ist (z.B. Setze ein Flag oder sende Email)
// Da kein E-Mail/PUSH gewünscht ist, hier nur Beispiel: Log-Ausgabe
async function checkExpiredCards() {
  const now = new Date();
  const expiredCards = await Card.find({
    expirationDate: { $lte: now }
  });

  for (const card of expiredCards) {
    console.log(`Ablauf-Benachrichtigung: Karte "${card.title}" ist abgelaufen.`);
    // Hier könntest du ein Feld in DB setzen, Flag ändern, oder andere Logik
  }
}

// Benachrichtigung an Kartenbesitzer bei neuem Kommentar
async function notifyCardOwnerNewComment(cardCreatorId, comment) {
  const user = await User.findById(cardCreatorId);
  if (user) {
    console.log(`Benachrichtigung: Neuer Kommentar von ${comment.userName} auf deiner Karte.`);
    // Hier kannst du z.B. E-Mail senden, Push senden, oder DB Flag setzen
  }
}

module.exports = {
  checkExpiredCards,
  notifyCardOwnerNewComment
};
