// Guía de GitHub CLI (gh).
// Campos opcionales por entrada: desc, ej (salida de ejemplo), alias, tip (consejo), warn (precaución).
// Campos opcionales por sección: intro (texto que explica la sección), nota, tipo: 'pasos' | 'glosario'.
window.CHEATSHEETS = window.CHEATSHEETS || {};
window.CHEATSHEETS.gh = {
  meta: { id: 'gh', nombre: 'GitHub CLI', subtitulo: 'Pull requests, issues, repos, Actions y releases desde la terminal' },
  secciones: [
    {
      id: 'empezar-de-cero',
      titulo: 'Empezar de cero',
      tipo: 'pasos',
      intro: 'gh es el cliente oficial de GitHub para la terminal. Sigue estos pasos en orden, en PowerShell.',
      items: [
        {
          cmd: 'winget install --id GitHub.cli',
          desc: 'Instala GitHub CLI en Windows.',
          tip: 'Con Scoop también sirve: scoop install gh. Cierra y vuelve a abrir la terminal al terminar para que el PATH se actualice.'
        },
        {
          cmd: 'gh --version',
          desc: 'Confirma que gh quedó instalado y qué versión es.',
          ej: 'gh version 2.101.0 (2026-09-01)'
        },
        {
          cmd: 'gh auth login',
          desc: 'Inicia sesión en GitHub de forma guiada: eliges GitHub.com, el protocolo (HTTPS o SSH) y si autenticas con el navegador.',
          tip: 'La opción "Login with a web browser" es la más simple: te da un código de un solo uso que pegas en la página que se abre.'
        },
        {
          cmd: 'gh auth status',
          desc: 'Muestra con qué cuenta tienes la sesión iniciada y con qué permisos.',
          ej: 'github.com\n  ✓ Logged in to github.com account <usuario>'
        },
        {
          cmd: 'gh repo clone <usuario>/<repo>',
          desc: 'Clona un repositorio de GitHub sin necesidad de escribir la URL completa.'
        },
        {
          cmd: 'gh pr status',
          desc: 'Resumen de tus pull requests y de los que esperan tu revisión, para comprobar que todo funciona.'
        }
      ],
      nota: 'Los comandos de gh se ejecutan dentro de la carpeta de un repositorio. Fuera de él, agrega -R <usuario>/<repo> para indicar sobre cuál trabajar.'
    },
    {
      id: 'autenticacion',
      titulo: 'Autenticación',
      items: [
        { cmd: 'gh auth login', desc: 'Inicia sesión (interactivo).' },
        { cmd: 'gh auth login --web', desc: 'Inicia sesión directamente por el navegador, sin preguntas intermedias.' },
        { cmd: 'gh auth status', desc: 'Muestra la cuenta activa, el protocolo y los permisos (scopes) del token.' },
        { cmd: 'gh auth refresh -s <scope>', desc: 'Agrega un permiso extra al token actual sin volver a iniciar sesión.', ej: 'gh auth refresh -s workflow' },
        { cmd: 'gh auth setup-git', desc: 'Configura Git para que use gh como credential helper en los remotos HTTPS.' },
        { cmd: 'gh ssh-key add <archivo.pub>', desc: 'Sube una clave SSH pública a tu cuenta de GitHub, útil si elegiste SSH como protocolo.', ej: 'gh ssh-key add ~/.ssh/id_ed25519.pub --title "mi-equipo"' },
        { cmd: 'gh ssh-key list', desc: 'Lista las claves SSH registradas en tu cuenta.' },
        { cmd: 'gh auth switch', desc: 'Cambia entre varias cuentas con sesión iniciada (por ejemplo, personal y trabajo).' },
        { cmd: 'gh auth logout', desc: 'Cierra la sesión de la cuenta en este equipo.' },
        { cmd: 'gh auth token', desc: 'Imprime el token de acceso activo.', warn: 'El token equivale a tu contraseña: no lo pegues en chats, commits ni capturas.' }
      ]
    },
    {
      id: 'configuracion-y-alias',
      titulo: 'Configuración y alias',
      items: [
        { cmd: 'gh config list', desc: 'Muestra la configuración actual de gh.' },
        { cmd: 'gh config set editor "<comando>"', desc: 'Define el editor que se abre para escribir descripciones y comentarios.', ej: 'gh config set editor "code --wait"' },
        { cmd: 'gh config set git_protocol ssh', desc: 'Usa SSH en lugar de HTTPS cuando gh clona repositorios.', alias: 'gh config set git_protocol https' },
        { cmd: 'gh config set prompt disabled', desc: 'Desactiva los menús interactivos; útil en scripts.' },
        { cmd: 'gh completion -s powershell', desc: 'Genera el script de autocompletado de gh para PowerShell.', tip: 'Para activarlo en cada sesión: gh completion -s powershell | Out-String | Invoke-Expression, agregado a tu $PROFILE.' },
        { cmd: 'gh alias set <nombre> "<comando>"', desc: 'Crea un atajo propio para un comando de gh largo.', ej: 'gh alias set mis-prs "pr list --author @me"' },
        { cmd: 'gh alias set <nombre> --shell "<comando>"', desc: 'Crea un alias que ejecuta un comando de shell, lo que permite encadenar varios comandos.' },
        { cmd: 'gh alias list', desc: 'Lista los alias definidos.' },
        { cmd: 'gh alias delete <nombre>', desc: 'Elimina un alias.' }
      ]
    },
    {
      id: 'ver-pull-requests',
      titulo: 'Ver pull requests',
      items: [
        { cmd: 'gh pr list', desc: 'Lista los pull requests abiertos del repositorio.' },
        { cmd: 'gh pr list --state all', desc: 'Lista todos: abiertos, cerrados y fusionados.', alias: 'gh pr list -s all' },
        { cmd: 'gh pr list --author @me', desc: 'Solo los pull requests que creaste tú.' },
        { cmd: 'gh pr list --search "review-requested:@me"', desc: 'Los pull requests donde te pidieron revisión.' },
        { cmd: 'gh pr list --label "<etiqueta>"', desc: 'Filtra por etiqueta.' },
        { cmd: 'gh pr list --draft', desc: 'Solo los pull requests en borrador.' },
        { cmd: 'gh pr list --head <rama>', desc: 'Busca el pull request que sale de una rama concreta.' },
        { cmd: 'gh pr view <N>', desc: 'Muestra el detalle de un pull request: título, descripción, estado y revisiones.' },
        { cmd: 'gh pr view <N> --web', desc: 'Abre el pull request en el navegador.', alias: 'gh pr view <N> -w' },
        { cmd: 'gh pr view <N> --comments', desc: 'Incluye los comentarios de la conversación.' },
        { cmd: 'gh pr diff <N>', desc: 'Muestra el diff completo del pull request.' },
        { cmd: 'gh pr diff <N> --patch', desc: 'Muestra el diff en formato parche, que se puede guardar y aplicar con git apply.' },
        { cmd: 'gh pr diff <N> --name-only', desc: 'Lista solo los nombres de los archivos que cambia.' },
        { cmd: 'gh pr checks <N>', desc: 'Muestra el estado de las verificaciones (CI) del pull request.' },
        { cmd: 'gh pr checks <N> --watch', desc: 'Sigue las verificaciones en vivo hasta que terminen.' },
        { cmd: 'gh pr status', desc: 'Resumen de tus pull requests y de los que esperan tu revisión.' }
      ],
      nota: 'Si omites <N> dentro de una rama con pull request abierto, gh usa el de la rama actual.'
    },
    {
      id: 'revisar-un-pull-request',
      titulo: 'Revisar un pull request',
      items: [
        { cmd: 'gh pr checkout <N>', desc: 'Descarga la rama del pull request y te cambia a ella para probarla en local.', alias: 'gh pr co <N>' },
        { cmd: 'gh pr review <N> --approve --body "<comentario>"', desc: 'Aprueba el pull request.' },
        { cmd: 'gh pr review <N> --request-changes --body "<motivo>"', desc: 'Pide cambios antes de poder fusionarlo.' },
        { cmd: 'gh pr review <N> --comment --body "<comentario>"', desc: 'Deja una revisión con comentarios, sin aprobar ni rechazar.' },
        { cmd: 'gh pr comment <N> --body "<comentario>"', desc: 'Agrega un comentario a la conversación del pull request.' }
      ]
    },
    {
      id: 'crear-y-gestionar-pull-requests',
      titulo: 'Crear y gestionar pull requests',
      items: [
        { cmd: 'gh pr create', desc: 'Crea un pull request desde la rama actual, preguntando título, descripción y rama base.', tip: 'Si la rama aún no se subió, gh ofrece hacerlo por ti.' },
        { cmd: 'gh pr create --base <rama> --title "<título>" --body "<descripción>"', desc: 'Crea el pull request sin preguntas, indicando la rama destino.' },
        { cmd: 'gh pr create --fill', desc: 'Toma el título y la descripción de los mensajes de commit de la rama.' },
        { cmd: 'gh pr create --draft', desc: 'Lo crea como borrador, para mostrar trabajo en curso sin pedir revisión todavía.' },
        { cmd: 'gh pr create --web', desc: 'Abre en el navegador el formulario de creación ya rellenado, para terminarlo ahí.' },
        { cmd: 'gh pr create --reviewer <usuario> --assignee @me', desc: 'Crea el pull request pidiendo revisión a alguien y asignándotelo.' },
        { cmd: 'gh pr create --body-file <archivo>', desc: 'Toma la descripción desde un archivo de texto o Markdown.' },
        { cmd: 'gh pr update-branch <N>', desc: 'Pone la rama del pull request al día con su rama base, sin hacer merge ni rebase en local.' },
        { cmd: 'gh pr ready <N>', desc: 'Pasa un borrador a listo para revisión.' },
        { cmd: 'gh pr edit <N> --title "<título>"', desc: 'Cambia el título de un pull request existente.' },
        { cmd: 'gh pr edit <N> --base <rama>', desc: 'Cambia la rama destino.' },
        { cmd: 'gh pr edit <N> --add-reviewer <usuario>', desc: 'Agrega un revisor.' },
        { cmd: 'gh pr edit <N> --add-label "<etiqueta>"', desc: 'Agrega una etiqueta.' },
        { cmd: 'gh pr merge <N> --squash --delete-branch', desc: 'Fusiona combinando todos los commits en uno y borra la rama.' },
        { cmd: 'gh pr merge <N> --merge --delete-branch', desc: 'Fusiona con un commit de merge, conservando todos los commits.' },
        { cmd: 'gh pr merge <N> --rebase --delete-branch', desc: 'Fusiona reaplicando los commits sobre la rama destino, con historial lineal.' },
        { cmd: 'gh pr merge <N> --auto --squash', desc: 'Programa la fusión para cuando pasen las verificaciones y aprobaciones requeridas.' },
        { cmd: 'gh pr merge <N> --admin --squash', desc: 'Fusiona saltándose las reglas de protección de la rama.', warn: 'Requiere permisos de administrador y omite aprobaciones y verificaciones; úsalo solo cuando corresponda.' },
        { cmd: 'gh pr close <N>', desc: 'Cierra el pull request sin fusionarlo.' },
        { cmd: 'gh pr reopen <N>', desc: 'Vuelve a abrir un pull request cerrado.' }
      ],
      nota: 'Los métodos de merge disponibles dependen de lo que el repositorio tenga habilitado.'
    },
    {
      id: 'stacked-prs',
      titulo: 'Stacked PRs con gh-stack',
      intro: 'Un stack divide un cambio grande en varios pull requests encadenados: cada uno apunta a la rama del anterior, y se revisan y fusionan de la base hacia la punta. Se usa con la extensión oficial github/gh-stack.',
      items: [
        { cmd: 'gh extension install github/gh-stack', desc: 'Instala la extensión que agrega el grupo de comandos gh stack.', alias: 'gh extension upgrade gh-stack' },
        { cmd: 'gh stack init --base <base> <rama-1>', desc: 'Crea un stack nuevo: su primera rama parte de <base> (por ejemplo, main).' },
        { cmd: 'gh stack init --base <base> <rama-1> <rama-2> <rama-3>', desc: 'Convierte ramas que ya existen en un stack, indicándolas de abajo hacia arriba.' },
        { cmd: 'gh stack add <rama-2>', desc: 'Crea la siguiente rama encima de la actual y se cambia a ella.' },
        { cmd: 'gh stack add -Am "<mensaje>" <rama-2>', desc: 'Agrega todos los cambios, hace commit y apila la rama nueva en un solo paso.' },
        { cmd: 'gh stack link --base <base> <N1> <N2> <N3>', desc: 'Enlaza pull requests que ya existen para formar un stack.' },
        { cmd: 'gh stack submit', desc: 'Sube las ramas y crea o actualiza los pull requests; abre un editor para título, descripción y borrador de cada uno (Ctrl+S envía).' },
        { cmd: 'gh stack submit --auto', desc: 'Igual, pero sin editor: usa títulos automáticos y deja los nuevos como borrador.' },
        { cmd: 'gh stack submit --open', desc: 'Marca todos los pull requests del stack como listos para revisión.' },
        { cmd: 'gh stack push', desc: 'Solo sube las ramas, sin crear ni tocar pull requests.' },
        { cmd: 'gh stack view', desc: 'Muestra el stack completo: sus ramas, pull requests y estado.', alias: 'gh stack view --short' },
        { cmd: 'gh stack up', desc: 'Te mueve a la rama siguiente del stack (hacia la punta).', alias: 'gh stack top' },
        { cmd: 'gh stack down', desc: 'Te mueve a la rama anterior (hacia la base).', alias: 'gh stack bottom' },
        { cmd: 'gh stack trunk', desc: 'Te lleva a la rama base sobre la que se apoya todo el stack.' },
        { cmd: 'gh stack switch', desc: 'Elige de forma interactiva a qué rama del stack cambiarte.' },
        { cmd: 'gh stack checkout <N>', desc: 'Descarga el stack al que pertenece el pull request N, por ejemplo el de otra persona.' },
        {
          cmd: 'gh stack sync',
          desc: 'Deja todo el stack al día en un paso: hace fetch, rebase en cascada de cada rama sobre la anterior, sube con --force-with-lease y actualiza los pull requests.',
          tip: 'Es el comando que más vas a usar: córrelo después de corregir una rama de abajo o de fusionar la base del stack.'
        },
        { cmd: 'gh stack rebase', desc: 'Hace el rebase en cascada del stack sin subir nada; útil para resolver conflictos con calma.' },
        { cmd: 'gh stack rebase --continue', desc: 'Continúa el rebase después de resolver los conflictos y hacer git add.', alias: 'gh stack rebase --abort' },
        { cmd: 'gh stack modify', desc: 'Reordena, elimina o divide ramas del stack.' },
        { cmd: 'gh stack merge', desc: 'Fusiona el stack completo de una vez.', alias: 'gh stack merge <N>' },
        { cmd: 'gh stack unstack', desc: 'Deshace el stack en local y en GitHub; las ramas y los pull requests quedan como estaban.', alias: 'gh stack unstack --local' }
      ],
      nota: 'Para corregir una rama de abajo: gh stack down, edita y haz commit, y luego gh stack sync. Evita hacer git rebase a mano rama por rama, porque gh stack sync ya lo hace en cascada. Al ser una extensión, revisa gh stack <comando> --help por si alguna opción cambia entre versiones.'
    },
    {
      id: 'issues',
      titulo: 'Issues',
      items: [
        { cmd: 'gh issue list', desc: 'Lista los issues abiertos.' },
        { cmd: 'gh issue list --assignee @me', desc: 'Solo los issues asignados a ti.' },
        { cmd: 'gh issue list --label "<etiqueta>" --state all', desc: 'Filtra por etiqueta e incluye los cerrados.' },
        { cmd: 'gh issue view <N>', desc: 'Muestra el detalle de un issue.' },
        { cmd: 'gh issue view <N> --web', desc: 'Abre el issue en el navegador.' },
        { cmd: 'gh issue create', desc: 'Crea un issue de forma interactiva.' },
        { cmd: 'gh issue create --title "<título>" --body "<descripción>"', desc: 'Crea un issue sin preguntas.' },
        { cmd: 'gh issue comment <N> --body "<comentario>"', desc: 'Comenta en un issue.' },
        { cmd: 'gh issue edit <N> --add-assignee @me', desc: 'Te asigna el issue.' },
        { cmd: 'gh issue close <N>', desc: 'Cierra un issue.' },
        { cmd: 'gh issue reopen <N>', desc: 'Vuelve a abrir un issue cerrado.' },
        { cmd: 'gh issue develop <N> --checkout', desc: 'Crea una rama vinculada al issue y te cambia a ella.', alias: 'gh issue develop <N> -c' }
      ]
    },
    {
      id: 'repositorios',
      titulo: 'Repositorios',
      items: [
        { cmd: 'gh repo view', desc: 'Muestra la descripción y el README del repositorio actual.' },
        { cmd: 'gh repo view --web', desc: 'Abre el repositorio en el navegador.', alias: 'gh browse' },
        { cmd: 'gh repo clone <usuario>/<repo>', desc: 'Clona un repositorio.' },
        { cmd: 'gh repo create <nombre> --private --source=. --push', desc: 'Crea un repositorio privado en GitHub a partir de la carpeta actual y sube el código.', tip: 'Usa --public en lugar de --private para hacerlo público.' },
        { cmd: 'gh repo create <nombre> --template <usuario>/<plantilla>', desc: 'Crea un repositorio nuevo a partir de un repositorio plantilla.' },
        { cmd: 'gh repo set-default', desc: 'Define sobre qué repositorio actúa gh cuando hay varios remotos, por ejemplo un fork y el original.', tip: 'Sin esto, comandos como gh pr create pueden apuntar al repositorio equivocado o preguntar cada vez.' },
        { cmd: 'gh repo rename <nuevo-nombre>', desc: 'Cambia el nombre del repositorio actual en GitHub.' },
        { cmd: 'gh repo archive <usuario>/<repo>', desc: 'Archiva un repositorio: queda en modo solo lectura.' },
        { cmd: 'gh repo fork', desc: 'Crea un fork del repositorio actual en tu cuenta.', alias: 'gh repo fork --clone' },
        { cmd: 'gh repo list <usuario>', desc: 'Lista los repositorios de una cuenta u organización.' },
        { cmd: 'gh repo edit --description "<texto>"', desc: 'Cambia la descripción del repositorio.' },
        { cmd: 'gh repo sync', desc: 'Sincroniza tu fork con el repositorio original.' },
        { cmd: 'gh repo delete <usuario>/<repo>', desc: 'Elimina un repositorio.', warn: 'Irreversible: borra el repositorio y todo su historial en GitHub. Requiere permiso delete_repo.' },
        { cmd: 'gh browse', desc: 'Abre en el navegador la página del repositorio.', ej: 'gh browse <archivo>  # abre ese archivo en GitHub' }
      ]
    },
    {
      id: 'actions-y-workflows',
      titulo: 'Actions y workflows (CI/CD)',
      items: [
        { cmd: 'gh run list', desc: 'Lista las ejecuciones recientes de workflows, con su estado.' },
        { cmd: 'gh run list --branch <rama>', desc: 'Solo las ejecuciones de una rama.' },
        { cmd: 'gh run list --workflow <archivo>', desc: 'Solo las ejecuciones de un workflow concreto.', ej: 'gh run list --workflow ci.yml' },
        { cmd: 'gh run view <id>', desc: 'Muestra el detalle de una ejecución y sus jobs.' },
        { cmd: 'gh run view --job <id>', desc: 'Muestra un job puntual de la ejecución, con sus pasos.', alias: 'gh run view --job <id> --log' },
        { cmd: 'gh run view <id> --log-failed', desc: 'Muestra solo el log de los pasos que fallaron; lo más rápido para diagnosticar un CI en rojo.' },
        { cmd: 'gh run watch <id>', desc: 'Sigue una ejecución en vivo hasta que termine.' },
        { cmd: 'gh run rerun <id>', desc: 'Vuelve a ejecutar un workflow.', alias: 'gh run rerun <id> --failed' },
        { cmd: 'gh run cancel <id>', desc: 'Cancela una ejecución en curso.' },
        { cmd: 'gh run download <id>', desc: 'Descarga los artefactos que generó una ejecución.' },
        { cmd: 'gh workflow list', desc: 'Lista los workflows del repositorio.' },
        { cmd: 'gh workflow run <workflow>', desc: 'Dispara manualmente un workflow que tenga el evento workflow_dispatch.', ej: 'gh workflow run deploy.yml --ref main' },
        { cmd: 'gh workflow disable <workflow>', desc: 'Desactiva un workflow sin borrarlo.', alias: 'gh workflow enable <workflow>' },
        { cmd: 'gh secret set <NOMBRE>', desc: 'Guarda un secreto del repositorio para usarlo en Actions; pide el valor por entrada.' },
        { cmd: 'gh secret list', desc: 'Lista los nombres de los secretos configurados; nunca muestra sus valores.' },
        { cmd: 'gh secret delete <NOMBRE>', desc: 'Elimina un secreto del repositorio.' },
        { cmd: 'gh variable set <NOMBRE> --body "<valor>"', desc: 'Define una variable de configuración (no secreta) del repositorio.' },
        { cmd: 'gh variable list', desc: 'Lista las variables del repositorio con sus valores.' },
        { cmd: 'gh cache list', desc: 'Lista las cachés de Actions del repositorio y cuánto espacio ocupan.' },
        { cmd: 'gh cache delete <id>', desc: 'Elimina una caché de Actions.', alias: 'gh cache delete --all' }
      ]
    },
    {
      id: 'releases',
      titulo: 'Releases',
      items: [
        { cmd: 'gh release list', desc: 'Lista los releases del repositorio.' },
        { cmd: 'gh release view <tag>', desc: 'Muestra el detalle de un release.', alias: 'gh release view --web' },
        { cmd: 'gh release create <tag> --generate-notes', desc: 'Crea un release a partir de un tag y genera las notas automáticamente con los cambios desde el release anterior.' },
        { cmd: 'gh release create <tag> <archivo> --title "<título>"', desc: 'Crea un release y adjunta archivos (instaladores, binarios).' },
        { cmd: 'gh release create <tag> --prerelease', desc: 'Lo marca como prerelease.' },
        { cmd: 'gh release upload <tag> <archivo>', desc: 'Adjunta archivos a un release que ya existe.', alias: 'gh release upload <tag> <archivo> --clobber' },
        { cmd: 'gh release download <tag>', desc: 'Descarga los archivos adjuntos de un release.', alias: 'gh release download <tag> --pattern "*.zip"' },
        { cmd: 'gh release delete <tag>', desc: 'Elimina un release.' }
      ]
    },
    {
      id: 'buscar-y-otras-utilidades',
      titulo: 'Buscar y otras utilidades',
      items: [
        { cmd: 'gh search repos "<texto>" --language <lenguaje>', desc: 'Busca repositorios en GitHub.', ej: 'gh search repos "cheatsheet" --language javascript' },
        { cmd: 'gh search prs "<texto>" --state open', desc: 'Busca pull requests en todo GitHub o en una organización.', alias: 'gh search issues "<texto>"' },
        { cmd: 'gh search code "<texto>" --owner <usuario>', desc: 'Busca código en los repositorios de una cuenta.' },
        { cmd: 'gh gist create <archivo>', desc: 'Sube un archivo como gist secreto y devuelve la URL.', tip: 'Agrega --public para hacerlo público.' },
        { cmd: 'gh gist list', desc: 'Lista tus gists.' },
        { cmd: 'gh label list', desc: 'Lista las etiquetas del repositorio.' },
        { cmd: 'gh label create <nombre> --color <hex> --description "<texto>"', desc: 'Crea una etiqueta nueva.', ej: 'gh label create urgente --color d73a4a' },
        { cmd: 'gh label edit <nombre> --name <nuevo-nombre>', desc: 'Renombra o cambia el color y la descripción de una etiqueta.' },
        { cmd: 'gh label delete <nombre>', desc: 'Elimina una etiqueta.' },
        { cmd: 'gh project list', desc: 'Lista los GitHub Projects (tableros) de tu cuenta.', tip: 'Requiere el permiso project: gh auth refresh -s project.' },
        { cmd: 'gh ruleset list', desc: 'Lista los rulesets (reglas de protección) del repositorio.' },
        { cmd: 'gh codespace list', desc: 'Lista tus Codespaces.', alias: 'gh codespace ssh' },
        { cmd: 'gh status', desc: 'Panel con tus menciones, revisiones pendientes y actividad reciente en GitHub.' },
        { cmd: 'gh extension install <usuario>/<gh-extension>', desc: 'Instala una extensión de terceros que agrega comandos nuevos a gh.', ej: 'gh extension install dlvhdr/gh-dash' },
        { cmd: 'gh extension list', desc: 'Lista las extensiones instaladas.', alias: 'gh extension upgrade --all' }
      ]
    },
    {
      id: 'salida-json-y-api',
      titulo: 'Salida en JSON y API',
      intro: 'La mayoría de los comandos de listado aceptan --json para devolver datos estructurados, y --jq para filtrarlos sin instalar nada más. Sirve para scripts y para armar tablas a medida.',
      items: [
        { cmd: 'gh pr list --json number,title,author', desc: 'Devuelve los campos indicados como JSON en vez de la tabla habitual.' },
        { cmd: 'gh pr list --json number,title --jq \'.[] | "#\\(.number) \\(.title)"\'', desc: 'Filtra la salida con una expresión jq; aquí imprime una línea por pull request.' },
        { cmd: 'gh pr list --json number,headRefName,baseRefName,changedFiles,additions,deletions,reviewDecision', desc: 'Base, tamaño y estado de revisión de cada pull request; útil para saber cuáles son grandes.' },
        { cmd: 'gh pr view <N> --json state,mergeable,statusCheckRollup', desc: 'Consulta si un pull request está listo para fusionarse.' },
        { cmd: 'gh api repos/<usuario>/<repo>', desc: 'Llama directamente a la API REST de GitHub con tu sesión ya autenticada.' },
        { cmd: 'gh api repos/<usuario>/<repo>/issues -X POST -f title="<título>" -f body="<texto>"', desc: 'Llama a la API con otro método HTTP (-X) y envía campos de texto con -f.', tip: 'Usa -F en lugar de -f para enviar números, booleanos o el contenido de un archivo (-F body=@archivo.md).' },
        { cmd: 'gh api graphql -f query=\'<consulta>\'', desc: 'Ejecuta una consulta GraphQL.' },
        { cmd: 'gh api repos/<usuario>/<repo>/pulls --paginate', desc: 'Recorre todas las páginas de resultados en lugar de solo la primera.' }
      ],
      nota: 'Ejecuta gh <comando> --json sin campos para ver la lista de campos disponibles de ese comando.'
    },
    {
      id: 'variables-de-entorno',
      titulo: 'Variables de entorno',
      intro: 'gh lee varias variables de entorno que permiten usarlo en scripts y CI, donde no hay una sesión interactiva con gh auth login.',
      items: [
        { cmd: '$env:GH_TOKEN = "<token>"', desc: 'Autentica gh con un token, sin necesidad de gh auth login. Es lo habitual en CI, donde suele usarse ${{ secrets.GITHUB_TOKEN }}.', warn: 'El token equivale a una contraseña: no lo escribas en archivos versionados.' },
        { cmd: '$env:GH_REPO = "<usuario>/<repo>"', desc: 'Indica sobre qué repositorio actuar, equivalente a pasar -R en cada comando; permite correr gh fuera de una carpeta de repositorio.' },
        { cmd: '$env:GH_EDITOR = "<comando>"', desc: 'Editor que gh abre para descripciones y comentarios; tiene prioridad sobre gh config set editor.' },
        { cmd: '$env:GH_PROMPT_DISABLED = "1"', desc: 'Desactiva los menús interactivos, útil en scripts.' },
        { cmd: '$env:GH_HOST = "<host>"', desc: 'Apunta gh a otro host, como una instancia de GitHub Enterprise.' },
        { cmd: '$env:NO_COLOR = "1"', desc: 'Quita los colores de la salida, útil al redirigirla a un archivo.' }
      ],
      nota: 'Estas variables valen solo para la sesión de PowerShell actual. Para dejarlas fijas usa [Environment]::SetEnvironmentVariable("<NOMBRE>", "<valor>", "User").'
    },
    {
      id: 'ayuda',
      titulo: 'Ayuda y actualización',
      items: [
        { cmd: 'gh --help', desc: 'Lista los grupos de comandos disponibles.' },
        { cmd: 'gh <comando> --help', desc: 'Muestra las opciones y ejemplos de un comando.', ej: 'gh pr create --help' },
        { cmd: 'gh <comando> <subcomando> --help', desc: 'Ayuda de un subcomando puntual.', ej: 'gh run view --help' },
        { cmd: 'gh help formatting', desc: 'Explica cómo dar formato a la salida con --json, --jq y --template.' },
        { cmd: 'winget upgrade --id GitHub.cli', desc: 'Actualiza gh a la última versión.', alias: 'scoop update gh' }
      ]
    },
    {
      id: 'glosario-de-terminos',
      titulo: 'Glosario de términos',
      tipo: 'glosario',
      items: [
        { term: 'Pull request (PR)', def: 'Propuesta para incorporar los cambios de una rama en otra, con espacio para revisión y comentarios.' },
        { term: 'Draft (borrador)', def: 'Pull request marcado como trabajo en curso; no puede fusionarse hasta pasarlo a "listo para revisión".' },
        { term: 'Base / head', def: 'En un pull request, base es la rama destino y head es la rama con los cambios.' },
        { term: 'Review (revisión)', def: 'Evaluación de un pull request que puede aprobar, pedir cambios o solo comentar.' },
        { term: 'Issue', def: 'Tarea, error o idea registrada en el repositorio para dar seguimiento.' },
        { term: 'Stack', def: 'Serie de pull requests encadenados, donde cada uno tiene como base la rama del anterior; permite dividir un cambio grande en partes revisables.' },
        { term: 'Squash', def: 'Método de fusión que combina todos los commits del pull request en uno solo.' },
        { term: 'Workflow', def: 'Automatización definida en un archivo YAML dentro de .github/workflows, que se ejecuta ante eventos como un push o un pull request.' },
        { term: 'Run', def: 'Una ejecución concreta de un workflow.' },
        { term: 'Release', def: 'Versión publicada del proyecto asociada a un tag, con notas y archivos descargables.' },
        { term: 'Gist', def: 'Fragmento de código o texto que se comparte de forma independiente, sin necesidad de un repositorio.' },
        { term: 'Scope', def: 'Permiso concreto que se le concede a un token de acceso, como repo o workflow.' },
        { term: 'Extensión', def: 'Programa de terceros que se instala con gh extension install y agrega comandos nuevos a gh.' }
      ]
    }
  ]
};
