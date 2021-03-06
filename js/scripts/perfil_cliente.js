const id = localStorage.getItem('apiceId');
const token = localStorage.getItem('apiceToken');
$(document).ready(function () {
    // esconde todas as telas
    $(".telas").hide();
    // mostra a tela de procedimentos inicialmente
    $("#divProcedimentos").show();
    getUser()
    getProcedimentos()
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
            $(".usuarioNome").html(res.usuario.usuario_nome)
        }
    })
}

function getProcedimentos() {
    if (!localStorage.getItem('apiceId') && !localStorage.getItem('apiceIToken')) {
        localStorage.clear()
        window.location.replace("login.html");
    }

    let url = baseUri + "/procedimentoCliente/" + id;
    $.ajax({
        url: url,
        method: 'GET',
        contentType: 'application/JSON'
    }).done(res => {
        console.log(res)
        let procedimentos = res.procedimentos;
        if (procedimentos.length > 0) {
            procedimentos.map(procedimento => {
                $("#linhasProcedimentos").append(`
                <tr>
                <td>${procedimento.procedimento_titulo}</td>
                <td>${procedimento.procedimento_tipo_nome}</td>
                <td>${procedimento.procedimento_status_nome}</td>
                <td>
                  <button class="btn btn-primary btn-sm">Visualizar</button>
                </td>
                <tr>
                `)
            
            })
        }
    })
}


function logout() {
    localStorage.clear("apiceId");
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



