
function changeArticle(title, source){
    sessionStorage.setItem("articleTitle", title);
    sessionStorage.setItem("source", source);
}

function articleLoad(){
    let articleTitle = sessionStorage.getItem("articleTitle");
    let articleSource = sessionStorage.getItem("source");
    document.getElementById("articleTitle").innerHTML = articleTitle;
    document.getElementById("viewer").src = articleSource;
}