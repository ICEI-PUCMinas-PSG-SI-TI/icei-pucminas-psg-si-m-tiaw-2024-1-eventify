const baseApiUrl = "https://9a107ea6-8a7f-4350-a4ea-4e6b0afc2dab-00-30mzjl6xfkqba.riker.replit.dev/";

var personData;
var eventData;

if (localStorage.getItem("user")) {
    personData = JSON.parse(localStorage.getItem("user"));
}

loadUserInfo();
loadEventData();

function loadUserInfo() {
    const loggedContent = document.getElementById('logged-content');
    if (personData && personData.id) {
        if (personData.tipoUsuario === "promotor" || personData.tipoUsuario === "admin") {
            loggedContent.innerHTML = `<a href="/codigo/pages/create-edit-event.html"> <h1 class="create-event-title">Criar um evento</h1> </a>`;
        }

        const userPhoto = personData.foto
            ? `<img data-bs-toggle="dropdown" src=${personData.foto} alt="Foto do usuário" class="user-photo"></img>`
            : `<div data-bs-toggle="dropdown" class="user-photo">${personData.nome.slice(0, 1)}</div>`;

        loggedContent.innerHTML += `
        <div class="dropdown">
            ${userPhoto}
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="/codigo/pages/profile.html">Perfil</a></li>
                ${personData.tipoUsuario === "promotor" || personData.tipoUsuario === "admin" ? '<li><a class="dropdown-item" href="/codigo/pages/create-edit-event.html">Criar evento</a></li>' : ''}
                <li style="cursor: pointer;" class="dropdown-item" onClick="logout()">Sair</li>
            </ul>
        </div>`;
    } else {
        loggedContent.innerHTML = `<a href="/codigo/pages/login.html"><button class="sign-in-button">Entrar / Cadastrar</button></a>`;
    }
}

function loadEventData() {
    if (window.location.search) {
        const eventId = window.location.search.replaceAll("?ev=", "");


        fetch(baseApiUrl + "eventos/" + eventId)
            .then(function (response) { return response.json() })
            .then(function (data) {
                eventData = data;
                fillEvent();

                
            })
            .catch(error => {
                alert('Erro ao ler eventos via API JSONServer');
            });
    }
}

function fillEvent() {
    document.getElementById('descricao').innerHTML=eventData.descricao;
    document.getElementById('data').innerHTML="Data: " + eventData.data;
    document.getElementById('horario').innerHTML="Horário: " + eventData.horario;
    document.getElementById('local').innerHTML="Local: " + eventData.local;
    document.getElementById('imagem').scr=eventData.imagem

}


