
"use strict"; // Start of use strict

console.log('asdf');

var mapsKey = 'NkIINWhWylFEa4jHbMuVSIOfwNXHU63G';
var mapsUrl = 'http://www.mapquestapi.com/directions/v2/';

function getUrlDirection(origem, destino) {
  var urlcompleta = mapsUrl + 'route?key=' + mapsKey + '&unit=k&from=Rua Vitorino Calegare, 141, Barueri, São Paulo&to=Av. Presidente João Goulart, Osasco, São Paulo';
  console.log(urlcompleta);
  return urlcompleta;
  // ${url}distancematrix/json?origins=${origem}&destinations=${destino}&key=${key}`;
}

function ObterInformacoesRota(origem, destino) {
  //var distancia;
  return $.getJSON(getUrlDirection(origem, destino));
  // console.log('esperei');
  // console.log('distancia', distancia);
  //return distancia;
}


