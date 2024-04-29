function toggleAside() {
    const aside = document.getElementById('aside-filter');
    const main = document.getElementById('main-container');

    if(aside && main) {
        if(!aside.style.display || aside.style.display === "none") {
            if(window.innerWidth > 900) {
                main.style.display = "block";
                main.style.width = "80%";
                aside.style.width = "20%";
            } else {
                main.style.display = "none";
                aside.style.width = "100%";
            }

            aside.style.display = "flex";
        } else {
            main.style.display = "block";
            main.style.width = "100%";

            aside.style.display = "none";
        }
    }
}

function filter() {

}