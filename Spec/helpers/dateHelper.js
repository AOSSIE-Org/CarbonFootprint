// Get current Month and Year
var DATE = new Date()
var currMonth = DATE.getMonth() + 1;
var today = DATE.getDate();
if(today < 10) today = '0' + today;
var currYear = DATE.getFullYear();
var nextMonth = DATE.getMonth() + 2;
var yearForNextMonth = DATE.getFullYear();
var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

if(nextMonth === 13) {
    nextMonth = 1;
    year += 1;
}

var currMonthName = monthNames[currMonth - 1]
var nextMonthName = monthNames[nextMonth - 1]

if(nextMonth <= 10) {
    // pad Month with 0. (8 -> 08)
    nextMonth = '0' + nextMonth
}
if(currMonth <= 10) {
    // pad Month with 0. (8 -> 08)
    currMonth = '0' + currMonth
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = {
    DATE, currMonth, today, currYear, nextMonth, yearForNextMonth, nextMonthName, currMonthName, sleep
}