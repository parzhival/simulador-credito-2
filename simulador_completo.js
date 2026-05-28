
let clientes = [];
let creditos = [];

let tasaInteres = 15;
let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;


function ocultarSecciones() {
  document.getElementById("clientes").classList.remove("activa");
  document.getElementById("parametros").classList.remove("activa");
  document.getElementById("credito").classList.remove("activa");
  document.getElementById("listaCreditos").classList.remove("activa");

}

function mostrarSeccion(id) {
  ocultarSecciones()
  document.getElementById(id).classList.add("activa")
}

function guardarTasa() {
  let valor = recuperarInt("tasaInteres")
  if (valor >= 10 && valor <= 20) {
    tasaInteres = valor
    mostrarTexto("mensajeTasa", "Tasa configurada correctamente: " + tasaInteres + "%")
  } else {
    mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%")
  }
  return valor
}

function guardarCliente() {
  let cmpCedula = recuperaraTexto("cedula")
  let cmpNombre = recuperaraTexto("nombre")
  let cmpApellido = recuperaraTexto("apellido")
  let cmpIngresos = recuperarFloat("ingresos")
  let cmpEgresos = recuperarFloat("egresos")
  let cmpTelefono = recuperaraTexto("telefono")

  let cliente = {
    cedula: cmpCedula,
    nombre: cmpNombre,
    apellido: cmpApellido,
    ingresos: cmpIngresos,
    egresos: cmpEgresos,
    telefono: cmpTelefono,
  }
  if (clienteSeleccionado != null) {
    if (clientes[clienteSeleccionado].cedula != cliente.cedula) {
      alert("NO SE PERMITE MODIFICAR LA CEDULA")
    }
    clientes[clienteSeleccionado].nombre = cliente.nombre
    clientes[clienteSeleccionado].apellido = cliente.apellido
    clientes[clienteSeleccionado].ingresos = cliente.ingresos
    clientes[clienteSeleccionado].egresos = cliente.egresos
    clientes[clienteSeleccionado].telefono = cliente.telefono
  } else {
    clientes.push(cliente)// se guarda el objeto
    console.log(clientes)
    console.log(clientes.toString())
  }
  pintarCliente()
  limpiar()
}



function pintarCliente() {
  let tabla = document.getElementById("tablaClientes");
  let contenidoTabla = "";
  for (let i = 0; i < clientes.length; i++) {
    let objCliente = clientes[i];
    contenidoTabla += "<tr>"
    contenidoTabla += "<td>" + objCliente.cedula + "</td>"
    contenidoTabla += "<td>" + objCliente.nombre + "</td>"
    contenidoTabla += "<td>" + objCliente.apellido + "</td>"
    contenidoTabla += "<td>" + objCliente.ingresos + "</td>"
    contenidoTabla += "<td>" + objCliente.egresos + "</td>"
    contenidoTabla += "<td>" + objCliente.telefono + "</td>"
    contenidoTabla += "<td>" +
      "<button onclick=seleccionarCliente(" + objCliente.cedula + ")>Actualizar</button>" +
      "<button onclick=eliminar("+ i +")>Eliminar</button>" +
      "</td>"
    contenidoTabla += "</tr>"  
  }

  tabla.innerHTML = contenidoTabla;
}


function buscarCliente(cedula) {
  for (let i = 0; i < clientes.length; i++) {
    let objCliente = clientes[i];
    if (objCliente.cedula == cedula) {
      return i
    }
  }
  return null
}

function seleccionarCliente(cedula) {
  clienteSeleccionado = buscarCliente(cedula);
  if (clienteSeleccionado != null) {
    mostrarTextoEnCaja("cedula", clientes[clienteSeleccionado].cedula)
    mostrarTextoEnCaja("nombre", clientes[clienteSeleccionado].nombre)
    mostrarTextoEnCaja("apellido", clientes[clienteSeleccionado].apellido)
    mostrarTextoEnCaja("ingresos", clientes[clienteSeleccionado].ingresos)
    mostrarTextoEnCaja("egresos", clientes[clienteSeleccionado].egresos)
    mostrarTextoEnCaja("telefono", clientes[clienteSeleccionado].telefono)
  }

}

function limpiar() {
  mostrarTextoEnCaja("cedula", "")
  mostrarTextoEnCaja("nombre", "")
  mostrarTextoEnCaja("apellido", "")
  mostrarTextoEnCaja("ingresos", "")
  mostrarTextoEnCaja("egresos", "")
  mostrarTextoEnCaja("telefono", "")

}

function eliminar(indice) {
  clientes.splice(indice, 1);
  pintarCliente();
}

function buscarClienteCredito() {
  let cmpCedula = recuperaraTexto("buscarCedulaCredito");
  let cliente = buscarCliente(cmpCedula);
  let resultadoCliente = document.getElementById("datosClienteCredito")
  let tabla = ""

  clienteSeleccionado = null;

  if (cliente !== null) {
    clienteSeleccionado = cliente;

    tabla = `
                  <h3>Datos del Cliente</h3>
                  <p><strong>Cédula:</strong>${clientes[clienteSeleccionado].cedula}</p>
                  <p><strong>Nombre:</strong>${clientes[clienteSeleccionado].nombre}</p>
                  <p><strong>Apellido:</strong>${clientes[clienteSeleccionado].apellido}</p>
                  <p><strong>Ingresos:</strong>${clientes[clienteSeleccionado].ingresos}</p>
                  <p><strong>Egresos:</strong>${clientes[clienteSeleccionado].egresos}</p>
                   <p><strong>Egresos:</strong>${clientes[clienteSeleccionado].telefono}</p>
                   `;
  } else {
    tabla = `
                 <h3> El cliente no Existe </h3>
                 `;
  }
  resultadoCliente.innerHTML = tabla;
}

function calcularCredito(){
  let monto = recuperarInt("montoCredito");
  let plazo = recuperarInt("plazoCredito");
  let taza = guardarTasa();
  let disponible = calcularDisponible(clientes[clienteSeleccionado].ingresos,clientes[clienteSeleccionado].egresos);
  let monto1 = calcularCapacidadPago(disponible);
  let interes = calcularInteresSimple(monto, taza,monto );
  let total = calcularTotalPagar( monto,taza);
  let cuota= calcularCuotaMensual(total, plazo).toFixed(2);
  let tabla= ""
  let resultadoCredito = document.getElementById("resultadoCredito")
  let estado = aprobarCredito(monto1,cuota);
  let estado1
  let botonCredito = document.getElementById("btnSolicitarCredito")
  if(estado == true){
    estado1= "credito aprobado"
    resultadoCredito.className = "aprobado"
    botonCredito.disabled = false;
  }else{
    estado1= "credito rechazado"
    resultadoCredito.className = "rechazado"
    botonCredito.disabled = true;
  }

  montoCalculado = monto;
  cuotaCalculada = cuota;
  plazoCalculado = plazo;
  tasaInteres = taza;
  
  tabla+= "<tr>"
   tabla+=          "<p>capacidad de pago: "+ monto1 +"</p>"
   tabla+=          "<p>total a pagar: "+ total+"</p>"
   tabla+=          "<p>cuota mensual: "+cuota+"</p>"
   tabla+=          "<p>resultado: "+estado1 +"</p>"        
   tabla+=        "</tr>" 
  resultadoCredito.innerHTML= tabla ;      
}

function calcularDisponible(ingresos, egresos) {
  let disponible;
  disponible = ingresos - egresos;
  if (disponible < 0) {
    disponible = 0
  }
  return disponible;
}
function calcularCapacidadPago(montoDisponible) {
  let monto;
  monto = montoDisponible / 2;
  return monto;
}
function calcularInteresSimple(monto, tasa, tiempo) {
  let cuota;
  cuota = tiempo * monto * (tasa / 100);
  return cuota;
}
function calcularTotalPagar(monto, tasa) {
  let totalPagar;
  totalPagar = monto + tasa + 100;
  return totalPagar;
}
function calcularCuotaMensual(total, tiempo) {
  let cuotaMensual;
  cuotaMensual = total / (tiempo * 12);
  return cuotaMensual;
}
function aprobarCredito(capacidadPago,cuotaMensual){
    if(capacidadPago >  cuotaMensual){
        
        return true
    }else{
        
        return false
    }

}

function solicitarCredito(){
  let resultadoCredito = document.getElementById("resultadoCredito");
  let resultadoCliente = document.getElementById("datosClienteCredito");
  let cliente= clientes[clienteSeleccionado]  

  let credito = {
      cedula: cliente.cedula,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      monto: montoCalculado,
      tasa: tasaInteres,
      plazo: plazoCalculado,
      cuota: cuotaCalculada
     }


    creditos.push(credito);
    mostrarTextoEnCaja("montoCredito", "");
    mostrarTextoEnCaja("plazoCredito", "");
    mostrarTextoEnCaja("buscarCedulaCredito", "");
    resultadoCredito.innerHTML = `<p>Credito Registrado</p>`;
    resultadoCliente.innerHTML = "";
}

function buscarCreditos(cedula) {
  let creditosEncontrados = [];

  for (let i = 0; i < creditos.length; i++) {
    let objCredito = creditos[i];

    if (objCredito.cedula == cedula) {
      creditosEncontrados.push(objCredito);
    }
  }

  return creditosEncontrados;
}

function pintarCreditos(creditos) {
  let tabla = document.getElementById("tablaCreditos");
  let contenidoTabla = "";

  if (creditos.length === 0) {
    contenidoTabla += "<tr><td colspan='8'>No existen créditos registrados.</td></tr>";
    tabla.innerHTML = contenidoTabla;
    return; 
  }

  for (let i = 0; i < creditos.length; i++) {
    let objCredito = creditos[i];
    
    contenidoTabla += "<tr>";
    contenidoTabla += "<td>" + objCredito.cedula + "</td>";
    contenidoTabla += "<td>" + objCredito.nombre + "</td>";
    contenidoTabla += "<td>" + objCredito.apellido + "</td>";
    contenidoTabla += "<td>" + objCredito.monto + "</td>";
    contenidoTabla += "<td>" + objCredito.tasa + "%</td>";
    contenidoTabla += "<td>" + objCredito.plazo + "</td>";
    contenidoTabla += "<td>" + objCredito.cuota + "</td>";
    contenidoTabla += "<td>Aprobado</td>"; 
    contenidoTabla += "</tr>";
  }

  tabla.innerHTML = contenidoTabla;
}

function buscarCreditosCliente() {
  let cmpAviso = recuperarElemento("txtAvisoCredito");
  let cmpCedula = recuperarTexto("buscarCedulaListado").trim();

  if (!validarCedula(cmpCedula)) {
    cmpAviso.classList.add("aviso");
    cmpAviso.innerText = "La cédula debe tener 10 digitos";
    return;
  }

  cmpAviso.innerHTML = "";
  let creditosCliente = buscarCreditos(cmpCedula);

  pintarCreditos(creditosCliente);
}

function buscarCreditosCliente() {
  let cmpAviso = document.getElementById("txtAvisoCredito");
  let cmpCedula = recuperaraTexto("buscarCedulaListado");

  if (cmpCedula.length != 10) {
    cmpAviso.className = "aviso"; 
    cmpAviso.innerHTML = "La cédula debe tener 10 digitos";
    return;
  }

  cmpAviso.innerHTML = "";

  let creditosCliente = buscarCreditos(cmpCedula);
  pintarCreditos(creditosCliente);
}