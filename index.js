const TelegramBot = require('node-telegram-bot-api');
const request = require('request')

const token = '';

const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
	const message = msg.text.toString().toLowerCase();

	const pot = "pot of greed";
	const what = "what"
	const ask = "do?"
	if (message.includes(pot)) {
		if (message.includes(what) && message.includes(ask)) {

			bot.sendMessage(msg.chat.id, "It allows you to draw 2 cards.",  {
				"reply_to_message_id":msg.message_id
			});
			return;
		}
	}

	const doro = "doro";
	const monsutaC = "monsuta cado"
	const monsutaK = "monsuta kado"
	if (message.includes(doro) && !message.includes(monsutaC) && !message.includes(monsutaK)) {
		bot.sendMessage(msg.chat.id, "MONSUTA KADO!",  {
			"reply_to_message_id":msg.message_id
		});
		return;
	}else if (message.includes(doro) && (message.includes(monsutaC) || message.includes(monsutaK))) {
		bot.sendMessage(msg.chat.id, "YAMETE, YUGI!",  {
			"reply_to_message_id":msg.message_id
		});
		return;
	}

	const synchro = "synchro"
	if (message.includes(synchro)) {
		bot.sendMessage(msg.chat.id, "Synchro what?",  {
			"reply_to_message_id":msg.message_id
		});
		return;
	}

});

//Welcome Message
bot.onText(/\/start/, (msg) => {

	bot.sendMessage(msg.chat.id, "*Welcome!* \n\nI can search _YU-GI-OH!_ cards for you! \n\nSend /help for more information!", {
		"reply_to_message_id":msg.message_id,
		parse_mode : "Markdown"
	});
});

//About bot
bot.onText(/\/about/, (msg) => {

	bot.sendMessage(msg.chat.id, "*Made by @delctrl* \n\nThe *YGOHub API* can be found at https://www.ygohub.com/", {
		"reply_to_message_id":msg.message_id,
		parse_mode : "Markdown"
	});

});

//Help and Commands
bot.onText(/\/help/, (msg) => {

	bot.sendMessage(msg.chat.id, "List of Commands \n\n\n/start - Welcome message\n\n/about - Credits and Bot information\n\n/card {card name} - Replies with a picture of the card.\n\n/stats {card name} - Replies with information about the card.\n\n/price {card name} - Replies with the current averrage price on TCGPlayer.\n\n\nAll card names needs to be the exact name of the card. Some newer cards may be listed by their YGOrganization names, rather then the official ones.", {
		"reply_to_message_id":msg.message_id,
		parse_mode : "Markdown"
	});

});

//Search card picture by name
bot.onText(/\/card (.+)/, (msg, match) => {

	const chatId = msg.chat.id;

	const cardName = encodeURIComponent(match[1]);

	console.log(cardName.toString());

	request('https://www.ygohub.com/api/card_info?name=' + cardName,  {json: true }, (err, res, body) => {

		if (err) { return console.log(err); }
		if (body.status.includes("error")) {
			return bot.sendMessage(chatId, body.error_msg, {
				"reply_to_message_id":msg.message_id
			});
		}

		console.log(body.card.image_path);
		bot.sendPhoto(chatId, body.card.image_path, {
			"reply_to_message_id":msg.message_id
		});

	});

});

bot.onText(/\/Card (.+)/, (msg, match) => {

	const chatId = msg.chat.id;

	const cardName = encodeURIComponent(match[1]);

	console.log(cardName.toString());

	request('https://www.ygohub.com/api/card_info?name=' + cardName,  {json: true }, (err, res, body) => {

		if (err) { return console.log(err); }
		if (body.status.includes("error")) {
			return bot.sendMessage(chatId, body.error_msg, {
				"reply_to_message_id":msg.message_id
			});
		}

		console.log(body.card.image_path);
		bot.sendPhoto(chatId, body.card.image_path, {
			"reply_to_message_id":msg.message_id
		});

	});
});

//Search card avg price
bot.onText(/\/price (.+)/, (msg, match) => {

	const chatId = msg.chat.id;

	const cardName = encodeURIComponent(match[1]);

	console.log(cardName.toString());

	request('https://www.ygohub.com/api/card_info?name=' + cardName,  {json: true }, (err, res, body) => {

		if (err) { return console.log(err); }
		if (body.status.includes("error")) {
			return bot.sendMessage(chatId, body.error_msg, {
				"reply_to_message_id":msg.message_id
			});
		}

		bot.sendMessage(chatId, "USD " + body.card.price_avg, {
			"reply_to_message_id":msg.message_id
		});

	});

});

//Search card information
bot.onText(/\/stats (.+)/, (msg, match) => {

	const chatId = msg.chat.id;

	const cardName = encodeURIComponent(match[1]);

	console.log(cardName.toString());

	request('https://www.ygohub.com/api/card_info?name=' + cardName,  {json: true }, (err, res, body) => {

		if (err) { return console.log(err); }
		if (body.status.includes("error")) {
			return bot.sendMessage(chatId, body.error_msg, {
				"reply_to_message_id":msg.message_id
			});
		}

		const card = body.card;
		var info = "";

		info = "Name: " +  card.name + "\n";
		info += "Card Type: " + card.type + "\n";

		if (card.is_monster) {

			if (card.is_xyz) {
				info += "Rank: " + card.stars + "\n";
			}
			else if (card.is_link) {
				info += "Link Rating: " + card.link_number + "\n";
			}
			else {
				info += "Level: " + card.stars + "\n";
			}
			
			info += "Attribute: " + card.attribute + "\n";
			info += "Type: " + card.species + "\n";
			info += "Attack: " + card.attack + "\n";

			if (!card.is_link) { info += "Defense: " + card.defense + "\n"; }

			if (card.has_materials) {
				info += "\nMaterials: " + card.materials + "\n";
			}

			if (card.is_pendulum) {
				info += "\nPendulum Scale: " + card.pendulum_left + "\n";
			}

			if (card.is_link) {
				info += "\nLink Markers:\n";

				const linkMarkers = card.link_markers;
				for (var i = linkMarkers.length - 1; i >= 0; i--) {
					info += "+ " + linkMarkers[i] + "\n";
				}
			}

			info += "\nSubtypes:\n";

			const monsterTypes = card.monster_types;
		
			for (var i = monsterTypes.length - 1; i >= 0; i--) {
				info += "+ " + monsterTypes[i] + "\n";
			}
		}
		else {
			info += "Subtype: " + card.property + "\n";
		}

		bot.sendMessage(chatId, info, {
			"reply_to_message_id":msg.message_id
		});

	});

});


//Search card effects
bot.onText(/\/effect (.+)/, (msg, match) => {

	const chatId = msg.chat.id;

	const cardName = encodeURIComponent(match[1]);

	console.log(cardName.toString());

	request('https://www.ygohub.com/api/card_info?name=' + cardName,  {json: true }, (err, res, body) => {

		if (err) { return console.log(err); }
		if (body.status.includes("error")) {
			return bot.sendMessage(chatId, body.error_msg, {
				"reply_to_message_id":msg.message_id
			});
		}

		const card = body.card;
		var text = "";

		text = "Name: " +  card.name + "\n";

		if (card.has_materials) {
				text += "\nMaterials: " + card.materials + "\n";
			}

		if (card.is_pendulum) {
			text += "\nPendulum Effect: " + card.pendulum_text + "\n";
		}

		text += "\nText: " + card.text + "\n";

		bot.sendMessage(chatId, text, {
			"reply_to_message_id":msg.message_id
		});

	});

});

