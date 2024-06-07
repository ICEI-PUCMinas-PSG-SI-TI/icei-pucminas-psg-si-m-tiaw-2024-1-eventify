const baseApiUrl = "https://9a107ea6-8a7f-4350-a4ea-4e6b0afc2dab-00-30mzjl6xfkqba.riker.replit.dev/";

var personData;

if (localStorage.getItem("user")) {
    personData = JSON.parse(localStorage.getItem("user"));

    if (personData.tipoUsuario === "promotor" || personData.tipoUsuario === "admin") {
        document.getElementById('myEventsButton').style.display = 'block';
    }
} else {
    window.location = "/codigo/index.html";
}

loadUserInfo();
loadProfileInfo();

function loadUserInfo() {
    const loggedContent = document.getElementById('logged-content');
    if (personData && personData.id) {
        if (personData.tipoUsuario === "promotor" || personData.tipoUsuario === "admin") {
            loggedContent.innerHTML = `<a href="/codigo/pages/create-edit-event.html"> <h1 class="create-event-title">Criar um evento</h1> </a>`;
        }

        document.getElementById('profilePic').innerHTML = personData.foto
            ? `<img src=${personData.foto} alt="Profile Picture" class="profile-pic">`
            : `<div class="profile-pic profile-pic-name">${personData.nome.slice(0, 1)}</div>`;

        const userPhoto = personData.foto
            ? `<img data-bs-toggle="dropdown" src=${personData.foto} alt="Foto do usuário" class="user-photo"></img>`
            : `<div data-bs-toggle="dropdown" class="user-photo">${personData.nome.slice(0, 1)}</div>`;

        loggedContent.innerHTML += `
        <div class="dropdown">
            ${userPhoto}
            <ul class="dropdown-menu">
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

function loadProfileInfo() {
    document.getElementById('event-name').value = personData.nome;
    document.getElementById('city').value = personData.cidade;
    document.getElementById('email').value = personData.email;
    document.getElementById('interests').value = personData.interesses;
}

// function editProfile() {
//     const formValue = $('#create-edit-form').serializeArray();
// }

function logout() {
    localStorage.removeItem("user");
    window.location.reload();
}