/**
 * Minified by jsDelivr using Terser v5.3.5.
 * www.pccv.com
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
console.clear();const sliderProps={fill:"#0B1EDF",background:"rgba(255, 255, 255, 0.214)"},slider=document.querySelector(".range__slider"),sliderValue=document.querySelector(".length__title");function applyFill(e){const t=100*(e.value-e.min)/(e.max-e.min),n=`linear-gradient(90deg, ${sliderProps.fill} ${t}%, ${sliderProps.background} ${t+.1}%)`;e.style.background=n,sliderValue.setAttribute("data-length",e.value)}slider.querySelector("input").addEventListener("input",(e=>{sliderValue.setAttribute("data-length",e.target.value),applyFill(e.target)})),applyFill(slider.querySelector("input"));const randomFunc={lower:getRandomLower,upper:getRandomUpper,number:getRandomNumber,symbol:getRandomSymbol};function getRandomLower(){return String.fromCharCode(Math.floor(26*Math.random())+97)}function getRandomUpper(){return String.fromCharCode(Math.floor(26*Math.random())+65)}function getRandomNumber(){return String.fromCharCode(Math.floor(10*Math.random())+48)}function getRandomSymbol(){const e='~!@#$%^&*()_+{}":?><;.,';return e[Math.floor(Math.random()*e.length)]}const resultEl=document.getElementById("result"),lengthEl=document.getElementById("slider"),uppercaseEl=document.getElementById("uppercase"),lowercaseEl=document.getElementById("lowercase"),numberEl=document.getElementById("number"),symbolEl=document.getElementById("symbol"),generateBtn=document.getElementById("generate"),copyBtn=document.getElementById("copy-btn"),resultContainer=document.querySelector(".result"),copyInfo=document.querySelector(".result__info.right"),copiedInfo=document.querySelector(".result__info.left");let resultContainerBound={left:resultContainer.getBoundingClientRect().left,top:resultContainer.getBoundingClientRect().top};function generatePassword(e,t,n,o,r){let l="";const a=t+n+o+r,c=[{lower:t},{upper:n},{number:o},{symbol:r}].filter((e=>Object.values(e)[0]));if(0===a)return"";for(let t=0;t<e;t++)c.forEach((e=>{const t=Object.keys(e)[0];l+=randomFunc[t]()}));return l.slice(0,e)}resultContainer.addEventListener("mousemove",(e=>{copyBtn.style.setProperty("--x",e.x-resultContainerBound.left+"px"),copyBtn.style.setProperty("--y",e.y-resultContainerBound.top+"px")})),window.addEventListener("resize",(e=>{resultContainerBound={left:resultContainer.getBoundingClientRect().left,top:resultContainer.getBoundingClientRect().top}})),copyBtn.addEventListener("click",(()=>{const e=document.createElement("textarea"),t=resultEl.innerText;t&&"CLICK GENERATE"!=t&&(e.value=t,document.body.appendChild(e),e.select(),document.execCommand("copy"),e.remove(),copyInfo.style.transform="translateY(200%)",copyInfo.style.opacity="0",copiedInfo.style.transform="translateY(0%)",copiedInfo.style.opacity="0.75")})),generateBtn.addEventListener("click",(()=>{const e=+lengthEl.value,t=lowercaseEl.checked,n=uppercaseEl.checked,o=numberEl.checked,r=symbolEl.checked;resultEl.innerText=generatePassword(e,t,n,o,r),copyInfo.style.transform="translateY(0%)",copyInfo.style.opacity="0.75",copiedInfo.style.transform="translateY(200%)",copiedInfo.style.opacity="0"}));
