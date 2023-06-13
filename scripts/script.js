$(document).ready(function () {
  $("#clearBtn").prop("disabled", true);
  
  // Método ajax para obtenção de dados JSON
  $.getJSON('/scripts/csvjson.json', function (data) {
    var table = $('#table_id').DataTable({
      data: data,
      bAutoWidth: false,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.12.1/i18n/pt-BR.json',
      },
      columns: [
        { 
          data: "Termo", 
          title: "Termo", 
          className: "noVis", 
          render: function(data, type, row) {
            return `<span class="mx-auto container font-weight-bold text-center" id="termo">${data}</span>`;
          }
        },
        { 
          data: "Definição", 
          title: "Definição", 
          className: "noVis", 
          render: function(data, type, row) {
            let link1 = row.link1;
            let link2 = row.link2;
            return `<span class="mx-auto text-justify text-center"  id="definicao">${data}</span><br><a href="${link1}">${link1}</a><br><a href="${link2}">${link2}</a>`;
          }
        },
        { 
          data: "Dificuldade", 
          title: "Nível", 
          className: "noVis", 
          render: function(data, type, row) {
            switch (data) {
              case "Iniciante":
                return `<span class="text-justify text-center btn btn-outline-dark" id="nivel">Iniciante</span>`;
              case "Intermediário":
                return `<span class="text-center text-justify btn btn-outline-dark"  id="nivel">Intermediário</span>`;
              case "Profissional":
                return `<span class="text-center text-justify btn btn-outline-dark"  id="nivel">Profissional</span>`;
              default:
                return data;
            }
          }
        },
        { 
          data: "Tags", 
          title: "Categorias", 
          className: "noVis", 
          render: function(data, type, row) {
            const categorias = data.split(",");
            let tagsHTML = "";
            categorias.forEach(function(categoria) {
              tagsHTML += `<span class="text-justify text-center btn btn-outline-dark btn-group-sm" id="categorias">${categoria}</span> `;
            });
            return tagsHTML;
          }
        }
      ]
    });

    $('#table_id').on('click', 'span#categorias, span#nivel', function() {
      var clickedText = $(this).text().trim();
      var searchBox = $('.form-control, .form-control-sm');
      var currentSearchValue = searchBox.val().trim();

      // Verifica se a caixa de pesquisa já contém algum valor
      if (currentSearchValue.length > 0) {
        // Adiciona o valor clicado à caixa de pesquisa separado por vírgula
        searchBox.val(currentSearchValue + ' ' + clickedText);
      } else {
        // Define o valor clicado como o valor da caixa de pesquisa
        searchBox.val(clickedText);
      }

      table.search(searchBox.val()).draw();
      updateClearButton();
    });

    $(".form-control").on("input", function () {
      table.search($(this).val()).draw();
      updateClearButton();
    });

    function updateClearButton() {
      var searchBoxValue = $(".form-control").val().trim();
      var clearButton = $("#clearBtn");

      if (searchBoxValue.length > 0) {
        clearButton.removeAttr("disabled");
      } else {
        clearButton.prop("disabled", true);
      }
    }

    $("#cleanBtn").on("click", function () {
      $(".form-control").val("").trigger("input");
    });
  }).fail(function (jqxhr, textStatus, error) {
    console.error("Falha ao ler o arquivo JSON: " + error);
  });
  
});
