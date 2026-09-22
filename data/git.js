// Guía de Git.
// Campos opcionales por entrada: desc, ej (salida de ejemplo), alias, tip (consejo), warn (precaución).
// Campos opcionales por sección: intro (texto que explica la sección), nota, tipo: 'pasos' | 'glosario'.
window.CHEATSHEETS = window.CHEATSHEETS || {};
window.CHEATSHEETS.git = {
  meta: { id: 'git', nombre: 'Git', subtitulo: 'Commits, ramas, merge, rebase, stash y remotos' },
  secciones: [
    {
      id: 'empezar-de-cero',
      titulo: 'Empezar de cero',
      tipo: 'pasos',
      intro: 'Sigue estos pasos en orden, en PowerShell. Cada paso indica qué deberías ver si salió bien.',
      items: [
        {
          cmd: 'winget install --id Git.Git -e --source winget',
          desc: 'Instala Git for Windows: incluye el cliente git, Git Bash y el Git Credential Manager.',
          tip: 'Cierra y vuelve a abrir la terminal al terminar para que el PATH se actualice. Con Scoop también sirve: scoop install git.'
        },
        {
          cmd: 'git --version',
          desc: 'Confirma que Git quedó instalado y qué versión es.',
          ej: 'git version 2.47.0.windows.1'
        },
        {
          cmd: 'git config --global user.name "<Tu Nombre>"',
          desc: 'Define el nombre que aparecerá como autor en tus commits. Es obligatorio antes de poder confirmar cambios.'
        },
        {
          cmd: 'git config --global user.email "<tu@correo.com>"',
          desc: 'Define el correo asociado a tus commits. Usa el mismo correo que tu cuenta de GitHub/GitLab si quieres que los commits se vinculen a tu perfil.'
        },
        {
          cmd: 'git config --global init.defaultBranch main',
          desc: 'Fija el nombre de la rama inicial en los repositorios nuevos. Sin esto, versiones antiguas de Git usan master.'
        },
        {
          cmd: 'git init',
          desc: 'Convierte la carpeta actual en un repositorio Git nuevo y vacío.',
          ej: 'Initialized empty Git repository in C:/proyecto/.git/'
        },
        {
          cmd: 'git clone <url>',
          desc: 'Descarga un repositorio remoto completo, con su historial, y lo deja listo para trabajar en una carpeta nueva.'
        },
        {
          cmd: 'git status',
          desc: 'Muestra en qué rama estás y qué archivos tienen cambios sin confirmar.',
          ej: 'On branch main\nnothing to commit, working tree clean'
        },
        {
          cmd: 'git add .',
          desc: 'Agrega todos los cambios de la carpeta actual hacia abajo al área de preparación (staging), listos para el próximo commit.'
        },
        {
          cmd: 'git commit -m "<mensaje>"',
          desc: 'Guarda en el historial los cambios que están en staging, con un mensaje que explique el porqué.'
        }
      ]
    },
    {
      id: 'configuracion',
      titulo: 'Configuración',
      intro: 'Git guarda la configuración en tres niveles: --system (toda la máquina), --global (tu usuario) y sin bandera (solo el repositorio actual). El más específico gana.',
      items: [
        { cmd: 'git config --global user.name "<nombre>"', desc: 'Nombre de autor para tus commits en todos los repositorios de esta máquina.' },
        { cmd: 'git config --global user.email "<correo>"', desc: 'Correo de autor para tus commits en todos los repositorios.' },
        { cmd: 'git config user.email "<correo>"', desc: 'Sobrescribe el correo solo para el repositorio actual, sin el --global.', tip: 'Útil cuando usas un correo distinto para proyectos de trabajo.' },
        { cmd: 'git config --global core.editor "<comando>"', desc: 'Define el editor que se abre para escribir mensajes de commit largos o hacer rebase interactivo.', alias: 'git config --global core.editor "code --wait"' },
        { cmd: 'git config --global alias.<alias> "<comando>"', desc: 'Crea un atajo para un comando largo.', ej: 'git config --global alias.st "status -s"' },
        { cmd: 'git config --global core.autocrlf true', desc: 'En Windows, convierte los saltos de línea LF a CRLF al hacer checkout y de vuelta a LF al confirmar, para trabajar bien con repositorios que usan LF (la mayoría).' },
        { cmd: 'git config --global credential.helper manager', desc: 'Usa el Git Credential Manager para guardar credenciales de HTTPS de forma segura, sin pedirlas en cada push/pull.' },
        { cmd: 'git config --list --show-origin', desc: 'Muestra toda la configuración efectiva y de qué archivo viene cada valor.' },
        { cmd: 'git config --global -e', desc: 'Abre el archivo de configuración global (~/.gitconfig) directamente en el editor.' }
      ]
    },
    {
      id: 'estado-y-preparacion',
      titulo: 'Estado y área de preparación (staging)',
      intro: 'Un cambio pasa por tres lugares: el directorio de trabajo, el área de preparación (staging/index) y el historial de commits.',
      items: [
        { cmd: 'git status', desc: 'Muestra archivos modificados, nuevos y en staging.' },
        { cmd: 'git status -s', desc: 'Versión abreviada: una letra por archivo (M modificado, A agregado, ?? sin trackear).', alias: 'git status --short' },
        { cmd: 'git add <archivo>', desc: 'Agrega un archivo puntual al área de preparación.' },
        { cmd: 'git add .', desc: 'Agrega todos los cambios (nuevos, modificados, eliminados) de la carpeta actual hacia abajo.' },
        { cmd: 'git add -p', desc: 'Revisa los cambios en bloques (hunks) y decide interactivamente cuáles agregar; útil para no mezclar cambios distintos en un mismo commit.', alias: 'git add --patch' },
        { cmd: 'git restore <archivo>', desc: 'Descarta los cambios sin confirmar de un archivo, volviéndolo a como estaba en el último commit.', warn: 'Los cambios descartados no se pueden recuperar.' },
        { cmd: 'git restore --staged <archivo>', desc: 'Saca un archivo del área de preparación sin perder sus cambios; queda como modificado sin agregar.' },
        { cmd: 'git diff', desc: 'Muestra las diferencias entre el directorio de trabajo y lo que ya está en staging.' },
        { cmd: 'git diff --staged', desc: 'Muestra las diferencias entre lo que está en staging y el último commit.', alias: 'git diff --cached' }
      ]
    },
    {
      id: 'commits',
      titulo: 'Commits',
      items: [
        { cmd: 'git commit -m "<mensaje>"', desc: 'Confirma los cambios en staging con un mensaje corto en una línea.' },
        { cmd: 'git commit', desc: 'Abre el editor configurado para escribir un mensaje de commit más largo (título + cuerpo).' },
        { cmd: 'git commit -am "<mensaje>"', desc: 'Agrega automáticamente los cambios de archivos ya trackeados y confirma en un solo paso.', warn: 'No incluye archivos nuevos sin trackear; esos igual necesitan git add.' },
        { cmd: 'git commit --amend', desc: 'Reemplaza el último commit por uno nuevo, permitiendo editar el mensaje y sumar cambios que quedaron en staging.' },
        { cmd: 'git commit --amend --no-edit', desc: 'Suma cambios en staging al último commit sin tocar el mensaje.', warn: 'Si el commit ya se subió a un remoto compartido, hacer amend reescribe su hash; coordina con el equipo antes de hacer push --force.' },
        { cmd: '.gitignore', desc: 'Archivo con patrones de rutas que Git debe ignorar al mostrar el estado o al agregar archivos.', ej: 'node_modules/\n*.log\n.env' }
      ]
    },
    {
      id: 'historial-e-inspeccion',
      titulo: 'Historial e inspección',
      items: [
        { cmd: 'git log', desc: 'Muestra el historial de commits de la rama actual, del más reciente al más antiguo.' },
        { cmd: 'git log --oneline', desc: 'Una línea por commit: hash corto y mensaje.' },
        { cmd: 'git log --oneline --graph --all', desc: 'Historial de todas las ramas con un gráfico ASCII de cómo se bifurcan y se unen.' },
        { cmd: 'git log -p -1', desc: 'Muestra el commit más reciente junto con su diff completo.' },
        { cmd: 'git log --author="<nombre>"', desc: 'Filtra el historial por autor.' },
        { cmd: 'git log --since="<fecha>" --until="<fecha>"', desc: 'Filtra el historial por rango de fechas.' },
        { cmd: 'git show <commit>', desc: 'Muestra los metadatos y el diff de un commit específico.' },
        { cmd: 'git show HEAD~1', desc: 'Muestra el commit anterior al actual (HEAD~2 sería dos atrás, y así sucesivamente).' },
        { cmd: 'git blame <archivo>', desc: 'Muestra, línea por línea, en qué commit y por quién se modificó por última vez cada línea del archivo.' },
        { cmd: 'git diff <commitA> <commitB>', desc: 'Muestra las diferencias entre dos commits o ramas.' }
      ]
    },
    {
      id: 'ramas',
      titulo: 'Ramas (branching)',
      items: [
        { cmd: 'git branch', desc: 'Lista las ramas locales; marca con * la rama activa.' },
        { cmd: 'git branch -a', desc: 'Lista ramas locales y remotas conocidas.' },
        { cmd: 'git branch <nombre>', desc: 'Crea una rama nueva a partir del commit actual, sin cambiarte a ella.' },
        { cmd: 'git switch <rama>', desc: 'Cambia a una rama existente.', alias: 'git checkout <rama>' },
        { cmd: 'git switch -c <rama>', desc: 'Crea una rama nueva y se cambia a ella en un solo paso.', alias: 'git checkout -b <rama>' },
        { cmd: 'git branch -m <nuevo-nombre>', desc: 'Renombra la rama activa.' },
        { cmd: 'git branch -d <rama>', desc: 'Elimina una rama local ya fusionada.', warn: 'Falla si la rama tiene commits sin fusionar; usa -D para forzar.' },
        { cmd: 'git branch -D <rama>', desc: 'Elimina una rama local aunque tenga commits sin fusionar.', warn: 'Los commits exclusivos de esa rama quedan sin ninguna referencia y Git puede eliminarlos definitivamente.' },
        { cmd: 'git branch --merged', desc: 'Lista las ramas ya fusionadas en la rama actual; candidatas seguras para borrar.' }
      ]
    },
    {
      id: 'merge-y-rebase',
      titulo: 'Merge y rebase',
      intro: 'Ambos integran cambios de una rama en otra, pero de forma distinta: merge crea un commit que une las dos historias; rebase reescribe los commits de una rama para que parezcan creados sobre la punta de la otra.',
      items: [
        { cmd: 'git merge <rama>', desc: 'Fusiona los cambios de <rama> en la rama activa. Si es posible, avanza el puntero sin crear commit (fast-forward).' },
        { cmd: 'git merge --no-ff <rama>', desc: 'Fuerza un commit de merge aunque el fast-forward fuera posible, para dejar registro explícito de que hubo una integración.' },
        { cmd: 'git merge --abort', desc: 'Cancela un merge en curso con conflictos y vuelve al estado previo.' },
        { cmd: 'git rebase <rama>', desc: 'Vuelve a aplicar los commits de la rama activa encima de la punta de <rama>, dejando un historial lineal.', warn: 'No hagas rebase de una rama que ya empujaste y que otros están usando: reescribe los hashes de los commits.' },
        { cmd: 'git rebase -i HEAD~<n>', desc: 'Rebase interactivo: permite reordenar, combinar (squash) o editar los últimos n commits antes de reescribirlos.' },
        { cmd: 'git rebase --continue', desc: 'Continúa un rebase después de resolver los conflictos del paso actual.' },
        { cmd: 'git rebase --abort', desc: 'Cancela un rebase en curso y vuelve al estado anterior al comando.' },
        { cmd: 'git cherry-pick <commit>', desc: 'Aplica un commit específico de otra rama sobre la rama activa, sin traer el resto de su historial.' }
      ],
      nota: 'Al haber conflictos, Git marca en los archivos las zonas en disputa con <<<<<<<, ======= y >>>>>>>; edítalas, deja el resultado final y confirma con git add antes de continuar (git rebase --continue o el commit del merge).'
    },
    {
      id: 'remotos',
      titulo: 'Remotos',
      items: [
        { cmd: 'git remote -v', desc: 'Lista los remotos configurados con sus URLs de fetch y push.' },
        { cmd: 'git remote add origin <url>', desc: 'Registra un remoto nuevo llamado origin.' },
        { cmd: 'git remote set-url origin <url>', desc: 'Cambia la URL de un remoto ya configurado.' },
        { cmd: 'git remote remove <nombre>', desc: 'Elimina un remoto del repositorio local; no afecta al servidor remoto.' },
        { cmd: 'git fetch', desc: 'Descarga commits y ramas nuevas del remoto, sin fusionarlos en tu trabajo actual.' },
        { cmd: 'git fetch --all', desc: 'Descarga novedades de todos los remotos configurados.' },
        { cmd: 'git pull', desc: 'Descarga y fusiona (fetch + merge) los cambios del remoto en la rama actual.' },
        { cmd: 'git pull --rebase', desc: 'Descarga los cambios y reaplica tus commits locales encima, en vez de crear un commit de merge.' },
        { cmd: 'git push', desc: 'Sube los commits de la rama actual al remoto correspondiente.' },
        { cmd: 'git push -u origin <rama>', desc: 'Sube la rama y la vincula como upstream, para que un simple git push la reconozca en el futuro.', alias: 'git push --set-upstream origin <rama>' },
        { cmd: 'git push --force-with-lease', desc: 'Sobrescribe el historial remoto solo si nadie más subió commits nuevos desde tu última descarga.', warn: 'Más seguro que --force, pero igual reescribe historial compartido: úsalo solo en ramas propias o coordinando con el equipo.' }
      ]
    },
    {
      id: 'deshacer-cambios',
      titulo: 'Deshacer cambios',
      intro: 'Cuál usar depende de qué tan lejos llegó el cambio: restore para el directorio de trabajo o staging, reset para mover el historial local, revert para deshacer sin reescribir el historial.',
      items: [
        { cmd: 'git restore <archivo>', desc: 'Descarta cambios sin confirmar en el directorio de trabajo.', warn: 'Irreversible: el contenido anterior se pierde.' },
        { cmd: 'git restore --staged <archivo>', desc: 'Quita un archivo del área de preparación sin perder sus cambios.' },
        { cmd: 'git reset --soft HEAD~1', desc: 'Deshace el último commit pero deja sus cambios en staging, listos para volver a confirmar.' },
        { cmd: 'git reset HEAD~1', desc: 'Deshace el último commit y deja sus cambios sin staging (modo mixed, el predeterminado).' },
        { cmd: 'git reset --hard HEAD~1', desc: 'Deshace el último commit y descarta también sus cambios del directorio de trabajo.', warn: 'Pierdes el contenido del commit y los cambios sin confirmar que tuvieras encima; no se puede deshacer con un comando normal.' },
        { cmd: 'git revert <commit>', desc: 'Crea un commit nuevo que aplica el efecto contrario de <commit>, sin borrar el commit original del historial.', tip: 'Es la forma segura de deshacer algo que ya se subió a un remoto compartido.' },
        { cmd: 'git clean -n', desc: 'Muestra qué archivos sin trackear se eliminarían, sin borrar nada todavía.', alias: 'git clean --dry-run' },
        { cmd: 'git clean -fd', desc: 'Elimina archivos y carpetas sin trackear del directorio de trabajo.', warn: 'No se puede deshacer; ejecuta primero git clean -n para revisar qué se va a borrar.' }
      ]
    },
    {
      id: 'stash',
      titulo: 'Stash',
      intro: 'Guarda cambios sin confirmar en una pila temporal, para volver a un directorio de trabajo limpio sin perder el progreso.',
      items: [
        { cmd: 'git stash', desc: 'Guarda los cambios trackeados (staged y sin staging) y limpia el directorio de trabajo.', alias: 'git stash push' },
        { cmd: 'git stash -u', desc: 'Incluye también los archivos nuevos sin trackear.', alias: 'git stash push -u' },
        { cmd: 'git stash list', desc: 'Lista los stashes guardados, del más reciente al más antiguo.' },
        { cmd: 'git stash pop', desc: 'Aplica el stash más reciente sobre el directorio de trabajo y lo elimina de la pila.', warn: 'Puede generar conflictos si el directorio de trabajo cambió desde que se guardó el stash.' },
        { cmd: 'git stash apply', desc: 'Aplica el stash más reciente pero lo mantiene en la pila, por si necesitas aplicarlo también en otra rama.' },
        { cmd: 'git stash drop', desc: 'Elimina el stash más reciente de la pila sin aplicarlo.' },
        { cmd: 'git stash show -p stash@{0}', desc: 'Muestra el diff completo de un stash específico sin aplicarlo.' },
        { cmd: 'git stash branch <nombre>', desc: 'Crea una rama nueva a partir del commit donde se guardó el stash y lo aplica ahí; útil cuando aplicarlo directo genera conflictos.' }
      ]
    },
    {
      id: 'tags',
      titulo: 'Tags',
      items: [
        { cmd: 'git tag', desc: 'Lista los tags del repositorio.' },
        { cmd: 'git tag <nombre>', desc: 'Crea un tag ligero (un simple puntero) sobre el commit actual.', ej: 'git tag v1.0.0' },
        { cmd: 'git tag -a <nombre> -m "<mensaje>"', desc: 'Crea un tag anotado, con autor, fecha y mensaje propios; recomendado para releases.' },
        { cmd: 'git show <tag>', desc: 'Muestra la información del tag y el commit al que apunta.' },
        { cmd: 'git push origin <tag>', desc: 'Sube un tag puntual al remoto.' },
        { cmd: 'git push --tags', desc: 'Sube todos los tags locales que aún no existen en el remoto.' },
        { cmd: 'git tag -d <nombre>', desc: 'Elimina un tag local.' },
        { cmd: 'git push origin --delete <nombre>', desc: 'Elimina un tag del remoto.' }
      ]
    },
    {
      id: 'comandos-practicos-combinados',
      titulo: 'Comandos prácticos combinados',
      items: [
        { cmd: 'git switch -c feature/<nombre> && git push -u origin feature/<nombre>', desc: 'Crea una rama de feature y la publica en el remoto en el mismo paso.' },
        { cmd: 'git add -A && git commit --amend --no-edit && git push --force-with-lease', desc: 'Agrega cambios pendientes al último commit y actualiza el remoto sin cambiar el mensaje.', warn: 'Solo en ramas propias que no comparta nadie más.' },
        { cmd: 'git fetch origin && git rebase origin/main', desc: 'Actualiza tu rama con lo último de main manteniendo un historial lineal.' },
        { cmd: 'git stash && git pull && git stash pop', desc: 'Guarda cambios locales, actualiza la rama y los vuelve a aplicar; evita el error "your local changes would be overwritten".' },
        { cmd: 'git reset --soft HEAD~1', desc: 'Deshace el último commit dejando los cambios listos para editarlo o dividirlo en commits más chicos.' },
        { cmd: 'git log --oneline --graph --all --decorate', desc: 'Vista rápida de cómo se relacionan todas las ramas y sus commits.' }
      ],
      nota: 'Ejemplos listos para adaptar. Reemplaza nombres de ramas, remotos y mensajes antes de ejecutarlos.'
    },
    {
      id: 'problemas-comunes-en-windows',
      titulo: 'Problemas comunes en Windows',
      intro: 'Los errores que más aparecen al trabajar con Git en Windows, y qué ejecutar para resolverlos.',
      items: [
        {
          cmd: 'git config --global core.autocrlf true',
          desc: 'Corrige el aviso "LF will be replaced by CRLF" en cada commit: convierte los finales de línea automáticamente al hacer checkout/commit.'
        },
        {
          cmd: 'git config --global core.longpaths true',
          desc: 'Soluciona errores de "Filename too long" en repositorios con rutas muy anidadas (node_modules, por ejemplo); Windows por defecto limita las rutas a 260 caracteres.'
        },
        {
          cmd: 'git config --global credential.helper manager',
          desc: 'Corrige que Git pida usuario y contraseña en cada push/pull: guarda las credenciales HTTPS de forma segura con el Credential Manager de Windows.'
        },
        {
          cmd: 'cmdkey /list | findstr git',
          desc: 'Busca en el Administrador de Credenciales de Windows una credencial de Git guardada que haya quedado vieja o de otra cuenta.',
          tip: 'Bórrala desde Panel de control > Administrador de credenciales si git sigue autenticando con la cuenta incorrecta.'
        },
        {
          cmd: 'git rev-parse --is-inside-work-tree',
          desc: 'Confirma si la carpeta actual está dentro de un repositorio Git; útil para diagnosticar el error "fatal: not a git repository".',
          ej: 'true'
        },
        {
          cmd: 'git update-index --chmod=+x <script>',
          desc: 'Marca un script como ejecutable dentro del repositorio, ya que Windows no tiene bit de ejecución nativo; evita que falle al clonarse en Linux/CI.'
        }
      ]
    },
    {
      id: 'glosario-de-terminos',
      titulo: 'Glosario de términos',
      tipo: 'glosario',
      items: [
        { term: 'Repositorio', def: 'Carpeta cuyo historial de cambios administra Git, identificada por la subcarpeta .git.' },
        { term: 'Directorio de trabajo', def: 'Los archivos tal como los ves y editas en el sistema de archivos.' },
        { term: 'Área de preparación (staging / index)', def: 'Zona intermedia donde se marcan los cambios que irán en el próximo commit.' },
        { term: 'Commit', def: 'Una fotografía guardada del repositorio en un momento dado, con autor, fecha, mensaje y referencia al commit anterior.' },
        { term: 'HEAD', def: 'Puntero al commit sobre el que estás parado actualmente; normalmente apunta a la punta de la rama activa.' },
        { term: 'Rama (branch)', def: 'Puntero móvil a un commit que avanza automáticamente con cada nuevo commit hecho sobre ella.' },
        { term: 'Remoto (remote)', def: 'Una copia del repositorio alojada en otro lugar (servidor, otra máquina) con la que se sincronizan cambios.' },
        { term: 'origin', def: 'Nombre convencional que Git asigna al remoto del que clonaste el repositorio.' },
        { term: 'upstream', def: 'La rama remota que sigue una rama local; determina qué trae git pull y a dónde sube git push sin argumentos.' },
        { term: 'Fast-forward', def: 'Tipo de merge donde no hace falta crear un commit nuevo porque la rama destino es un antepasado directo de la rama que se integra.' },
        { term: 'Conflicto de merge', def: 'Situación donde Git no puede combinar automáticamente dos cambios sobre las mismas líneas y pide resolución manual.' },
        { term: 'Rebase', def: 'Reescribir los commits de una rama para que parezcan creados a partir de otro punto del historial.' },
        { term: 'Detached HEAD', def: 'Estado en el que HEAD apunta directamente a un commit en vez de a una rama; los commits nuevos ahí pueden perderse si cambias de rama sin crear una nueva.' },
        { term: 'Fork', def: 'Copia completa de un repositorio en otra cuenta u organización, usada como base para proponer cambios sin acceso directo al original.' },
        { term: 'Clonar (clone)', def: 'Descargar un repositorio remoto completo, con todo su historial, a una carpeta local nueva.' },
        { term: 'Tag', def: 'Referencia fija a un commit específico, usada normalmente para marcar versiones o releases.' },
        { term: 'Stash', def: 'Cambios sin confirmar guardados temporalmente fuera del historial, para limpiar el directorio de trabajo sin perderlos.' },
        { term: '.gitignore', def: 'Archivo con patrones de rutas que Git debe ignorar al mostrar el estado o al agregar archivos.' },
        { term: 'Hash / SHA', def: 'Identificador único de 40 caracteres (o su forma corta) que Git calcula para cada commit según su contenido.' },
        { term: 'Working tree clean', def: 'Estado en el que no hay cambios sin confirmar ni archivos nuevos sin trackear.' }
      ]
    }
  ]
};
