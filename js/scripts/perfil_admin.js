// variaveis do sistema
const id = localStorage.getItem('apiceId');
const token = localStorage.getItem('apiceToken');
var blog_id = null;
var procedimento_id = null;
var prestador_id = null;
var usuario_id = null;

$(document).ready(function () {
    if (!localStorage.getItem('apiceId') && !localStorage.getItem('apiceIToken')) {
        localStorage.clear()
        window.location.replace("login.html");
    }
    // esconde todas as telas
    $(".telas").hide();
    // mostra a tela de procedimentos inicialmente
    $("#divDashboard").show();
    getUser()
    getProcedimentos()
    getClientes()
    getPrestadores()
    getBlog()
    $('#procedimentosTable').DataTable({
        language: {
            "emptyTable": "Nenhum registro encontrado",
            "info": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "infoEmpty": "Mostrando 0 até 0 de 0 registros",
            "infoFiltered": "(Filtrados de _MAX_ registros)",
            "infoThousands": ".",
            "lengthMenu": "_MENU_ resultados por página",
            "loadingRecords": "Carregando...",
            "processing": "Processando...",
            "zeroRecords": "Nenhum registro encontrado",
            "search": "Pesquisar",
            "paginate": {
                "next": "Próximo",
                "previous": "Anterior",
                "first": "Primeiro",
                "last": "Último"
            },
            "aria": {
                "sortAscending": ": Ordenar colunas de forma ascendente",
                "sortDescending": ": Ordenar colunas de forma descendente"
            },
            "select": {
                "rows": {
                    "_": "Selecionado %d linhas",
                    "0": "Nenhuma linha selecionada",
                    "1": "Selecionado 1 linha"
                }
            },
            "buttons": {
                "copy": "Copiar para a área de transferência",
                "copyTitle": "Cópia bem sucedida",
                "copySuccess": {
                    "1": "Uma linha copiada com sucesso",
                    "_": "%d linhas copiadas com sucesso"
                }
            }
        }
    });


});

function getUser() {
    if (!localStorage.getItem('apiceToken')) {
        localStorage.clear()
        window.location.replace("login.html");
    }

    let url = baseUri + "/getUser";
    let data = {
        usuario: {
            id: id,
            token: localStorage.getItem('apiceToken')
        },
        token: token
    }
    $.ajax({
        url: url,
        method: 'post',
        contentType: 'application/JSON',
        data: JSON.stringify(data)
    }).done(res => {
        console.log(res)
        if (res.err != undefined) {
            localStorage.clear()
            window.location.replace("login.html");
        } else {
            $("#usuarioNome").html(res.usuario.usuario_nome)
        }
    })
}

function getProcedimentos() {    

    let url = baseUri + "/procedimento";
    $.ajax({
        url: url,
        method: 'GET',
        contentType: 'application/JSON'
    }).done(res => {
        console.log(res)
        let procedimentos = res.procedimentos;
        $("#linhasProcedimentos").html('');
        if (procedimentos.length > 0) {
            procedimentos.map(procedimento => {
                if(procedimento.procedimento_status == 1) {
                    button = `<button class="btn btn-warning btn-sm" onclick="showChangeStatusProcedimento('0', '${procedimento.procedimento_id}')">Desativar</button>`;
                } else {
                    button = `<button class="btn btn-success btn-sm" onclick="showChangeStatusProcedimento('1', '${procedimento.procedimento_id}')">Ativar</button>`;
                }
                $("#linhasProcedimentos").append(`
                <tr>
                <td>${procedimento.procedimento_titulo}</td>
                <td>${procedimento.procedimento_tipo_nome}</td>
                <td>${procedimento.procedimento_status_nome}</td>
                <td>${procedimento.usuario_nome}</td>
                <td>
                  <button class="btn btn-primary btn-sm" onclick="showEditProcedimento(${procedimento.procedimento_id}, '${procedimento.procedimento_titulo}', '${procedimento.procedimento_desc}', '${procedimento.procedimento_tipo}', '${procedimento.procedimento_cliente}')">Editar</button>
                  ${button}
                  <button class="btn btn-danger btn-sm" onclick="showRemoveProcedimento(${procedimento.procedimento_id})">Remover</button>
                </td>
                </tr>
                `)
            })
        }
    })
}

function showChangeStatusProcedimento(status, id) {
    $.ajax({
        url: baseUri + "/procedimento",
        method: "PUT",
        contentType: "application/JSON",
        data: JSON.stringify({
            procedimento: {
                procedimento_status: status,
                procedimento_id: id
            }
        }),
    }).done((res) => {
        console.log(res);
        if (res.err != undefined) {
            // show erro
            $.toast({
                heading: "Erro ao alterar status",
                text: res.err,
                icon: "danger",
                loader: true, // Change it to false to disable loader
                loaderBg: "#ff0000", // To change the background
            });
        } else {
            $.toast({
                heading: "Status alterado com sucesso!",
                text: res.err,
                icon: "success",
                loader: true, // Change it to false to disable loader
                loaderBg: "#00ff00", // To change the background
            });            
            
            getProcedimentos();
        }
    });
}

function showRemoveProcedimento(id) {
    $('#modalRemoveProcedimento').modal('show');
    procedimento_id = id;
}

function showAddProcedimento() {
    procedimento_id = null;
    $('#modalAddProcedimento').modal('show')
    $("#procedimento_titulo").val('');
    $("#procedimento_desc").val('');
    $("#procedimento_tipo").val('').trigger('change');
    $("#procedimento_cliente").val('').trigger('change');
}

function showEditProcedimento(id, titulo, desc, tipo, cliente) {
    procedimento_id = id;
    $("#procedimento_titulo").val(titulo);
    $("#procedimento_desc").val(desc);
    $("#procedimento_tipo").val(tipo).trigger('change');
    $("#procedimento_cliente").val(cliente).trigger('change');
    $('#modalAddProcedimento').modal('show');
}

function removeProcedimento() {
    if (procedimento_id != null) {
        $.ajax({
            url: baseUri + "/procedimento",
            method: "DELETE",
            contentType: 'application/JSON',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token)
            },
            data: JSON.stringify({
                procedimento: {
                    procedimento_id: procedimento_id
                }
            })
        }).done(res => {
            if (res.err == undefined) {
                $("#modalRemoveProcedimento").modal('hide');
                $.toast({
                    heading: "Procedimento removido com sucesso!",
                    text: "",
                    icon: "danger",
                    loader: true, // Change it to false to disable loader
                    loaderBg: "#00FF00", // To change the background
                });
                getProcedimentos();
            } else {
                $.toast({
                    heading: "Erro ao remover procedimento",
                    text: "",
                    icon: "danger",
                    loader: true, // Change it to false to disable loader
                    loaderBg: "#00FF00", // To change the background
                });
            }

        })
    }
}

function getClientes() {
    if (!localStorage.getItem('apiceId') && !localStorage.getItem('apiceIToken')) {
        localStorage.clear()
        window.location.replace("login.html");
    }

    let url = baseUri + "/user";
    $.ajax({
        url: url,
        method: 'GET',
        contentType: 'application/JSON'
    }).done(res => {
        console.log(res)
        let usuarios = res.usuarios;
        if (res.err == undefined) {
            $("#linhasClientes").html('');
            var button;
            if (usuarios.length > 0) {
                usuarios.map(usuario => {
                    
                    if(usuario.usuario_status == 1) {
                        button = `<button class="btn btn-warning btn-sm" onclick="showChangeStatusCliente('0', '${usuario.usuario_id}')">Desativar</button>`;
                    } else {
                        button = `<button class="btn btn-success btn-sm" onclick="showChangeStatusCliente('1', '${usuario.usuario_id}')">Ativar</button>`;
                    }
                    $("#linhasClientes").append(`
                    <tr>
                    <td>${usuario.usuario_nome}</td>
                    <td>${usuario.usuario_ficha}</td>
                    <td>${usuario.usuario_status_nome}</td>
                    <td>${usuario.usuario_procedimentos}</td>
                    <td>
                      <button class="btn btn-primary btn-sm" onclick="showEditCliente(${usuario.usuario_id}, '${usuario.usuario_nome}', '${usuario.usuario_ficha}', '${usuario.usuario_cpf}', '${usuario.usuario_nascimento}', '${usuario.usuario_telefone}')">Editar</button>
                      ${button}
                      <button class="btn btn-danger btn-sm" onclick="showRemoverCliente(${usuario.usuario_id})">Remover</button>
                    </td>
                    </tr>
                    `)
                })
            }
        }

    })
}

function setCliente() {
    // Validação campos vazios
    let validator = true;
    let idCampoVazio = "";
    $(".inputCliente").each(function () {
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
    } 
    
    else if (
        $("#usuario_ficha").val().trim() === $(this).attr("id")) {
        $.toast({
          heading: "Senhas diferentes!",
          text: "Suas senhas não estão iguais",
          icon: "danger",
          loader: true, // Change it to false to disable loader
          loaderBg: "#ff0000", // To change the background
        });
      }else {
      // cadastra
      let dados = [];
      $(".inputCliente").each(function () {
        if ($(this).attr("id") != "usuario_confirma_senha") {
          dados.push($(this).val().trim());
        }
      });
      console.log(dados);
      let url = baseUri + "/register";
      let data = {
        usuario: {
          login: dados[6],
          senha: dados[7],
          nome: dados[0],
          cpf: dados[2],
          nascimento: dados[3],
          telefone: dados[4],
          email: dados[5],
          ficha: dados[1],
        },
      };
      let method = 'POST';
        let msg = "Cadastro";
        if(usuario_id != null) {
            if($("#usuario_senha").val() == '') {
                data.usuario.usuario_senha = undefined;
            }
            data.usuario.usuario_id = usuario_id;
            method = 'PUT';
            msg = "Alteração";
            url = baseUri + "/user"
        }
        $.ajax({
            url: url,
            method: method,
            contentType: "application/JSON",
            data: JSON.stringify(data),
        }).done((res) => {
            console.log(res);
            if (res.err != undefined) {
                // show erro
                $.toast({
                    heading: "Erro de "+msg+"!",
                    text: res.err,
                    icon: "danger",
                    loader: true, // Change it to false to disable loader
                    loaderBg: "#ff0000", // To change the background
                });
            } else {
                $.toast({
                    heading: msg + " realizado com sucesso!",
                    text: res.err,
                    icon: "success",
                    loader: true, // Change it to false to disable loader
                    loaderBg: "#00ff00", // To change the background
                });
                $("#modalAddCliente").modal('hide')
                $(".inputCliente").val('')
                getClientes();
            }
        });
    }
}
  function showRemoverCliente(id) {
    $('#modalRemoveCliente').modal('show');
    usuario_id = id;
} 

  function removeCliente() {
    if (usuario_id != null) {
        $.ajax({
            url: baseUri + "/user",
            method: "DELETE",
            contentType: 'application/JSON',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token)
            },
            data: JSON.stringify({
                usuario: {
                    usuario_id: usuario_id
                }
            })
        }).done(res => {
            if (res.err == undefined) {
                $("#modalRemoveCliente").modal('hide');
                $.toast({
                    heading: "Cliente removido com sucesso!",
                    text: "",
                    icon: "danger",
                    loader: true, // Change it to false to disable loader
                    loaderBg: "#00FF00", // To change the background
                });
                $("#modalRemoveCliente").modal('hide')
                getClientes();
            } else {
                $.toast({
                    heading: "Erro ao remover cliente",
                    text: "",
                    icon: "danger",
                    loader: true, // Change it to false to disable loader
                    loaderBg: "#00FF00", // To change the background
                });
            }

        })
    }
}

function showChangeStatusCliente(status, id) {
    $.ajax({
        url: baseUri + "/user",
        method: "PUT",
        contentType: "application/JSON",
        data: JSON.stringify({
            usuario: {
                usuario_status: status,
                usuario_id: id
            }
        }),
    }).done((res) => {
        console.log(res);
        if (res.err != undefined) {
            // show erro
            $.toast({
                heading: "Erro ao alterar status",
                text: res.err,
                icon: "danger",
                loader: true, // Change it to false to disable loader
                loaderBg: "#ff0000", // To change the background
            });
        } else {
            $.toast({
                heading: "Status alterado com sucesso!",
                text: res.err,
                icon: "success",
                loader: true, // Change it to false to disable loader
                loaderBg: "#00ff00", // To change the background
            });            
            
            getClientes();
        }
    });
}

function showAddCliente() {
    $(".inputCliente").val('');
    $('#modalAddCliente').modal('show');
    usuario_id = null;
}

function showEditCliente(id, nome, cpf, nascimento, email, telefone, ficha) {
    
    $('#modalAddCliente').modal('show');
    usuario_id = id;
    $("#usuario_nome").val(nome);
    $("#usuario_ficha").val(ficha);
    $("#usuario_cpf").val(cpf);
    $("#usuario_nascimento").val(nascimento);
    $("#usuario_telefone").val(telefone);
    $("#usuario_email").val(email);
    

}
  

function getPrestadores() {
    if (!localStorage.getItem('apiceId') && !localStorage.getItem('apiceIToken')) {
        localStorage.clear()
        window.location.replace("login.html");
    }

    let url = baseUri + "/getPrestadores";
    $.ajax({
        url: url,
        method: 'GET',
        contentType: 'application/JSON'
    }).done(res => {
        console.log(res)
        let prestadores = res.prestadores;
        if (res.err == undefined) {
            $("#linhasPrestadores").html('');
            var button;
            if (prestadores.length > 0) {
                prestadores.map(prestador => {
                    
                    if(prestador.usuario_status == 1) {
                        button = `<button class="btn btn-warning btn-sm" onclick="showChangeStatusPrestador('0', '${prestador.usuario_id}')">Desativar</button>`;
                    } else {
                        button = `<button class="btn btn-success btn-sm" onclick="showChangeStatusPrestador('1', '${prestador.usuario_id}')">Ativar</button>`;
                    }
                    $("#linhasPrestadores").append(`
                    <tr>
                    <td>${prestador.usuario_nome}</td>
                    <td>${prestador.usuario_email}</td>
                    <td>${prestador.usuario_status_nome}</td>
                    <td>
                      <button class="btn btn-primary btn-sm" onclick="showEditPrestador(${prestador.usuario_id}, '${prestador.usuario_nome}', '${prestador.usuario_email}', '${prestador.usuario_tipo}', '${prestador.usuario_login}')">Editar</button>
                      ${button}
                      <button class="btn btn-danger btn-sm" onclick="showRemoverPrestador(${prestador.usuario_id})">Remover</button>
                    </td>
                    </tr>
                    `)
                })
            }
        }

    })
}

function showRemoverPrestador(id) {
    $('#modalRemovePrestador').modal('show');
    prestador_id = id;
}

function removePrestador() {
    if (prestador_id != null) {
        $.ajax({
            url: baseUri + "/user",
            method: "DELETE",
            contentType: 'application/JSON',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token)
            },
            data: JSON.stringify({
                usuario: {
                    usuario_id: prestador_id
                }
            })
        }).done(res => {
            if (res.err == undefined) {
                $("#modalRemovePrestador").modal('hide');
                $.toast({
                    heading: "Prestador removido com sucesso!",
                    text: "",
                    icon: "danger",
                    loader: true, // Change it to false to disable loader
                    loaderBg: "#00FF00", // To change the background
                   
                }
                ); 

                getPrestadores()
            } else {
                $.toast({
                    heading: "Erro ao remover prestador",
                    text: "",
                    icon: "danger",
                    loader: true, // Change it to false to disable loader
                    loaderBg: "#00FF00", // To change the background
                });
            }
           
        })
    }
}

function showChangeStatusPrestador(status, id) {
    $.ajax({
        url: baseUri + "/user",
        method: "PUT",
        contentType: "application/JSON",
        data: JSON.stringify({
            usuario: {
                usuario_status: status,
                usuario_id: id
            }
        }),
    }).done((res) => {
        console.log(res);
        if (res.err != undefined) {
            // show erro
            $.toast({
                heading: "Erro ao alterar status",
                text: res.err,
                icon: "danger",
                loader: true, // Change it to false to disable loader
                loaderBg: "#ff0000", // To change the background
            });
        } else {
            $.toast({
                heading: "Status alterado com sucesso!",
                text: res.err,
                icon: "success",
                loader: true, // Change it to false to disable loader
                loaderBg: "#00ff00", // To change the background
            });            
            
            getPrestadores();
        }
    });
}

function showAddPrestador() {
    $(".inputPrestador").val('');
    $('#modalAddPrestador').modal('show');
    prestador_id = null;
}

function showEditPrestador(id, nome, email, tipo, login) {
    
    $('#modalAddPrestador').modal('show');
    prestador_id = id;
    $("#usuario_nome_prestador").val(nome);
    $("#usuario_email_prestador").val(email);
    $("#usuario_tipo_prestador").val(tipo).trigger('change');
    $("#usuario_login_prestador").val(login);

}
function setPrestador() {
    // Validação campos vazios
    let validator = true;
    let idCampoVazio = "";
    $(".inputPrestador").each(function () {
        if ($(this).val().trim() == "") {
            validator = false;
            idCampoVazio = $(this).attr("id");
            return false;
        }
    });

    if($("#usuario_senha_prestador").val() == '' && prestador_id != null)
        validator = true;
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
        $("#usuario_senha_prestador").val().trim() !=
        $("#usuario_confirma_senha_prestador").val().trim()
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
        $(".inputPrestador").each(function () {
            if ($(this).attr("id") != "usuario_confirma_senha") {
                dados.push($(this).val().trim());
            }
        });
        console.log(dados);
        let url = baseUri + "/registerPrestador";
        let data = {
            usuario: {
                usuario_login: dados[3],
                usuario_senha: dados[4],
                usuario_nome: dados[0],
                usuario_tipo: dados[2],
                usuario_email: dados[1],
            },
        };
        let method = 'POST';
        let msg = "Cadastro";
        if(prestador_id != null) {
            if($("#usuario_senha_prestador").val() == '') {
                data.usuario.usuario_senha = undefined;
            }
            data.usuario.usuario_id = prestador_id;
            method = 'PUT';
            msg = "Alteração";
            url = baseUri + "/user"
        }
        $.ajax({
            url: url,
            method: method,
            contentType: "application/JSON",
            data: JSON.stringify(data),
        }).done((res) => {
            console.log(res);
            if (res.err != undefined) {
                // show erro
                $.toast({
                    heading: "Erro de "+msg+"!",
                    text: res.err,
                    icon: "danger",
                    loader: true, // Change it to false to disable loader
                    loaderBg: "#ff0000", // To change the background
                });
            } else {
                $.toast({
                    heading: msg + " realizado com sucesso!",
                    text: res.err,
                    icon: "success",
                    loader: true, // Change it to false to disable loader
                    loaderBg: "#00ff00", // To change the background
                });
                $("#modalAddPrestador").modal('hide')
                $(".inputPrestador").val('')
                getPrestadores();
            }
        });
    }
}


function getBlog() {
    if (!localStorage.getItem('apiceId') && !localStorage.getItem('apiceIToken')) {
        localStorage.clear()
        window.location.replace("login.html");
    }

    let url = baseUri + "/blog";
    $.ajax({
        url: url,
        method: 'GET',
        contentType: 'application/JSON'
    }).done(res => {
        console.log(res)
        let blogs = res.blogs;
        if (res.err == undefined) {
            $("#linhasBlog").html('');
            if (blogs.length > 0) {
                blogs.map(blog => {
                    $("#linhasBlog").append(`
                    <tr>
                    <td>${blog.blog_titulo}</td>
                    <td>${blog.blog_data}</td>
                    <td>${blog.blog_home_nome}</td>
                    <td>
                      <button class="btn btn-primary btn-sm" onclick="showEditBlog(${blog.blog_id}, '${blog.blog_titulo}', '${blog.blog_desc}', '${blog.blog_desc_full}', '${blog.blog_home}')">Editar</button>
                      <button class="btn btn-danger btn-sm"  onclick="showRemoveBlog(${blog.blog_id})">Remover</button>
                    </td>
                    </tr>
                    `)
                })
            }
        }

    })
}

function showAddBlog() {
    $('#modalAddBlog').modal('show');
    blog_id = null;
    $("#blog_titulo").val('');
    $("#blog_desc").val('');
    $("#blog_desc_full").val('');
    $("#blog_home").val('').trigger('change');
}

function showEditBlog(id, titulo, desc, descFull, home) {
    blog_id = id;
    $('#modalAddBlog').modal('show');
    $("#blog_titulo").val(titulo);
    $("#blog_desc").val(desc);
    $("#blog_desc_full").val(descFull);
    $("#blog_home").val(home).trigger('change');
}

function showRemoveBlog(id) {
    $('#modalRemoveBlog').modal('show');
    blog_id = id;
}

function removeBlog() {

    if (blog_id != null) {
        $.ajax({
            url: baseUri + "/blog",
            method: "DELETE",
            contentType: 'application/JSON',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token)
            },
            data: JSON.stringify({
                blog: {
                    blog_id: blog_id
                }
            })
        }).done(res => {
            if (res.err == undefined) {
                $("#modalRemoveBlog").modal('hide');
                $.toast({
                    heading: "Postagem de blog removida com sucesso!",
                    text: "",
                    icon: "danger",
                    loader: true, // Change it to false to disable loader
                    loaderBg: "#00FF00", // To change the background
                });
                getBlog();
            } else {
                $.toast({
                    heading: "Erro ao remover postagem do blog",
                    text: "",
                    icon: "danger",
                    loader: true, // Change it to false to disable loader
                    loaderBg: "#00FF00", // To change the background
                });
            }

        })
    }
}

function setBlog() {
    let titulo = $("#blog_titulo").val();
    let desc = $("#blog_desc").val();
    let desc_full = $("#blog_desc_full").val();
    let home = $("#blog_home").val();
    if (titulo == '') {
        $.toast({
            heading: "Campo obrigatório vazio!",
            text: "Campo de título do procedimento vazio!",
            icon: "danger",
            loader: true, // Change it to false to disable loader
            loaderBg: "#ff0000", // To change the background
        });
    }

    else if (desc == '')
        $.toast({
            heading: "Campo obrigatório vazio!",
            text: "Campo de descrição do procedimento vazio!",
            icon: "danger",
            loader: true, // Change it to false to disable loader
            loaderBg: "#ff0000", // To change the background
        });
    else if (desc_full == '')
        $.toast({
            heading: "Campo obrigatório vazio!",
            text: "Campo de tipo do procedimento vazio!",
            icon: "danger",
            loader: true, // Change it to false to disable loader
            loaderBg: "#ff0000", // To change the background
        });
    else if (home == '')
        $.toast({
            heading: "Campo obrigatório vazio!",
            text: "Campo de Cliente do procedimento vazio!",
            icon: "danger",
            loader: true, // Change it to false to disable loader
            loaderBg: "#ff0000", // To change the background
        });
    else {
        // salva o procedimento
        let url = baseUri + "/blog";
        var data = {
            blog: {
                blog_titulo: titulo,
                blog_desc: desc,
                blog_desc_full: desc_full,
                blog_home: home
            },
        };
        let method = "POST";
        let msg = "cadastrado";
        if (blog_id != null) {
            data.blog.blog_id = blog_id;
            method = "PUT";
            msg = "alterado";
        }
        $.ajax({
            url: url,
            method: method,
            contentType: 'application/JSON',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token)
            },
            data: JSON.stringify(data)
        }).done(res => {
            if (res.err == undefined) {
                $("#modalAddBlog").modal('hide');
                $.toast({
                    heading: "Blog " + msg + " com sucesso!",
                    text: "",
                    icon: "danger",
                    loader: true, // Change it to false to disable loader
                    loaderBg: "#00FF00", // To change the background
                });
                getBlog();
                $("#blog_titulo").val('');
                $("#blog_desc").val('');
                $("#blog_desc_full").val('');
                $("#blog_home").val('');
            }

        })
    }
}


function setProcedimento() {
    let titulo = $("#procedimento_titulo").val();
    let desc = $("#procedimento_desc").val();
    let tipo = $("#procedimento_tipo").val();
    let cliente = $("#procedimento_cliente").val();
    if (titulo == '') {
        $.toast({
            heading: "Campo obrigatório vazio!",
            text: "Campo de título do procedimento vazio!",
            icon: "danger",
            loader: true, // Change it to false to disable loader
            loaderBg: "#ff0000", // To change the background
        });
    }

    else if (desc == '')
        $.toast({
            heading: "Campo obrigatório vazio!",
            text: "Campo de descrição do procedimento vazio!",
            icon: "danger",
            loader: true, // Change it to false to disable loader
            loaderBg: "#ff0000", // To change the background
        });
    else if (tipo == '')
        $.toast({
            heading: "Campo obrigatório vazio!",
            text: "Campo de tipo do procedimento vazio!",
            icon: "danger",
            loader: true, // Change it to false to disable loader
            loaderBg: "#ff0000", // To change the background
        });
    else if (cliente == '')
        $.toast({
            heading: "Campo obrigatório vazio!",
            text: "Campo de Cliente do procedimento vazio!",
            icon: "danger",
            loader: true, // Change it to false to disable loader
            loaderBg: "#ff0000", // To change the background
        });
    else {
        // salva o procedimento
        let url = baseUri + "/procedimento";
        let method = "POST";
        let msg = "cadastrado";
        let dados = {
            procedimento: {
                procedimento_titulo: titulo,
                procedimento_desc: desc,
                procedimento_tipo: tipo,
                procedimento_cliente: cliente
            },
        }
        if(procedimento_id != null) {
            method = "PUT";
            msg = "alterado";
            dados.procedimento.procedimento_id = procedimento_id;
        }
        $.ajax({
            url: url,
            method: method,
            contentType: 'application/JSON',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token)
            },
            data: JSON.stringify(dados)
        }).done(res => {
            if (res.err == undefined) {
                $("#modalAddProcedimento").modal('hide');
                $.toast({
                    heading: "Procedimento "+ msg +" com sucesso!",
                    text: "",
                    icon: "danger",
                    loader: true, // Change it to false to disable loader
                    loaderBg: "#00FF00", // To change the background
                });
                getProcedimentos();
                $("#procedimento_titulo").val('');
                $("#procedimento_desc").val('');
                $("#procedimento_tipo").val('');
                $("#procedimento_cliente").val('');
            }

        })
    }
}





function logout() {
    localStorage.clear();
    window.location.replace("login.html");
}

function switchTelas(id) {

    // esconde todas as telas
    $(".telas").hide();
    // mostra a tela desejada
    $("#div" + id).show();

    // remove a class active de todos os menu
    $(".listas").removeClass('active');
    // Insere a class active no menu selecionado
    $("#nav" + id).addClass('active');
}



