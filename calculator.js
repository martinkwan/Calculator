var currentDisplay = "";
var totalEquation = [];
var tempOperator = "";
var lastPressed = "clear";
var totalEquation2 = "";

//adds & removes opacity on click 
$(".calcButton").click(function() {
  $(".calcButton.buttonClicked").removeClass("buttonClicked");
  $(this).addClass("buttonClicked");
  setTimeout(function() {
    $(".calcButton").removeClass("buttonClicked");
  }, 200);
  //if button is operator button, add border. if button is any button except for AC / plusMinus, remove border
  if ($(this).hasClass("operatorButton")) {
    $(".operatorButton.operatorOn").removeClass("operatorOn");
    $(this).addClass("operatorOn");
  } else if (!$(this).hasClass("ACButton") && !$(this).hasClass("plusMinusButton")) {
    $(".operatorButton.operatorOn").removeClass("operatorOn");
  }
})

$(".numberButton").click(function() {
  var numberPressed = this.innerHTML;
  //if display was "0", or "-0", any numbers pressed after that will overwrite the zero, so there is no unnecesary leading zeros
  if ((currentDisplay.length == 1 && currentDisplay[0] == "0") || (currentDisplay.length == 2 && currentDisplay[0] == "-" && currentDisplay[1] == "0")) {
    currentDisplay = currentDisplay.substring(0, currentDisplay.length - 1);
  }
  //if last pressed button was a number
  if ((lastPressed == "number" || lastPressed == "clear") && currentDisplay.length < 9) {
    currentDisplay += numberPressed;
    $("#results").html(displayFormat(currentDisplay));
    lastPressed = "number";
  }
  //if last pressed button was an operator
  else if (lastPressed == "operator") {
    //totalEquation.push(tempOperator);
    //resets font size
    $("#results").removeClass();
    $("#results").addClass("normalFont");

    currentDisplay = numberPressed;
    $("#results").html(currentDisplay);
    lastPressed = "number";
  }
  //if last pressed button was equals button
  else if (lastPressed == "equalSign") {

    //resets font size
    $("#results").removeClass();
    $("#results").addClass("normalFont");
    totalEquation = [];
    currentDisplay = numberPressed;
    $("#results").html(currentDisplay);
    lastPressed = "number";
  }

  $("#AC").html("C");
})

$("#decimal").click(function() {
  if (lastPressed == "clear" || lastPressed == "equalSign") {
    totalEquation = [];
    currentDisplay = "0.";
    $("#results").html(currentDisplay);
    lastPressed = "number";
  }
  //if last pressed is a number and currentDisplay doesnt not have a decimal already (no double decimals)
  else if (lastPressed == "number" && currentDisplay.indexOf(".") === -1) {
    currentDisplay += ".";
    $("#results").html(displayFormat(currentDisplay));
    lastPressed = "number";
  } else if (lastPressed == "operator") {
    //totalEquation.push(tempOperator);
    currentDisplay = "0.";
    $("#results").html(currentDisplay);
    lastPressed = "number";
  }
})

$(".operatorButton").click(function() {
  var operatorPressed = this.innerHTML;
  //if last pressed is cleared and totalequation is blank, then operator button does nothing
  if (lastPressed == "clear" && totalEquation.length == 0) {
    return;
  }
  //if last pressed button was a number
  if (lastPressed == "number") {
    totalEquation.push(currentDisplay);
    //if there is at least 2 numbers and 1 operator, calculate the math and change the display before continuing
    if (totalEquation.length >= 3) {
      var results = eval(totalEquation[0] + totalEquation[1] + totalEquation[2]);
      //console.log(totalEquation[0] + totalEquation[1] + totalEquation[2])
      calculationFormat(results);
      totalEquation = [];

      results = results.toString();
      totalEquation[0] = results;
    } //endif totalequation length >= 3
    tempOperator = operatorPressed;
    lastPressed = "operator";
  } //endif lastPressed == "number"

  //if last pressed button was an operator
  else if (lastPressed == "operator" || lastPressed == "equalSign") {
    tempOperator = operatorPressed;
    lastPressed = "operator";
  }
  //if "X" is pressed, change the operator to *
  if (tempOperator == "x") {
    tempOperator = "*";
  }
  //if "÷" is pressed, change the operator to /
  if (tempOperator == "÷") {
    tempOperator = "/";
  }

  totalEquation[1] = tempOperator;
})

$("#equal").click(function() {
  $(".operatorButton.operatorOn").removeClass("operatorOn");

  //if lastpressed is operator, then add/subtract/multiply/divide by currentdisplay
  if (lastPressed == "operator") {
    //if current display is "" because last pressed was "clear" button, then set it to 0, so function can push 0 instead of "" into calculator
    if (currentDisplay == "") {
      currentDisplay = "0";
    }
    totalEquation.push(currentDisplay);
  }
  //if lastpressed is equalsign, then add/subtract/multi/divide by previous totalEquation[2]
  else if (lastPressed == "equalSign") {
    totalEquation.push(tempOperator);
    totalEquation.push(totalEquation2);
  }
  //if lastpressed is number and if totalEquation has length of 2, then continue push the current display into totalequation (this is to prevent pressing equals when there is only one number pressed prior); 
  else if (lastPressed == "number" && totalEquation.length == 2) {
    totalEquation.push(currentDisplay);
  }
  if (totalEquation.length >= 3) {
    //if equation is x - (-y), change it to x + y. Because of glitch in eval();
    if (totalEquation[1] == "-" && totalEquation[2].toString().charAt(0) == "-") {
      totalEquation[1] = "+";
      totalEquation[2] = totalEquation[2].slice(1);
    }
    var results = eval(totalEquation[0] + totalEquation[1] + totalEquation[2]);
    calculationFormat(results);
    totalEquation2 = totalEquation[2];
    totalEquation = [];
    //tempOperator = "";
    results = results.toString();
    totalEquation[0] = results;
    currentDisplay = results;
    lastPressed = "equalSign";
  }
})

$("#plusMinus").click(function() {

  //change from negative to positive number
  if (lastPressed == "number" && currentDisplay.charAt(0) === "-") {
    currentDisplay = currentDisplay.slice(1);
  } else if (lastPressed == "equalSign" && currentDisplay.charAt(0) === "-") {
    currentDisplay = currentDisplay.slice(1);
    totalEquation[0] = currentDisplay;
  }
  //change from positive to negative
  else if (lastPressed == "number") {
    currentDisplay = "-" + currentDisplay;
  } else if (lastPressed == "equalSign") {
    currentDisplay = "-" + currentDisplay;
    totalEquation[0] = currentDisplay;
  }
  //make sure "-" turns into "-0" when necessary
  else if (currentDisplay == "" || lastPressed == "operator") {
    currentDisplay = "-0";
  }
  $("#results").html(displayFormat(currentDisplay));
  lastPressed = "number";
})

//clears everything if AC button pressed
$("#AC").click(function() {

  //resets font size
  $("#results").removeClass();
  $("#results").addClass("normalFont");

  //if clear button has already been pressed once, or last pressed is equalsign, then clear everything
  if (currentDisplay == "" || lastPressed == "equalSign") {
    totalEquation = [];
    currentDisplay = "";
    $("#results").html("0");
    lastPressed = "clear";
    $("#AC").html("AC");
    $(".operatorButton.operatorOn").removeClass("operatorOn");
  }
  //if clear button needs to be just "C", clear the currentdisplay only
  else {
    currentDisplay = "";
    $("#results").html("0");
    lastPressed = "operator";
    $("#AC").html("AC");
  }
})
/*
//testing
$(".calcButton").click(function() {
  console.log(totalEquation);
  console.log(lastPressed);
  console.log(totalEquation.length);
  console.log(tempOperator + "is the temp operator");
  console.log(eval("-2--5"));
})
*/
function calculationFormat(results) {
  //if the result has more than 9 digits, shorten it to 9 digits
  if (results.toString().length > 9) {
    results = results.toPrecision(8);
    var indexOfE = results.toString().indexOf("e");
    //if the results are still long and do not have an e, make it shorter
    if (results.toString().length > 9 && (indexOfE == -1)) {
      var indexOfDecimal = results.toString().indexOf(".");
      results = parseFloat(results).toFixed(9 - indexOfDecimal);
    }
    //if the results are stll long and has an e, make it shorter by subtracting the number by the amount of digits e+1x has
    else if (results.toString().length > 9 && (indexOfE != -1)) {
      var partA = results.slice(0, indexOfE - 1);
      partA = parseFloat(partA).toFixed(8 - (results.toString().length - indexOfE));
      var partB = results.slice(indexOfE);
      results = partA + partB;
      indexOfE = results.toString().indexOf("e");
    }
    //if the result does not contain an e AND results do contain a decimal AND reuslts end with a 0 (ex: 0.001213200), remove the trailing zeros
    if (indexOfE == -1 && ((results.indexOf(".") != -1) && results.slice(-1) == "0")) {
      results = parseFloat(results);
    }
    //if result has an E and the digit before E is an 0 (ex:1.23100e-5), remove the trailing zeros
    if (indexOfE !== -1 && results.charAt(indexOfE - 1) == "0") {
      var partA = parseFloat(results.slice(0, indexOfE - 1));
      var partB = results.slice(indexOfE);
      results = partA + partB;
      indexOfE = results.toString().indexOf("e");
    }
  }
  $("#results").html(displayFormat(results));
}
//changes display to include commas
function displayFormat(num) {
  num = num.toString();
  displayResize(num);
  var parts = num.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
//changes font size depending on how many digits are in display
function displayResize(num) {
  var decimalCount = num.indexOf(".");
  if (decimalCount == -1) {
    decimalCount = 0;
  } else {
    decimalCount = 1;
  }
  //do not count decimal in displaylength
  var displayLength = num.length - decimalCount;
  if (displayLength < 6) {
    $("#results").removeClass();
    $("#results").addClass("normalFont");
  }
  if (displayLength == 6) {
    $("#results").removeClass();
    $("#results").addClass("smallerFont1");
  } else if (displayLength == 7) {
    $("#results").removeClass();
    $("#results").addClass("smallerFont2");
  } else if (displayLength == 8) {
    $("#results").removeClass();
    $("#results").addClass("smallerFont3");
  } else if (displayLength == 9) {
    $("#results").removeClass();
    $("#results").addClass("smallerFont4");
  } else if (displayLength == 10) {
    $("#results").removeClass();
    $("#results").addClass("smallerFont5");
  }
}
