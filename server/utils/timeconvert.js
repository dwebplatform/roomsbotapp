
let dataContainer = {
    1: ["январь", "января"],
    2: ["февраль", "февраля"],
    3: ["март", "марта"],
    4: ["апрель", "апреля"],
    5: ["май", "мая"],
    6: ["июнь", "июня"],
    7: ["июль", "июля"],
    8: ["август", "августа"],
    9: ["сентябрь", "сентября"],
    10: ["октябрь", "октября"],
    11: ["ноябрь", "ноября"],
    12: ["декабрь", "декабря"]
};

/**
 * @var dataStr - строка "1-е сентября 2019"
 * @param {*} dataStr 
 * @returns Object{ day, month, year}
 */
function convertData(dataStr) {
    dataStr = dataStr.trim();
    let [day, month, year] = dataStr.split(' ');

    day = transformDayToFormat(day);
    // ((day / 10) % 10).toString().replace(".", "")
    //
    let result = {
        day: day,
        month: null,
        year: year
    };
    if (isNaN(parseInt(day)) || !month || isNaN(parseInt(year))) {
        return false;
    }
    let isMonthExist = false;
    let unixTime = Date.now();
    for (let monthIndex in dataContainer) {
        if (dataContainer[monthIndex].includes(month)) {// that's a case
            result.month = transformDayToFormat(monthIndex);
            // get unix date
            // new Date(year, month, date)
            unixTime = new Date(year, +monthIndex - 1, +day).getTime() / 1000;
            isMonthExist = true;
        }
    }
    if (!isMonthExist) {
        return false;
    }

    return { ...result, unixTime };
}
module.exports = {
    convertData
};

function transformDayToFormat(day) {
    let transformedDay = day.replace(/[^0-9.]/g, "");
    transformedDay = ((+transformedDay / 10) % 10).toString().replace(".", "");
    return transformedDay;
}
// day = day.replace(/[^0-9.]/g, "");
