const baseApiUrl = "https://9a107ea6-8a7f-4350-a4ea-4e6b0afc2dab-00-30mzjl6xfkqba.riker.replit.dev/";

var personData = localStorage.getItem("user");
var editEvent;
if (personData && JSON.parse(personData).tipoUsuario === "promotor" || JSON.parse(personData).tipoUsuario === "admin") {
    personData = JSON.parse(personData);
    loadUserInfo();
    loadEventData();
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
                <li><a class="dropdown-item" href="/codigo/pages/create-edit-event.html">Criar evento</a></li>
                <li style="cursor: pointer;" class="dropdown-item" onClick="logout()">Sair</li>
            </ul>
        </div>`;
    }
}

function logout() {
    localStorage.removeItem("user");
    window.location = "/codigo/index.html";
}

function loadEventData() {
    if (window.location.search) {
        const eventId = window.location.search.replaceAll("?ev=", "");

        if (personData.eventosCriados && personData.eventosCriados.length &&
            personData.eventosCriados.some(evento => evento.id === eventId)
        ) {
            fetch(baseApiUrl + "eventos/" + eventId)
                .then(function (response) { return response.json() })
                .then(function (data) {
                    editEvent = data;
                    fillForm();
                })
                .catch(error => {
                    alert('Erro ao ler eventos via API JSONServer');
                });
        } else {
            window.location = "/codigo/index.html";
            alert("Evento inválido.")
        }
    }
}

function fillForm() {
    document.getElementById('page-title').innerHTML = "Editar evento: ";
    document.getElementById('create-edit-button').innerHTML = "Editar";

    const inputs = document.getElementsByClassName('text-form-button');

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = editEvent[inputs[i].name];
    }
}

function createEditEventifyEvent() {
    const formValue = $('#create-edit-form').serializeArray();
    let eventData = {};
    let hasError = false;

    if (formValue && formValue.length) {
        formValue.every(field => {
            if (field.value === '') {
                alert("O campo \"" + field.name.charAt(0).toUpperCase() + field.name.slice(1) + "\" é obrigatório.");
                hasError = true;
                return false;
            }

            if (field.name === "data" && !(/^[0-3][0-9]\/[0-1][0-9]\/[0-9]{4}$/).test(field.value)) {
                alert("Insira uma data válida com formato DD/MM/AAAA");
                hasError = true;
                return false;
            } else if (field.name === "horario" && !(/^[0-2][0-9]:[0-5][0-9]$/).test(field.value)) {
                alert("Insira um horário válido com formato HH:MM");
                hasError = true;
                return false;
            }

            eventData[field.name] = field.value;

            return true;
        });

        if (!hasError) {
            // Atualiza evento
            if (editEvent && editEvent.id) {
                eventData.id = editEvent.id;
                eventData.promotorId = personData.id;
                eventData.comentarios = editEvent.comentarios;

                fetch(baseApiUrl + "eventos/" + eventData.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventData),
                })
                    .then(function (response) { return response.json() })
                    .then(function (data) { 
                        window.location = "/codigo/pages/event.html?ev=" + eventData.id;
                    })
                    .catch(error => {
                        alert('Erro ao editar evento via API JSONServer.');
                    });

            } else {
                eventData.id = generateUUID();
                eventData.promotorId = personData.id;
                eventData.comentarios = [];

                // Cria novo evento
                fetch(baseApiUrl + "eventos", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventData),
                })
                    .then(function (response) { return response.json() })
                    .then(function (data) {
                        // Atualiza usuário
                        if (personData.eventosCriados && personData.eventosCriados.length) {
                            personData.eventosCriados.push({ "id": eventData.id });
                        } else {
                            personData.eventosCriados = [{ "id": eventData.id }];
                        }

                        fetch(baseApiUrl + "pessoas/" + personData.id, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                "eventosCriados": personData.eventosCriados
                            }),
                        })
                            .then(() => {
                                localStorage.setItem("user", JSON.stringify(personData));
                                window.location = "/codigo/pages/event.html?ev=" + eventData.id;
                            })
                            .catch(error => {
                                alert('Erro ao atualizar usuário via API JSONServer.');
                            });
                    })
                    .catch(error => {
                        alert('Erro ao criar evento via API JSONServer.');
                    });
            }
        }
    }
}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}