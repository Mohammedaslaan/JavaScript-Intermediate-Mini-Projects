const inputSlider = document.querySelector("[data-lengthSlider]")
const lengthDisplay = document.querySelector("[data-lengthNumber]")
const passwordDisplay = document.querySelector("[data-password-display]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generateButton")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")

const symbols = "~!@#$%^&*()_+{}:<>?";
//initialze values
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider()
// set strength circle color to gray

//set passwordLength
function handleSlider(){
        inputSlider.value = passwordLength;
        lengthDisplay.innerText = passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
}

//geting an random integer between min and max.
function getRndInteger(min,max){
     return (Math.floor(Math.random()*(max-min)) + min)
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,122));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
    return symbols.charAt(getRndInteger(0,symbols.length));
}

function generatePassword(){
    
}
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndicator("#0f0");
    } else if( (hasLower || hasUpper) && (hasNum ||hasSym) && passwordLength >=6){
        setIndicator("#ff0")
    } else{
        setIndicator("#f00")
    }
}
const unsecuredCopyToClipboard = (text) => { 
    const textArea = document.createElement("textarea"); 
    textArea.value=text;
    document.body.appendChild(textArea); 
    textArea.focus();
    textArea.select(); 
    try{
        document.execCommand('copy')
    }
    catch(err){
        console.error('Unable to copy to clipboard',err)
    }
    document.body.removeChild(textArea)
};

async function copyContent() {
    try {
        console.log(passwordDisplay.value)
        let num = passwordDisplay.value;
        await navigator.clipboard.writeText(num);
        //Clipboard addition may not work in some browser as navigator.clipboard require secure origin connection
        copyMsg.innerText = "copied";
    }
    catch(e) {
        console.log(e)
        //Jugad tarika to clipboard.
        unsecuredCopyToClipboard(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
        copyMsg.innerText = "";
    },2000);
    

}

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider()
})
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach( (checkbox)=>{
    //checkCount.addEventListener('change',handleCheckBoxChange)
    checkbox.addEventListener('change',()=>{
        handleCheckBoxChange()
    })
});

function shufflePassword(array){
    //Fisher Yates Method
    for(let i = array.length-1 ; i>0 ; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = ""
    array.forEach((el)=>{
        str+= el;
    })
    return str;

}
generateBtn.addEventListener('click',()=>{
    console.log('btn clicked');
    //none of the checkbox are selected
    if(checkCount<=0) return;
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    //lets generate new password
    //remove old password
    console.log("Starting the Journey");
    password = "";


    //lets put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password = generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password = generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password = generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password = symbolsCheck();
    // }
    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase)
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase)
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber)
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol)
    }
    // compalsury char
    for(let i = 0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");
    //remaining char
    for(let i = 0 ; i< passwordLength -funcArr.length ; i++){
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    console.log('passwrod is',password);
    // suffleing password characters
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    passwordDisplay.value = password;
    console.log("UI adddition done");

    //calling calculate strength function
    calcStrength();

});

