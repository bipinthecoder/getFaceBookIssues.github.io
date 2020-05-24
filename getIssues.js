function getData(){
    fetch("https://api.github.com/search/repositories?q=org:facebook&type=Issues")
    .then(res => res.json())
    .then(res=> console.log(res));
}       
let data = [];
let pageData =[];
let perPage = 25;
let activePage = 1;
let select;
let initial = "facebook";
function searchItem(entry){
    fetch("https://api.github.com/search/issues?q="+entry+"org:facebook")
    .then(res => res.json())
    .then(res => data=res["items"])
    .then(res => pagination(activePage));
}
fetch("https://api.github.com/search/issues?q="+initial+"org:facebook")
.then(res => res.json())
.then(res => data=res["items"])
.then(res => pagination(activePage));

function renderDOM(){
    //setting data according to the page
    let page = activePage;
    let low = (page -1) * perPage;
    let high = page * perPage;
    pageData = data.filter((a,i)=> i>= low && i < high);
    fillPage(page);
}

function pagination(page){
    let total = data.length;
    let pageCount = Math.ceil(total/perPage);
    let pages = document.getElementById("pages");
    pages.innerHTML = " " ;

    for(let i = 0; i < pageCount; i ++){
        let li = document.createElement("li");
        if(i === page - 1){
            li.setAttribute("class","page-item active");
        }
        else{
            li.setAttribute("class","page-item");
        }

        li.setAttribute("onclick",`changePage(${i + 1})`);

        let a = document.createElement("a");
        a.setAttribute("class","page-link")
        a.setAttribute("href",`#${i + 1}`);
        a.textContent = i + 1;
        li.append(a);
        pages.append(li);
    }
    renderDOM();

}

function changePage(newPage){
    let liActive = document.querySelector(`#pages li:nth-child(${activePage})`);
    liActive.setAttribute("class","page-item");
    activePage = newPage;
    let liNew = document.querySelector(`#pages li:nth-child(${activePage})`);
    liNew.setAttribute("class","page-item active");
    renderDOM();

}

function fillPage(){
    let div = document.getElementById("data");
    div.innerHTML = "";
    pageData.forEach(item =>{

        let newDiv = document.createElement("div");
        //title
        let a = document.createElement("a");
        a.textContent = item.title;
        a.setAttribute("href",item.url);
        a.style.textDecoration = "none";
        a.setAttribute("class","display-4");
        //Issue No
        let id = document.createElement("p");
        id.textContent = `Issue No: ${item.id}`;
        //Created On
        let created = document.createElement("p");
        created.textContent = `Created on:: ${item.created_at}`;
        //Description
        let descr = document.createElement("div");
        descr.textContent = `Description: ${item.body}`;

        let hr = document.createElement("hr");
        //Appending to Main Div
        div.append(newDiv);
        newDiv.append(a,id,created,descr,hr);

    })

}
window.addEventListener("load",function(){
    
    getData();
    perPage = 10;
    pagination(activePage);
    let searchInput = document.getElementById("searchIssue");
    
    //debouncing
    searchInput.addEventListener("keyup",function(){
        setTimeout(() =>{
            searchItem(searchInput.value);
        },1000);
    })
});