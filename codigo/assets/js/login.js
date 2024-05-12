const baseApiUrl = "https://9a107ea6-8a7f-4350-a4ea-4e6b0afc2dab-00-30mzjl6xfkqba.riker.replit.dev/";

function showSignUpForm() {
    document.getElementById('sign-in-form').style.display = "none";
    document.getElementById('sign-up-form').style.display = "flex";
}

function showSignInForm() {
    document.getElementById('sign-in-form').style.display = "flex";
    document.getElementById('sign-up-form').style.display = "none";
}

function signIn() {
    const form = document.getElementById("sign-in-form").getElementsByTagName("input");
    hasError = false;

    if (form && form.length) {
        for (let i = 0; i < form.length; i++) {
            if (!form[i].value || !form[i].value.replaceAll(" ", "")) {
                alert("Campo " + form[i].name + " é obrigatório.");
                hasError = true;
            }
        }

        if (!hasError) {
            fetch(baseApiUrl + "pessoas")
                .then(function (response) { return response.json() })
                .then(function (data) {
                    let loggedUser = data.find(person => person.login === form[0].value && person.senha === form[1].value);

                    if (loggedUser && loggedUser.id) {
                        delete loggedUser.login;
                        delete loggedUser.senha;

                        localStorage.setItem("user", JSON.stringify(loggedUser));

                        window.location = "/codigo/index.html";
                    } else {
                        alert("Usuário não encontrado!");
                    }
                })
                .catch(error => {
                    alert('Erro ao ler eventos via API JSONServer');
                });
        }
    }
}

function signUp() {
    const formValue = $('#sign-up-form').serializeArray();
    let userData = {};

    let hasError = false;
    let hasInterests = false;
    let hasTypeOfuser = false;

    if (formValue && formValue.length) {
        formValue.every(field => {
            if (field.value === '') {
                alert("O campo \"" + field.name.charAt(0).toUpperCase() + field.name.slice(1) + "\" é obrigatório.");
                hasError = true;
                return false;
            }

            if (field.name === "email" && !(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.([a-z]+))?$/i).test(field.value)) {
                alert("Favor inserir um e-mail válido.");
                hasError = true;
                return false;
            } else if (field.name === "interesses") {
                if (userData[field.name] && userData[field.name].length) {
                    userData[field.name].push(field.value);
                } else {
                    userData[field.name] = [field.value];
                }
                hasInterests = true;
            } else if (field.name === "tipoUsuario") {
                userData[field.name] = field.value;
                hasTypeOfuser = true;
            } else if (field.name !== "Repetir senha") {
                userData[field.name] = field.value;
            }

            return true;
        });

        if (!hasError && !hasInterests) alert("O campo \"Interesses\" é obrigatório.");
        if (!hasError && hasInterests && !hasTypeOfuser) alert("O campo \"Eu sou\" é obrigatório.");

        if (!hasError && hasInterests && hasTypeOfuser && userData["senha"] !== userData["repetirSenha"]) {
            alert("As senhas devem ser iguais.");
            hasError = true;
        }

        if (!hasError && hasInterests && hasTypeOfuser && userData) {
            fetch(baseApiUrl + "pessoas")
                .then(function (response) { return response.json() })
                .then(function (data) {
                    let registeredUser = data.find(person => person.login === userData.login);

                    if (registeredUser && registeredUser.id) {
                        alert("Já existe um usuário cadastrado com esse login.");
                    } else {
                        userData.id = generateUUID();
                        userData.foto = "";
                        userData.eventosFavoritos = [];
                        userData.eventosCriados = [];

                        delete userData.repetirSenha;

                        // Cria o novo usuário
                        fetch(baseApiUrl + "pessoas", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(userData),
                        })
                            .then(function (response) { return response.json() })
                            .then(function (data) {
                                delete userData.login;
                                delete userData.senha;

                                localStorage.setItem("user", JSON.stringify(userData));

                                window.location = "/codigo/index.html";
                            })
                            .catch(error => {
                                alert('Erro ao criar usuário via API JSONServer.');
                            });
                    }
                })
                .catch(error => {
                    alert('Erro ao ler eventos via API JSONServer');
                });
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