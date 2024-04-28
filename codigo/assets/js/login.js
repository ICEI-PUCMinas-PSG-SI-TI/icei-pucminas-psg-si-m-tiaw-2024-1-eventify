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
        for(let i = 0; i < form.length; i++) {
            if (!form[i].value || !form[i].value.replaceAll(" ", "")) {
                alert("Campo " + form[i].name + " é obrigatório.");
                hasError = true;
            }
        }

        if (!hasError) {
            //Sign-in
        }
    }
}

function signUp() {
    const form = document.getElementById("sign-up-form").getElementsByTagName("input");
    hasError = false;
    hasInterrest = false;
    hasTypeOfUser = false;

    console.log(form)
    if (form && form.length) {
        for(let i = 0; i < form.length; i++) {
            if (!form[i] || !form[i].value || !form[i].value.replaceAll(" ", "")) {
                alert("Campo " + form[i].name + " é obrigatório.");
                hasError = true;
                i = form.length;
            } else if(form[i].name === "Repetir senha" && form[i - 1] && form[i].value !== form[i - 1].value) {
                alert("As senhas devem ser iguais.");
                hasError = true;
                i = form.length;
            } else if(form[i].name === "Interesses" && form[i].checked) {
                hasInterrest = true;
            } else if(form[i].name === "Eu sou" && form[i].checked) {
                hasTypeOfUser = true;
            }
        }

        if(!hasError && !hasInterrest) alert("O campo \"Interesses\" é obrigatório.");
        if(!hasError && hasInterrest && !hasTypeOfUser) alert("O campo \"Eu sou\" é obrigatório.");

        if (!hasError && hasInterrest && hasTypeOfUser) {
            //Sign-up
        }
    }
}