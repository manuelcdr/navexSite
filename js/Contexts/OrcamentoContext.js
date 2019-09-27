import Orcamento from '/js/models/Orcamento.js';
import Endereco from '/js/models/Endereco.js';

class Context {

  constructor() {
  }

  tagIniciada = false;
  tags = new AmsifySuggestags($('input[name="moveisEObjetos"]'));

  origem = '';
  destino = '';

  autocompleteConfig = {
    types: ['address'],
    components: 'country:br',
    fields: ['address_components', 'geometry', 'icon', 'name']
  };

  initialize() {
    var o = this;
    
    this.initializeTags();
    this.initializeAutoCompleteMap();


    $('#moveis-e-objetos-link').click(function () {
      if (o.tagIniciada) return;
      setTimeout(function () {
        o.tags._init();
        o.tagIniciada = true;
      }, 200);
    });

    $('input[name=finish]').click(async () => {
      var origem = new Endereco(
        $('#enderecoOrigem').val(),
        $('[name=tipoOrigem]:checked').val(),
        $('#andarOrigem').val(),
        $('#temElevadorOrigem').is(':checked')
      );

      var destino = new Endereco(
        $('#enderecoDestino').val(),
        $('[name=tipoDestino]').val(),
        $('#andarDestino').val(),
        $('#temElevadorDestino').is(':checked')
      );

      var orcamento = new Orcamento(
        origem, destino,
        $('[name=querAjudantes]:checked').val(),
        $('#querEmbalar').is(':checked'),
        $('#querEmpacotamento').is(':checked'),
        $('#querMontagem').is(':checked'));

        await orcamento.calcular();

        $('#valor-orcamento').text('R$ ' + orcamento.valor)

        console.log(orcamento);
        console.info(orcamento);

    });
  }

  initializeTags() {
    this.tags._settings({
      suggestions: ['cama casal', 'cama solteiro', 'geladeira', 'fogão', 'sofá 3 lugares', 'sofá 2 lugares', 'poltrona']
    });
  }

  initializeAutoCompleteMap() {
    var inputOrigem = document.getElementById('enderecoOrigem');
    var autocompleteOrigem = new google.maps.places.Autocomplete(inputOrigem, this.autocompleteConfig);
    autocompleteOrigem.addListener('place_changed', function () {
      var place = autocompleteOrigem.getPlace();
      if (!place.geometry) {
        window.alert("Lugar não encontrado: '" + place.name + "'");
        return;
      }
      this.origem = place.name;
    });
    var inputDestino = document.getElementById('enderecoDestino');
    var autocompleteDestino = new google.maps.places.Autocomplete(inputDestino, this.autocompleteConfig);
    autocompleteDestino.addListener('place_changed', function () {
      var place = autocompleteDestino.getPlace();
      if (!place.geometry) {
        window.alert("Lugar não encontrado: '" + place.name + "'");
        return;
      }
      this.destino = place.name;
    });
  }
}


export default Context;
