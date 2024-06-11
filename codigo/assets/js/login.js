const baseApiUrl = "https://cc0057ba-73b9-4881-9d22-2136c991d8eb-00-2jwqq3dx7jht6.spock.replit.dev/";

function cnpjMask(el) {
    if ((el.value.length === 3 || el.value.length === 7)) {
        if (el.value.slice(-1) !== '.' && !(/[0-9]/g).test(el.value.slice(-1))) el.value = el.value.slice(0, el.value.length - 1);
    } else if (el.value.length === 11) {
        if (el.value.slice(-1) !== '/' && !(/[0-9]/g).test(el.value.slice(-1))) el.value = el.value.slice(0, el.value.length - 1);
    } else if (el.value.length === 16) {
        if (el.value.slice(-1) !== '-' && !(/[0-9]/g).test(el.value.slice(-1))) el.value = el.value.slice(0, el.value.length - 1);
    } else if (!(/[0-9]/g).test(el.value.slice(-1))) {
        el.value = el.value.slice(0, el.value.length - 1);
    }

    el.value = el.value
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
}

function showSignUpForm() {
    document.getElementById('sign-in-form').style.display = "none";
    document.getElementById('sign-up-form').style.display = "flex";
}

function showSignInForm() {
    document.getElementById('sign-in-form').style.display = "flex";
    document.getElementById('sign-up-form').style.display = "none";
}

function changeUserType(name) {
    const interestsElements = document.getElementById('interest-elements');
    if (interestsElements.style.display === 'none') interestsElements.style.display = 'flex';

    document.getElementById('cnpj-elements').style.display = name === "user" ? "none" : "flex";

    document.getElementById('interest-label').innerHTML = name === "user" ? "Interesses *" : "Tipos de evento *";
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
            document.getElementById('signInButton').innerHTML = `<div class="loader"></div>`;

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
                        document.getElementById('signInButton').innerHTML = "Entrar";
                        alert("Usuário não encontrado!");
                    }
                })
                .catch(error => {
                    document.getElementById('signInButton').innerHTML = "Entrar";
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

    if (formValue && formValue.length) {
        const userType = formValue.find(el => el.name === 'tipoUsuario');

        if (!userType || !userType.value) {
            alert("O campo \"Eu sou\" é obrigatório.");
            return;
        }

        formValue.every(field => {
            if (field.value === '') {
                if (field.name !== 'cnpj' || (field.name === 'cnpj' && userType.value === 'promotor')) {
                    alert("O campo \"" + field.name.charAt(0).toUpperCase() + field.name.slice(1) + "\" é obrigatório.");
                    hasError = true;
                    return false;
                }
            }

            if (field.name === "email" && !(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.([a-z]+))?$/i).test(field.value)) {
                alert("Favor inserir um e-mail válido.");
                hasError = true;
                return false;
            } else if (userType.value === 'promotor' && field.name === "cnpj" && !validarCNPJ(field.value)) {
                alert("Favor inserir um CNPJ válido.");
                hasError = true;
                return false;
            } else if (field.name === "interesses") {
                if (userData[field.name] && userData[field.name].length) {
                    userData[field.name].push(field.value);
                } else {
                    userData[field.name] = [field.value];
                }
                hasInterests = true;
            } else if (field.name !== "Repetir senha") {
                userData[field.name] = field.value;
            }

            return true;
        });

        if (!hasError && !hasInterests) {
            if (userType.value === 'promotor') alert("O campo \"Tipos de evento\" é obrigatório.");
            else alert("O campo \"Interesses\" é obrigatório.");
        }

        if (!hasError && hasInterests && userData["senha"] !== userData["repetirSenha"]) {
            alert("As senhas devem ser iguais.");
            hasError = true;
        }

        if (!hasError && hasInterests && userData) {
            document.getElementById('signUpButton').innerHTML = `<div class="loader"></div>`;

            fetch(baseApiUrl + "pessoas?login=" + userData.login)
                .then(function (response) { return response.json() })
                .then(function (data) {
                    if (data && data.length) {
                        alert("Já existe um usuário cadastrado com esse login.");
                    } else if (userType.value === 'promotor') {
                        fetch(baseApiUrl + "checkCnpj?cnpj=" + userData.cnpj.replace(/[^\d]/g, ""))
                            .then(function (response) { return response.json() })
                            .then(function (data) {
                                if (data.situacao === "ATIVA" && data.atividade_principal) {
                                    createUser(userData);
                                } else {
                                    document.getElementById('signUpButton').innerHTML = "Cadastrar";
                                    alert('CNPJ inválido.');
                                }
                            })
                            .catch(error => {
                                document.getElementById('signUpButton').innerHTML = "Cadastrar";
                                alert('Erro ao criar procurar por CNPJ.');
                            });
                    } else {
                        createUser(userData);
                    }
                })
                .catch(error => {
                    document.getElementById('signUpButton').innerHTML = "Cadastrar";
                    alert('Erro ao ler eventos via API JSONServer');
                });
        }
    }
}

function createUser(userData) {
    userData.id = generateUUID();
    userData.login = userData.email;
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
            document.getElementById('signInButton').innerHTML = "Cadastrar";
            alert('Erro ao criar usuário via API JSONServer.');
        });
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

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj == '' || cnpj.length != 14) return false;

    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) return false;

    return true;
}