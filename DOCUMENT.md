### Table of Contents

-   [sendMessage][1]
-   [getWeatherData][2]
-   [createWeatherMessage][3]
    -   [Parameters][4]
-   [symbolNameToImageURL][5]
    -   [Parameters][6]

## sendMessage

this function will get the weatherData and send the message.

## getWeatherData

this function will get weather-data from yr.no.

Returns **[JSON][7]** weatherData

## createWeatherMessage

this function will create Weather Message in order to send to a specific channel (set as enviroment variables).

### Parameters

-   `weatherData` **[JSON][7]**

Returns **[JSON][7]** weatherMessage

## symbolNameToImageURL

this function will return the url of icon that match to the symbol name.

### Parameters

-   `symbolName` **[String][8]**

Returns **[String][8]** urlOfIcon

[1]: #sendmessage

[2]: #getweatherdata

[3]: #createweathermessage

[4]: #parameters

[5]: #symbolnametoimageurl

[6]: #parameters-1

[7]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON

[8]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String