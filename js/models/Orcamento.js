import Endereco from './Endereco.js';
// import google from 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAeLCI2uEVkQccjRTieaYcFDZszskd_jSI&libraries=places&language=pt-BR';

class Orcamento {

  enderecoOrigem = new Endereco();
  enderecoDestino = new Endereco();
  querAjudantes = false;
  querEmpacotamento = false;
  querEmbalar = false;
  querMontagem = false;
  distanciaEntrePontos = {};
  valor = parseFloat(0.0);

  _service = new google.maps.DistanceMatrixService();

  constructor(
    _enderecoOrigem,
    _enderecoDestino,
    _querAjudantes,
    _querEmbalar,
    _querEmpacotamento,
    _querMontagem) {
    this.enderecoOrigem = _enderecoOrigem;
    this.enderecoDestino = _enderecoDestino;
    this.querAjudantes = _querAjudantes;
    this.querEmbalar = _querEmbalar;
    this.querEmpacotamento = _querEmpacotamento;
    this.querMontagem = _querMontagem;
  }

  calcularDistanciaEntrePontos = (o) => new Promise((resolve, reject) => {
    this._service.getDistanceMatrix({
      origins: [this.enderecoOrigem.endereco],
      destinations: [this.enderecoDestino.endereco],
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status != google.maps.DistanceMatrixStatus.OK) {
        reject(status);
      } else {
        console.log('distancia', response);
        this.distanciaEntrePontos = response.rows[0].elements[0].distance;
        resolve(response);
      }
    });
  })
  // {
  //   const promise = new Promise()
  //   var o = this;

  //   this._service.getDistanceMatrix({
  //     origins: [o.enderecoOrigem.endereco],
  //     destinations: [o.enderecoDestino.endereco],
  //     travelMode: 'DRIVING'
  //   }, (response, status) => {
  //     if (status != google.maps.DistanceMatrixStatus.OK) {
  //       d.reject(status);
  //     } else {
  //       o.distanciaEntrePontos = response.rows[0].elements[0].distance.text;
  //       d.resolve(response);
  //     }
  //   });
  //   return d.promise();
  // }

  // readFilePromise = (filename) => new Promise((resolve, reject = {
  //   fs.readFile(filename, (err, data) => {
  //     if (err) {
  //       reject(err)
  //     } else {
  //       resolve(data)
  //     }
  //   }
  // }))

  async calcular() {
    var calculoDistancia = this.calcularDistanciaEntrePontos();

    if (this.querAjudantes) {
      this.valor += parseFloat(100);
    }

    if (this.querEmbalar) {
      this.valor += parseFloat(100);
    }

    if (this.querEmpacotamento) {
      this.valor += parseFloat(100);
    }

    if (this.querMontagem) {
      this.valor += parseFloat(100);
    }

    this.valor += parseFloat(250); // saida

    await calculoDistancia;
    this.valor += parseFloat(parseInt(this.distanciaEntrePontos.value) / 1000) * parseFloat(2.5);

    return this.valor;
  }

}

export default Orcamento;