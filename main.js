let modelosMonitores = []; 

function cargarModelosMonitores() {
  fetch('modelosMonitores.json')
    .then(response => response.json())
    .then(data => {
      modelosMonitores = data;
      const marcas = [...new Set(data.map(item => item.marca))];
      marcas.forEach((marca) => {
        const option = document.createElement("option");
        option.value = marca;
        option.textContent = marca;
        marcaSelect.appendChild(option);
      });

      const modelosPrimeraMarca = data.filter(item => item.marca === marcas[0]);
      modelosPrimeraMarca.forEach((modelo) => {
        const option = document.createElement("option");
        option.value = modelo.modelo;
        option.textContent = modelo.modelo;
        modeloSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error al cargar el archivo JSON', error);
    });
}

window.onload = function () {
  const marcaSelect = document.getElementById("marca"); 
  const modeloSelect = document.getElementById("modelo");

  cargarModelosMonitores();

  const tipoPanelSelect = document.getElementById("tipoPanel");
  const pulgadasSelect = document.getElementById("pulgadas");
  const frecuenciaSelect = document.getElementById("frecuencia");
  const calcularButton = document.getElementById("calcular");
  const detallesCompraDiv = document.getElementById("detalles-compra");
  const resultadoDiv = document.getElementById("resultado");

  marcaSelect.addEventListener("change", function () {
    modeloSelect.innerHTML = "";
    const modelos = modelosMonitores.filter((item) => item.marca === marcaSelect.value);
    modelos.forEach((modelo) => {
      const option = document.createElement("option");
      option.value = modelo.modelo;
      option.textContent = modelo.modelo;
      modeloSelect.appendChild(option);
    });
  });

  calcularButton.addEventListener("click", function () {
    const marca = marcaSelect.value;
    const modelo = modeloSelect.value;
    const tipoPanel = tipoPanelSelect.value;
    const pulgadas = pulgadasSelect.value;
    const frecuencia = frecuenciaSelect.value;

    const monitor = modelosMonitores.find(
      (item) =>
        item.marca === marca &&
        item.modelo === modelo &&
        item.tipoPanel === tipoPanel &&
        item.pulgadas === pulgadas &&
        frecuencia in item.frecuencia
    );

    if (monitor) {
      const costo = monitor.frecuencia[frecuencia];

      const detallesMonitor = {
        marca: marca,
        modelo: modelo,
        tipoPanel: tipoPanel,
        pulgadas: pulgadas,
        frecuencia: frecuencia,
        costo: costo,
      };

      localStorage.setItem("detallesMonitor", JSON.stringify(detallesMonitor));

      detallesCompraDiv.innerHTML = `
          <h2>Detalles de la Compra</h2>
          <p>Marca: ${marca}</p>
          <p>Modelo: ${modelo}</p>
          <p>Tipo de Panel: ${tipoPanel}</p>
          <p>Pulgadas: ${pulgadas} pulgadas</p>
          <p>Frecuencia: ${frecuencia}</p>
          <p>Costo: $${costo}</p>
          <button id="comprar">COMPRAR</button>
        `;

      const comprarButton = document.getElementById("comprar");
      comprarButton.addEventListener("click", function () {
        resultadoDiv.innerHTML = `
            <p>¡Compra realizada con éxito!</p>
          `;
      });
    } else {
      detallesCompraDiv.innerHTML = `
          <p>El monitor seleccionado no se encuentra disponible en nuestras opciones.</p>
        `;
      resultadoDiv.innerHTML = "";
    }
  });
};

