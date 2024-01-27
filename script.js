function agregarFilas() {
    var numeroActividades = document.getElementById("numeroActividades").value;
    var table = document.getElementById("actividadesTable");

    // Limpiar la tabla antes de agregar nuevas filas
    table.innerHTML = "<tr><th>Actividad</th><th>Tiempo Estándar (TS)</th><th>TS/TKT</th><th>OP (Operadores)</th><th>Op. Ml (Operadores Mínimos)</th></tr>";

    for (var i = 0; i < numeroActividades; i++) {
        var newRow = table.insertRow(table.rows.length);
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);
        var cell5 = newRow.insertCell(4);

        cell1.innerHTML = "<input type='text' name='actividad[]' value='" + String.fromCharCode(65 + i) + "' readonly>";
        cell2.innerHTML = "<input type='number' name='tiempo[]' required onkeydown='moverFoco(event, " + (i + 1) + ")'>";
        cell3.innerHTML = "<input type='number' name='ts_tkt[]' readonly></td>";
        cell4.innerHTML = "<input type='number' name='operadores[]' readonly></td>";
        cell5.innerHTML = "<input type='number' name='operadores_minimos[]' readonly></td>";
    }
}

function moverFoco(event, nextIndex) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evitar el comportamiento predeterminado del Enter en el formulario

        // Mover el foco al siguiente campo de entrada
        var nextInput = document.getElementsByName("tiempo[]")[nextIndex];
        if (nextInput) {
            nextInput.focus();
        } else {
            // Si es la última entrada, calcular el balanceo
            calcularBalanceo();
        }
    }
}

function calcularBalanceo() {
    var numeroOperadores = document.getElementById("numeroActividades").value;
    var ts_tkt_values = document.getElementsByName("ts_tkt[]");
    var operadores_values = document.getElementsByName("operadores[]");
    var ts_values = document.getElementsByName("tiempo[]");
    var op_ml_values = document.getElementsByName("operadores_minimos[]");

    for (var i = 0; i < ts_tkt_values.length; i++) {
        // Calcular TS/TKT y redondear al número entero más cercano
        var ts_tkt_value = parseFloat(ts_tkt_values[i].value);
        var operadores_result = Math.round(ts_tkt_value);

        // Verificar si operadores_result es 0 y, en ese caso, establecerlo en 1
        operadores_result = (operadores_result === 0) ? 1 : operadores_result;

        // Calcular TS/OP para obtener Op. Ml y redondear al número entero más cercano
        var ts_value = parseFloat(ts_values[i].value);
        var op_result = parseFloat(operadores_result);
        var op_ml_result = Math.round(ts_value / operadores_result);

        // Actualizar los campos OP y Op. Ml en la tabla
        operadores_values[i].value = operadores_result;
        op_ml_values[i].value = (ts_value / op_result);
    }
}


function calcularTKT() {
    var jornadaTrabajo = document.getElementById("jornadaTrabajo").value;
    var numeroPiezas = document.getElementById("numeroPiezas").value;

    var tkt = jornadaTrabajo / numeroPiezas;

    // Actualizar los campos TS/TKT en la tabla
    var ts_tkt = document.getElementsByName("ts_tkt[]");
    for (var i = 0; i < ts_tkt.length; i++) {
        ts_tkt[i].value = tkt.toFixed(2);
    }

    // Calcular y mostrar el resultado de TS/TKT
    var tsValues = document.getElementsByName("tiempo[]");
    for (var i = 0; i < tsValues.length; i++) {
        var ts_tkt_value = parseFloat(tsValues[i].value) / tkt;
        ts_tkt[i].value = ts_tkt_value.toFixed(2);
    }

    // Agregar el resultado de TKT junto con el resultado de tiempo de ciclo objetivo
    var tktResultDiv = document.getElementById("tktResult");
    tktResultDiv.innerHTML = "<p>Tick Time (TKT): " + tkt.toFixed(2) + " minutos por pieza.</p>";
}

function mostrarDatoMasGrande() {
    var ts_values = document.getElementsByName("tiempo[]");
    var op_ml_values = document.getElementsByName("operadores_minimos[]");
    var operadores_values = document.getElementsByName("operadores[]");
    var jornadaTrabajo = document.getElementById("jornadaTrabajo").value;
    var numeroPiezas = document.getElementById("numeroPiezas").value;


    // Encontrar el valor más grande en la columna op_ml_values
    var valorMasGrande = 0;
    var filaMasGrande = 0;

    for (var i = 0; i < op_ml_values.length; i++) {
        var valorActual = parseFloat(op_ml_values[i].value);
        if (valorActual > valorMasGrande) {
            valorMasGrande = valorActual;
            filaMasGrande = i;
        }
    }

    // Obtener los valores de la fila donde se encuentra el dato más grande
    var operadoresEnFilaMasGrande = parseFloat(operadores_values[filaMasGrande].value);
    var tiempoEnFilaMasGrande = parseFloat(ts_values[filaMasGrande].value);

    // Mostrar los resultados en un elemento de texto
    var datoMasGrandeDiv = document.getElementById("datoMasGrandeResult");
    datoMasGrandeDiv.innerHTML = "<p>Ts → Op. Ml= " + tiempoEnFilaMasGrande + "</p>" +
        "<p>Op= " + operadoresEnFilaMasGrande + "</p>" +
        "<p>Jornada= " + jornadaTrabajo + "</p>";
        
    // Obtener los valores de la fila donde se encuentra el dato más grande
    var operadoresEnFilaMasGrande = parseFloat(operadores_values[filaMasGrande].value);
    var tiempoEnFilaMasGrande = parseFloat(ts_values[filaMasGrande].value);

    // Realizar operaciones matemáticas con los datos obtenidos
    var resultadoOperacion = (operadoresEnFilaMasGrande * jornadaTrabajo) / tiempoEnFilaMasGrande;

    // Mostrar el resultado en un elemento de texto
    var PiezasMostrarDiv = document.getElementById("PiezasMostrar");
    PiezasMostrarDiv.innerHTML = "<p>Piezas que se pueden obtener: " + resultadoOperacion.toFixed(2) + "</p>";

    // Obtener los valores de la fila de piezas y resultado de operacion
    var operadoresEnFilaMasGrande = parseFloat(operadores_values[filaMasGrande].value);
    var tiempoEnFilaMasGrande = parseFloat(ts_values[filaMasGrande].value);

    // Realizar operaciones de eficiencia
    var EficienciaTotal = (resultadoOperacion / numeroPiezas)*100;

    // Mostrar el resultado de eficiencia
    var EficienciaDiv = document.getElementById("Eficiencia");
    EficienciaDiv.innerHTML = "<p>Eficiencia: " + EficienciaTotal.toFixed(1) + '%' +"</p>";

    // Actualizar la barra de progreso de eficiencia
    actualizarBarraDeProgreso(EficienciaTotal);
}

function actualizarBarraDeProgreso(eficiencia) {
    var progressBar = document.getElementById('eficienciaProgressBar');
    
    // Ajustar el color de la barra de progreso según la eficiencia
    if (eficiencia < 86) {
        progressBar.style.backgroundColor = '#FFA500';  // Naranja si es menos del 85%
    } else if (eficiencia <= 95) {
        progressBar.style.backgroundColor = '#FFFF00';  // Amarillo si es del 85% - 95%
    } else {
        progressBar.style.backgroundColor = '#4dff00';  // Verde para el 95% - 100%
    }

    // Actualizar el ancho de la barra de progreso
    progressBar.style.width = (eficiencia) + '%';
}
