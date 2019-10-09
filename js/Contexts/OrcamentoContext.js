import Orcamento from '/js/models/Orcamento.js';
import WizardOrcamento from '/js/models/Wizard.js';
import Endereco from '/js/models/Endereco.js';

class Context {

  // Code for the Validator
  $validator = $('.wizard-card form').validate({
    rules: {
      enderecoOrigem: {
        required: true
      },
      enderecoDestino: {
        required: true
      },
      email: {
        required: true
      },
      telefone: {
        required: true
      },
      nome: {
        required: true
      },
      moveisEObjetos: {
        required: true
      }
    },

    errorPlacement: function (error, element) {
      $(element).parent('div').addClass('has-error');
    }
  });


  orcamento = new Orcamento();
  wizard = new WizardOrcamento(this.$validator);


  constructor() {
  }

  tagIniciada = false;
  tags = new AmsifySuggestags($('input[name="moveisEObjetos"]'));
  suggestionsTags = ['cama casal', 'cama solteiro', 'geladeira', 'fogão', 'sofá 3 lugares', 'sofá 2 lugares', 'poltrona'];

  autocompleteConfig = {
    types: ['address'],
    components: 'country:br',
    fields: ['address_components', 'geometry', 'icon', 'name']
  };

  initialize() {
    var o = this;

    this.initializeTags();
    this.initializeAutoCompleteMap();
    this.wizard.initialize();
    this.wizard.addTabFunction('moveis-e-objetos', () => { this.functionShowTabTags(o) });

    // $('#moveis-e-objetos-link').click(() => { this.functionShowTabTags(o) });

    $('input[name=finish]').click(async () => {
      if (this.wizard.validateForm()) {
        await this.finalizarOrcamento();
      }
    });
  }

  async finalizarOrcamento() {
    this.orcamento.enderecoOrigem.alterarTipo($('[name=tipoOrigem]:checked').val());
    this.orcamento.enderecoOrigem.alterarAndar($('#andarOrigem').val());
    this.orcamento.enderecoOrigem.temElevador = $('#temElevadorOrigem').is(':checked');

    this.orcamento.enderecoDestino.alterarTipo($('[name=tipoDestino]:checked').val());
    this.orcamento.enderecoDestino.alterarAndar($('#andarDestino').val());
    this.orcamento.enderecoDestino.temElevador = $('#temElevadorDestino').is(':checked');

    this.orcamento.querAjudantes = ($('[name=querAjudantes]:checked').val() === 'true');
    this.orcamento.querEmbalar = $('#querEmbalar').is(':checked');
    this.orcamento.querEmpacotamento = $('#querEmpacotamento').is(':checked');
    this.orcamento.querMontagem = $('#querMontagem').is(':checked');

    this.orcamento.pessoa.nome = $('#nome').val();
    this.orcamento.pessoa.email = $('#email').val();
    this.orcamento.pessoa.telefone = $('#telefone').val();

    this.orcamento.atualizarListaObjetos(this.tags.tagNames);

    await this.orcamento.calcular();
    var valorTexto = this.orcamento.valor.toFixed(2).toString().replace(',', '').replace('.', ',');
    var valorCustoTexto = this.orcamento.valorCusto.toFixed(2).toString().replace(',', '').replace('.', ',');
    var valorCompartilhadoTexto = this.orcamento.valorCompartilhado.toFixed(2).toString().replace(',', '').replace('.', ',');
    var valorCompartilhadoCustoTexto = this.orcamento.valorCompartilhadoCusto.toFixed(2).toString().replace(',', '').replace('.', ',');


    $('#valor-orcamento').html(`<small>Exclusivo: </small> R$ ${valorTexto}`);
    $('#valor-orcamento-custo').html(`<small>custo: R$ ${valorCustoTexto}</small>`);

    $('#valor-orcamento-compartilhado').html(`<small>Compartilhado: </small> R$ ${valorCompartilhadoTexto}`);
    $('#valor-orcamento-compartilhado-custo').html(`<small>custo: R$ ${valorCompartilhadoCustoTexto}</small> `);

    console.log(this.orcamento);
  }

  functionShowTabTags(context) {
    if (context.tagIniciada) return;
    context.tags._init();
    context.tagIniciada = true;
    // setTimeout(() => {
    //   context.tags._init();
    //   context.tagIniciada = true;
    // }, );
  }

  functionChangeAutoComplete(orcamento, autoComplete, tipo) {
    console.log('functionChangeAutoComplete', orcamento, autoComplete, tipo);

    var place = autoComplete.getPlace();

    if (!place.geometry) {
      window.alert("Lugar não encontrado: '" + place.name + "'");
      return;
    }

    orcamento[`endereco${tipo}`].mapsPlace = place;
  }

  initializeTags() {
    this.tags._settings({
      suggestions: this.suggestionsTags
    });
  }

  initializeAutoCompleteMap() {
    var o = this;
    var inputOrigem = document.getElementById('enderecoOrigem');
    var autocompleteOrigem = new google.maps.places.Autocomplete(inputOrigem, o.autocompleteConfig);
    autocompleteOrigem.addListener('place_changed', () => { o.functionChangeAutoComplete(o.orcamento, autocompleteOrigem, 'Origem') });

    var inputDestino = document.getElementById('enderecoDestino');
    var autocompleteDestino = new google.maps.places.Autocomplete(inputDestino, o.autocompleteConfig);
    autocompleteDestino.addListener('place_changed', () => { o.functionChangeAutoComplete(o.orcamento, autocompleteDestino, 'Destino') });
  }
}


export default Context;
