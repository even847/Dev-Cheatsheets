// Guía de Scoop (gestor de paquetes de línea de comandos para Windows).
// Campos opcionales por entrada: desc, ej (salida de ejemplo), alias, tip (consejo), warn (precaución).
// Campos opcionales por sección: intro (texto que explica la sección), nota, tipo: 'pasos' | 'glosario'.
window.CHEATSHEETS = window.CHEATSHEETS || {};
window.CHEATSHEETS.scoop = {
  meta: { id: 'scoop', nombre: 'Scoop', subtitulo: 'Instalar y mantener herramientas en Windows desde la terminal' },
  secciones: [
    {
      id: 'empezar-de-cero',
      titulo: 'Empezar de cero',
      tipo: 'pasos',
      intro: 'Sigue estos pasos en orden, en PowerShell. Cada paso indica qué deberías ver si salió bien.',
      items: [
        {
          cmd: 'Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force',
          desc: 'Permite ejecutar scripts locales y firmados remotamente; PowerShell bloquea scripts por defecto y el instalador de Scoop es un script.',
          tip: 'Solo afecta a tu usuario, no a todo el equipo.'
        },
        {
          cmd: 'irm get.scoop.sh | iex',
          desc: 'Descarga y ejecuta el instalador oficial de Scoop. Instala todo bajo ~\\scoop, sin necesitar permisos de administrador.',
          warn: 'No lo ejecutes como administrador: Scoop está pensado para instalarse por usuario, no a nivel de sistema.'
        },
        {
          cmd: 'scoop help',
          desc: 'Confirma que Scoop quedó instalado y lista los comandos disponibles.'
        },
        {
          cmd: 'scoop bucket add extras',
          desc: 'Agrega el bucket extras, que trae la mayoría de las apps con interfaz gráfica y herramientas que no están en el bucket main.'
        },
        {
          cmd: 'scoop install git',
          desc: 'Instala Git, necesario para que Scoop pueda agregar buckets alojados en repositorios Git de terceros.'
        },
        {
          cmd: 'scoop install <app>',
          desc: 'Instala una aplicación buscándola en los buckets que ya agregaste.',
          ej: 'scoop install 7zip'
        },
        {
          cmd: 'scoop list',
          desc: 'Muestra las apps instaladas y desde qué bucket vino cada una.'
        }
      ]
    },
    {
      id: 'buckets',
      titulo: 'Buckets',
      intro: 'Un bucket es un repositorio de manifests (recetas de instalación). Scoop agrega main automáticamente; el resto hay que sumarlos a mano.',
      items: [
        { cmd: 'scoop bucket list', desc: 'Lista los buckets que ya agregaste.' },
        { cmd: 'scoop bucket known', desc: 'Lista los buckets oficiales que Scoop reconoce por nombre, sin necesitar la URL completa.' },
        { cmd: 'scoop bucket add <nombre>', desc: 'Agrega un bucket oficial conocido.', ej: 'scoop bucket add versions' },
        { cmd: 'scoop bucket add <nombre> <url>', desc: 'Agrega un bucket de terceros a partir de la URL de su repositorio Git.' },
        { cmd: 'scoop bucket rm <nombre>', desc: 'Quita un bucket agregado; no desinstala las apps que ya instalaste desde él.' }
      ]
    },
    {
      id: 'instalar-y-gestionar-apps',
      titulo: 'Instalar y gestionar apps',
      items: [
        { cmd: 'scoop install <app>', desc: 'Instala una app para tu usuario, resolviendo automáticamente en qué bucket agregado está.' },
        { cmd: 'scoop install <app>@<version>', desc: 'Instala una versión específica de la app, si el bucket conserva manifests de versiones anteriores.' },
        { cmd: 'scoop install <bucket>/<app>', desc: 'Especifica de qué bucket instalar cuando el mismo nombre de app existe en más de uno.' },
        { cmd: 'scoop install -g <app>', desc: 'Instala la app para todos los usuarios del equipo, en vez de solo el actual.', alias: 'scoop install --global <app>', warn: 'Requiere una consola de PowerShell abierta como administrador.' },
        { cmd: 'scoop uninstall <app>', desc: 'Desinstala una app y elimina sus shims.' },
        { cmd: 'scoop uninstall -g <app>', desc: 'Desinstala una app que fue instalada de forma global.' },
        { cmd: 'scoop list', desc: 'Lista todas las apps instaladas con su versión y bucket de origen.' }
      ]
    },
    {
      id: 'actualizar',
      titulo: 'Actualizar',
      items: [
        { cmd: 'scoop update', desc: 'Actualiza Scoop y refresca el índice de manifests de todos los buckets agregados; no actualiza las apps instaladas.' },
        { cmd: 'scoop update *', desc: 'Actualiza todas las apps instaladas a su última versión disponible.' },
        { cmd: 'scoop update <app>', desc: 'Actualiza una sola app a su última versión.' },
        { cmd: 'scoop status', desc: 'Muestra qué apps instaladas tienen una versión más nueva disponible y si Scoop detecta algún problema en el entorno.' },
        { cmd: 'scoop hold <app>', desc: 'Excluye una app de las actualizaciones masivas (scoop update *); útil si una versión nueva te rompió algo.' },
        { cmd: 'scoop unhold <app>', desc: 'Quita la exclusión y vuelve a permitir que la app se actualice.' }
      ]
    },
    {
      id: 'busqueda-e-informacion',
      titulo: 'Búsqueda e información',
      items: [
        { cmd: 'scoop search <nombre>', desc: 'Busca una app por nombre en los buckets agregados y en el índice remoto de Scoop.' },
        { cmd: 'scoop info <app>', desc: 'Muestra versión, sitio web, binarios que expone y de qué bucket viene una app.' },
        { cmd: 'scoop depends <app>', desc: 'Lista las apps de las que depende, para saber qué más se instalaría junto con ella.' },
        { cmd: 'scoop which <app>', desc: 'Muestra la ruta del shim que Scoop puso en el PATH para ese comando.' },
        { cmd: 'scoop home <app>', desc: 'Abre en el navegador la página oficial del proyecto.' },
        { cmd: 'scoop cat <app>', desc: 'Muestra el manifest (JSON) completo que Scoop usa para instalar esa app.' }
      ]
    },
    {
      id: 'versiones-y-cache',
      titulo: 'Versiones y caché',
      intro: 'Scoop conserva versiones anteriores instaladas hasta que las limpias explícitamente, lo que permite volver atrás sin reinstalar.',
      items: [
        { cmd: 'scoop reset <app>', desc: 'Vuelve a activar la versión declarada en el manifest actual de la app, sin reinstalar; arregla shims o enlaces que quedaron apuntando a una versión vieja.' },
        { cmd: 'scoop reset <app>@<version>', desc: 'Cambia la app instalada a otra versión que ya tengas descargada localmente, sin descargar nada de nuevo.' },
        { cmd: 'scoop cache show', desc: 'Lista los instaladores descargados que Scoop guarda en caché.' },
        { cmd: 'scoop cache rm <app>', desc: 'Elimina del caché los instaladores descargados de una app puntual.' },
        { cmd: 'scoop cache rm *', desc: 'Vacía todo el caché de descargas.', warn: 'Las próximas instalaciones o actualizaciones tendrán que descargar todo de nuevo.' }
      ]
    },
    {
      id: 'mantenimiento-y-limpieza',
      titulo: 'Mantenimiento y limpieza',
      items: [
        { cmd: 'scoop cleanup <app>', desc: 'Elimina las versiones antiguas de una app, dejando solo la que está activa.' },
        { cmd: 'scoop cleanup *', desc: 'Aplica la limpieza de versiones antiguas a todas las apps instaladas; libera espacio en disco.' },
        { cmd: 'scoop checkup', desc: 'Diagnostica problemas comunes del entorno: falta de Git, política de ejecución, soporte de rutas largas, etc.' },
        { cmd: 'scoop config', desc: 'Muestra la configuración actual de Scoop (proxy, downloader, rutas).' },
        { cmd: 'scoop config <clave> <valor>', desc: 'Cambia un valor de configuración.', ej: 'scoop config aria2-enabled false', tip: 'Desactivar aria2 ayuda cuando las descargas fallan detrás de un proxy corporativo.' }
      ]
    },
    {
      id: 'exportar-e-importar-configuracion',
      titulo: 'Exportar e importar configuración',
      intro: 'Sirve para replicar tu setup de Scoop en otro equipo: buckets, apps y configuración en un solo archivo.',
      items: [
        { cmd: 'scoop export > scoopfile.json', desc: 'Genera un archivo con la lista de buckets y apps instaladas, incluyendo las que tengas en hold.' },
        { cmd: 'scoop export --config > scoopfile.json', desc: 'Igual que el anterior, pero incluye también la configuración de Scoop (scoop config).' },
        { cmd: 'scoop import scoopfile.json', desc: 'En otro equipo con Scoop ya instalado, agrega los buckets y las apps declaradas en el archivo.' },
        { cmd: 'scoop status', desc: 'Después de importar, confirma que todas las apps quedaron instaladas y actualizadas.' }
      ]
    },
    {
      id: 'comandos-practicos-combinados',
      titulo: 'Comandos prácticos combinados',
      items: [
        { cmd: 'scoop bucket add extras && scoop install git 7zip', desc: 'Deja listo un equipo nuevo: agrega el bucket más usado e instala dos herramientas base en un solo paso.' },
        { cmd: 'scoop update && scoop update *', desc: 'Actualiza primero los índices de Scoop y sus buckets, y recién después todas las apps instaladas.' },
        { cmd: 'scoop cache rm * && scoop cleanup *', desc: 'Libera espacio en disco: borra el caché de descargas y las versiones antiguas de todas las apps.' },
        { cmd: 'scoop export --config > scoopfile.json', desc: 'Antes de formatear o migrar de equipo, respalda qué tienes instalado y cómo está configurado.' }
      ],
      nota: 'Ejemplos listos para adaptar. Reemplaza nombres de apps antes de ejecutarlos.'
    },
    {
      id: 'problemas-comunes-en-windows',
      titulo: 'Problemas comunes en Windows',
      intro: 'Los errores que más aparecen al trabajar con Scoop, y qué ejecutar para resolverlos.',
      items: [
        {
          cmd: 'Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force',
          desc: 'Corrige el error "no se puede cargar el archivo ... porque la ejecución de scripts está deshabilitada" al instalar o actualizar Scoop.'
        },
        {
          cmd: 'scoop checkup',
          desc: 'Primer diagnóstico ante cualquier comportamiento raro: revisa Git, rutas largas, permisos y la propia instalación de Scoop.'
        },
        {
          cmd: '$env:SCOOP',
          desc: 'Muestra la carpeta raíz donde Scoop instala todo (por defecto ~\\scoop). Si sale vacío, la instalación no dejó bien configuradas las variables de entorno.'
        },
        {
          cmd: 'where.exe <comando>',
          desc: 'Muestra desde qué rutas se resuelve un comando. Si aparece una instalación fuera de Scoop antes que el shim, esa gana.',
          tip: 'Los shims de Scoop viven en ~\\scoop\\shims; si esa ruta no está primero en PATH, puede ejecutarse otra versión instalada por fuera.'
        },
        {
          cmd: 'Add-MpPreference -ExclusionPath "$env:USERPROFILE\\scoop"',
          desc: 'Excluye la carpeta de Scoop del análisis de Windows Defender; algunos antivirus ponen en cuarentena binarios recién descargados o sus shims.',
          warn: 'Requiere PowerShell como administrador. Confirma que tu política de seguridad corporativa permite agregar exclusiones antes de usarlo.'
        },
        {
          cmd: 'scoop install <app> -a 32bit',
          desc: 'Fuerza instalar la versión de 32 bits de una app cuando la de 64 bits falla o no es compatible con el equipo.',
          alias: 'scoop install <app> -a 64bit'
        }
      ]
    },
    {
      id: 'glosario-de-terminos',
      titulo: 'Glosario de términos',
      tipo: 'glosario',
      items: [
        { term: 'Scoop', def: 'Gestor de paquetes de línea de comandos para Windows: instala apps sin necesitar un instalador gráfico ni permisos de administrador.' },
        { term: 'Bucket', def: 'Repositorio de manifests (recetas de instalación) que Scoop puede agregar; main viene incluido por defecto.' },
        { term: 'Manifest', def: 'Archivo JSON que describe cómo Scoop debe descargar, verificar e instalar una app concreta.' },
        { term: 'Shim', def: 'Pequeño ejecutable que Scoop coloca en su carpeta de shims (dentro del PATH) para poder llamar a un programa instalado por su nombre desde cualquier carpeta.' },
        { term: 'App global', def: 'App instalada con -g/--global, disponible para todos los usuarios del equipo en vez de solo el que la instaló.' },
        { term: 'Hold', def: 'Marca que excluye una app de las actualizaciones masivas (scoop update *) hasta que se le quita explícitamente.' },
        { term: 'Caché', def: 'Carpeta donde Scoop guarda los instaladores ya descargados, para no volver a bajarlos si reinstalas o cambias de versión.' },
        { term: 'aria2', def: 'Descargador externo opcional que Scoop puede usar para acelerar descargas grandes con conexiones múltiples.' },
        { term: 'Checkup', def: 'Diagnóstico integrado de Scoop que revisa que el entorno (Git, rutas largas, permisos) esté bien configurado.' },
        { term: 'Scoopfile', def: 'Archivo JSON generado con scoop export que lista buckets, apps y configuración para replicar el setup en otro equipo.' }
      ]
    }
  ]
};
