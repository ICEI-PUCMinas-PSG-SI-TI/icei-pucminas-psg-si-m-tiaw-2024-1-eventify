const baseApiUrl = "/";

var isFirstLoad = true;
var personData;
var editType;
var eventImageBase64;

if (localStorage.getItem("user")) {
    personData = JSON.parse(localStorage.getItem("user"));

    if (personData.tipoUsuario === "promotor" || personData.tipoUsuario === "admin") {
        document.getElementById('myEventsButton').style.display = 'block';
    }
} else {
    window.location = "/index.html";
}

loadUserInfo();
loadProfileInfo();

function loadUserInfo() {


    const loggedContent = document.getElementById('logged-content');
    if (personData && personData.id) {
        if (personData.tipoUsuario === "promotor" || personData.tipoUsuario === "admin") {
            loggedContent.innerHTML = `<a href="/pages/create-edit-event.html"> <h1 class="create-event-title">Criar um evento</h1> </a>`;
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
                ${personData.tipoUsuario === "promotor" || personData.tipoUsuario === "admin" ? '<li><a class="dropdown-item" href="/pages/create-edit-event.html">Criar evento</a></li>' : ''}
                <li style="cursor: pointer;" class="dropdown-item" onClick="logout()">Sair</li>
            </ul>
        </div>`;
    } else {
        loggedContent.innerHTML = `<a href="/pages/login.html"><button class="sign-in-button">Entrar / Cadastrar</button></a>`;
    }
}

function loadProfileInfo() {
    if(isFirstLoad) {
        document.getElementById('perfilEsquerda').style.display = "none";
        document.getElementById('dados').style.display = "none";
        document.getElementById('loadSpinner').style.display = "flex";
    }

    editType = "";

    document.getElementById('divName').style.display = 'block';
    document.getElementById('event-name').disabled = true;
    document.getElementById('event-name').value = personData.nome;

    document.getElementById('divCity').style.display = 'block';
    document.getElementById('city').disabled = true;
    document.getElementById('city').value = personData.cidade;

    document.getElementById('divEmail').style.display = 'block';
    document.getElementById('email').value = personData.email;

    document.getElementById('divInterests').style.display = 'block';
    document.getElementById('interests').value = personData.interesses;

    document.getElementById('interestElements').style.display = "none";

    const interestsCheck = document.getElementsByClassName('check-form-button');
    if (personData.interesses && personData.interesses.length &&
        interestsCheck && interestsCheck.length
    ) {
        for (let i = 0; i < interestsCheck.length; i++) {
            if (interestsCheck[i] &&
                personData.interesses.some(interesse => interesse === interestsCheck[i].children.interesses.value)
            ) {
                interestsCheck[i].children.interesses.checked = true;
            }
        }
    }

    document.getElementById('saveMyProfile').style.display = 'none';
    document.getElementById('cancelEditProfile').style.display = 'none';

    document.getElementById('divPassword').style.display = 'none';
    document.getElementById('password').value = '';

    document.getElementById('divNewPassword').style.display = 'none';
    document.getElementById('newPassword').value = '';

    document.getElementById('divNewPasswordconfirm').style.display = 'none';
    document.getElementById('newPasswordconfirm').value = '';

    document.getElementById('editMyProfile').style.display = 'block';
    document.getElementById('editMyPassword').style.display = 'block';

    document.getElementById('updatePhoto').style.display = "none";
    document.getElementById('updatePhotoInput').value = "";
    eventImageBase64 = "";

    if(isFirstLoad) {
        document.getElementById('perfilEsquerda').style.display = "block";
        document.getElementById('dados').style.display = "block";
        document.getElementById('loadSpinner').style.display = "none";
    }
}

function editProfile(event) {
    if (event && event.target && event.target.id) {
        document.getElementById('editMyProfile').style.display = 'none';
        document.getElementById('editMyPassword').style.display = 'none';
        document.getElementById('divInterests').style.display = 'none';
        document.getElementById('divEmail').style.display = 'none';
        document.getElementById('saveMyProfile').style.display = 'block';
        document.getElementById('cancelEditProfile').style.display = 'block';

        if (event.target.id === "editMyProfile") {
            editType = "profile";

            document.getElementById('event-name').disabled = false;
            document.getElementById('city').disabled = false;
            document.getElementById('updatePhoto').style.display = "flex";
            document.getElementById('interestElements').style.display = "flex";
        } else if (event.target.id === "editMyPassword") {
            editType = "password";

            document.getElementById('divName').style.display = 'none';
            document.getElementById('divCity').style.display = 'none';
            document.getElementById('divPassword').style.display = 'block';
            document.getElementById('divNewPassword').style.display = 'block';
            document.getElementById('divNewPasswordconfirm').style.display = 'block';
        }
    }
}

function saveProfile(el) {
    if (editType === "profile") {
        const tempName = document.getElementById('event-name').value;
        const tempCity = document.getElementById('city').value;

        let tempInterests = [];
        const interestsCheck = document.getElementsByClassName('check-form-button');
        for (let i = 0; i < interestsCheck.length; i++) {
            if (interestsCheck[i] && interestsCheck[i].children.interesses.checked) {
                tempInterests.push(interestsCheck[i].children.interesses.value);
            }
        }

        if (!tempName) {
            alert("Nome é obrigatório.");
        } else if (!tempCity) {
            alert("Cidade é obrigatória.");
        } else if (!tempInterests || !tempInterests.length) {
            alert("Interesses são obrigatórios.");
        } else {
            el.innerHTML = `
                <div class="spinner-border text-light" role="status" style="margin-top: 4px;">
                    <span class="sr-only">Loading...</span>
                </div>
            `;

            fetch(baseApiUrl + "pessoas/" + personData.id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "nome": tempName,
                    "cidade": tempCity,
                    "interesses": tempInterests,
                    "foto": eventImageBase64 || personData.foto
                })
            })
                .then(function (response) { return response.json() })
                .then(function (data) {
                    personData = data;
                    delete personData.login;
                    delete personData.senha;

                    localStorage.setItem("user", JSON.stringify(personData));
                    
                    window.location.reload();
                })
                .catch(error => {
                    el.innerHTML = "Salvar";
                    alert("Não foi possível atualizar seu perfil");
                });
        }
    } else if (editType === "password") {
        const senhaAtualDig = document.getElementById('password').value;
        const senhaNova = document.getElementById('newPassword').value;
        const senhaNovaConfirmacao = document.getElementById('newPasswordconfirm').value;

        if (!senhaAtualDig) {
            alert("Senha atual é obrigatória.");
        } else if (!senhaNova) {
            alert("Nova senha é obrigatória.");
        } else if (!senhaNovaConfirmacao) {
            alert("Repetir senha é obrigatória.");
        } else if (senhaNova !== senhaNovaConfirmacao) {
            alert("A nova senha deve ser igual a senha repetida.");
        } else {
            el.innerHTML = `
                <div class="spinner-border text-light" role="status" style="margin-top: 4px;">
                    <span class="sr-only">Loading...</span>
                </div>
            `;

            fetch(baseApiUrl + "pessoas/" + personData.id)
                .then(function (response) { return response.json() })
                .then(function (data) {
                    if (data.senha === senhaAtualDig) {
                        fetch(baseApiUrl + "pessoas/" + personData.id, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                "senha": senhaNova
                            }),
                        })
                            .then(function (response) { return response.json() })
                            .then(function (data) {
                                el.innerHTML = "Salvar";
                                alert("Senha atualizada com sucesso!");
                                loadProfileInfo();
                            })
                            .catch(error => {
                                el.innerHTML = "Salvar";
                                alert('Erro ao ler eventos via API JSONServer');
                            });
                    } else {
                        el.innerHTML = "Salvar";
                        alert("A senha atual está incorreta!");
                    }
                })
                .catch(error => {
                    el.innerHTML = "Salvar";
                    alert('Erro ao ler eventos via API JSONServer');
                });
        }
    }
}

function savePassword() {
    var senhaAtualJS = personData.password;


    if (senhaAtualJS === senhaAtualDig) {
        if (senhaNova && senhaNova === senhaNovaConfirmacao) {
            personData.password = senhaNova;
            localStorage.setItem('user', JSON.stringify(personData));
            alert('Senha alterada com sucesso!');
            window.location.href = 'profile.html'; // Redireciona para profile.html
        } else {
            alert('Nova senha e confirmação não correspondem ou estão vazias.');
        }
    } else {
        alert('Credenciais inválidas');
    }
    document.getElementById('saveMyPassword').style.display = 'none';
}

function logout() {
    localStorage.removeItem("user");
    window.location.reload();
}

function readFile(el) {
    if (!el.files || !el.files[0]) return;

    const FR = new FileReader();
    FR.addEventListener("load", function (evt) {
        eventImageBase64 = evt.target.result;
    });

    FR.readAsDataURL(el.files[0]);
}