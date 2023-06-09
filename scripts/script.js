$(document).ready(function () {
  $("input.form-control").prop("disabled", true);

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
              return `<span class="mx-auto container font-weight-bold text-center" id="termo">${data}</span>`;
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

              return `<span class="mx-auto text-justify text-center"  id="definicao">${data}</span><br><a  href="${link1}" target="_blank">${titulo1}</a><br><a  href="${link2}" target="_blank">${titulo2}</a>`;
            },
          },
          {
            data: "Dificuldade",
            title: "Nível",
            className: "noVis",
            render: function (data, type, row) {
              switch (data) {
                case "Iniciante":
                  return `<span class="text-justify equalWidth text-center btn btn-outline-dark" id="nivel" data-dificuldade="Iniciante">Iniciante</span>`;
                case "Intermediário":
                  return `<span class="text-center equalWidth text-justify btn btn-outline-dark"  id="nivel" data-dificuldade="Intermediário">Intermediário</span>`;
                case "Profissional":
                  return `<span class="text-center equalWidth text-justify btn btn-outline-dark"  id="nivel" data-dificuldade="Profissional">Profissional</span>`;
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
                tagsHTML += `<span class="text-justify equalWidth text-center btn btn-outline-dark btn-group-sm" id="categorias">${categoria}</span> `;
              });
              return tagsHTML;
            },
          },
        ],
      });

      var selectedDificuldades = new Set();
      var selectedTags = new Set();

      $("#table_id").on("click", "span#categorias, span#nivel", function () {
        var clickedText = $(this).text().trim();
        var searchBox = $(".form-control, .form-control-sm");
        var currentSearchValue = searchBox.val().trim();

        // Verifica se o termo já está presente na caixa de pesquisa
        if (!currentSearchValue.includes(clickedText)) {
          // Verifica se a caixa de pesquisa já contém algum valor
          if (currentSearchValue.length > 0) {
            // Adiciona o valor clicado à caixa de pesquisa separado por vírgula
            searchBox.val(currentSearchValue + " " + clickedText);
          } else {
            // Define o valor clicado como o valor da caixa de pesquisa
            searchBox.val(clickedText);
          }

          table.search(searchBox.val()).draw();
          updateClearButton();
        }
      });

      $(".form-control, .form-control-sm").on("input", function () {
        table.search($(this).val()).draw();
        updateClearButton();
      });

      function updateClearButton() {
        var searchBoxValue = $(".form-control, .form-control-sm").val().trim();
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
        $(".form-control, .form-control-sm").val("").trigger("input");
      });

      var urlParams = new URLSearchParams(window.location.search);
      var termoPesquisa = urlParams.get("termo");

      if (termoPesquisa) {
        var conteudoDecodificado = decodeURIComponent(termoPesquisa);
        $(".form-control, .form-control-sm")
          .val(conteudoDecodificado)
          .trigger("input");
      }

      $("#table_id").on("click", "span#nivel", function () {
        var clickedDificuldade = $(this).attr("data-dificuldade");

        if (selectedDificuldades.has(clickedDificuldade)) {
          selectedDificuldades.delete(clickedDificuldade);
        } else {
          selectedDificuldades.add(clickedDificuldade);
        }

        updateClearButton();
      });
    },
    error: function (jqxhr, textStatus, error) {
      console.error("Falha ao ler o arquivo JSON: " + error);
    },
  });
});
