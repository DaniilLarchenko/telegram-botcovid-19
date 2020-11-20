require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const { format } = require('prettier');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply(`
Hello ${ctx.message.from.first_name}!
Узнай статистику по COVID19 В любой стране.
Для этого введи название страны на английском языке, так же посмотреть весь список стран можно с помощью команды /help.
`, Markup.keyboard([
    ['Belarus', 'Russia'],
    ['Ukraine', 'US'],
    ['Canada', 'Italy'],
])
    .resize()
    .extra()
));

bot.help((ctx) => ctx.reply(COUNTRIES_LIST))

bot.on('text', async (ctx) => {
    let data = {};

    try {
        data = await api.getReportsByCountries(ctx.message.text)

        let formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Выздоровели: ${data[0][0].recovered}
Флаг: ${data[0][0].flag}
    `;

        ctx.reply(formatData);
    } catch {
        console.log('Ошибка');
        ctx.reply('Ошибка, такой страны не существует, попробуйте исправить или посмтотрите /help');
    }

});

bot.launch();
console.log('Бот запущен'); 