const baseApiUrl = "/";

if (!window.location.search || !window.location.search.includes("ev=")) window.location = "/index.html";

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
            loggedContent.innerHTML = `<a href="/pages/create-edit-event.html"> <h1 class="create-event-title">Criar um evento</h1> </a>`;
        }

        const userPhoto = personData.foto
            ? `<img data-bs-toggle="dropdown" src=${personData.foto} alt="Foto do usuário" class="user-photo"></img>`
            : `<div data-bs-toggle="dropdown" class="user-photo">${personData.nome.slice(0, 1)}</div>`;

        loggedContent.innerHTML += `
        <div class="dropdown">
            ${userPhoto}
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="/pages/profile.html">Perfil</a></li>
                <li><a class="dropdown-item" href="/pages/favorite-events.html">Eventos Favoritos</a></li>
                ${personData.tipoUsuario === "promotor" ? '<li><a class="dropdown-item" href="/pages/created-events.html">Meus eventos</a></li>' : ''}
                ${personData.tipoUsuario === "promotor" || personData.tipoUsuario === "admin" ? '<li><a class="dropdown-item" href="/pages/create-edit-event.html">Criar evento</a></li>' : ''}
                <li style="cursor: pointer;" class="dropdown-item" onClick="logout()">Sair</li>
            </ul>
        </div>`;
    } else {
        loggedContent.innerHTML = `<a href="/pages/login.html"><button class="sign-in-button">Entrar / Cadastrar</button></a>`;
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

                if (personData && personData.id) {
                    document.getElementById('comentarios-titulo').style.display = "block";
                    document.getElementById('adicionarComentario').style.display = "flex";
                } else if (data.comentarios && data.comentarios.length) {
                    document.getElementById('comentarios-titulo').style.display = "block";
                }

                eventData = data;
                fillEvent();
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

function fillEvent() {
    document.getElementById('nome').innerHTML = eventData.nome;
    document.getElementById('imagem').src = eventData.imagem;
    document.getElementById('data').innerHTML = "<strong>Data:</strong> " + eventData.data;
    document.getElementById('horario').innerHTML = "<strong>Horário:</strong> " + eventData.horario;
    document.getElementById('local').innerHTML = "<strong>Local:</strong> " + eventData.local;
    document.getElementById('endereco').innerHTML = "<strong>Endereco:</strong> " + eventData.endereco + ", " + eventData.numero + " - " + eventData.cep

    document.getElementById('descricao').innerHTML = eventData.descricao;

    document.getElementById('ingresso').innerHTML = eventData.vendaDeIngressos;
    document.getElementById('ingresso').href = eventData.vendaDeIngressos;

    document.getElementById('maisInfo').innerHTML = eventData.saibaMais;
    document.getElementById('maisInfo').href = eventData.saibaMais;

    document.getElementById('listaComentarios').innerHTML = "";
    if (eventData.comentarios && eventData.comentarios.length) {
        document.getElementById('listaComentarios').style.display = 'block';

        eventData.comentarios.forEach(comentario => {
            if (personData && (personData.id === comentario.usuarioId || personData.id === eventData.promotorId || personData.tipoUsuario === 'admin')) {
                document.getElementById('listaComentarios').innerHTML += `
                    <div class="caixa-comentario">
                        <div class="cabecalho-comentario">
                            <div class="container-foto">
                                ${comentario.foto
                        ? `<img src="${comentario.foto}" alt="Foto do comentário">`
                        : `<div>${comentario.nome.slice(0, 1)}</div>`}
                            </div>
                            <p>${comentario.nome}</p>
                        </div>
                        <p>${comentario.texto}</p>
                        <div class="container-botao">
                            <button id="excluirComentarioBotao" onClick="excluirComentario('${comentario.id}')">Excluir</button>
                        </div>
                    </div>
                `;
            } else {
                document.getElementById('listaComentarios').innerHTML += `
                    <div class="caixa-comentario">
                        <div class="cabecalho-comentario">
                            <div class="container-foto">
                                ${comentario.foto
                        ? `<img src="${comentario.foto}" alt="Foto do comentário">`
                        : `<div>${comentario.nome.slice(0, 1)}</div>`}
                            </div>
                            <p>${comentario.nome}</p>
                        </div>
                        <p>${comentario.texto}</p>
                    </div>
                `;
            }
        });
    }

    document.getElementById('excluirEventoBotao').style.display = personData && (personData.id === eventData.promotorId || personData.tipoUsuario === 'admin')
        ? "block" : "none";

    document.getElementById('denunciarEventoBotao').style.display = !personData || personData.id === eventData.promotorId
        ? "none" : "block";

    document.getElementById('editarEventoBotao').style.display = personData && (personData.id === eventData.promotorId || personData.tipoUsuario === 'admin')
        ? "block" : "none";
}

function adicionarComentario() {
    const texto = document.getElementById('campoComentario');

    if (!texto || !texto.value) {
        alert("É preciso preencher o campo de texto.");
    } else if (eventData.comentarios.some(evento => evento.usuarioId === personData.id)) {
        alert("Só é possível adicionar um comentário por evento.");
    } else {
        const listaComentarios = eventData.comentarios || [];
        listaComentarios.push({
            "id": generateUUID(),
            "usuarioId": personData.id,
            "foto": personData.foto,
            "nome": personData.nome,
            "texto": texto.value
        });

        document.getElementById('adicionarComentarioBotao').innerHTML = `
            <div class="spinner-border text-dark" role="status" style="margin-top: 4px;">
                <span class="sr-only">Loading...</span>
            </div>
        `;

        fetch(baseApiUrl + "eventos/" + eventData.id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "comentarios": listaComentarios
            }),
        })
            .then(function (response) { return response.json() })
            .then(function (data) {
                document.getElementById('adicionarComentarioBotao').innerHTML = "Adicionar comentário";
                texto.value = "";
                eventData = data;
                fillEvent();
            })
            .catch(error => {
                document.getElementById('adicionarComentarioBotao').innerHTML = "Adicionar comentário";
                alert('Erro ao adicionar comentário via API JSONServer.');
            });
    }
}

function excluirComentario(id) {
    const listaComentarios = eventData.comentarios.filter(comentario => comentario.id !== id);

    document.getElementById('excluirComentarioBotao').innerHTML = `
        <div class="spinner-border text-dark" role="status" style="margin-top: 4px;">
            <span class="sr-only">Loading...</span>
        </div>
    `;

    fetch(baseApiUrl + "eventos/" + eventData.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "comentarios": listaComentarios
        }),
    })
        .then(function (response) { return response.json() })
        .then(function (data) {
            eventData = data;
            fillEvent();
        })
        .catch(error => {
            document.getElementById('excluirComentarioBotao').innerHTML = "Excluir comentário";
            alert('Erro ao excluir comentário via API JSONServer.');
        });
}

function excluirEvento() {
    const confirmacao = confirm("Tem certeza que deseja excluir o evento? Saiba que essa ação não terá retorno.");

    if (confirmacao) {
        document.getElementById('excluirEventoBotao').innerHTML = `
            <div class="spinner-border text-dark" role="status" style="margin-top: 4px;">
                <span class="sr-only">Loading...</span>
            </div>
        `;

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
                            document.getElementById('excluirEventoBotao').innerHTML = "Excluir evento";
                            alert('Erro ao buscar promotor via API JSONServer');
                        });
                }
            })
            .catch(error => {
                document.getElementById('excluirEventoBotao').innerHTML = "Excluir evento";
                alert('Erro ao excluir evento via API JSONServer');
            });
    }
}

function editarEvento() {
    window.location = "/pages/create-edit-event.html?ev=" + eventData.id;
}

function showMap() {
    window.location = "/pages/events-map.html?ev=" + eventData.id;
}

function denunciarEvento(el) {
    const motivo = document.getElementById('motivoDenuncia');
    const descricao = document.getElementById('descricaoDenuncia');

    if (!motivo.value) {
        alert("O motivo da denúncia é obrigatório");
    } else if (!descricao.value) {
        alert("A descrição da denúncia é obrigatório");
    } else if (eventData.denuncias && eventData.denuncias.length &&
        eventData.denuncias.some(denuncia => denuncia.usuarioId === personData.id)
    ) {
        alert("Só é possível denunciar este evento uma vez.")
    }
    else {
        eventData.denuncias = eventData.denuncias || [];
        eventData.denuncias.push({
            "id": generateUUID(),
            "usuarioId": personData.id,
            "motivo": motivo.value,
            "descricao": descricao.value
        });

        el.innerHTML = `
            <div class="spinner-border text-light" role="status" style="width: 16px; height: 16px; margin-top: 4px;">
                <span class="sr-only">Loading...</span>
            </div>
        `;

        fetch(baseApiUrl + "eventos/" + eventData.id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "denuncias": eventData.denuncias
            }),
        })
            .then(function (response) { return response.json() })
            .then(function (data) {
                eventData = data;

                $('#denunciarModal').modal('toggle');

                el.innerHTML = "Denunciar";
                motivo.value = "";
                descricao.value = '';
            })
            .catch(error => {
                el.innerHTML = "Denunciar";
                alert('Erro ao denunciar evento via API JSONServer.');
            });
    }
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
            window.location = "/index.html";
        })
        .catch(error => {
            document.getElementById('excluirEventoBotao').innerHTML = "Excluir evento";
            alert('Erro ao atualizar eventos criados via API JSONServer.');
        });
}

function logout() {
    localStorage.removeItem("user");
    window.location = "/index.html";
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