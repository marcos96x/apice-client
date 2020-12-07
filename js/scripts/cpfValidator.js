function TestaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
  if (strCPF == "00000000000") return false;

  for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

  Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}

function validaNome(strNome) {
  if (strNome.length <= 2) 
    return false
  
    if(isNaN(strNome))
    return true

}
function validaData(data){
 // pega o valor do input
data = data.replace(/\//g, "-"); // substitui eventuais barras (ex. IE) "/" por hífen "-"
var data_array = data.split("-"); // quebra a data em array

// para o IE onde será inserido no formato dd/MM/yyyy
if(data_array[0].length != 4){
   data = data_array[2]+"-"+data_array[1]+"-"+data_array[0]; // remonto a data no formato yyyy/MM/dd
}
// comparo as datas e calculo a idade
var hoje = new Date();
var nasc  = new Date(data);
var idade = hoje.getFullYear() - nasc.getFullYear();
var m = hoje.getMonth() - nasc.getMonth();
if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;



if(idade >= 10 && idade <= 100){
   return true;
}

}


function validaEmail(email) {

  if (email.length <= 4) 
  return false;

  if(isNaN(email))
  {  return true;
  }

}


