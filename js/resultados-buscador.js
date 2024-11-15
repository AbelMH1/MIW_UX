$(document).ready(function() {
    // Obtener el término de búsqueda de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const terminoBusqueda = urlParams.get('query');
    
    // Mostrar el término de búsqueda en la página de resultados
    $('#termino-busqueda').text(terminoBusqueda);

    // Lista de páginas donde buscar
    const paginas = ["index.html", "aficiones.html", "proyectos.html", "contacto.html", "viajes.html", "deportes.html", "programacion.html", "videojuegos.html"];
    const resultadosDiv = $('#resultados-busqueda');
    let resultadosEncontrados = 0; // Contador de resultados encontrados

    // Si no hay término de búsqueda, no hacer nada
    if (!terminoBusqueda) {
        resultadosDiv.html("<p>Introduce un término de búsqueda para ver resultados.</p>");
        return;
    }

    // Función para mostrar los resultados con el nombre de archivo y un extracto de contexto
    function mostrarResultado(pagina, texto, query) {
        // Crear un extracto con la coincidencia
        const indice = texto.toLowerCase().indexOf(query.toLowerCase());
        const inicio = Math.max(0, indice - 40);  // 40 caracteres antes de la coincidencia
        const fin = Math.min(texto.length, indice + query.length + 40);  // 40 caracteres después de la coincidencia
        const extracto = `${texto.substring(inicio, indice)}<b>${texto.substring(indice, indice + query.length)}</b>${texto.substring(indice + query.length, fin)}`;

        // Crear y mostrar el resultado
        resultadosDiv.append(`
            <div class="resultado-item">
                <h3><a href="${pagina}">${pagina}</a></h3>
                <p>${extracto}...</p>
            </div>
        `);

        resultadosEncontrados++; // Incrementar el contador de resultados
    }

    // Buscar el término en cada página
    paginas.forEach((pagina, index) => {
        $.ajax({
            url: pagina,
            dataType: "html",
            success: function(data) {
                // Crear un elemento temporal para manipular el HTML recibido
                const $contenido = $('<div>').html(data);
                
                // Obtener solo el texto sin los elementos <script> y <style>
                const textoFiltrado = $contenido.find("main *:not(script):not(style)").text();

                // Verificar si hay coincidencia
                if (textoFiltrado.toLowerCase().includes(terminoBusqueda.toLowerCase())) {
                    mostrarResultado(pagina, textoFiltrado, terminoBusqueda);
                }

                // Si estamos en el último archivo y no hubo resultados, mostrar el mensaje
                if (index === paginas.length - 1 && resultadosEncontrados === 0) {
                    resultadosDiv.append("<p>No se encontraron resultados para tu búsqueda.</p>");
                }
            },
            error: function() {
                console.error(`No se pudo cargar el contenido de ${pagina}`);

                // Si estamos en el último archivo y no hubo resultados, mostrar el mensaje
                if (index === paginas.length - 1 && resultadosEncontrados === 0) {
                    resultadosDiv.append("<p>No se encontraron resultados para tu búsqueda.</p>");
                }
            }
        });
    });
});
