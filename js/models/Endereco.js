class Endereco {

  mapsPlace = {};
  tipo = 'casa'|'apartamento';
  andar = 0;
  temElevador = false;

  constructor(endereco, tipo, andar, temElevador) {
    this.endereco = endereco;
    this.tipo = tipo;
    this.andar = andar;
    this.temElevador = temElevador;
  }

  alterarTipo(tipo) {
    this.tipo = tipo;
  }

  alterarAndar(andar) {
    this.andar = andar;
  }

};

export default Endereco;