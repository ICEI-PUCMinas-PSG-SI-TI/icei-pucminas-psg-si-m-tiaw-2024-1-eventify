var responseJSON = {
    "pessoa": {
        "id": "1",
        "nome": "Júlia Marques",
        "foto": "https://lh3.googleusercontent.com/a/ACg8ocKZ5h6Ae_eRddMV-pNNnJMsZeonV1elhx1mXVmo8yn9jlNTYh9vUA=s288-c-no",
        "cidade": "Belo Horizonte",
        "email": "julia.marques@gmail.com",
        "interesses": [
            "show",
            "teatro",
            "bar & cultura"
        ],
        "login": "julia.marques",
        "senha": "julia123",
        "tipoUsuario": "promotor",
        "eventosCriados": [
            {
                "id": "1"
            }
        ],
        "eventosFavoritos": [
            {
                "id": "2"
            },
            {
                "id": "3"
            }
        ]
    },
    eventos: [
        {
            "id": "1",
            "nome": "Peça nova",
            "imagem": "https://lets.events/blog/wp-content/uploads/2023/06/Imersao-Cultural.jpg",
            "data": "12/05/2024",
            "horario": "21:00 às 23:00",
            "local": "Sesc Palladium - R. Rio de Janeiro, 1046 - Centro, Belo Horizonte - MG, 30160-041",
            "descrição": "O grupo “Peça nova” irá fazer mais uma de suas fantásticas apresentações de dança rítmica em BH, sua cidade natal, e você não pode ficar de fora dessa! Garanta já seu ingresso no link abaixo.",
            "venda de ingressos": "https://bileto.sympla.com.br/event/92924/d/250557",
            "saibaMais": "https://sescmg.com.br/unidade/sesc-palladium/",
            "comentários": [
                {
                    "imagem": "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
                    "nome": "Isadora Silva",
                    "texto": "Já fui em edições anteriores e gostei muito. Super recomendo!"
                },
                {
                    "imagem": "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    "nome": "Bárbara Guedes",
                    "texto": "Estou muito animada para ir, às críticas sobre esse grupo são sempre muito positivas."
                }
            ]

        },
        {
            "id": "2",
            "nome": "wagner",
            "imagem": "https://lets.events/blog/wp-content/uploads/2023/06/Imersao-Cultural.jpg",
            "data": "12/05/2024",
            "horario": "21:00 às 23:00",
            "local": "Viaduto - Centro, Belo Horizonte - MG, 30160-041",
            "descrição": "O grupo “Peça nova” irá fazer mais uma de suas fantásticas apresentações de dança rítmica em BH, sua cidade natal, e você não pode ficar de fora dessa! Garanta já seu ingresso no link abaixo.",
            "venda de ingressos": "https://bileto.sympla.com.br/event/92924/d/250557",
            "saibaMais": "https://sescmg.com.br/unidade/sesc-palladium/",
            "comentários": [
                {
                    "imagem": "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
                    "nome": "Isadora Silva",
                    "texto": "Já fui em edições anteriores e gostei muito. Super recomendo!"
                },
                {
                    "imagem": "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    "nome": "Bárbara Guedes",
                    "texto": "Estou muito animada para ir, às críticas sobre esse grupo são sempre muito positivas."
                }
            ]
        },
        {
            "id": "3",
            "nome": "laura",
            "imagem": "https://lets.events/blog/wp-content/uploads/2023/06/Imersao-Cultural.jpg",
            "data": "12/05/2024",
            "horario": "21:00 às 23:00",
            "local": "Sesc Palladium - R. Rio de Janeiro, 1046 - Centro, Belo Horizonte - MG, 30160-041",
            "descrição": "O grupo “Peça nova” irá fazer mais uma de suas fantásticas apresentações de dança rítmica em BH, sua cidade natal, e você não pode ficar de fora dessa! Garanta já seu ingresso no link abaixo.",
            "venda de ingressos": "https://bileto.sympla.com.br/event/92924/d/250557",
            "saibaMais": "https://sescmg.com.br/unidade/sesc-palladium/",
            "comentários": [
                {
                    "imagem": "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
                    "nome": "Isadora Silva",
                    "texto": "Já fui em edições anteriores e gostei muito. Super recomendo!"
                },
                {
                    "imagem": "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    "nome": "Bárbara Guedes",
                    "texto": "Estou muito animada para ir, às críticas sobre esse grupo são sempre muito positivas."
                }
            ]
        }
    ]
};

// Não é promotor ou não está logado
if (!responseJSON || !responseJSON.pessoa || responseJSON.pessoa.tipoUsuario === "usuário") {
    window.location.href = window.location.origin + "/codigo/index.html";
}

var personData = responseJSON.pessoa;
var eventsList = responseJSON.eventos.filter(eventData =>
    responseJSON.pessoa.eventosCriados.some(createdEvent => createdEvent.id === eventData.id));

const loggedContent = document.getElementById('logged-content');
if (personData && personData.id) {
    if (personData.tipoUsuario === "promotor") {
        loggedContent.innerHTML = `<a href="/criar-evento"> <h1 class="create-event-title">Criar um evento</h1> </a>`;
    }

    const userPhoto = personData.foto
        ? `<img data-bs-toggle="dropdown" src=${personData.foto} alt="Foto do usuário" class="user-photo"></img>`
        : `<div data-bs-toggle="dropdown" class="user-photo">${personData.nome.slice(0, 1)}</div>`;

    loggedContent.innerHTML += `
        <div class="dropdown">
            ${userPhoto}
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="/codigo/pages/profile.html">Perfil</a></li>
                ${personData.tipoUsuario === "promotor" ? '<li><a class="dropdown-item" href="/criar-evento">Criar evento</a></li>' : ''}
            </ul>
        </div>`;
}

fillEvents(eventsList);

function fillEvents(list) {
    const eventListElement = document.getElementById('events-list');

    if (list && list.length) {
        eventListElement.innerHTML = "";

        list.forEach(eventData => {
            eventListElement.innerHTML += `
                <div style="z-index:1;" class="event-card" onclick="eventClick(${eventData.id})">
                    <img src="${eventData.imagem}" alt="Imagem do evento">
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
    window.location.href = window.location.origin + "/codigo/pages/event.html?ev=" + id;
}

function getFavEventIcon(id) {
    if (personData && personData.id) {
        return personData.eventosFavoritos.some(eventData => eventData.id === id)
            ? `<svg onClick="favoriteEvent(event, ${id})" class="favorite-star" checked=true xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#FFD43B" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`
            : `<svg onClick="favoriteEvent(event, ${id})" class="favorite-star" checked=false xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#192d37" d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>`;
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

    responseJSON = {
        pessoa: personData,
        eventos: eventsList
    };

    personData = responseJSON.pessoa;

    // TO DO: Salvar no JSON os dados da pessoa
}