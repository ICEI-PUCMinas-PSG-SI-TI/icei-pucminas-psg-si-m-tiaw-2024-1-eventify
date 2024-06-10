const baseApiUrl = "https://9a107ea6-8a7f-4350-a4ea-4e6b0afc2dab-00-30mzjl6xfkqba.riker.replit.dev/";

//if (!window.location.search || !window.location.search.includes("ev=")) window.location = "/index.html";

var personData;
var eventData;
var urlEvent = window.location.search.replaceAll("?ev=", "");

if (localStorage.getItem("user")) {
    personData = JSON.parse(localStorage.getItem("user"));

    if (personData.tipoUsuario === "admin" ||
        (personData.tipoUsuario === "promotor" && personData.eventosCriados && personData.eventosCriados.length &&
            personData.eventosCriados.some(evento => evento.id === urlEvent))
    ) {
        document.getElementById('excluirEventoBotao').style.display = 'block';
    }
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
                <li><a class="dropdown-item" href="/codigo/pages/favorite-events.html">Eventos Favoritos</a></li>
                ${personData.tipoUsuario === "promotor" ? '<li><a class="dropdown-item" href="/codigo/pages/created-events.html">Meus eventos</a></li>' : ''}
                ${personData.tipoUsuario === "promotor" || personData.tipoUsuario === "admin" ? '<li><a class="dropdown-item" href="/codigo/pages/create-edit-event.html">Criar evento</a></li>' : ''}
                <li style="cursor: pointer;" class="dropdown-item" onClick="logout()">Sair</li>
            </ul>
        </div>`;
    } else {
        loggedContent.innerHTML = `<a href="/codigo/pages/login.html"><button class="sign-in-button">Entrar / Cadastrar</button></a>`;
    }
}

function loadEventData() {
    document.getElementById('pageContent').style.display = "none";
    document.getElementById('loadSpinner').style.display = "flex";

    fetch(baseApiUrl + "eventos/" + urlEvent)
        .then(function (response) { return response.json() })
        .then(function (data) {
            if (data && data.id) {
                document.getElementById('pageContent').style.display = "block";
                document.getElementById('loadSpinner').style.display = "none";

                eventData = data;
                fillEventInfo();
            } else {
                alert("Evento não encontrado.");
                window.location = "/index.html";
            }
        })
        .catch(error => {
            document.getElementById('pageContent').style.display = "block";
            document.getElementById('loadSpinner').style.display = "none";
            alert('Erro ao ler eventos via API JSONServer');
        });
}

function fillEventInfo() {
    document.getElementById('map-title').innerHTML = "Localização do vento: " + eventData.nome;
    document.getElementById('markerModalLabel').innerHTML = eventData.nome;

    document.getElementById('info-evento').innerHTML = `
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="card bg-secondary text-light" style="max-width: 30rem;">
                        <div class="card-body">
                            <img src=${eventData.imagem} id="imagem" class="card-img-top rounded" alt="Imagem do evento"
                                onerror="this.onerror=null; this.src='../assets/images/login-background.jpg'">

                            <p class="card-text mt-3" id="data"><strong>Data: </strong>${eventData.data}</p>
                            <p class="card-text" id="horario"><strong>Horário: </strong>${eventData.horario}</p>
                            <p class="card-text" id="local"><strong>Local: </strong>${eventData.local}, N.${eventData.numero} - ${eventData.cep}</p>
                        </div>
                    </div>
                </div>
                <div class="col-12 mt-3">
                    <h5><strong>Descrição do Evento</strong></h5>
                    <p id="descricao">${eventData.descricao}</p>

                    <h5><strong>Adquira seus Ingressos em:</strong></h5>
                    <p><a href=${eventData.vendaDeIngressos} id="ingresso">${eventData.vendaDeIngressos}</a></p>

                    <h5><strong>Saiba mais em:</strong></h5>
                    <p><a href=${eventData.saibaMais} id="maisInfo">${eventData.saibaMais}</a></p>
                </div>
            </div>
        </div>
    `;
}

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        lat: parseFloat(params.get('lat')),
        lng: parseFloat(params.get('lng'))
    };
}

function initMap() {
    //const { lat, lng } = ToDo: obter geolocalização;
    const { lat, lng } = { lat: -19.928113, lng: -43.932875 };
    const mapOptions = {
        center: { lat: lat, lng: lng },
        zoom: 15
    };
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: 'Localizacao do Evento'
    });

    google.maps.event.addListener(marker, 'click', function () {
        const modalEl = new bootstrap.Modal('#markerModal', {
            keyboard: false
        });

        modalEl.show();
    });
}

window.onload = initMap;