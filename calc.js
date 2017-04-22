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
    case "pi":
      tmpInput = Math.PI;
      setInputIntoMonitor();
      break;
    case "x!":
      if(tmpInput != "0" || isNaN(parseInt(tmpInput))){
        tmpInput = tmpInput + "!";
      }
      setInputIntoMonitor();
      break;
    case "(":
      if(tmpInput != "0"){
        opArr[opArr.length] = tmpInput;
        tmpInput = "0";
      }
      opArr[opArr.length] = "(";
      break;
    case ")":
      var openBracketNumber = countBracket("(");
      var closedBracketNumber = countBracket(")");
      if(openBracketNumber - closedBracketNumber >= 1){
        if(tmpInput != "0"){
          opArr[opArr.length] = tmpInput;
          tmpInput = "";
        }
        opArr[opArr.length] = ")";
      }
      break;
    default:
      console.log("l'input " + input + " non e' ancora stato gestito");
  }
}

//controlla se si può o meno inserire un operatore
//l'operatore si può inserire:
/*
  1) se il valore appena precedente è un numero
  2) se il valore appena precedente è un operatore diverso da meno e quello da inserire è un meno
*/
function checkBasicOperation(input){
  var result = true;
  var lastChar = opArr[opArr.length - 1];

  var arrayOperator = ["*", "+", "/", "-"];
  if(arrayOperator.indexOf(lastChar) != -1)
    result = false;
  return result;
}

function changeLastOperator(input){
  var result = false;
  var secondToLastChar = opArr[opArr.length - 2];
  var lastChar = opArr[opArr.length - 1];
  var arrayOperator = ["+", "-", "*", "/"];
  if(arrayOperator.indexOf(secondToLastChar) && lastChar == "-" && isNaN(parseInt(input))){
    result = true;
  }

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
    var changeLastOp = changeLastOperator(input);
    console.log(changeLastOp);

    if(changeLastOp){
      console.log("not modified opArr");
    }
    else if(tmpInput == '0' && ((opArr.length == 1 && check)||(!check && input == "-"))){
      opArr[opArr.length] = input;
    } else if(!check && tmpInput == '0'){
      opArr[opArr.length - 1] = input;
    }
    else{
      //se l'ultimo carattere di tmpInput è una virgola la si elimina
      var lastChar = tmpInput.substr(tmpInput.length - 1);
      if(lastChar == "."){
        tmpInput = tmpInput.substring(0, tmpInput.length - 1);
      }

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

function countBracket(bracketType){
  var x = 0;
  for(var i = 0; i < opArr.length; i++){
    if(opArr[i] == bracketType)
      x++;
  }
  return x;
}

function closedOpenBracket(){
  var openBracketNumber = countBracket("(");
  var closedBracketNumber = countBracket(")");

  if(openBracketNumber - closedBracketNumber > 0){
    var cicle = openBracketNumber - closedBracketNumber;
    for(var i = 0; i < cicle; i++){
      opArr[opArr.length] = ")";
    }
  }
}

function manageBasicOperation(arr){
  var i = 0;
  while(i < arr.length){
    if(arr[i] == "*" || arr[i] == "/"){
      var result = "";
      if(arr[i] == "*"){
        result = (arr[i - 1] * arr[i + 1]);
      }else{
        result = arr[i - 1] / arr[i + 1];
      }
      arr.splice(i - 1, 3, result);
      i = i - 1;
    }
    i++;
  }

  i = 0;
  while(i < arr.length){
    if(arr[i] == "+" || arr[i] == "-"){
      var result = "";
      if(arr[i] == "+"){
        result = arr[i - 1] + arr[i + 1];
      }else{
        result = arr[i - 1] - arr[i + 1];
      }
      arr.splice(i - 1, 3, result);
      i = i - 2;
    }
    i++;
  }
}

function manageOperationInBracket(){
  var thereAreBracket = true;
  while(thereAreBracket){
    var end = 0;
    var begin = 0;
    var j;

    for(var i = 0; i < opArr.length; i++){
      if(opArr[i] == ")")
        end = i;
    }
    j = i;
    while(opArr[j] != "("){
      j--;
    }
    begin = j;

    var subOpArr = [];
    subOpArr = opArr.slice(begin, end + 1);

    manageBasicOperation(subOpArr);
    opArr.splice(begin, end-begin+1, subOpArr[1]);

    var openBracketNumber = countBracket("(");
    if(openBracketNumber == 0){
      thereAreBracket = false;
    }
  }

  //remove white elements from opArr
  for(var i = 0; i < opArr.length; i++){
    if(opArr[i] == ""){
      opArr.splice(i, 1);
    }
  }
}

function generateResult(){
  var i = 0;

  while(i < opArr.length){
    var elm = String(opArr[i]);
    if(elm.substr(elm.length - 1) == "!"){
      calculateFactorial(elm, i);
    }
    i++;
  }

  checkNegativeNumber();
  i = 0;
  while(i < opArr.length){
    if(!isNaN(parseFloat(opArr[i]))){
      opArr[i] = parseFloat(opArr[i]);
    }
    i++;
  }

  //conta il numero di parentesi tonde aperte
  //se non sono state chiuse chiudile automaticamente alla fine
  //fare un ciclo for sul numero di parentesi tonde aperte
  //prendi la prima parentesi cerca se ci sono altre parentesi tonde aperte prima della chiusura della parentesi
  //  SI: ricomincia a cercare da quel punto se ci sono altre parentesi aperte
  //  NO: calcola tutto ciò che c'è tra le parentesi

  closedOpenBracket();

  var thereAreBracket = true;
  if(countBracket("(") == 0){
    thereAreBracket = false;
  }

  if(thereAreBracket)
    manageOperationInBracket();

  manageBasicOperation(opArr);
  setResultIntoMonitor();
}

function setInputIntoMonitor(){
  var total;

  if(opArr.length == 0){
    total = 0;
  }else if(opArr.length >= 1){
    var show = opArr.toString().replace(/,/g, " ");
    show = show.replace(/\*/g, "x");
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
