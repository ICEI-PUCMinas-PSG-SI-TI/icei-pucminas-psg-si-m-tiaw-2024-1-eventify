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
        "tipoUsuario": "usuário",
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

// Não está logado
if(!responseJSON || !responseJSON.pessoa || !responseJSON.pessoa.tipoUsuario) {
    window.location.href = window.location.origin + "/codigo/index.html";
}

var personData = responseJSON.pessoa;
var eventsList = responseJSON.eventos.filter(eventData =>
    responseJSON.pessoa.eventosFavoritos.some(favoriteEvent => favoriteEvent.id === eventData.id));

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
                            <svg onClick="unfavoriteEvent(event, ${eventData.id})" class="favorite-star" checked=true xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#FFD43B" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
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
    window.location.href = window.location.origin + "/codigo/pages/event.html?ev=" + id;
}

function unfavoriteEvent(event, id) {
    event.stopPropagation();

    personData.eventosFavoritos = personData.eventosFavoritos.filter(favEvento => favEvento.id !== id.toString());

    responseJSON = {
        pessoa: personData,
        eventos: eventsList
    };

    personData = responseJSON.pessoa;
    eventsList = responseJSON.eventos;

    eventsList = eventsList.filter(eventData =>
        personData.eventosFavoritos.some(favoriteEvent => favoriteEvent.id === eventData.id));

    fillEvents(eventsList);

    // TO DO: Salvar no JSON os dados da pessoa
}