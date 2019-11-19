require('dotenv').config();

const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
const CRON_TIME = process.env.CRON_TIME;

const weather = require('./lib/weather');
const CronJob = require('cron').CronJob;


/**
 * this function will get the weatherData and send the message.
 */
const sendMessage = async () => {
  const WEATHER_DATA = await weather.getWeatherData();
  const BLOCK_MESSAGE = weather.createWeatherMessage(WEATHER_DATA)
  weather.sendMessageToSlackChannel(BLOCK_MESSAGE, SLACK_CHANNEL);
};

const job = new CronJob(CRON_TIME, () => {
  sendMessage();
});

job.start();
