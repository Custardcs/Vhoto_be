const dayjs = require('dayjs')

exports.GUID = (_value, _bool) => {
  var string = ''
  var possible =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  string += Date.now()
  for (var ccc = 0; ccc < _value; ccc++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  if (_bool) {
    return insertHyphens(string);
  }

  return string
}
exports.PRODID = () => {
  var d = new Date(Date.now())

  var month = '' + (d.getMonth() + 1)
  var day = '' + d.getDate()
  var year = d.getFullYear()

  if (month.length < 2) {
    month = '0' + month
  }
  if (day.length < 2) {
    day = '0' + day
  }

  let string2 = year + '_' + month + '_' + day + '_'

  var string = 'PN_'
  var possible =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  string += string2
  for (var ccc = 0; ccc < 10; ccc++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return string
}
exports.GUIDNODATE = (_value) => {
  var string = ''
  var possible =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  //string += Date.now();
  for (var ccc = 0; ccc < _value; ccc++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return string
}

exports.GETINVITECODE = () => {
  var string = ''
  var possible = '0123456789'
  for (var c1 = 0; c1 < 5; c1++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  string += '-'
  for (var c2 = 0; c2 < 1; c2++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  string += '-'
  for (var c3 = 0; c3 < 5; c3++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return string
}

exports.GETTIME = () => {
  // //Creating TimeStamp
  // var d = new Date(Date.now())

  // var seconds = '' + d.getSeconds()
  // var minutes = '' + d.getMinutes()
  // var hour = '' + d.getHours()
  // var month = '' + (d.getMonth() + 1)
  // var day = '' + d.getDate()
  // var year = d.getFullYear()

  // if (month.length < 2) {
  //   month = '0' + month
  // }
  // if (day.length < 2) {
  //   day = '0' + day
  // }

  // let string = hour + ':' + minutes + ':' + seconds;

  let string = dayjs().format('HH:mm:ss')
  return string
}
exports.GETDATE = () => {
  // //Creating TimeStamp
  // var d = new Date(Date.now())

  // var seconds = '' + d.getSeconds()
  // var minutes = '' + d.getMinutes()
  // var hour = '' + d.getHours()
  // var month = '' + (d.getMonth() + 1)
  // var day = '' + d.getDate()
  // var year = d.getFullYear()

  // if (month.length < 2) {
  //   month = '0' + month
  // }
  // if (day.length < 2) {
  //   day = '0' + day
  // }

  // let string = year + '-' + month + '-' + day

  let string = dayjs().format('YYYY-MM-DD')


  return string
}
exports.GETTIMESTAMP = () => {
  // //Creating TimeStamp
  // var d = new Date(Date.now())

  // var seconds = '' + d.getSeconds()
  // var minutes = '' + d.getMinutes()
  // var hour = '' + d.getHours()
  // var month = '' + (d.getMonth() + 1)
  // var day = '' + d.getDate()
  // var year = d.getFullYear()

  // if (month.length < 2) {
  //   month = '0' + month
  // }
  // if (day.length < 2) {
  //   day = '0' + day
  // }
  // if (hour.length < 2) {
  //   hour = '0' + hour
  // }
  // if (minutes.length < 2) {
  //   minutes = '0' + minutes
  // }
  // if (seconds.length < 2) {
  //   seconds = '0' + seconds
  // }

  // let string =
  //   year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
  let string = dayjs().format('YYYY-MM-DD HH:mm:ss')

  return string
}
exports.GETTIMESTAMPMS = () => {
  //Creating TimeStamp with miliseconds;
  return +new Date()
}
exports.GETDATE_DAY_MONTH = () => {
  //Creating TimeStamp
  var d = new Date(Date.now())

  var seconds = '' + d.getSeconds()
  var minutes = '' + d.getMinutes()
  var hour = '' + d.getHours()
  var month = '' + (d.getMonth() + 1)
  var day = '' + d.getDate()
  var year = d.getFullYear()

  // if (month.length < 2) {
  //     month = '0' + month;
  // }
  if (day.length < 2) {
    day = '0' + day
  }

  const monthNames = [
    'NON',
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ]

  let string = day + ' ' + monthNames[month] + ' ' + year
  return string
}

exports.GETCOLOR = (alpha) => {
  // var makeColorCode = '0123456789ABCDEF';
  // var code = '#';
  // for (var count = 0; count < 6; count++) {
  //     code = code + makeColorCode[Math.floor(Math.random() * 16)];
  // }
  var red = getRandomInt(64, 256)
  var green = getRandomInt(64, 256)
  var blue = getRandomInt(64, 256)

  var code = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')'

  return code
}
exports.GETCOLOR_DASH = () => {
  // var makeColorCode = '0123456789ABCDEF';
  // var code = '#';
  // for (var count = 0; count < 6; count++) {
  //     code = code + makeColorCode[Math.floor(Math.random() * 16)];
  // }
  var red = getRandomInt(64, 256)
  var green = getRandomInt(64, 256)
  var blue = getRandomInt(64, 256)

  var code = 'rgba(' + red + ',' + green + ',' + blue + ',' + 0.2 + ')'
  var code2 = 'rgba(' + red + ',' + green + ',' + blue + ',' + 1 + ')'
  var code3 =
    'rgba(' +
    Number(red / 2) +
    ',' +
    Number(green / 2) +
    ',' +
    Number(blue / 2) +
    ',' +
    0.2 +
    ')'
  var code4 =
    'rgba(' +
    Number(red / 2) +
    ',' +
    Number(green / 2) +
    ',' +
    Number(blue / 2) +
    ',' +
    1 +
    ')'
  var code5 =
    'rgba(' +
    Number(red * 2) +
    ',' +
    Number(green * 2) +
    ',' +
    Number(blue * 2) +
    ',' +
    0.2 +
    ')'
  var code6 =
    'rgba(' +
    Number(red * 2) +
    ',' +
    Number(green * 2) +
    ',' +
    Number(blue * 2) +
    ',' +
    1 +
    ')'

  return { i1: code, i2: code2, o1: code3, o2: code4, t1: code5, t2: code6 }
}
exports.ADDTIME_MIN = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000)
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}
function insertHyphens(inputString, chunkSize = 5) {
  const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
  return inputString.match(regex).join('-');
}