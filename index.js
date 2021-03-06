const dotenv = require('dotenv').config();
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const session = require('telegraf/session')
const request = require('request-promise')
const { reply } = Telegraf

const cardTypes = {
	SPELL: "Spell Card",
	TRAP: "Trap Card",
	MONSTER: "Monster Card"
}

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
bot.use(session())

//Welcome message
bot.start((ctx) => {
    ctx.replyWithMarkdown('*Welcome!* \n\nI can search _YU-GI-OH!_ cards for you! \n\nSend /help for more information!')
})

//Help Commands
bot.help((ctx) => {
	ctx.replyWithMarkdown("List of Commands \n\n/start - Welcome message\n/about - Credits and Bot information\n/card {card name} - Replies with a picture of the card.\n/stats {card name} - Replies with information about the card.\n/price {card name} - Replies with the current lowest price on TCGPlayer.\n/artworks {card name} - Replies with all the artworks for a given card\n/draw - Replies with a random card\n\nAll card names needs to be the exact name of the card. Some newer cards may be listed by their YGOrganization names, rather then the official ones.")
})

//About the bot
bot.command('about', (ctx) => {
	ctx.replyWithMarkdown("*Made by @delctrl* \n\nThe *Yu-gi-oh! API* can be found at https://db.ygoprodeck.com/api-guide/")
})

//Handle errors
const handleError = function (err, ctx, messageId) {
		ctx.reply("Card not found", {
			"reply_to_message_id": messageId
		})
}

//Fetchs Artwork for a given card
bot.hears(/\/card (.+)/, async (ctx) => {

	const messageId = ctx.message.message_id
	const cardName = encodeURIComponent(ctx.match[1])

	return request('https://db.ygoprodeck.com/api/v5/cardinfo.php?name=' + cardName, { json: true })
	.then( function (body) {
		return ctx.replyWithPhoto({ url: body[0].card_images[0].image_url }, {
			"reply_to_message_id": messageId
		})
	})
	.catch(function (err) { handleError(err, ctx, messageId) })
})

//Fetch lowest price on TCGPlayer
bot.hears(/\/price (.+)/, async (ctx) => {

	const messageId = ctx.message.message_id
	const cardName = encodeURIComponent(ctx.match[1])

	return request('https://db.ygoprodeck.com/api/v5/cardinfo.php?name=' + cardName,  {json: true })
	.then( function (body) {
		return ctx.reply(body[0].card_prices.tcgplayer_price, {
			"reply_to_message_id": messageId
		})
	})
	.catch(function (err) { handleError(err, ctx, messageId) })
})

//Fetch card effects
bot.hears(/\/effect (.+)/, async (ctx) => {

	const messageId = ctx.message.message_id
	const cardName = encodeURIComponent(ctx.match[1])

	return request('https://db.ygoprodeck.com/api/v5/cardinfo.php?name=' + cardName,  {json: true })
	.then( function (body) {
		var text = "Name: " + body[0].name + "\n"
		text += body[0].desc
		return ctx.reply(text, {
			"reply_to_message_id": messageId
		})
	})
	.catch(function (err) { handleError(err, ctx, messageId) })
})

//Fetch card information
bot.hears(/\/stats (.+)/, async (ctx) => {

	const messageId = ctx.message.message_id
	const cardName = encodeURIComponent(ctx.match[1])

	return request('https://db.ygoprodeck.com/api/v5/cardinfo.php?name=' + cardName,  {json: true })
	.then( function (body) {
		const card = body[0]

		var info = "Name: " + card.name + "\n"
		info += "Card Type: " + card.type + "\n"
		info += "Subtype: " + card.race + "\n"
		if (card.archetype) {
			info += "Archetype: " + card.archetype + "\n"
		}

		if (card.type != cardTypes.SPELL && card.type != cardTypes.TRAP) {
			if(card.type.includes("XYZ")) {
				info += "Rank: " + card.level + "\n";
			}
			else if (card.type.includes("Link")) {
				const arrows = card.linkmarkers

				info += "Link Rating: " + card.linkval + "\n"
				info += "Link Markers: "

				for (var i = 0; i < arrows.length; i++ ) {
					info += arrows[i] + " | "
				}
				info += "\n"
			}
			else {
				info += "Level: " + card.level + "\n"
			}

			info += "Attribute: " + card.attribute + "\n"
			info += "Type: " + card.race + "\n"
			info += "Attack: " + card.atk + "\n"

			if (!card.type.includes("Link")) { info += "Defense: " + card.def + "\n" }

			if (card.type.includes("Pendulum")) {
				info += "\nPendulum Scale: " + card.scale + "\n"
			}
		}

		if (card.banlist_info && card.banlist_info.ban_tcg) {
			info += "Banlist Status: " + card.banlist_info.ban_tcg + "\n"
		}

		return ctx.reply(info, {
			"reply_to_message_id": messageId
		})
	})
	.catch(function (err) { handleError(err, ctx, messageId) })
})

//Returns every Artwork for a given card
bot.hears(/\/artworks (.+)/, async (ctx) => {

	const messageId = ctx.message.message_id
	const cardName = encodeURIComponent(ctx.match[1])

	return request('https://db.ygoprodeck.com/api/v5/cardinfo.php?name=' + cardName,  {json: true })
	.then( function (body) {

		var images = []
		for(var i = 0; i < body[0].card_images.length; i++) {
			const path = body[0].card_images[i].image_url
			images.push({
				'media': { url: path },
				'type': 'photo'
			})
		}

		return ctx.replyWithMediaGroup(images, {
			"reply_to_message_id": messageId
		})
	})
	.catch(function (err) { handleError(err, ctx, messageId) })
})

//Searches for a Random Card. Currently Disabled.
bot.command("draw", async (ctx) => {

	const messageId = ctx.message.message_id

	return request("https://db.ygoprodeck.com/api/v5/randomcard.php", {json: true })
	.then ( function (body) {
		const card = body[0]
		var caption = ""
		if (card.type != cardTypes.SPELL && card.type != cardTypes.TRAP) {
			caption = "MONSUTA CADO!!!"
		}

		const imgPath = card.card_images[0].image_url
		return ctx.replyWithPhoto({ url: imgPath }, {
			"reply_to_message_id": messageId,
			"caption": caption
		})
	})
	.catch(function (err) { handleError(err, ctx, messageId) })
})

//Starts the bot
if (process.env.NODE_ENV === 'production') {

	// Set telegram webhook
  bot.launch( {
    webhook: {
      domain: process.env.HEROKU_URL,
			hookPath: '/bot',
      port: process.env.PORT || 5000
    }
  })

	console.log("BOT started in production mode");
}
else {
  bot.launch()

	console.log("BOT started in development mode");
}
