
//Entrega Final - Guastavino

fetch('modelosMonitores.json')
  .then(response => response.json())
  .then(data => {
    const modelosMonitores = data;

    function cargarOpciones(selectId, opciones) {
      const select = document.getElementById(selectId);
      select.innerHTML = '';
      opciones.forEach((opcion) => {
        const option = document.createElement('option');
        option.value = opcion;
        option.textContent = opcion;
        select.appendChild(option);
      });
    }

 
    function calcularCostoMonitor(marca, modelo, tipoPanel, pulgadas, frecuencia) {
      const monitor = modelosMonitores.find(
        (marcaMonitor) => marcaMonitor.marca === marca
      );

      if (monitor) {
        const modeloMonitor = monitor.modelos.find(
          (modeloMonitor) =>
            modeloMonitor.nombre === modelo &&
            modeloMonitor.tipoPanel === tipoPanel &&
            modeloMonitor.pulgadas.includes(pulgadas) &&
            frecuencia in modeloMonitor.frecuencia
        );

        if (modeloMonitor) {
          return modeloMonitor.frecuencia[frecuencia];
        }
      }

      return 0;
    }

    let totalCarrito = 0;

    window.onload = function() {
      const marcaSelect = document.getElementById('marca');
      const modeloSelect = document.getElementById('modelo');
      const tipoPanelSelect = document.getElementById('tipoPanel');
      const pulgadasSelect = document.getElementById('pulgadas');
      const frecuenciaSelect = document.getElementById('frecuencia');
      const calcularButton = document.getElementById('calcular');
      const detallesCompraDiv = document.getElementById('detalles-compra');
      const carritoLista = document.getElementById('carrito-lista');

      marcaSelect.addEventListener('change', function() {
        const marcaSeleccionada = marcaSelect.value;
        const modelosMarcaSeleccionada = modelosMonitores.find(
          (marcaMonitor) => marcaMonitor.marca === marcaSeleccionada
        ).modelos;
        
        cargarOpciones('modelo', modelosMarcaSeleccionada.map((modeloMonitor) => modeloMonitor.nombre));
        cargarOpciones('tipoPanel', [modelosMarcaSeleccionada[0].tipoPanel]);
        cargarOpciones('pulgadas', modelosMarcaSeleccionada[0].pulgadas);
        const frecuencias = Object.keys(modelosMarcaSeleccionada[0].frecuencia);
        cargarOpciones('frecuencia', frecuencias);
      });

      modeloSelect.addEventListener('change', function() {
        const marcaSeleccionada = marcaSelect.value;
        const modeloSeleccionado = modeloSelect.value;
        const modeloMonitor = modelosMonitores
          .find((marcaMonitor) => marcaMonitor.marca === marcaSeleccionada)
          .modelos.find((modeloMonitor) => modeloMonitor.nombre === modeloSeleccionado);

        cargarOpciones('tipoPanel', [modeloMonitor.tipoPanel]);
        cargarOpciones('pulgadas', modeloMonitor.pulgadas);
        const frecuencias = Object.keys(modeloMonitor.frecuencia);
        cargarOpciones('frecuencia', frecuencias);
      });

      calcularButton.addEventListener('click', function() {
        const marca = marcaSelect.value;
        const modelo = modeloSelect.value;
        const tipoPanel = tipoPanelSelect.value;
        const pulgadas = pulgadasSelect.value;
        const frecuencia = frecuenciaSelect.value;

        const costo = calcularCostoMonitor(marca, modelo, tipoPanel, pulgadas, frecuencia);

        if (costo > 0) {
          const detallesMonitor = {
            marca: marca,
            modelo: modelo,
            tipoPanel: tipoPanel,
            pulgadas: pulgadas,
            frecuencia: frecuencia,
            costo: costo
          };

          localStorage.setItem('detallesMonitor', JSON.stringify(detallesMonitor));

          detallesCompraDiv.innerHTML = `
            <h2>Detalles de la Compra</h2>
            <p>Marca: ${marca}</p>
            <p>Modelo: ${modelo}</p>
            <p>Tipo de Panel: ${tipoPanel}</p>
            <p>Pulgadas: ${pulgadas} pulgadas</p>
            <p>Frecuencia: ${frecuencia}</p>
            <p>Costo: $${costo.toFixed(2)}</p>
            <button id="comprar">Agregar al carrito de compras</button>
          `;

          const comprarButton = document.getElementById('comprar');
          comprarButton.addEventListener('click', function() {
            carritoLista.innerHTML += `
              <li>
                <span>${marca} ${modelo}</span>
                <span>Tipo de Panel: ${tipoPanel}</span>
                <span>Pulgadas: ${pulgadas} pulgadas</span>
                <span>Frecuencia: ${frecuencia}</span>
                <span>Costo: $${costo.toFixed(2)}</span>
              </li>
            `;

           
            totalCarrito += costo;
            document.getElementById('total-carrito').textContent = `$${totalCarrito.toFixed(2)}`;

           
          });
        } else {
          detallesCompraDiv.innerHTML = `
            <p>El monitor seleccionado no se encuentra disponible en nuestras opciones.</p>
          `;
         
        }
      });
    };
  })