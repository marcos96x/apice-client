function login() {
    $("#errorLogin").hide();
    $("#errorSenha").hide();
    let login = $("#login").val().trim();
    let senha = $("#senha").val().trim();

    if (login == '')
        $("#errorLogin").show();
    else if (senha == '')
        $("#errorSenha").show();
    else {
        let url = baseUri + "/login"
        let data = {
            usuario: {
                login: login,
                senha: senha
            }
        }
        $.ajax({
            url: url,
            method: 'post',
            contentType: 'application/JSON',
            data: JSON.stringify(data)
        }).done(res => {
            console.log(res)
            if (res.err != undefined) {
                // show erro
                $.toast({
                    heading: 'Erro de login',
                    text: res.err,
                    icon: 'danger',
                    loader: true,        // Change it to false to disable loader
                    loaderBg: "#ff0000"  // To change the background
                })
            } else {
                localStorage.setItem('apiceToken', res.token)
                localStorage.setItem('apiceId', res.id)
                if (res.perm == 'cliente') {
                    window.location.href = "perfil_cliente.html"
                } else if (res.perm == 'prestador') {
                    window.location.href = "perfil_prestador.html"
                } else if (res.perm == 'admin') {
                    window.location.href = "perfil_admin.html"
                }
            }
        })
    }
}