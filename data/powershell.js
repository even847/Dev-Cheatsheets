// Guía de PowerShell.
// Campos opcionales por entrada: desc, ej (salida de ejemplo), alias, tip (consejo), warn (precaución).
// Campos opcionales por sección: intro (texto que explica la sección), nota, tipo: 'pasos' | 'glosario'.
window.CHEATSHEETS = window.CHEATSHEETS || {};
window.CHEATSHEETS.powershell = {
  meta: { id: 'powershell', nombre: 'PowerShell', subtitulo: 'Archivos, procesos, red y variables de entorno en Windows' },
  secciones: [
    {
      id: 'empezar-de-cero',
      titulo: 'Empezar de cero',
      tipo: 'pasos',
      intro: 'Sigue estos pasos en orden. Cada paso indica qué deberías ver si salió bien.',
      items: [
        {
          cmd: '$PSVersionTable',
          desc: 'Muestra la versión de PowerShell instalada y del motor .NET sobre el que corre.',
          ej: 'PSVersion                      5.1.22621.1'
        },
        {
          cmd: 'Get-ExecutionPolicy',
          desc: 'Muestra si PowerShell permite ejecutar scripts (.ps1) en esta sesión o usuario.',
          ej: 'RemoteSigned'
        },
        {
          cmd: 'Set-ExecutionPolicy -Scope CurrentUser RemoteSigned',
          desc: 'Permite ejecutar scripts locales y firmados descargados de internet, sin afectar a todo el equipo.'
        },
        {
          cmd: 'Test-Path $PROFILE',
          desc: 'Comprueba si ya existe tu archivo de perfil, el script que se ejecuta automáticamente al abrir PowerShell.'
        },
        {
          cmd: 'New-Item -ItemType File -Path $PROFILE -Force',
          desc: 'Crea el archivo de perfil si todavía no existe, junto con las carpetas intermedias necesarias.'
        },
        {
          cmd: 'notepad $PROFILE',
          desc: 'Abre el perfil para agregar alias, funciones o configuración que quieras cargar en cada sesión nueva.'
        },
        {
          cmd: 'Get-Command Get-*',
          desc: 'Busca cmdlets disponibles por su verbo; útil para descubrir qué existe sin recordar el nombre exacto.'
        },
        {
          cmd: 'Get-Help <comando> -Examples',
          desc: 'Muestra ejemplos de uso de un cmdlet directamente en la terminal.'
        }
      ]
    },
    {
      id: 'archivos-y-carpetas',
      titulo: 'Archivos y carpetas',
      items: [
        { cmd: 'Get-ChildItem', desc: 'Lista archivos y carpetas del directorio actual.', alias: 'ls, dir' },
        { cmd: 'Get-ChildItem -Recurse', desc: 'Lista archivos y carpetas de forma recursiva.' },
        { cmd: 'Set-Location <ruta>', desc: 'Cambia el directorio actual.', alias: 'cd <ruta>' },
        { cmd: 'New-Item -ItemType Directory -Path <ruta>', desc: 'Crea una carpeta nueva.', alias: 'mkdir <ruta>' },
        { cmd: 'New-Item -ItemType File -Path <ruta>', desc: 'Crea un archivo vacío.' },
        { cmd: 'Copy-Item <origen> <destino>', desc: 'Copia un archivo o carpeta.', alias: 'cp <origen> <destino>' },
        { cmd: 'Copy-Item <origen> <destino> -Recurse', desc: 'Copia una carpeta junto con todo su contenido.' },
        { cmd: 'Move-Item <origen> <destino>', desc: 'Mueve o renombra un archivo o carpeta.', alias: 'mv <origen> <destino>' },
        { cmd: 'Remove-Item <ruta>', desc: 'Elimina un archivo.', alias: 'rm <ruta>', warn: 'No usa la papelera de reciclaje: la eliminación es directa.' },
        { cmd: 'Remove-Item <ruta> -Recurse -Force', desc: 'Elimina una carpeta con todo su contenido sin pedir confirmación.', warn: 'Irreversible; confirma la ruta antes de ejecutar.' },
        { cmd: 'Test-Path <ruta>', desc: 'Comprueba si un archivo o carpeta existe; devuelve $true o $false.' },
        { cmd: 'Get-Content <archivo>', desc: 'Muestra el contenido de un archivo de texto.', alias: 'cat <archivo>' },
        { cmd: 'Set-Content <archivo> -Value "<texto>"', desc: 'Escribe el contenido de un archivo, reemplazando lo que hubiera.' },
        { cmd: 'Add-Content <archivo> -Value "<texto>"', desc: 'Agrega una línea al final de un archivo sin borrar lo anterior.' }
      ]
    },
    {
      id: 'busqueda-y-filtrado',
      titulo: 'Búsqueda y filtrado',
      items: [
        { cmd: 'Select-String -Path <archivo> -Pattern "<texto>"', desc: 'Busca texto dentro de uno o varios archivos, similar a grep.', alias: 'sls -Path <archivo> -Pattern "<texto>"' },
        { cmd: 'Get-ChildItem -Recurse | Select-String -Pattern "<texto>"', desc: 'Busca texto dentro de todos los archivos de una carpeta, de forma recursiva.' },
        { cmd: '<comando> | Where-Object { <condicion> }', desc: 'Filtra los objetos que salen de un comando según una condición.', ej: 'Get-Process | Where-Object { $_.CPU -gt 100 }' },
        { cmd: '<comando> | Select-Object <propiedad1>, <propiedad2>', desc: 'Elige qué propiedades de los objetos mostrar, descartando el resto.' },
        { cmd: '<comando> | Select-Object -First <n>', desc: 'Muestra solo los primeros n resultados.' },
        { cmd: '<comando> | Sort-Object <propiedad>', desc: 'Ordena los objetos por una propiedad.' },
        { cmd: '<comando> | Sort-Object <propiedad> -Descending', desc: 'Ordena de mayor a menor.' },
        { cmd: '<comando> | Measure-Object', desc: 'Cuenta cuántos objetos produjo un comando.' },
        { cmd: '<comando> | Group-Object <propiedad>', desc: 'Agrupa los resultados según el valor de una propiedad.' }
      ]
    },
    {
      id: 'procesos-y-servicios',
      titulo: 'Procesos y servicios',
      items: [
        { cmd: 'Get-Process', desc: 'Lista los procesos en ejecución.', alias: 'ps' },
        { cmd: 'Get-Process <nombre>', desc: 'Busca un proceso puntual por nombre, sin la extensión .exe.' },
        { cmd: 'Stop-Process -Name <nombre>', desc: 'Detiene un proceso por nombre.', warn: 'Termina el proceso sin darle oportunidad de cerrar limpiamente.' },
        { cmd: 'Stop-Process -Id <pid> -Force', desc: 'Fuerza la detención de un proceso por su ID.' },
        { cmd: 'Get-Service', desc: 'Lista los servicios de Windows y su estado.' },
        { cmd: 'Get-Service <nombre>', desc: 'Muestra el estado de un servicio puntual.' },
        { cmd: 'Start-Service <nombre>', desc: 'Inicia un servicio.', warn: 'Puede requerir PowerShell abierto como administrador.' },
        { cmd: 'Stop-Service <nombre>', desc: 'Detiene un servicio en ejecución.' },
        { cmd: 'Restart-Service <nombre>', desc: 'Reinicia un servicio.' }
      ]
    },
    {
      id: 'red',
      titulo: 'Red',
      items: [
        { cmd: 'Test-Connection <host>', desc: 'Envía pings a un host para comprobar conectividad.', tip: 'ping sigue funcionando en PowerShell como comando externo de Windows, no como cmdlet.' },
        { cmd: 'Test-NetConnection <host> -Port <puerto>', desc: 'Comprueba si un puerto TCP específico está abierto en un host remoto.' },
        { cmd: 'Invoke-WebRequest <url>', desc: 'Hace una petición HTTP y devuelve la respuesta completa: headers, contenido y código de estado.', alias: 'iwr <url>' },
        { cmd: 'Invoke-RestMethod <url>', desc: 'Hace una petición HTTP y convierte automáticamente la respuesta JSON en objetos de PowerShell.', alias: 'irm <url>' },
        { cmd: 'Invoke-RestMethod <url> -Method Post -Body <cuerpo> -ContentType "application/json"', desc: 'Envía una petición POST con cuerpo JSON.' },
        { cmd: 'Get-NetIPAddress', desc: 'Muestra las direcciones IP configuradas en los adaptadores de red del equipo.' },
        { cmd: 'Get-NetIPConfiguration', desc: 'Muestra un resumen de la configuración de red: IP, gateway y DNS por adaptador.' },
        { cmd: 'Resolve-DnsName <dominio>', desc: 'Resuelve un nombre de dominio a su dirección IP.' },
        { cmd: 'ipconfig /flushdns', desc: 'Limpia la caché DNS local; comando externo de Windows, útil cuando un dominio resuelve a una IP vieja.' }
      ]
    },
    {
      id: 'variables-de-entorno-y-perfil',
      titulo: 'Variables de entorno y perfil',
      items: [
        { cmd: '$env:<NOMBRE>', desc: 'Lee el valor de una variable de entorno en la sesión actual.', ej: '$env:JAVA_HOME' },
        { cmd: '$env:<NOMBRE> = "<valor>"', desc: 'Define una variable de entorno solo para la sesión actual; se pierde al cerrar la terminal.' },
        { cmd: '[Environment]::SetEnvironmentVariable("<NOMBRE>", "<valor>", "User")', desc: 'Define una variable de entorno permanente para tu usuario, disponible en terminales nuevas.' },
        { cmd: '[Environment]::GetEnvironmentVariable("<NOMBRE>", "Machine")', desc: 'Lee una variable de entorno a nivel de todo el sistema.' },
        { cmd: '$PROFILE', desc: 'Muestra la ruta del archivo de perfil que se ejecuta automáticamente al abrir PowerShell.' },
        { cmd: 'Get-Command <nombre>', desc: 'Muestra de dónde viene un comando: cmdlet, función, alias o ejecutable externo.' },
        { cmd: 'Get-Alias <nombre>', desc: 'Muestra a qué cmdlet apunta un alias.', ej: 'Get-Alias ls' },
        { cmd: 'Get-Help <comando>', desc: 'Muestra la ayuda de un cmdlet: sintaxis, parámetros y descripción.' }
      ]
    },
    {
      id: 'modulos',
      titulo: 'Módulos',
      items: [
        { cmd: 'Get-Module -ListAvailable', desc: 'Lista los módulos instalados y disponibles para importar.' },
        { cmd: 'Import-Module <nombre>', desc: 'Carga un módulo en la sesión actual, habilitando sus cmdlets.' },
        { cmd: 'Find-Module <nombre>', desc: 'Busca un módulo en PowerShell Gallery, el repositorio público de módulos.' },
        { cmd: 'Install-Module <nombre> -Scope CurrentUser', desc: 'Instala un módulo desde PowerShell Gallery para tu usuario, sin necesitar permisos de administrador.' },
        { cmd: 'Update-Module <nombre>', desc: 'Actualiza un módulo instalado a su última versión.' },
        { cmd: 'Uninstall-Module <nombre>', desc: 'Desinstala un módulo.' },
        { cmd: 'Get-InstalledModule', desc: 'Lista los módulos instalados desde PowerShell Gallery, a diferencia de Get-Module que incluye también los que vienen con Windows.' }
      ]
    },
    {
      id: 'objetos-y-pipeline',
      titulo: 'Objetos y pipeline',
      intro: 'La diferencia clave con Bash: el pipeline de PowerShell pasa objetos completos entre comandos, no texto plano.',
      items: [
        { cmd: '<comando> | Get-Member', desc: 'Muestra las propiedades y métodos disponibles de los objetos que produce un comando.' },
        { cmd: '<comando> | ForEach-Object { <accion> }', desc: 'Ejecuta una acción por cada objeto que pasa por el pipeline.', alias: '<comando> | % { <accion> }' },
        { cmd: '<comando> | Format-Table -AutoSize', desc: 'Formatea la salida como tabla, ajustando el ancho de columnas automáticamente.' },
        { cmd: '<comando> | Format-List', desc: 'Muestra cada propiedad de cada objeto en su propia línea; útil cuando hay muchas columnas.' },
        { cmd: '<comando> | ConvertTo-Json', desc: 'Convierte los objetos de salida a JSON.' },
        { cmd: '<comando> | ConvertTo-Csv -NoTypeInformation', desc: 'Convierte los objetos de salida a formato CSV.' },
        { cmd: '<comando> | Export-Csv <archivo.csv> -NoTypeInformation', desc: 'Exporta los objetos de salida directamente a un archivo CSV.' },
        { cmd: '<comando1> | <comando2>', desc: 'Encadena comandos: el resultado del primero se pasa como entrada al segundo, ya como objetos, no como texto a parsear.' }
      ]
    },
    {
      id: 'comandos-practicos-combinados',
      titulo: 'Comandos prácticos combinados',
      items: [
        { cmd: 'Get-ChildItem -Recurse -Filter *.log | Remove-Item', desc: 'Busca todos los archivos .log de forma recursiva y los elimina.', warn: 'Revisa primero con Get-ChildItem solo, sin el Remove-Item, para confirmar qué se va a borrar.' },
        { cmd: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 5', desc: 'Muestra los 5 procesos que más CPU están consumiendo en este momento.' },
        { cmd: 'Get-Content <archivo.log> -Wait -Tail 20', desc: 'Sigue un archivo de log en tiempo real, mostrando las últimas 20 líneas y las nuevas a medida que se agregan.' },
        { cmd: 'Invoke-RestMethod <url> | ConvertTo-Json -Depth 5', desc: 'Consulta una API y muestra la respuesta completa como JSON legible.' },
        { cmd: 'Get-ChildItem -Recurse | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) }', desc: 'Encuentra archivos que no se han modificado en los últimos 30 días.' }
      ],
      nota: 'Ejemplos listos para adaptar. Reemplaza rutas y valores antes de ejecutarlos.'
    },
    {
      id: 'problemas-comunes',
      titulo: 'Problemas comunes',
      intro: 'Los errores que más aparecen al trabajar en PowerShell, y qué ejecutar para resolverlos.',
      items: [
        {
          cmd: 'Set-ExecutionPolicy -Scope CurrentUser RemoteSigned',
          desc: 'Corrige el error "la ejecución de scripts está deshabilitada en este sistema" al correr un .ps1 o una herramienta que instala scripts (npm, nvm, etc.).'
        },
        {
          cmd: 'Get-Alias | Where-Object { $_.Name -in "ls","cat","rm","cp","mv","pwd" }',
          desc: 'Muestra qué alias de Unix ya vienen definidos en PowerShell y a qué cmdlet apuntan realmente.',
          tip: 'Son alias reales, no los comandos de Unix: soportan menos flags, y las que existen suelen tener nombres distintos (por ejemplo, no hay -la en ls).'
        },
        {
          cmd: "'texto con comilla simple: it''s'",
          desc: 'Dentro de un string con comillas simples, una comilla simple literal se escribe duplicada.',
          tip: 'Usa comillas dobles cuando necesites interpolar $variables; usa comillas simples para texto literal.'
        },
        {
          cmd: '$?',
          desc: 'Muestra si el último comando terminó bien ($true) o con error ($false).'
        },
        {
          cmd: '$LASTEXITCODE',
          desc: 'Muestra el código de salida del último programa externo ejecutado (no cmdlet); útil para diagnosticar por qué falló un script en CI.'
        }
      ]
    },
    {
      id: 'glosario-de-terminos',
      titulo: 'Glosario de términos',
      tipo: 'glosario',
      items: [
        { term: 'Cmdlet', def: 'Comando nativo de PowerShell con formato Verbo-Sustantivo, por ejemplo Get-Process.' },
        { term: 'Pipeline', def: 'Mecanismo que conecta la salida de un comando con la entrada del siguiente, pasando objetos completos en vez de texto.' },
        { term: 'Objeto', def: 'Estructura con propiedades y métodos que producen los cmdlets, a diferencia de la salida de texto plano de otras shells.' },
        { term: 'Alias', def: 'Nombre corto o alternativo para un cmdlet, por ejemplo ls para Get-ChildItem.' },
        { term: 'Módulo', def: 'Paquete que agrupa cmdlets, funciones y variables relacionadas, instalable desde PowerShell Gallery.' },
        { term: 'Perfil ($PROFILE)', def: 'Script que se ejecuta automáticamente al abrir una sesión de PowerShell, usado para cargar configuración personal.' },
        { term: 'PowerShell Gallery', def: 'Repositorio público de módulos y scripts para PowerShell.' },
        { term: 'ExecutionPolicy', def: 'Configuración de seguridad que controla si PowerShell puede ejecutar scripts (.ps1) y bajo qué condiciones.' },
        { term: 'Proveedor (provider)', def: 'Componente que expone una fuente de datos (sistema de archivos, registro, certificados) con la misma sintaxis de navegación que las carpetas.' },
        { term: '$null', def: 'Valor que representa ausencia de datos; distinto de una cadena vacía o de $false.' }
      ]
    }
  ]
};
