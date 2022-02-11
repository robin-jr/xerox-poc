const btn = document.getElementById('btn');
btn.addEventListener('click',()=>{
    var title = document.getElementById('title').value;
    console.log(title);
    window.electronApi.setTitle(title)
    console.log("msg sent");
})