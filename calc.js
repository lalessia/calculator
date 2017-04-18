var opArr = [];
var tmpInput = '0';

function getInput(input){
  if(input != "="){
    addInput(input);
  }else{
    if(tmpInput != '0')
      opArr[opArr.length] = tmpInput;
    generateResult();
  }
}

function manageOperation(input){
  switch(input){
    case "C":
      opArr = [];
      tmpInput = '0';
      setResultIntoMonitor();
      break;
    case "CA":
      tmpInput = '0';
      setInputIntoMonitor();
      break;
    case "x!":
      tmpInput = tmpInput + "!";
      //opArr[opArr.length] = tmpInput;
      setInputIntoMonitor();
      break;
    default:
      console.log("l'input " + input + " non e' ancora stato gestito");
  }
}

function checkBasicOperation(input){
  var result = true;
  //var lastChar = tmpInput.substr(tmpInput.length - 1);
  var lastChar = opArr[opArr.length - 1];
  if(lastChar == '+' || lastChar == '*' ||lastChar == '/')
    result = false;
  return result;
}

function addInput(input){
  if(!isNaN(parseInt(input)) || input == '.'){
    if(tmpInput === '0'){
      if(opArr.length == 1){
        opArr = [];
        tmpInput = '0';
        setInputIntoMonitor();
      }
      if(input == '.'){
        tmpInput = '0.';
      }else{
        tmpInput = input;
      }
    }else{
      var commaCount = (tmpInput.split(".").length) - 1;
      if(commaCount <= 0 || input !== "."){
        tmpInput = tmpInput.concat(input);
      }

    }
  }else if(input == '+' ||input == '*' ||input == '/' ||input == '-'){
    var check = checkBasicOperation(input);

    //DA SISTEMARE: I PRIMI DUE IF HANNO UN CONTENUTO ANALOGO!!!
    if(tmpInput == '0' && opArr.length == 1 && check){
      opArr[opArr.length] = input;
    }else if(!check && tmpInput == '0' && input == "-"){
      opArr[opArr.length] = input;
    }
    else if(!check && tmpInput == '0'){
      opArr[opArr.length - 1] = input;
    }
    else{
      opArr[opArr.length] = tmpInput;
      opArr[opArr.length] = input;
      tmpInput = '0';
    }
  }else{
    manageOperation(input);
  }
  setInputIntoMonitor();
}

function checkNegativeNumber(){
    for(var i = 1; i < opArr.length; i++){
      if(opArr[i] == "-" && (opArr[i - 1] == "*" || opArr[i - 1] == "/" || opArr[i - 1] == "+" )){
        var negative = -Math.abs(opArr[i + 1]);
        opArr.splice(i, 2, negative)
      }
    }
}
function calculateFactorial(num, i){
  var int = num.substr(0, num.length - 1);
  var result = 1;
  for(var j = 1; j <= int; j++){
    result *= j;
  }
  opArr[i] = result;
}

function generateResult(){
  var i = 0;
  checkNegativeNumber();

  i = 0;
  while(i < opArr.length){
    var elm = String(opArr[i]);
    if(elm.substr(elm.length - 1) == "!"){
      calculateFactorial(elm, i);
    }
    i++;
  }
  
  i = 0;
  while(i < opArr.length){
    if(!isNaN(parseFloat(opArr[i]))){
      opArr[i] = parseFloat(opArr[i]);
    }
    i++;
  }

  i = 0;
  while(i < opArr.length){
    if(opArr[i] == "*" || opArr[i] == "/"){
      var result = "";
      if(opArr[i] == "*"){
        result = (opArr[i - 1] * opArr[i + 1]);
      }else{
        result = opArr[i - 1] / opArr[i + 1];
      }
      opArr.splice(i - 1, 3, result);
      i = i - 1;
    }
    i++;
  }

  i = 0;
  while(i < opArr.length){
    if(opArr[i] == "+" || opArr[i] == "-"){
      var result = "";
      if(opArr[i] == "+"){
        result = opArr[i - 1] + opArr[i + 1];
      }else{
        result = opArr[i - 1] - opArr[i + 1];
      }
      opArr.splice(i - 1, 3, result);
      i = i - 2;
    }
    i++;
  }
  setResultIntoMonitor();
}

function setInputIntoMonitor(){
  var total;

  if(opArr.length == 0){
    total = 0;
  }else if(opArr.length >= 1){
    var show = opArr.toString().replace(/,/g, " ");
    document.getElementById('screenResult').innerHTML = show;
  }
  document.getElementById('screenOperation').innerHTML = tmpInput;
}

function setResultIntoMonitor(){
  document.getElementById('screenResult').innerHTML = '';
  if(isNaN(opArr[0]) && opArr[0] != undefined){
    opArr[0] = 'Error'
  }
  document.getElementById('screenOperation').innerHTML = opArr[0];

  tmpInput = '0'
}

function addToMonitor(){
  var currentOperation = "";
  for(var i = 0; i < opArr.length; i++){
    currentOperation = currentOperation + opArr[i];
  }
  document.getElementById('screenOperation').innerHTML = currentOperation;
}

window.addEventListener('load',
  function() {
    setInputIntoMonitor();
  }, false);
