// var savingRate_Month;

var dayLabel = new Array('일', '월', '화', '수', '목', '금', '토');
var baseDay     = new Date();
baseDay.setHours(0,0,0,0); // today 날짜만 깔끔히 잡도록 시간 초기화

// dashboard2에서 day plot에서 자정에 전날 데이터 뿌리기 위해 임시로 사용했던 코드
// if (baseDay.getHours() == 0) {
//   baseDay = shiftDate(baseDay, -1)
//   baseDay.setHours(0,0,0,0); // today 날짜만 깔끔히 잡도록 시간 초기화
// } else {
//   baseDay.setHours(0,0,0,0); // today 날짜만 깔끔히 잡도록 시간 초기화
// }

var yesterDay = shiftDate(baseDay, -1) // 어제
var lastWeekSameDay = shiftDate(baseDay, -7) // 어제

var baseTime     = baseDay.getTime();
var yesterDayTime = yesterDay.getTime();
var lastWeekDayTime = lastWeekSameDay.getTime();

if(baseDay.getDay() > 0 && baseDay.getDay() < 6){
  console.log("오늘은 평일");
  var weekDay_Indicator = 1; // 1: 평일, 0: 주말
  var weekDay_label = "평일";
  console.log("baseDay: ",baseDay, weekDay_Indicator);

} else {
  console.log("오늘은 주말");
  var weekDay_Indicator = 0; // 1: 평일, 0: 주말
  var weekDay_label = "주말";
  console.log("baseDay: ",baseDay, weekDay_Indicator);
}

// XXX: self refresh page (temporary bug patch)
setInterval(function () {
    location.reload() 
}, 10 * 60000)

function getLastMonday(date){
  var dayNumber = date.getDay();
  var offset = -7 - dayNumber + 1;

  return shiftDate(date, offset);
}

function shiftDate(date, offset) {
  var shiftedDate = new Date(date);
  shiftedDate.setDate(shiftedDate.getDate() + offset);

  return shiftedDate;
}


function invokeOpenAPI(url, scb, ecb) {
    $.ajax({
        url : url,
        type : "get",
        dataType : "json",
        success : function (data) {
            //console.log('retrieve success:' + data);
            scb(data)
        },
        error : function (response) {
            console.log("failed to retrieve:" + response);
            if (ecb) {
              ecb(response);
            }
        }
    });
}

function accumulator(data, targetDescription) {
  result = 0;
  for(i=0; i<data.feeders.length;i++){
      if(data.feeders[i].description == targetDescription) {
        result = result + (data.feeders[i].value);
        //console.log(data.feeders[i].value, data.feeders[i].description, result)
      }
  }
  return result;
}

function realtime_accumulator(data, targetDescription) {
  result = 0;
  for(i=0; i<data.feeders.length;i++){
      if(data.feeders[i].description == targetDescription) {
        result = result + (data.feeders[i].value);
        //console.log(data.feeders[i].value, data.feeders[i].description, result)
      }
  }
  return result/1000000;
}

function dateFormatter(input_date){ // for query input parameters
  //console.log('format year', input_date.getFullYear());
  //console.log('format month', input_date.getMonth()+1);
  //console.log('format date', input_date.getDate());
  // result = (input_date.getMonth()+1) + '/' + input_date.getDate();
  result = input_date.getFullYear() + '-' + (input_date.getMonth()+1) + '-' + input_date.getDate();
  //console.log(result);
  return result;
}

function dateLabelMaker(input_date){
  //console.log('format year', input_date.getFullYear());
  //console.log('format month', input_date.getMonth()+1);
  //console.log('format date', input_date.getDate());

  //result = (input_date.getMonth()+1) + '/' + input_date.getDate() + '(' + dayLabel[input_date.getDay()] + ')';
  result = (input_date.getMonth()+1) + '/' + input_date.getDate();
  // result = input_date.getFullYear() + '-' + (input_date.getMonth()+1) + '-' + input_date.getDate();
  //console.log(result);
  return result;
}

function arrayMean(input_array){
  var sum = 0;
  for(var i = 0; i < input_array.length; i++){
    sum += input_array[i];
  }
  return Math.round((sum/input_array.length)*10)/10;
}

function limitedArraySum(input_array, limit){
  var sum = 0;
  for(var i=0; i<limit; i++){
    sum += input_array[i];
  }
  return Number(sum.toFixed(1));
}

function dateToString(date) {
    var dateString = date.getFullYear() + '년' + (date.getMonth() + 1) + '월' + date.getDate() + '일 ' + date.getHours()+9 + '시' + date.getMinutes()+0 + '분';
    switch (date.getDay()) {
        case 0:
            dateString = dateString + ' [Sun]';
            break;
        case 1:
            dateString = dateString + ' [Mon]';
            break;
        case 2:
            dateString = dateString + ' [Tue]';
            break;
        case 3:
            dateString = dateString + ' [Wed]';
            break;
        case 4:
            dateString = dateString + ' [Thu]';
            break;
        case 5:
            dateString = dateString + ' [Fri]';
            break;
        case 6:
            dateString = dateString + ' [Sat]';
            break;
    }
    return dateString;
}

// function comparingSumData(baseTime,lastWeekDayTime) {
//   var baseDay_query  = '/api/labs/marg/energy/quarters.json?base_time=' + baseTime;
//   var comparingDay_query = '/api/labs/marg/energy/quarters.json?base_time=' + lastWeekDayTime;
//
//   // console.log(baseDay_query);
//   // console.log(comparingDay_query);
//
//   var xAxis_categories = [];
//   var comparingDay_data = [];
//   var today_data = [];
//   var smile_date = 0;
//
//
//   invokeOpenAPI(comparingDay_query, function (comparingDay) {
//     //console.log(comparingDay);
//     for(var index = 0; index < comparingDay.length; index++){
//       comparingDay_data.push(Number(comparingDay[index].sum.toFixed(1)));
//       xAxis_categories.push(new Date(comparingDay[index].dateFrom).getHours() + '시');
//     }
//
//       invokeOpenAPI(baseDay_query, function (today) {
//         //console.log(today);
//         for(var index = 0; index < today.length; index++){
//           today_data.push(Number(today[index].sum.toFixed(1)));
//         }
//
//         // console.log('comparingDay', comparingDay_data);
//         // console.log('today', today_data);
//
//         var comparingSum = limitedArraySum(comparingDay_data, today.length);
//         var todaySum     = limitedArraySum(today_data, today.length);
//
//         console.log(today.length, comparingSum);
//         console.log(today.length, todaySum);
//
//         // console.log(new Date(today[today.length].dateTo));
//         console.log("today:", today);
//
//         savingRate_Day = todaySum / comparingSum;
//         console.log(savingRate_Day);
//
//         if(savingRate_Day > 1.05) {
//           var currentState = 1;
//         } else if ( savingRate_Day > .90) {
//           var currentState = 2;
//         } else {
//           var currentState = 3;
//         }
//       }
//     }
//     return comparingSum,todaySum;
// }
