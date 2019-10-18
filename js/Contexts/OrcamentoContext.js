import Orcamento from '../models/Orcamento.js';
import WizardOrcamento from '../models/Wizard.js';
import Endereco from '../models/Endereco.js';

class Context {

  // Code for the Validator
  // $validator = $('.wizard-card form').validate();

  //   {
  //   rules: {
  //     // enderecoOrigem: {
  //     //   required: true
  //     // },
  //     // enderecoDestino: {
  //     //   required: true
  //     // },
  //     // moveisEObjetos: {
  //     //   required: true
  //     // }
  //     // email: {
  //     //   required: true
  //     // },
  //     // telefone: {
  //     //   required: true
  //     // },
  //     // nome: {
  //     //   required: true
  //     // }
  //   },

  //   errorPlacement: function (error, element) {
  //     $(element).parent('div').addClass('has-error');
  //   }
  // });


  orcamento = new Orcamento();
  wizard = new WizardOrcamento({}, this.orcamento);


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
    this.inicializeDates();
    this.initializeOpcoes();
    this.wizard.initialize();
    this.wizard.addTabFunction('moveis-e-objetos', () => { this.functionShowTabTags(o) });

    $('button[name=finish]').click(async () => {
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

    this.orcamento.vaiCarregarCaixas = ($('[name=caixas]:checked').val() === 'true');
    this.orcamento.querEmpacotamento = $('#querEmpacotamento').is(':checked');
    // this.orcamento.querMontagem = $('#querMontagem').is(':checked');

    this.orcamento.pessoa.nome = $('#nome').val();
    this.orcamento.pessoa.email = $('#email').val();
    this.orcamento.pessoa.telefone = $('#telefone').val();
    this.orcamento.pessoa.permiteContatoWA = $('#permiteContatoWA').is(':checked');

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
  }

  functionChangeAutoComplete(orcamento, autoComplete, tipo) {
    var place = autoComplete.getPlace();

    if (!place.geometry) {
      window.alert("Lugar não encontrado: '" + place.name + "'");
      return;
    }

    orcamento[`endereco${tipo}`].mapsPlace = place;
    $(`#endereco${tipo}`).trigger("input");
  }

  initializeTags() {
    this.tags._settings({
      suggestions: this.suggestionsTags
    });
  }

  inicializeDates() {
    var start = moment();
    var end = moment().add(7, 'days');
    $('input[name="periodo"]').daterangepicker({
      minDate: start,
      startDate: start,
      endDate: end,
      locale: {
        format: 'DD/MM/YYYY',
        "separator": " até ",
        applyLabel: "Ok",
        cancelLabel: "Cancelar",
        "fromLabel": "De",
        "toLabel": "Até",
        "daysOfWeek": [
          "D",
          "S",
          "T",
          "Q",
          "Q",
          "S",
          "S"
        ],
        "monthNames": [
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro"
        ]
      }
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

    $('[data-endereco-validate]').change(function () {
      var tipo = $(this).data('endereco-validate');
      o.orcamento[`endereco${tipo}`].mapsPlace = {};
      $(this).trigger('input');
    });

    $('[data-endereco-validate]').bind('input', function () {
      var tipo = $(this).data('endereco-validate');
      if (!o.orcamento[`endereco${tipo}`].mapsPlace.geometry) {
        this.setCustomValidity('validacao-endereco-maps');
      } else
        this.setCustomValidity('');
    });
  }

  initializeOpcoes() {
    var c = this;
    $('#divEmpacotamento').hide();
    $('#divEmbalamento').hide();
    $('#divElevadorDestino').hide();
    $('#divElevadorOrigem').hide();

    $('[name=andarDestino]').change(function () {
      var condicao = $(this).val() > 0;
      c.toggleShow(condicao, $('#divElevadorDestino'));
    })

    $('[name=andarOrigem]').change(function () {
      var condicao = $(this).val() > 0;
      c.toggleShow(condicao, $('#divElevadorOrigem'));
    })

    $('[name=querAjudantes]').change(function () {
      var condicao = $(this).val() === 'true';
      c.toggleShow(condicao, $('#divEmbalamento'));
    })

    $('[name=caixas]').change(function () {
      var condicao = $(this).val() === 'true';
      c.toggleShow(condicao, $('#divEmpacotamento'));
    })

    $(window).resize(function () {
      $('.wizard-card').each(function () {
        var $wizard = $(this);
    
        var index = $wizard.bootstrapWizard('currentIndex');
        c.wizard.refreshAnimation($wizard, index);
    
        $('.moving-tab').css({
          'transition': 'transform 0s'
        });
      });
    });

  }

  toggleShow(show, element) {
    if (show) { $(element).show(); }
    else { $(element).hide(); }
  }
}


export default Context;
