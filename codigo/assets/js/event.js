const baseApiUrl = "https://9a107ea6-8a7f-4350-a4ea-4e6b0afc2dab-00-30mzjl6xfkqba.riker.replit.dev/";

if (!window.location.search || !window.location.search.includes("ev=")) window.location = "/codigo/index.html";

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
                ${personData.tipoUsuario === "promotor" || personData.tipoUsuario === "admin" ? '<li><a class="dropdown-item" href="/codigo/pages/create-edit-event.html">Criar evento</a></li>' : ''}
                <li style="cursor: pointer;" class="dropdown-item" onClick="logout()">Sair</li>
            </ul>
        </div>`;
    } else {
        loggedContent.innerHTML = `<a href="/codigo/pages/login.html"><button class="sign-in-button">Entrar / Cadastrar</button></a>`;
    }
}

function loadEventData() {
    fetch(baseApiUrl + "eventos/" + urlEvent)
        .then(function (response) { return response.json() })
        .then(function (data) {
            if (data && data.id) {
                eventData = data;
                fillEvent();
            } else {
                alert("Evento não encontrado.");
                window.location = "/codigo/index.html";
            }
        })
        .catch(error => {
            alert('Erro ao ler eventos via API JSONServer');
        });
}

function fillEvent() {
    document.getElementById('nome').innerHTML = eventData.nome;
    document.getElementById('imagem').src = eventData.imagem;
    document.getElementById('data').innerHTML = "<strong>Data:</strong> " + eventData.data;
    document.getElementById('horario').innerHTML = "<strong>Horário:</strong> " + eventData.horario;
    document.getElementById('local').innerHTML = "<strong>Local:</strong> " + eventData.local;

    document.getElementById('descricao').innerHTML = eventData.descricao;

    document.getElementById('ingresso').innerHTML = eventData.vendaDeIngressos;
    document.getElementById('ingresso').href = eventData.vendaDeIngressos;

    document.getElementById('maisInfo').innerHTML = eventData.saibaMais;
    document.getElementById('maisInfo').href = eventData.saibaMais;
}

function excluirEvento() {
    fetch(baseApiUrl + "eventos/" + urlEvent, { method: 'DELETE' })
        .then(function (response) { return response.json() })
        .then(function (data) {
            let novaLista;
            if (personData.eventosCriados && personData.eventosCriados.length &&
                personData.eventosCriados.some(evento => evento.id === urlEvent)
            ) {
                novaLista = personData.eventosCriados.filter(evento => evento.id !== urlEvent);
                personData.eventosCriados = novaLista;
                localStorage.setItem("user", JSON.stringify(personData));
                removerReferencia(personData.id, novaLista);
            } else {
                fetch(baseApiUrl + "pessoas/" + eventData.promotorId)
                    .then(function (response) { return response.json() })
                    .then(function (data) {
                        novaLista = data.eventosCriados.filter(evento => evento.id !== urlEvent);
                        removerReferencia(data.id, novaLista);
                    })
                    .catch(error => {
                        alert('Erro ao buscar promotor via API JSONServer');
                    });
            }
        })
        .catch(error => {
            alert('Erro ao excluir evento via API JSONServer');
        });
}

function removerReferencia(id, lista) {
    fetch(baseApiUrl + "pessoas/" + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "eventosCriados": lista
        })
    })
        .then(() => {
            window.location = "/codigo/index.html";
        })
        .catch(error => {
            alert('Erro ao atualizar eventos criados via API JSONServer.');
        });
}

function logout() {
    localStorage.removeItem("user");
    window.location = "/codigo/index.html";
}