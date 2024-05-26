const baseApiUrl = "https://9a107ea6-8a7f-4350-a4ea-4e6b0afc2dab-00-30mzjl6xfkqba.riker.replit.dev/";

var personData;
var eventsList;

if (localStorage.getItem("user")) {
    personData = JSON.parse(localStorage.getItem("user"));
    loadUserInfo();
    getEvents();
} else {
    window.location = "/codigo/index.html";
}

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
    }
}

function getEvents() {
    document.getElementById('page-title').style.display = "none";
    document.getElementById('loadSpinner').style.display = "flex";

    fetch(baseApiUrl + "eventos")
        .then(function (response) { return response.json() })
        .then(function (data) {
            document.getElementById('page-title').style.display = "block";
            document.getElementById('loadSpinner').style.display = "none";

            eventsList = data.filter(eventData =>
                personData.eventosFavoritos.some(favoriteEvent => favoriteEvent.id === eventData.id));
            fillEvents(eventsList);
        })
        .catch(error => {
            document.getElementById('page-title').style.display = "block";
            document.getElementById('loadSpinner').style.display = "none";
            alert('Erro ao ler eventos via API JSONServer');
        });
}

function fillEvents(list) {
    const eventListElement = document.getElementById('events-list');

    if (list && list.length) {
        eventListElement.innerHTML = "";

        list.forEach(eventData => {
            eventListElement.innerHTML += `
                <div style="z-index:1;" class="event-card" onclick="eventClick('${eventData.id}')">
                    <img src="${eventData.imagem}" alt="Imagem do evento" onerror="this.onerror=null; this.src='../assets/images/login-background.jpg'">
                    <div class="event-description">
                        <div style="display: flex;align-items: flex-start;justify-content: space-between;">
                            <h1>${eventData.nome}</h1>
                            <svg onClick="unfavoriteEvent(event, '${eventData.id}')" class="favorite-star" checked=true xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#FFD43B" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
                        </div>
                        <h2>${eventData.data} - ${eventData.horario}</h2>
                        <p>${eventData.local}</p>
                    </div>
                </div>
            `;
        });
    } else {
        eventListElement.innerHTML = `<h1>Você ainda não favoritou nenhum evento.</h1>`;
    }
}

function eventClick(id) {
    window.location = "/codigo/pages/event.html?ev=" + id;
}

function unfavoriteEvent(event, id) {
    event.stopPropagation();

    personData.eventosFavoritos = personData.eventosFavoritos.filter(favEvento => favEvento.id !== id.toString());

    eventsList = eventsList.filter(eventData =>
        personData.eventosFavoritos.some(favoriteEvent => favoriteEvent.id === eventData.id));

    fillEvents(eventsList);

    // Atualiza db
    fetch(baseApiUrl + "pessoas/" + personData.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "eventosFavoritos": personData.eventosFavoritos
        }),
    })
        .then(() => {
            localStorage.setItem("user", JSON.stringify(personData));
        })
        .catch(error => {
            alert('Erro ao favoritar evento via API JSONServer.');
        });
}

function logout() {
    localStorage.removeItem("user");
    window.location = "/codigo/index.html";
}