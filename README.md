# KuribohBot

A simple Telegram Bot to perform Yu-gi-oh! related tasks, made with [node js](https://nodejs.org/).

## Getting Started

These instructions will get you a copy of the bot up and running.

### Prerequisites

Download and install [node js](https://nodejs.org/).

You will also need to obtain a Telegram Bot Token. Follow the instructions found on the first step of [this tutorial](https://github.com/hosein2398/node-telegram-bot-api-tutorial).

### Installing

First, initialize npm:

```
npm init
```

Then install the project dependencies:

```
npm install
```

Create a _.env_ file to store your Token
```
cat > .env
TELEGRAM_TOKEN={YOUR_TOKEN}
```

And that's it! You can now start the bot by running _index.js_ with node:

```
node index.js
```

## Built With

* [node js](https://nodejs.org/)
* [npm](https://www.npmjs.com/)
* [Yu-gi-Oh! API](https://db.ygoprodeck.com/api-guide/)

## Author

* **Rodrigo Assunção** - [DelCtrl](https://github.com/delctrl)

See also the list of [contributors](https://github.com/delctrl/kuribohbot/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Thanks to [hosein2398](https://github.com/hosein2398/) for it's [Telegram Bot with Node Tutorial](https://github.com/hosein2398/node-telegram-bot-api-tutorial)
* Thanks to every contributor of [Telegraf](https://github.com/telegraf/telegraf) for this incredible framework
* Conner Panarella from YGO Hub for creating the API from which the first version of this bot was made
* Alan from [YGOProDeck](https://ygoprodeck.com/) for maintaining the Yu-gi-Oh! API which is the basis for the current version of this bot
* Yu-Gi-Oh! Trading Card Game is TM and copyright Konami Holdings Corporation.
