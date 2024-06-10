const baseApiUrl = "https://9a107ea6-8a7f-4350-a4ea-4e6b0afc2dab-00-30mzjl6xfkqba.riker.replit.dev/";

var personData = localStorage.getItem("user");
var eventsList;

if(personData && JSON.parse(personData).tipoUsuario === "promotor" || JSON.parse(personData).tipoUsuario === "admin") {
    personData = JSON.parse(personData);
    loadUserInfo();
    getEvents();
} else {
  window.location = "/codigo/index.html";
}

function loadUserInfo() {
    const loggedContent = document.getElementById('logged-content');
    if (personData && personData.id) {
        const userPhoto = personData.foto
            ? `<img data-bs-toggle="dropdown" src=${personData.foto} alt="Foto do usuário" class="user-photo"></img>`
            : `<div data-bs-toggle="dropdown" class="user-photo">${personData.nome.slice(0, 1)}</div>`;

        loggedContent.innerHTML = `
        <a href="/codigo/pages/create-edit-event.html"> <h1 class="create-event-title">Criar um evento</h1> </a>
        <div class="dropdown">
            ${userPhoto}
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="/codigo/pages/profile.html">Perfil</a></li>
                <li><a class="dropdown-item" href="/codigo/pages/favorite-events.html">Eventos Favoritos</a></li>
                <li><a class="dropdown-item" href="/codigo/pages/create-edit-event.html">Criar evento</a></li>
                <li style="cursor: pointer;" class="dropdown-item" onClick="logout()">Sair</li>
            </ul>
        </div>`;
    }
}

function getEvents() {
    document.getElementById('page-title').style.display = "none";
    document.getElementById('loadSpinner').style.display = "flex";

    fetch(baseApiUrl + "eventos?promotorId=" + personData.id)
        .then(function (response) { return response.json() })
        .then(function (data) {
            document.getElementById('page-title').style.display = "block";
            document.getElementById('loadSpinner').style.display = "none";

            eventsList = data;
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
                            ${getFavEventIcon(eventData.id)}
                        </div>
                        <h2>${eventData.data} - ${eventData.horario}</h2>
                        <p>${eventData.local}</p>
                    </div>
                </div>
            `;
        });
    } else {
        eventListElement.innerHTML = `<h1>Você ainda não criou nenhum evento.</h1>`;
    }
}

function eventClick(id) {
    window.location = "/codigo/pages/event.html?ev=" + id;
}

function getFavEventIcon(id) {
    if (personData && personData.id) {
        return personData.eventosFavoritos.some(eventData => eventData.id === id)
            ? `<svg onClick="favoriteEvent(event, '${id}')" class="favorite-star" checked=true xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#FFD43B" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`
            : `<svg onClick="favoriteEvent(event, '${id}')" class="favorite-star" checked=false xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#192d37" d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>`;
    }

    return "";
}

function favoriteEvent(event, id) {
    event.stopPropagation();

    if (event.target.parentNode && event.target.parentNode.getAttribute("checked") === "true") {
        event.target.parentNode.setAttribute("checked", "false");
        event.target.parentNode.innerHTML = `<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#192d37" d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/>`;

        personData.eventosFavoritos = personData.eventosFavoritos.filter(favEvento => favEvento.id !== id.toString());
    } else {
        event.target.setAttribute("checked", "true");
        event.target.innerHTML = `<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#FFD43B" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>`;

        personData.eventosFavoritos.push({ id: id.toString() });
    }

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