// Guía de Node.js (nvm-windows + node + npm).
// Campos opcionales por entrada: desc, ej (salida de ejemplo), alias, tip (consejo), warn (precaución).
// Campos opcionales por sección: intro (texto que explica la sección), tipo: 'pasos' | 'glosario'.
window.CHEATSHEETS = window.CHEATSHEETS || {};
window.CHEATSHEETS.node = {
  meta: { id: 'node', nombre: 'Node.js', subtitulo: 'nvm, node y npm: de instalar a trabajar' },
  secciones: [
    {
      id: 'empezar-de-cero',
      titulo: 'Empezar de cero',
      tipo: 'pasos',
      intro: 'Sigue estos pasos en orden, en PowerShell. Cada paso indica qué deberías ver si salió bien.',
      items: [
        {
          cmd: 'winget install CoreyButler.NVMforWindows',
          desc: 'Instala nvm-windows, el gestor que permite tener varias versiones de Node y cambiar entre ellas.',
          tip: 'Cierra y vuelve a abrir la terminal al terminar; si no, "nvm" no se reconoce. Con Scoop también sirve: scoop install nvm.'
        },
        {
          cmd: 'nvm version',
          desc: 'Comprueba que nvm quedó instalado.',
          ej: '1.2.2'
        },
        {
          cmd: 'nvm install lts',
          desc: 'Descarga e instala la última versión LTS, que es la recomendada para trabajar (estable y con soporte largo).',
          ej: 'Downloading node.js version 22.11.0 (64-bit)... Complete\nInstalling node.js version 22.11.0 (64-bit)... Complete\nInstallation complete. If you want to use this version, type\n\nnvm use 22.11.0'
        },
        {
          cmd: 'nvm use lts',
          desc: 'Activa la versión LTS que acabas de instalar. Instalarla no la activa: hay que decirle a nvm que la use.',
          warn: 'Si sale un error de permisos, abre PowerShell como administrador: nvm-windows crea un enlace simbólico para cambiar de versión.'
        },
        {
          cmd: 'node -v',
          desc: 'Confirma la versión de Node activa.',
          ej: 'v22.11.0'
        },
        {
          cmd: 'npm -v',
          desc: 'Confirma que npm, el gestor de paquetes que viene con Node, también funciona.',
          ej: '10.9.0'
        },
        {
          cmd: 'npm init -y',
          desc: 'Crea un package.json básico en la carpeta actual. Es el punto de partida de cualquier proyecto Node.'
        }
      ]
    },
    {
      id: 'nvm-en-windows',
      titulo: 'nvm en Windows',
      intro: 'nvm-windows y el nvm de Mac/Linux son programas distintos: comparten idea, pero no todos los comandos. Esta sección es para Windows.',
      items: [
        { cmd: 'nvm list', alias: 'nvm ls', desc: 'Lista las versiones instaladas. La que está en uso lleva un asterisco.', ej: '  * 22.11.0 (Currently using 64-bit executable)\n    20.18.0' },
        { cmd: 'nvm list available', desc: 'Muestra las versiones que puedes descargar (actuales, LTS y antiguas).' },
        { cmd: 'nvm install <version>', desc: 'Instala una versión concreta, por ejemplo 20.18.0.' },
        { cmd: 'nvm install latest', desc: 'Instala la versión más reciente, que no siempre es LTS.' },
        { cmd: 'nvm use <version>', desc: 'Cambia a esa versión. Aplica a todas las terminales nuevas, no solo a la actual.' },
        { cmd: 'nvm current', desc: 'Muestra la versión de Node activa.', ej: 'v22.11.0' },
        { cmd: 'nvm uninstall <version>', desc: 'Elimina una versión instalada.', warn: 'También borra los paquetes globales (npm -g) que tuvieras en esa versión.' },
        { cmd: 'nvm on', desc: 'Activa el manejo de versiones de nvm.' },
        { cmd: 'nvm off', desc: 'Desactiva el manejo de versiones sin desinstalar nada; útil para descartar que nvm cause un problema.' },
        { cmd: 'nvm root', desc: 'Muestra la carpeta donde nvm guarda las versiones de Node.' },
        { cmd: 'nvm root <ruta>', desc: 'Cambia la carpeta donde nvm guarda las versiones.' },
        { cmd: 'nvm arch', desc: 'Muestra si nvm instala Node de 32 o de 64 bits.' },
        { cmd: 'nvm proxy <url>', desc: 'Configura un proxy para las descargas de nvm; útil en redes corporativas.' }
      ]
    },
    {
      id: 'nvm-en-mac-y-linux',
      titulo: 'nvm en Mac y Linux (diferencias)',
      intro: 'Si algún día usas WSL o un servidor Linux, el nvm es otro programa. Estos son los comandos que cambian, y que nvm-windows no tiene.',
      items: [
        { cmd: 'nvm install --lts', desc: 'Instala la última LTS. En nvm-windows sería nvm install lts.' },
        { cmd: 'nvm ls-remote --lts', desc: 'Lista las versiones LTS disponibles para descargar.' },
        { cmd: 'nvm alias default <version>', desc: 'Define la versión que se activa al abrir una terminal nueva.' },
        { cmd: 'echo "22" > .nvmrc', desc: 'Guarda en el proyecto qué versión de Node necesita.' },
        { cmd: 'nvm use', desc: 'Sin argumentos, lee el archivo .nvmrc del proyecto y cambia a esa versión.', tip: 'nvm-windows no lee .nvmrc: allí tienes que indicar la versión a mano.' },
        { cmd: 'nvm which <version>', desc: 'Muestra la ruta del ejecutable de esa versión.' }
      ]
    },
    {
      id: 'node-ejecutar-javascript',
      titulo: 'node: ejecutar JavaScript',
      intro: 'Estos comandos ejecutan código JavaScript directamente, sin navegador.',
      items: [
        { cmd: 'node -v', alias: 'node --version', desc: 'Muestra la versión de Node instalada.', ej: 'v22.11.0' },
        { cmd: 'node <archivo.js>', desc: 'Ejecuta un script.' },
        { cmd: 'node', desc: 'Abre la consola interactiva (REPL), para probar código línea a línea.', tip: 'Para salir escribe .exit o pulsa Ctrl+C dos veces.' },
        { cmd: 'node -e "console.log(2 + 2)"', desc: 'Ejecuta una línea de código sin crear un archivo.', ej: '4' },
        { cmd: 'node -p "process.version"', desc: 'Evalúa una expresión e imprime su resultado.', ej: 'v22.11.0' },
        { cmd: 'node --watch <archivo.js>', desc: 'Ejecuta el script y lo reinicia solo cada vez que guardas un cambio.', tip: 'Requiere Node 18.11 o superior.' },
        { cmd: 'node --env-file=.env <archivo.js>', desc: 'Carga las variables de un archivo .env antes de ejecutar.', tip: 'Requiere Node 20.6 o superior.' },
        { cmd: 'node --inspect <archivo.js>', desc: 'Ejecuta el script con el depurador abierto; conéctate desde el IDE o desde chrome://inspect.' },
        { cmd: 'node --test', desc: 'Ejecuta las pruebas con el runner que trae Node, sin instalar nada más.', tip: 'Recomendado desde Node 20.' }
      ]
    },
    {
      id: 'npm-paquetes-y-scripts',
      titulo: 'npm: paquetes y scripts',
      intro: 'npm instala las librerías que usa tu proyecto y ejecuta los scripts definidos en package.json.',
      items: [
        { cmd: 'npm install', alias: 'npm i', desc: 'Instala todo lo declarado en package.json.' },
        { cmd: 'npm install <paquete>', alias: 'npm i <paquete>', desc: 'Instala un paquete y lo agrega a las dependencias del proyecto.' },
        { cmd: 'npm install <paquete>@<version>', desc: 'Instala una versión concreta de un paquete.' },
        { cmd: 'npm install -D <paquete>', alias: 'npm i -D <paquete>', desc: 'Instala un paquete solo para desarrollo (pruebas, linters, compiladores).' },
        { cmd: 'npm install -g <paquete>', desc: 'Instala un paquete de forma global, disponible en cualquier carpeta.' },
        { cmd: 'npm ci', desc: 'Instala exactamente lo que dice package-lock.json. Es la opción para CI y builds reproducibles.', warn: 'Borra node_modules antes de instalar, y falla si package.json y package-lock.json no coinciden.' },
        { cmd: 'npm uninstall <paquete>', alias: 'npm rm <paquete>', desc: 'Quita un paquete del proyecto.' },
        { cmd: 'npm run', desc: 'Lista los scripts disponibles en package.json.' },
        { cmd: 'npm run <script>', desc: 'Ejecuta un script definido en package.json, por ejemplo build o dev.' },
        { cmd: 'npm start', desc: 'Atajo para npm run start.' },
        { cmd: 'npm test', alias: 'npm t', desc: 'Atajo para npm run test.' },
        { cmd: 'npm ls', desc: 'Muestra el árbol de dependencias instaladas.' },
        { cmd: 'npm ls -g --depth=0', desc: 'Lista solo los paquetes globales, sin sus dependencias.' },
        { cmd: 'npm outdated', desc: 'Muestra qué paquetes tienen una versión más nueva.', ej: 'Package   Current  Wanted  Latest\nexpress    4.18.2  4.21.1  5.0.1' },
        { cmd: 'npm update', desc: 'Actualiza los paquetes dentro del rango permitido en package.json.' },
        { cmd: 'npm audit', desc: 'Revisa las dependencias en busca de vulnerabilidades conocidas.' },
        { cmd: 'npm audit fix', desc: 'Intenta corregir las vulnerabilidades actualizando paquetes.', warn: 'Sin --force no hace cambios que rompan compatibilidad; revisa el resultado antes de confirmar.' },
        { cmd: 'npm view <paquete> version', desc: 'Muestra la última versión publicada de un paquete, sin instalarlo.' },
        { cmd: 'npm cache clean --force', desc: 'Vacía la caché de npm; sirve cuando una instalación falla por archivos corruptos.' },
        { cmd: 'npm config get registry', desc: 'Muestra desde qué registro descarga paquetes npm.', ej: 'https://registry.npmjs.org/' },
        { cmd: 'npm config set registry <url>', desc: 'Cambia el registro, por ejemplo a uno interno de la empresa.' },
        { cmd: 'npm root -g', desc: 'Muestra la carpeta de los paquetes globales.' },
        { cmd: 'npx <paquete>', desc: 'Ejecuta un paquete sin instalarlo de forma global (por ejemplo, un generador de proyectos).' }
      ]
    },
    {
      id: 'problemas-comunes-en-windows',
      titulo: 'Problemas comunes en Windows',
      intro: 'Los errores que más aparecen al trabajar con Node en Windows, y qué ejecutar para resolverlos.',
      items: [
        {
          cmd: 'Set-ExecutionPolicy -Scope CurrentUser RemoteSigned',
          desc: 'Soluciona el error "la ejecución de scripts está deshabilitada en este sistema" cuando npm no corre en PowerShell.',
          tip: 'Solo afecta a tu usuario, no a todo el equipo.'
        },
        {
          cmd: 'where.exe node',
          desc: 'Muestra desde qué rutas se encuentra node. Si hay una instalación antigua antes que la de nvm, esa gana.',
          tip: 'Si aparece más de una ruta, desinstala la de Node instalada por fuera de nvm.'
        },
        { cmd: '$env:NVM_HOME', desc: 'Comprueba que nvm dejó configurada su variable de entorno. Si sale vacío, la instalación no terminó bien.' },
        { cmd: 'npm config get prefix', desc: 'Muestra dónde se instalan los paquetes globales.' },
        {
          cmd: 'Remove-Item -Recurse -Force node_modules; npm install',
          desc: 'Reinstala las dependencias desde cero cuando algo quedó corrupto o inconsistente.',
          warn: 'Borra la carpeta node_modules de la carpeta actual. Confirma que estás en el proyecto correcto.'
        }
      ]
    },
    {
      id: 'glosario-de-terminos',
      titulo: 'Glosario de términos',
      tipo: 'glosario',
      items: [
        { term: 'Node.js', def: 'Entorno que permite ejecutar JavaScript fuera del navegador, por ejemplo en servidores y herramientas de línea de comandos.' },
        { term: 'npm', def: 'Gestor de paquetes de Node: descarga librerías y ejecuta scripts del proyecto.' },
        { term: 'npx', def: 'Herramienta de npm para ejecutar un paquete sin instalarlo globalmente.' },
        { term: 'nvm', def: 'Gestor de versiones de Node: permite instalar varias y cambiar entre ellas.' },
        { term: 'LTS', def: 'Long Term Support. Versión con soporte extendido, recomendada para proyectos reales.' },
        { term: 'package.json', def: 'Archivo que describe el proyecto: nombre, scripts y dependencias.' },
        { term: 'package-lock.json', def: 'Registro exacto de las versiones instaladas, para que todos obtengan lo mismo.' },
        { term: 'node_modules', def: 'Carpeta donde npm descarga las dependencias. No se sube al repositorio.' },
        { term: 'dependencies', def: 'Paquetes que el proyecto necesita para funcionar.' },
        { term: 'devDependencies', def: 'Paquetes que solo se necesitan mientras desarrollas, como pruebas o compiladores.' },
        { term: 'semver', def: 'Formato de versión mayor.menor.parche. ^1.2.3 permite subir menor y parche; ~1.2.3 solo el parche.' },
        { term: 'Registro (registry)', def: 'Servidor desde donde npm descarga los paquetes. Por defecto, registry.npmjs.org.' },
        { term: 'REPL', def: 'Consola interactiva de Node que ejecuta cada línea que escribes.' },
        { term: 'Paquete global', def: 'Paquete instalado con -g, disponible como comando en cualquier carpeta.' }
      ]
    }
  ]
};
