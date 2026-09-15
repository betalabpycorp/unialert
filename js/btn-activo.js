const pagina =
    window.location.pathname
    .split("/")
    .pop();


document.querySelectorAll(".btn-footer")
.forEach(btn=>{


    const enlace =
        btn.getAttribute("href")
        .split("/")
        .pop();


    if(enlace === pagina){

        btn.classList.add("activo");

    }


});