import Endereco from './Endereco.js';
import Pessoa from './Pessoa.js';
// import google from 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAeLCI2uEVkQccjRTieaYcFDZszskd_jSI&libraries=places&language=pt-BR';

class Orcamento {

  pessoa = new Pessoa();

  enderecoOrigem = new Endereco();
  enderecoDestino = new Endereco();
  querAjudantes = false;
  querEmpacotamento = false;
  querEmbalar = false;
  querMontagem = false;
  distanciaSaidaAteOrigem = 0;
  distanciaEntrePontos = 0;
  distanciaDestinoAteSaida = 0;
  distanciaTotal = 0;
  valor = parseFloat(0.0);
  valorCusto = parseFloat(0.0);
  valorCompartilhado = parseFloat(0.0);
  valorCompartilhadoCusto = parseFloat(0.0);
  objetos = [];

  _pontoSaidaCarro = { lat: -23.5660577, lng: -46.8034313 };
  _service = new google.maps.DistanceMatrixService();

  addObjeto(objeto) {
    this.objetos.push(objeto);
  }

  atualizarListaObjetos(objetos) {
    this.objetos = objetos;
  }

  calcularDistanciaSaidaAteOrigem = (o) => new Promise((resolve, reject) => {
    var origemLocation = this.enderecoOrigem.mapsPlace.geometry.location;
    this._service.getDistanceMatrix({
      origins: [this._pontoSaidaCarro],
      destinations: [origemLocation],
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status != google.maps.DistanceMatrixStatus.OK) {
        reject(status);
      } else {
        console.log('distanciaSaidaAteOrigem', response);
        this.distanciaSaidaAteOrigem = parseInt(response.rows[0].elements[0].distance.value) / 1000;
        resolve(response);
      }
    });
  })

  calcularDistanciaEntrePontos = (o) => new Promise((resolve, reject) => {
    var origemLocation = this.enderecoOrigem.mapsPlace.geometry.location;
    var destinoLocation = this.enderecoDestino.mapsPlace.geometry.location;
    this._service.getDistanceMatrix({
      origins: [origemLocation],
      destinations: [destinoLocation],
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status != google.maps.DistanceMatrixStatus.OK) {
        reject(status);
      } else {
        console.log('distanciaEntrePontos', response);
        this.distanciaEntrePontos = parseInt(response.rows[0].elements[0].distance.value) / 1000;
        resolve(response);
      }
    });
  })

  calcularDistanciaDestinoAteSaida = (o) => new Promise((resolve, reject) => {
    var destinoLocation = this.enderecoDestino.mapsPlace.geometry.location;
    this._service.getDistanceMatrix({
      origins: [destinoLocation],
      destinations: [this._pontoSaidaCarro],
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status != google.maps.DistanceMatrixStatus.OK) {
        reject(status);
      } else {
        console.log('distanciaDestinoAteSaida', response);
        this.distanciaDestinoAteSaida = parseInt(response.rows[0].elements[0].distance.value) / 1000;
        resolve(response);
      }
    });
  })

  async calcularDistanciaTotal() {
    var saidaAteOrigem = this.calcularDistanciaSaidaAteOrigem();
    var entrePontos = this.calcularDistanciaEntrePontos();
    var destinoAteSaida = this.calcularDistanciaDestinoAteSaida();

    var resposta1 = await saidaAteOrigem;
    var resposta2 = await entrePontos;
    var resposta3 = await destinoAteSaida;

    this.distanciaTotal = this.distanciaSaidaAteOrigem + this.distanciaEntrePontos + this.distanciaDestinoAteSaida;

    console.log('distanciaTotal', this.distanciaTotal);
  }

  async calcular() {
    var calculoDistanciaTotal = this.calcularDistanciaTotal();
    var quantidadeObjetos = this.objetos.length;

    this.querAjudantes = this.querAjudantes || this.querEmbalar || this.querEmpacotamento || this.querMontagem;

    var valorBase = 0.0;

    if (this.querAjudantes) {

      if (this.enderecoOrigem.andar > 0 && !this.enderecoOrigem.temElevador) {
        valorBase += (parseFloat(10) * parseFloat(quantidadeObjetos) * parseFloat(this.enderecoOrigem.andar));
      }
      console.log('end origem', valorBase);

      if (this.enderecoDestino.andar > 0 && !this.enderecoDestino.temElevador) {
        valorBase += (parseFloat(10) * parseFloat(quantidadeObjetos) * parseFloat(this.enderecoDestino.andar));
      }
    }

    if (this.querEmbalar) {
      valorBase += (parseFloat(15) * parseFloat(quantidadeObjetos));
    }

    if (this.querEmpacotamento) {
      valorBase += parseFloat(150);
    }

    if (this.querMontagem) {
      //valorBase += parseFloat(100);
    }

    await calculoDistanciaTotal;
    valorBase += parseFloat(this.distanciaTotal) * parseFloat(2.0);

    this.calcularExclusivo(valorBase);
    this.calcularCompartilhado(valorBase);

  }

  calcularExclusivo(valorBase) {
    this.valor = valorBase;
    this.valor += parseFloat(100); //motorista
    this.valor += parseFloat(100); //saida
    this.valor += parseFloat(50); // custos administrativos

    if (this.querAjudantes) {
      this.valor += parseFloat(80) * parseFloat(2);
    }

    var _valor = this.valor;

    this.valorCusto = _valor;

    this.valor += this.calcularMinhaMargem(_valor)
    this.valor += this.calcularLucro(_valor);
  }

  calcularCompartilhado(valorBase) {
    this.valorCompartilhado = valorBase;
    this.valorCompartilhado += parseFloat(50); //motorista
    this.valorCompartilhado += parseFloat(50); //saida
    this.valorCompartilhado += parseFloat(25); // custos administrativos

    if (this.querAjudantes) {
      this.valorCompartilhado += parseFloat(40) * parseFloat(2);
    }

    var _valor = this.valorCompartilhado;

    this.valorCompartilhadoCusto = _valor;

    this.valorCompartilhado += this.calcularMinhaMargem(_valor)
    this.valorCompartilhado += this.calcularLucro(_valor);
  }

  calcularMinhaMargem(valorBase) {
    return parseFloat(valorBase) * parseFloat(0.0); // minha margem
  }

  calcularLucro(valorBase) {
    return parseFloat(valorBase) * parseFloat(0.25); // lucro
  }

}

export default Orcamento;