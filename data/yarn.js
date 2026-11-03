// Guía de Yarn (gestor de paquetes de Node.js).
// Campos opcionales por entrada: desc, ej (salida de ejemplo), alias, tip (consejo), warn (precaución).
// Campos opcionales por sección: intro (texto que explica la sección), tipo: 'pasos' | 'glosario'.
window.CHEATSHEETS = window.CHEATSHEETS || {};
window.CHEATSHEETS.yarn = {
  meta: { id: 'yarn', nombre: 'Yarn', subtitulo: 'Instalar, agregar paquetes y correr scripts con Yarn' },
  secciones: [
    {
      id: 'instalar-yarn',
      titulo: 'Instalar Yarn moderno (2+)',
      intro: 'La versión actual de Yarn. Se activa con Corepack, que viene con Node.js, y se fija por proyecto. Los comandos son idénticos en Windows, macOS y Linux, por eso esta sección no se divide por sistema operativo. Si necesitas la versión antigua (1.x), usa la sección siguiente, que sí está dividida por sistema.',
      items: [
        { cmd: 'corepack enable', desc: 'Activa Corepack (viene con Node desde 14.19 y 16.9, pero está desactivado por defecto). Después, yarn queda disponible y usa la versión que indique cada proyecto.', tip: 'Es la forma recomendada por Yarn. En Windows puede requerir PowerShell como administrador.' },
        { cmd: 'npm install -g corepack', desc: 'Instala Corepack cuando tu Node no lo trae (por ejemplo, builds de terceros o paquetes del sistema). Luego ejecuta corepack enable.' },
        { cmd: 'corepack enable --install-directory ~/.volta/bin', desc: 'Si usas Volta: sus shims bloquean los de Corepack, así que hay que indicarle la carpeta de Volta (después de npm install -g corepack).' },
        { cmd: 'yarn exec env', desc: 'Comprueba que Corepack quedó bien instalado: si imprime una ruta, funciona.' },
        { cmd: 'corepack use yarn@stable', desc: 'Fija Yarn en el proyecto actual: escribe la versión en el campo packageManager del package.json y la descarga.' },
        { cmd: 'corepack prepare yarn@<version> --activate', desc: 'Descarga y activa una versión concreta de Yarn.', ej: 'corepack prepare yarn@4.5.0 --activate' },
        { cmd: 'corepack disable', desc: 'Desactiva Corepack y quita los atajos de yarn y pnpm que había creado.' },
        { cmd: 'yarn init -2', desc: 'Crea un proyecto nuevo que usa Yarn moderno desde el inicio.' },
        { cmd: 'yarn set version stable', desc: 'En un proyecto existente, pasa a la última versión estable de Yarn y la guarda en el proyecto. Después corre yarn install.' },
        { cmd: 'yarn set version canary', desc: 'Usa el canal canary, con funciones que aún no llegaron a estable.' },
        { cmd: 'yarn set version from sources', desc: 'Compila Yarn desde la rama master (con --branch <nombre> prueba un PR concreto).', warn: 'No puede usar Corepack: guarda el binario en .yarn/releases y lo referencia desde .yarnrc.yml.' },
        { cmd: 'yarn --version', alias: 'yarn -v', desc: 'Confirma que Yarn quedó instalado y muestra su versión.', ej: '4.5.0' }
      ]
    },
    {
      id: 'instalar-yarn-classic',
      titulo: 'Instalar Yarn Classic (1.x) por sistema',
      intro: 'La versión antigua de Yarn. Se instala de forma global con un gestor de paquetes, y por eso cambia según tu sistema operativo: elige el tuyo. Si usas Yarn moderno, no necesitas esta sección (se instala con Corepack).',
      items: [
        { so: 'windows', cmd: 'scoop install yarn', desc: 'Windows: instala Yarn Classic con Scoop.' },
        { so: 'windows', cmd: 'choco install yarn', desc: 'Windows: instala Yarn Classic con Chocolatey.' },
        { so: 'macos', cmd: 'brew install yarn', desc: 'macOS: instala Yarn Classic con Homebrew.' },
        { so: 'macos', cmd: 'sudo port install yarn', desc: 'macOS: instala Yarn Classic con MacPorts.' },
        { so: 'macos', cmd: 'brew upgrade yarn', desc: 'macOS: actualiza Yarn Classic instalado con Homebrew.' },
        { so: 'linux', cmd: 'sudo apt update && sudo apt install yarn', desc: 'Debian y Ubuntu, una vez agregado el repositorio APT de Yarn.', tip: 'Antes hay que agregar la clave y el repositorio (dl.yarnpkg.com/debian); los pasos están en classic.yarnpkg.com/en/docs/install.' },
        { so: 'linux', cmd: 'sudo dnf install yarn', desc: 'Fedora, CentOS y RHEL, una vez agregado el repositorio RPM de Yarn.', alias: 'sudo yum install yarn' },
        { so: 'linux', cmd: 'apk add yarn', desc: 'Alpine Linux.' },
        { so: 'linux', cmd: 'sudo pacman -S yarn', desc: 'Arch Linux.' },
        { so: ['macos', 'linux'], cmd: 'curl -o- -L https://yarnpkg.com/install.sh | bash', desc: 'Script de instalación de Yarn Classic para sistemas tipo Unix.', warn: 'Ejecuta un script descargado de internet; revísalo antes si no confías en la fuente.' },
        { cmd: 'npm install --global yarn@1', desc: 'Con npm, en cualquier sistema operativo: instala Yarn Classic de forma global; el mismo comando sirve para actualizarlo.' },
        { cmd: 'yarn --version', desc: 'Confirma que Yarn Classic quedó instalado.', ej: '1.22.22' }
      ]
    },
    {
      id: 'empezar-de-cero',
      titulo: 'Empezar de cero',
      tipo: 'pasos',
      intro: 'Con Yarn ya instalado y verificado (secciones anteriores), sigue estos pasos en orden; los comandos son los mismos en todos los sistemas.',
      items: [
        {
          cmd: 'yarn init',
          desc: 'Crea un package.json en la carpeta actual (en Yarn Classic pregunta los datos paso a paso).',
          tip: 'En Yarn Classic, yarn init -y acepta los valores por defecto sin preguntar.'
        },
        {
          cmd: 'yarn add <paquete>',
          desc: 'Agrega una primera dependencia al proyecto.'
        },
        {
          cmd: 'yarn install',
          desc: 'Instala todas las dependencias del package.json.'
        }
      ]
    },
    {
      id: 'dependencias',
      titulo: 'Dependencias',
      items: [
        { cmd: 'yarn install', alias: 'yarn', desc: 'Instala las dependencias del proyecto según package.json y yarn.lock.' },
        { cmd: 'yarn install --frozen-lockfile', desc: 'Instala exactamente lo que dice yarn.lock y falla si habría que modificarlo. Ideal para CI (Yarn Classic).', tip: 'En Yarn 2+ (Berry) el equivalente es yarn install --immutable, que ya es el valor por defecto en CI. --frozen-lockfile sigue funcionando como alias, pero será retirado.' },
        { cmd: 'yarn install --immutable', desc: 'Falla si el yarn.lock tendría que modificarse (Yarn 2+).' },
        { cmd: 'yarn install --production', alias: 'yarn install --prod', desc: 'Omite las devDependencies (Yarn Classic). Útil en imágenes Docker de producción.' },
        { cmd: 'yarn install --force', desc: 'Vuelve a descargar todos los paquetes, incluso los ya instalados (Yarn Classic).' },
        { cmd: 'yarn install --check-cache', desc: 'Vuelve a descargar y verifica los checksums contra el yarn.lock y la caché (Yarn 2+).' },
        { cmd: 'yarn install --mode=skip-build', desc: 'Instala sin ejecutar los scripts de build de los paquetes (Yarn 2+).' },
        { cmd: 'yarn add <paquete>', desc: 'Agrega un paquete a dependencies.' },
        { cmd: 'yarn add <paquete>@<version>', desc: 'Agrega una versión concreta, por ejemplo react@18.3.1.' },
        { cmd: 'yarn add <paquete> --dev', alias: 'yarn add -D <paquete>', desc: 'Agrega un paquete a devDependencies (solo para desarrollo).' },
        { cmd: 'yarn remove <paquete>', desc: 'Quita un paquete del package.json y del yarn.lock.' },
        { cmd: 'yarn upgrade <paquete>', desc: 'Actualiza un paquete dentro del rango permitido en package.json.', tip: 'En Yarn 2+ el comando es yarn up <paquete>.' },
        { cmd: 'yarn upgrade-interactive', desc: 'Muestra los paquetes desactualizados y te deja elegir cuáles actualizar.' },
        { cmd: 'yarn outdated', desc: 'Lista los paquetes que tienen una versión más nueva.', tip: 'En Yarn 2+ esto lo hace yarn upgrade-interactive.' },
        { cmd: 'yarn list --depth=0', desc: 'Lista las dependencias directas instaladas (Yarn Classic).' },
        { cmd: 'yarn why <paquete>', desc: 'Explica por qué un paquete está instalado y quién lo requiere.' },
        { cmd: 'yarn info <paquete>', desc: 'Muestra la información de un paquete (versión, dependencias, etc.).' },
        { cmd: 'yarn dedupe', desc: 'Reduce duplicados de versiones en el yarn.lock.' },
        { cmd: 'yarn audit', desc: 'Revisa las dependencias instaladas en busca de vulnerabilidades conocidas (Yarn Classic).', tip: 'En Yarn 2+ el comando es yarn npm audit.' },
        { cmd: 'yarn patch <paquete>', desc: 'Prepara una copia editable de un paquete para parchearlo (Yarn 2+). Al terminar se guarda con yarn patch-commit -s <ruta>.' },
        { cmd: 'yarn unplug <paquete>', desc: 'Extrae un paquete a disco para poder inspeccionarlo o depurarlo cuando se usa Plug\'n\'Play (Yarn 2+).' }
      ]
    },
    {
      id: 'scripts',
      titulo: 'Scripts',
      intro: 'Los scripts se definen en la sección "scripts" del package.json.',
      items: [
        { cmd: 'yarn run <script>', alias: 'yarn <script>', desc: 'Ejecuta un script del package.json, por ejemplo yarn build.' },
        { cmd: 'yarn start', desc: 'Ejecuta el script start del proyecto.' },
        { cmd: 'yarn test', desc: 'Ejecuta el script test del proyecto.' },
        { cmd: 'yarn build', desc: 'Ejecuta el script build, normalmente el que genera la versión para producción.' },
        { cmd: 'yarn run', desc: 'Sin argumentos, lista los scripts disponibles en el proyecto.' },
        { cmd: 'yarn <script> --<opcion>', desc: 'Pasa opciones al script. En Yarn Classic todo lo que va después del nombre llega al script.', ej: 'yarn test --watch' },
        { cmd: 'yarn dlx <paquete>', desc: 'Ejecuta un paquete en un entorno temporal, sin instalarlo en el proyecto (Yarn 2+). Equivale a npx.', tip: 'En Yarn Classic se usa npx <paquete>.' },
        { cmd: 'yarn exec <comando>', desc: 'Ejecuta un comando con los binarios del proyecto disponibles (Yarn 2+).' },
        { cmd: 'yarn bin <binario>', desc: 'Muestra la ruta de un binario instalado en el proyecto.' },
        { cmd: 'yarn node <archivo>', desc: 'Ejecuta Node con la configuración de Yarn ya aplicada, necesario con Plug\'n\'Play (Yarn 2+).' }
      ]
    },
    {
      id: 'globales',
      titulo: 'Paquetes globales',
      items: [
        { cmd: 'yarn global add <paquete>', desc: 'Instala un paquete de forma global (Yarn Classic).', warn: 'Yarn 2+ no soporta global; usa yarn dlx o npm install -g.' },
        { cmd: 'yarn global list', desc: 'Lista los paquetes globales instalados (Yarn Classic).' },
        { cmd: 'yarn global remove <paquete>', desc: 'Desinstala un paquete global (Yarn Classic).' },
        { cmd: 'yarn global upgrade', desc: 'Actualiza los paquetes globales dentro de su rango de versión (Yarn Classic).' },
        { cmd: 'yarn global bin', desc: 'Muestra la carpeta donde quedan los ejecutables globales (Yarn Classic).', tip: 'Si un comando global no se reconoce, agrega esa carpeta al PATH.' }
      ]
    },
    {
      id: 'cache-y-limpieza',
      titulo: 'Caché y limpieza',
      items: [
        { cmd: 'yarn cache dir', desc: 'Muestra la carpeta donde Yarn guarda su caché global (Yarn Classic).', tip: 'En Yarn 2+ la ruta se lee con yarn config get cacheFolder.' },
        { cmd: 'yarn cache list', desc: 'Lista los paquetes que hay en la caché (Yarn Classic).', alias: 'yarn cache list --pattern <patron>' },
        { cmd: 'yarn cache clean', desc: 'Borra la caché de Yarn.', warn: 'La próxima instalación tendrá que descargar todo de nuevo.' },
        { cmd: 'yarn cache clean <paquete>', desc: 'Borra de la caché solo un paquete (Yarn Classic).' },
        { cmd: 'rm -rf node_modules yarn.lock && yarn install', desc: 'Reinstala todo desde cero cuando las dependencias quedaron en mal estado.', warn: 'Borrar yarn.lock puede cambiar las versiones instaladas. En PowerShell: Remove-Item -Recurse -Force node_modules, yarn.lock.' },
        { cmd: 'yarn install --check-files', desc: 'Verifica que los archivos de node_modules existan y reinstala los que falten (Yarn Classic).' }
      ]
    },
    {
      id: 'configuracion',
      titulo: 'Configuración y versiones',
      items: [
        { cmd: 'yarn config list', desc: 'Muestra la configuración actual de Yarn.' },
        { cmd: 'yarn config get <clave>', desc: 'Lee el valor de una clave de configuración.' },
        { cmd: 'yarn config set <clave> <valor>', desc: 'Cambia una clave de configuración.', ej: 'yarn config set registry https://registry.npmjs.org' },
        { cmd: 'yarn config unset <clave>', desc: 'Elimina una clave de configuración (Yarn 2+).' },
        { cmd: 'yarn explain <codigo>', desc: 'Explica un código de error de Yarn, por ejemplo YN0002 (Yarn 2+).' },
        { cmd: 'yarn plugin list', desc: 'Lista los plugins oficiales disponibles (Yarn 2+).' },
        { cmd: 'yarn plugin import <plugin>', desc: 'Descarga e instala un plugin en el proyecto (Yarn 2+).' },
        { cmd: 'yarn set version stable', desc: 'Actualiza el proyecto a la última versión estable de Yarn (2+).', tip: 'Guarda la versión en package.json (campo packageManager) para que todo el equipo use la misma.' },
        { cmd: 'yarn set version classic', desc: 'Vuelve el proyecto a Yarn Classic (1.x).' },
        { cmd: 'corepack prepare yarn@<version> --activate', desc: 'Activa una versión concreta de Yarn con Corepack.' }
      ]
    },
    {
      id: 'workspaces',
      titulo: 'Workspaces (monorepo)',
      intro: 'Los workspaces permiten manejar varios paquetes en un solo repositorio. Se declaran con "workspaces" en el package.json raíz.',
      items: [
        { cmd: 'yarn workspaces list', desc: 'Lista los workspaces del proyecto (Yarn 2+).' },
        { cmd: 'yarn workspace <nombre> add <paquete>', desc: 'Agrega una dependencia solo a un workspace.' },
        { cmd: 'yarn workspace <nombre> run <script>', alias: 'yarn workspace <nombre> <script>', desc: 'Ejecuta un script dentro de un workspace concreto.' },
        { cmd: 'yarn workspaces foreach -A run <script>', desc: 'Ejecuta un script en todos los workspaces (Yarn 2+). Si un workspace no tiene ese script, lo omite sin error.', tip: 'En Yarn Classic: yarn workspaces run <script>.' },
        { cmd: 'yarn workspaces foreach -Apt run <script>', desc: 'Igual, pero en paralelo (-p) y respetando el orden de dependencias (-t): primero se construye lo que otros workspaces necesitan.' },
        { cmd: 'yarn workspaces foreach -A --since run <script>', desc: 'Ejecuta el script solo en los workspaces que cambiaron desde la referencia de git configurada.' },
        { cmd: 'yarn workspaces foreach -A --include <glob> run <script>', desc: 'Limita la ejecución a los workspaces que coinciden con el patrón; --exclude hace lo contrario.' },
        { cmd: 'yarn workspaces foreach -A -n run <script>', desc: 'Simulación: muestra qué se ejecutaría sin ejecutarlo (--dry-run).' },
        { cmd: 'yarn workspaces focus <nombre>', desc: 'Instala solo un workspace y sus dependencias (Yarn 2+). Útil para imágenes Docker de un solo servicio.' },
        { cmd: 'yarn workspaces info', desc: 'Muestra el árbol de workspaces y sus dependencias internas (Yarn Classic).' }
      ]
    },
    {
      id: 'publicar',
      titulo: 'Publicar y enlazar',
      items: [
        { cmd: 'yarn link', desc: 'Registra el paquete actual para probarlo localmente en otro proyecto (Yarn Classic).' },
        { cmd: 'yarn link <paquete>', desc: 'Usa en este proyecto la versión local enlazada de un paquete (Yarn Classic).' },
        { cmd: 'yarn pack', desc: 'Genera el .tgz que se publicaría, sin publicarlo.' },
        { cmd: 'yarn login', desc: 'Inicia sesión en el registro de npm (Yarn Classic).', tip: 'En Yarn 2+: yarn npm login. Para salir: yarn npm logout.' },
        { cmd: 'yarn npm whoami', desc: 'Muestra con qué usuario estás autenticado en el registro (Yarn 2+).' },
        { cmd: 'yarn publish', desc: 'Publica el paquete en el registro.', warn: 'En Yarn 2+ el comando es yarn npm publish.' },
        { cmd: 'yarn npm publish', desc: 'Publica el workspace activo en el registro de npm (Yarn 2+).' },
        { cmd: 'yarn version <version>', desc: 'Cambia la versión del paquete en package.json.', ej: 'yarn version 1.2.0' }
      ]
    },
    {
      id: 'classic-vs-berry',
      titulo: 'Yarn Classic vs Yarn 2+',
      tipo: 'glosario',
      items: [
        { term: 'Yarn Classic (1.x)', def: 'La versión original. Instala con node_modules y se mantiene solo con correcciones. Comandos como global, list y outdated existen aquí.' },
        { term: 'Yarn Berry (2, 3, 4)', def: 'La versión moderna, con configuración en .yarnrc.yml, Plug\'n\'Play opcional, dlx en vez de npx y workspaces foreach.' },
        { term: 'Corepack', def: 'Herramienta incluida con Node que descarga y usa la versión de Yarn indicada en el campo packageManager del package.json.' },
        { term: 'yarn.lock', def: 'Archivo que fija las versiones exactas instaladas. Se sube al repositorio para que todos instalen lo mismo.' },
        { term: 'Plug\'n\'Play (PnP)', def: 'Modo de Yarn 2+ que evita la carpeta node_modules y resuelve los paquetes desde un archivo .pnp.cjs.' }
      ]
    }
  ]
};
