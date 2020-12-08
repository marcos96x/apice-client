const id = localStorage.getItem('apiceId');
const token = localStorage.getItem('apiceToken');
$(document).ready(function () {
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
    if (!localStorage.getItem('apiceId') && !localStorage.getItem('apiceIToken')) {
        localStorage.clear()
        window.location.replace("login.html");
    }

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
                $("#linhasProcedimentos").append(`
                <tr>
                <td>${procedimento.procedimento_titulo}</td>
                <td>${procedimento.procedimento_tipo}</td>
                <td>${procedimento.procedimento_status}</td>
                <td>${procedimento.usuario_nome}</td>
                <td>
                  <button class="btn btn-primary btn-sm">Editar</button>
                  <button class="btn btn-danger btn-sm">Remover</button>
                </td>
                </tr>
                `)
            })
        }
    })
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
        let clientes = res.usuarios;
        if (clientes.length > 0) {
            clientes.map(cliente => {
                $("#linhasClientes").append(`
                <tr>
                <td>${cliente.usuario_nome}</td>
                <td>${cliente.usuario_ficha}</td>
                <td>${cliente.usuario_status}</td>
                <td>${cliente.usuario_procedimentos}</td>
                <td>
                  <button class="btn btn-primary btn-sm">Editar</button>
                  <button class="btn btn-danger btn-sm">Remover</button>
                </td>
                </tr>
                `);

                $("#procedimento_cliente").append(`
                    <option value="${cliente.usuario_id}">${cliente.usuario_nome}</option>
                `)
            })
        }
    })
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
            if (prestadores.length > 0) {
                prestadores.map(prestador => {
                    $("#linhasPrestadores").append(`
                    <tr>
                    <td>${prestador.usuario_nome}</td>
                    <td>${prestador.usuario_email}</td>
                    <td>${prestador.usuario_status}</td>
                    <td>
                      <button class="btn btn-primary btn-sm">Editar</button>
                      <button class="btn btn-danger btn-sm">Remover</button>
                    </td>
                    </tr>
                    `)
                })
            }
        }

    })
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
            if (blogs.length > 0) {
                blogs.map(blog => {
                    $("#linhasBlog").append(`
                    <tr>
                    <td>${blog.blog_titulo}</td>
                    <td>${blog.blog_data}</td>
                    <td>${blog.blog_home}</td>
                    <td>
                      <button class="btn btn-primary btn-sm">Editar</button>
                      <button class="btn btn-danger btn-sm">Remover</button>
                    </td>
                    </tr>
                    `)
                })
            }
        }

    })
}

function setProcedimento() {
    let titulo = $("#procedimento_titulo").val().trim();
    let desc = $("#procedimento_desc").val().trim();
    let tipo = $("#procedimento_tipo").val().trim();
    let cliente = $("#procedimento_cliente").val().trim();
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
        $.ajax({
            url: url,
            method: 'POST',
            contentType: 'application/JSON',
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', token)
            },
            data: JSON.stringify({
                procedimento: {
                    titulo: titulo,
                    desc: desc,
                    tipo: tipo,
                    cliente: cliente
                },
                
            })
        }).done(res => {
            if (res.err == undefined) {
                $("#modalAddProcedimento").modal('hide');
                $.toast({
                    heading: "Procedimento cadastrado com sucesso!",
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



