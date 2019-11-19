require('dotenv').config();

const YR_URL = process.env.YR_URL;
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const NUMBER_OF_PERIOD = process.env.NUMBER_OF_PERIOD;

const parser = require('fast-xml-parser');
const https = require('https');
const { WebClient } = require('@slack/client');
const web = new WebClient(SLACK_TOKEN);


/**
 * this function will get weather-data from yr.no.
 * @returns {JSON} weatherData
 */
const getWeatherData = () => {
  return new Promise((resolve, reject) => {
    https.get(YR_URL, (res) => {
      let xmlString = '';
      res.on('data', (d) => {
        xmlString += d;
      });
      res.on('close', () => {
        if (parser.validate(xmlString) === true) {
          const weatherData = parser.parse(xmlString, { ignoreAttributes: false, attributeNamePrefix: '' });
          resolve(weatherData);
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
};

/**
 * this function will create Weather Message in order to send to a specific channel (set as enviroment variables).
 * @param {JSON} weatherData
 * @returns {JSON} weatherMessage
 */
const createWeatherMessage = (weatherData) => {
  const weatherMessage = [];

  const divider = {
    type: 'divider'
  };

  for (let i = 0; i < NUMBER_OF_PERIOD; i++) {
    const weather = weatherData.weatherdata.forecast.tabular.time[i];
    const period = parseInt(weather.period);
    const date = weather.from.substring(0, 10);
    const timeFrom = weather.from.substring(11, 16);
    const timeTo = weather.to.substring(12, 16);
    const temperature = weather.temperature.value;
    const windSpeed = weather.windSpeed.mps;
    const precipitation = weather.precipitation.value;
    const windDirection = weather.windDirection.name;
    const weatherSymbolName = weather.symbol.name;

    const message = `*From ${timeFrom} to ${timeTo}*\nTempurature: ${temperature} °C     Precipitation: ${precipitation} mm\nWind: ${windDirection}     ${windSpeed} m/s`;
    const dateTitle = {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${date}*`
      }
    };
    const section = {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: message
      },
      accessory: {
        type: 'image',
        image_url: symbolNameToImageURL(weatherSymbolName),
        alt_text: `${weatherSymbolName}`
      }
    };
    const warning = {
      type: 'context',
      elements: [
        {
          type: 'image',
          image_url: process.env.UMBRELLA,
          alt_text: 'Umbrella'
        },
        {
          type: 'mrkdwn',
          text: "Please don't forget to bring your umbrella."
        },
        {
          type: 'image',
          image_url: process.env.WASHING_MACHINE,
          alt_text: 'Washing Machine'
        },
        {
          type: 'mrkdwn',
          text: 'Drying the clothes under the sun is not suitable.'
        }
      ]
    };

    if (i === 0) {
      weatherMessage.push(dateTitle);
    } else if (period === 0) {
      weatherMessage.push(divider);
      weatherMessage.push(dateTitle);
    }

    weatherMessage.push(section);

    if (weatherSymbolName.search(/rain/gi) !== -1) {
      weatherMessage.push(warning);
    }
  }

  return weatherMessage;
};

/**
 * this function will send the block message to the specified slack channel
 * @param {JSON} blocks 
 * @param {String} channel 
 */
const sendMessageToSlackChannel = (blocks, channel) => {
  web.chat.postMessage({
    blocks: blocks,
    channel: channel
  }).catch(err => {
    console.log(err);
  });
}

/**
 * this function will return the url of icon that match to the symbol name.
 * @param {String} symbolName
 * @returns {String} urlOfIcon
 */
const symbolNameToImageURL = (symbolName) => {
  const CLEAR_SKY = process.env.CLEAR_SKY;
  const PARTLY_CLOUDY = process.env.PARTLY_CLOUDY;
  const FAIR = process.env.FAIR;
  const FOG = process.env.FOG;
  const CLOUDY = process.env.CLOUDY;
  const RAIN = process.env.RAIN;
  const RAIN_THUNDER = process.env.RAIN_THUNDER;

  if (symbolName.search(/partly/gi) !== -1) {
    return PARTLY_CLOUDY;
  } else if (symbolName.search(/cloudy/gi) !== -1) {
    return CLOUDY;
  } else if (symbolName.search(/fair/gi) !== -1) {
    return FAIR;
  } else if (symbolName.search(/clear/gi) !== -1) {
    return CLEAR_SKY;
  } else if (symbolName.search(/showers/gi) !== -1) {
    return RAIN;
  } else if (symbolName.search(/thunder/gi) !== -1) {
    return RAIN_THUNDER;
  } else if (symbolName.search(/fog/gi) !== -1) {
    return FOG;
  }
};

module.exports = {
  getWeatherData: getWeatherData,
  createWeatherMessage: createWeatherMessage,
  sendMessageToSlackChannel: sendMessageToSlackChannel
};
