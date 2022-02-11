const btn = document.getElementById('btn');
const openBtn = document.getElementById('open-btn');
const counter = document.getElementById('counter');
const printBtn = document.getElementById('print-btn');

printBtn.addEventListener('click',()=>{
    window.electronApi.doPrint();
})

window.electronApi.onUpdate((event, value) => {
  const oldValue = Number(counter.innerText)
  const newValue = oldValue + value
  counter.innerText = newValue
  console.log(event)
  event.sender.send('counter-value', newValue)
})

openBtn.addEventListener('click',async()=>{
    var path= await window.electronApi.openFile();
    document.getElementById("file-path").innerHTML=path;
})

btn.addEventListener('click',()=>{
    var title = document.getElementById('title').value;
    console.log(title);
    window.electronApi.setTitle(title)
    console.log("msg sent");
})