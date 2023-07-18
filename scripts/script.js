$(document).ready(function () {
  $('#tabela').show();
  // Método AJAX para obtenção de dados JSON
  $.ajax({
    url: "./scripts/csvjson.json",
    dataType: "json",
    success: function (data) {
      var table = $("#table_id").DataTable({
        data: data,
        bAutoWidth: false,
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.12.1/i18n/pt-BR.json",
        },
        columns: [
          {
            data: "Termo",
            title: "Termo",
            className: "noVis",
            render: function (data, type, row) {
              return `<span class="mx-auto container font-weight-bold text-center termo">${data}</span>`;
            },
          },
          {
            data: "Definição",
            title: "Definição",
            className: "noVis",
            render: function (data, type, row) {
              let link1 = row.link1 ? row.link1.link : "";
              let link2 = row.link2 ? row.link2.link : "";
              let titulo1 = row.link1 ? row.link1.titulo : "";
              let titulo2 = row.link2 ? row.link2.titulo : "";

              return `<span class="mx-auto text-justify text-center definicao">${data}</span><br><a href="${link1}" target="_blank">${titulo1}</a><br><a href="${link2}" target="_blank">${titulo2}</a>`;
            },
          },
          {
            data: "Dificuldade",
            title: "Nível",
            className: "noVis",
            render: function (data, type, row) {
              switch (data) {
                case "Iniciante":
                  return `<span class="text-justify equalWidth text-center btn btn-outline-dark nivel" data-dificuldade="Iniciante">Iniciante</span>`;
                case "Intermediário":
                  return `<span class="text-center equalWidth text-justify btn btn-outline-dark nivel" data-dificuldade="Intermediário">Intermediário</span>`;
                case "Profissional":
                  return `<span class="text-center equalWidth text-justify btn btn-outline-dark nivel" data-dificuldade="Profissional">Profissional</span>`;
                default:
                  return data;
              }
            },
          },
          {
            data: "Tags",
            title: "Categorias",
            className: "noVis",
            render: function (data, type, row) {
              const categorias = data.split(",");
              let tagsHTML = "";
              categorias.forEach(function (categoria) {
                tagsHTML += `<span class="text-justify equalWidth text-center btn btn-outline-dark btn-group-sm categorias">${categoria}</span> `;
              });
              return tagsHTML;
            },
          },
        ],
      });

      var selectedDificuldades = new Set();
      var selectedTags = new Set();

      $("#table_id").on("click", ".nivel, .categorias", function () {
        var clickedText = $(this).text().trim();
        var searchBox = $("input.form-control, input.form-control-sm");
        var currentSearchValue = searchBox.val().trim();

        // Verifica se o termo já está presente na caixa de pesquisa
        if (!currentSearchValue.includes(clickedText)) {
          // Adiciona o valor clicado à caixa de pesquisa
          searchBox.val(searchBox.val() + " " + clickedText);

          table.search(searchBox.val()).draw();
          updateClearButton();
        }
      });

      $("#selectDificuldade, #selectCategoria").change(function (e) {
        var selectedValue = $(this).val();
        var oldValue = $(this).attr('old');
        var searchBox = $("input.form-control, input.form-control-sm");
        var currentSearchValue = searchBox.val().trim();

        if (selectedValue != oldValue && currentSearchValue.includes(oldValue)) {
          currentSearchValue = currentSearchValue.replace(oldValue, "").trim();
          searchBox.val(currentSearchValue);
        }
        // Verifica se o termo já está presente na caixa de pesquisa
        if (!currentSearchValue.includes(selectedValue)) {
          // Adiciona o valor selecionado à caixa de pesquisa
          searchBox.val(currentSearchValue + " " + selectedValue);
        }
        
        table.search(searchBox.val()).draw();
        updateClearButton();
        $(this).attr('old', selectedValue);
      });

      $("input.form-control, input.form-control-sm").on("input", function () {
        table.search($(this).val()).draw();
        updateClearButton();
      });

      function updateClearButton() {
        var searchBoxValue = $("input.form-control, input.form-control-sm").val().trim();
        var clearButton = $("#clearBtn");

        if (
          searchBoxValue.length > 0 ||
          selectedDificuldades.size > 0 ||
          selectedTags.size > 0
        ) {
          clearButton.removeAttr("disabled");
        } else {
          clearButton.prop("disabled", true);
        }
      }

      $("#cleanBtn").on("click", function () {
        $("input.form-control, input.form-control-sm, #selectDificuldade, #selectCategoria").val("").trigger("input");
      });

      var urlParams = new URLSearchParams(window.location.search);
      var termoPesquisa = urlParams.get("termo");

      if (termoPesquisa) {
        var conteudoDecodificado = decodeURIComponent(termoPesquisa);
        $("input.form-control, input.form-control-sm")
          .val(conteudoDecodificado)
          .trigger("input");
      }
    },
    error: function (jqxhr, textStatus, error) {
      console.error("Falha ao ler o arquivo JSON: " + error);
    },
  });

  $('#menuSobre').click(() => {
    $('#tabela').hide();

    $('main').load('./pages/sobre.html')
  }); 
  
});
