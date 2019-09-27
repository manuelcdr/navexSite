class Endereco {

  endereco = '';
  tipo = 'casa'|'apartamento';
  andar = 0;
  temElevador = false;

  constructor(endereco, tipo, andar, temElevador) {
    this.endereco = endereco;
    this.tipo = tipo;
    this.andar = andar;
    this.temElevador = temElevador;
  }

};

export default Endereco;