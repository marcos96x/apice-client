$("#usuario_cpf").blur(function () {
  let cpf = $("#usuario_cpf").val().replace(".", "").replace(".", "").replace("-", "");
  if (!TestaCPF(cpf)) {
    $("#usuario_cpf").val("").focus();
    $.toast({
      heading: "CPF Inválido",
      text: "Insira um cpf válido",
      icon: "danger",
      loader: true, // Change it to false to disable loader
      loaderBg: "#ff0000", // To change the background
    });
  }
});

$("#usuario_nome").blur(function () {
  let nome = $("#usuario_nome").val();
  if (!validaNome(nome)) {
    $("#usuario_nome").val("").focus();
    $.toast({
      heading: "Nome Inválido",
      text: "Seu nome é Inválido",
      icon: "danger",
      loader: true, // Change it to false to disable loader
      loaderBg: "#ff0000", // To change the background
    });
  }
});

$("#usuario_nascimento").blur(function () {
  let strdata = $("#usuario_nascimento").val()
  if (!validaData(strdata)) {
    $("#usuario_nascimento").val("").focus();
    $.toast({
      heading: "Data de Nascimento Inválida",
      text: "Sua data de nascimento é inválida",
      icon: "danger",
      loader: true, // Change it to false to disable loader
      loaderBg: "#ff0000", // To change the background
    });
  }
});

$("#usuario_email").blur(function () {
  let email = $("#usuario_email").val();
  if (!validaEmail(email)) {
    $("#usuario_email").val("").focus();
    $.toast({
      heading: "email Inválido",
      text: "seu E-mail é inválido",
      icon: "danger",
      loader: true, // Change it to false to disable loader
      loaderBg: "#ff0000", // To change the background
    });
  }
});

function cadastrar() {
  // Validação campos vazios
  let validator = true;
  let idCampoVazio = "";
  $(".input").each(function () {
    if ($(this).val().trim() == "") {
      validator = false;
      idCampoVazio = $(this).attr("id");
      return false;
    }
  });

  if (!validator) {
    $.toast({
      heading: "Campo obrigatório inválido!",
      text: "Preencha o campo obrigatório",
      icon: "danger",
      loader: true, // Change it to false to disable loader
      loaderBg: "#ff0000", // To change the background
    });
    $("#" + idCampoVazio).focus();
  } else if (
    $("#usuario_senha").val().trim() !=
    $("#usuario_confirma_senha").val().trim()
  ) {
    $.toast({
      heading: "Senhas diferentes!",
      text: "Suas senhas não estão iguais",
      icon: "danger",
      loader: true, // Change it to false to disable loader
      loaderBg: "#ff0000", // To change the background
    });
  } else {
    // cadastra
    let dados = [];
    $(".input").each(function () {
      if ($(this).attr("id") != "usuario_confirma_senha") {
        dados.push($(this).val().trim());
      }
    });
    console.log(dados);
    let url = baseUri + "/register";
    let data = {
      usuario: {
        login: dados[5],
        senha: dados[6],
        nome: dados[0],
        cpf: dados[2],
        nascimento: dados[1],
        telefone: dados[3],
        email: dados[4],
      },
    };
    $.ajax({
      url: url,
      method: "post",
      contentType: "application/JSON",
      data: JSON.stringify(data),
    }).done((res) => {
      console.log(res);
      if (res.err != undefined) {
        // show erro
        $.toast({
          heading: "Erro de cadastro!",
          text: res.err,
          icon: "danger",
          loader: true, // Change it to false to disable loader
          loaderBg: "#ff0000", // To change the background
        });
      } else {
        localStorage.setItem("apiceToken", res.token);
        localStorage.setItem("apiceId", res.id);
        if (res.perm == "cliente") {
          window.location.href = "perfil_cliente.html";
        } else if (res.perm == "prestador") {
          window.location.href = "perfil_prestador.html";
        } else if (res.perm == "admin") {
          window.location.href = "perfil_admin.html";
        }
      }
    });
  }
}
