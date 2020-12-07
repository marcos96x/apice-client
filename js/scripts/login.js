$(".form")
  .find("input, textarea")
  .on("keyup blur focus", function (e) {
    var $this = $(this),
      label = $this.prev("label");

    if (e.type === "keyup") {
      if ($this.val() === "") {
        label.removeClass("active highlight");
      } else {
        label.addClass("active highlight");
      }
    } else if (e.type === "blur") {
      if ($this.val() === "") {
        label.removeClass("active highlight");
      } else {
        label.removeClass("highlight");
      }
    } else if (e.type === "focus") {
      if ($this.val() === "") {
        label.removeClass("highlight");
      } else if ($this.val() !== "") {
        label.addClass("highlight");
      }
    }
  });

$(".tab a").on("click", function (e) {
  e.preventDefault();

  $(this).parent().addClass("active");
  $(this).parent().siblings().removeClass("active");

  target = $(this).attr("href");

  $(".tab-content > div").not(target).hide();

  $(target).fadeIn(600);
});

function login() {
  let login = $("#login").val().trim();
  let senha = $("#senha").val().trim();

  if (login == "")
    $.toast({
      heading: "Login inválido!",
      text: "Preencha o campo obrigatório",
      icon: "danger",
      loader: true, // Change it to false to disable loader
      loaderBg: "#ff0000", // To change the background
    });
  else if (senha == "")
    $.toast({
      heading: "Senha inválida!",
      text: "Preencha o campo obrigatório",
      icon: "danger",
      loader: true, // Change it to false to disable loader
      loaderBg: "#ff0000", // To change the background
    });
  else {
    let url = baseUri + "/login";
    let data = {
      usuario: {
        login: login,
        senha: senha,
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
          heading: "Erro de login",
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
