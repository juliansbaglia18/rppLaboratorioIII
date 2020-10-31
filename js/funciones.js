var objId;
var peticionHttp = new XMLHttpRequest();
var listaJson= new Array();
var urlAutos = 'http://localhost:3000/autos';
var urlGuardar = 'http://localhost:3000/nuevoAuto';
var urlEditar = 'http://localhost:3000/editarYear';
var rta;
var flag = false;
var autoAGuardar;
var añoAux;
var selectedOption;
var idEditar;

window.addEventListener("load", Load);

function Load(){
    Botones();
    realizarPeticionGET(urlAutos, traerJsonGetTabla);
}

function Botones(){
    var btnAbrir = document.getElementById("btnAbrir");
    btnCerrar.addEventListener("mouseout",function(){
        btnCerrar.value = "X";
    });
    btnCerrar.addEventListener("mouseover",function(){
        btnCerrar.value = "Bye";
    });
    
    
    btnGuardar.addEventListener("mouseout",function(){
        btnGuardar.value = "Modificar";
    });
    btnGuardar.addEventListener("mouseover",function(){
        btnGuardar.value = "Todo listo?";
    });
    btnAbrir.addEventListener("click", abrirContenedor);

    var select = document.getElementById("slcAño");
    agregarAños(select);
}

function realizarPeticionGET(url, funcion){
    peticionHttp.onreadystatechange = funcion;
    peticionHttp.open("GET", url, true);
    peticionHttp.send();
}

function traerJsonGetTabla(){
    
    tabla=document.getElementById("tableAutos");
    if(peticionHttp.readyState == 4)
    {
        if(peticionHttp.status == 200)
        {
            var respuesta=peticionHttp.responseText;
            var json= JSON.parse(respuesta);

            console.log("cantidad de elementos: " + json.length);
            
            for(var i=0; i<json.length;i++)
            {
                var listaTr=new Array();
                var auto=new Array(json[i].make,json[i].model,
                    json[i].year,json[i].id);
                var trAuto=CrearNodo(auto);
                
                
                // trMateria.addEventListener("dblclick", abrirContenedor);
                
                tabla.appendChild(trAuto);

                
                var element=document.getElementsByTagName("tr");
                for(var j=0; j<element.length; j++)
                {
                    listaTr.push(element[i]);
                }
                listaJson.push(json[i]);
            }
        }else{
            alert("ERROR");
        }
    }
}

function CrearNodo(auto)
{
  var trAuto=document.createElement("tr");
        
  var tdId=document.createElement("td");
  var tdMarca=document.createElement("td");
  var tdModelo=document.createElement("td");
  var tdAño=document.createElement("select");
  agregarAñosFilas(tdAño, auto[2]);
    tdAño.addEventListener("change",function(){
        selectedOption = this.options[tdAño.selectedIndex];
        console.log(': ' + selectedOption.text);
      });
      tdAño.addEventListener("change", EditarAño);
  tdId.hidden = true;

        
  var txMarca= document.createTextNode(auto[0]);
  var txModelo=document.createTextNode(auto[1]);
  var txAño=document.createTextNode(auto[2]);
  var txId=document.createTextNode(auto[3]);

  tdMarca.appendChild(txMarca);
  tdModelo.appendChild(txModelo);
  tdAño.appendChild(txAño);
  tdId.appendChild(txId);

  trAuto.appendChild(tdMarca);
  trAuto.appendChild(tdModelo);
  trAuto.appendChild(tdAño);
  trAuto.appendChild(tdId);
  
  return trAuto;
}

function abrirContenedor(){
    var contenedor = document.getElementById("divContenedor");
    contenedor.hidden = false;

    if(flag == false){
        contenedor.hidden = flag;
        flag = true;
        btnAbrir.value = "Cerrar"
    }else{
        contenedor.hidden = flag;
        flag = false;
        btnAbrir.value = "Abrir"
    }

    document.getElementById("txtMarca").value = "";
    document.getElementById("txtModelo").value = "";
    document.getElementById("slcAño").disabled = false;
    

    var btnCerrar = document.getElementById("btnCerrar");
    btnCerrar.addEventListener("click",CerrarContenedor);
    
    var btnGuardar = document.getElementById("btnGuardar");    
    btnGuardar.addEventListener("click",Crear);
}

function CerrarContenedor(){
    var contenedor = document.getElementById("divContenedor");
    contenedor.hidden = true;
    
    flag = false;
    btnAbrir.value = "Abrir"
}

function Crear(){
    // fecha = iniciarFecha(fecha);
    // document.getElementById("idMateria").value = id;
    var marca = document.getElementById("txtMarca");
    var modelo = document.getElementById("txtModelo");
    
    var año = document.getElementById("slcAño").value;
    
    if(ValidarMarcaModeloAño(marca,modelo, año) == true){
        marca.className = "inputSinError";
        modelo.className = "inputSinError";
        var auto = new Array(marca.value, modelo.value, año);
        CrearAuto(auto);
        // AñadirFila(auto);
        autoAGuardar = auto;
        
        CerrarContenedor();
    }
}
function ValidarMarcaModeloAño(marca, modelo, año){
    var retorno=true;
    if(marca.value.length <3)
    {
        console.log("Error en la marca");
        marca.className="inputError";
        retorno =false;
    }else{
        marca.className="inputSinError";
    }
    if(modelo.value.length <3)
    {
        console.log("Error en la marca");
        modelo.className="inputError";
        retorno =false;
    }else{
        modelo.className="inputSinError";
    }
    
    return retorno;
}

function AñadirFila(auto){
    console.log("Nuevo elemento: " + auto[0]);
    var tabla=document.getElementById("tableAutos");
    var listaTr=new Array();

    var trAutos=CrearNodo(auto);

        
        tabla.appendChild(trAutos);
    
        
        var element=document.getElementsByTagName("tr");
        for(var j=0; j<element.length; j++)
        {
            listaTr.push(element);
        }
}

function CrearAuto(auto){
    var json = {"make":auto[0],"model":auto[1],"year":auto[2]};
    realizarPeticionPostGuardar(urlGuardar, respuestaPostGuardar, JSON.stringify(json));
}

function realizarPeticionPostGuardar(url, funcion, param){
    SpinnerOn();
    peticionHttp.onreadystatechange = funcion;
    peticionHttp.open("POST", url, true);
    
    peticionHttp.setRequestHeader("Content-Type", "application/json");
    peticionHttp.send(param);
}

function respuestaPostGuardar(){
    if(peticionHttp.readyState===4){
        if(peticionHttp.status===200){
        AñadirFila(autoAGuardar);
        SpinnerOff();
        }
    }
}

function SpinnerOn(){
    document.getElementById("loader").hidden = false;
}
function SpinnerOff(){
    document.getElementById("loader").hidden = true;
}

function agregarAñosFilas(select, año){
    var flag  = false
        for(var i = 2000; i <= 2020; i++){
            var option = document.createElement('option');
            
            option.value = i;
            option.text = i;
            
            if(año < 2000 && flag == false){
                var optionAux = document.createElement('option');
                flag = true;
                optionAux.value = año;
                optionAux.text = año;
                optionAux.selected = true;
                select.appendChild(optionAux);
            }
            if(i == año){
                option.selected = true;
            }

            select.appendChild(option);
        }
}
function agregarAños(select){
        for(var i = 2000; i <= 2020; i++){
            var option = document.createElement('option');
            option.value = i;
            option.text = i;
            select.appendChild(option);
        }
}

function EditarAño(event){

    var row = event.target.parentNode;
    var id = row.childNodes[3].innerText;

    console.log("id de elemento a modificar" + id);
    var json = {"id":id, "year":selectedOption.text};
    
    realizarPeticionPostEditar(urlEditar, respuestaPostEditar, JSON.stringify(json));
}
function realizarPeticionPostEditar(url, funcion, param){
    SpinnerOn();
    peticionHttp.onreadystatechange = funcion;
    peticionHttp.open("POST", url, true);
    // console.log(peticionHttp.onreadystatechange);
    
    peticionHttp.setRequestHeader("Content-Type", "application/json");
    peticionHttp.send(param);
}

function respuestaPostEditar(){
    if(peticionHttp.readyState===4){
        if(peticionHttp.status===200){
                SpinnerOff();
        }
    }
}