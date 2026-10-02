// Guía de Gradle (gradle / gradlew).
// Campos opcionales por entrada: desc, ej (salida de ejemplo), alias, tip (consejo), warn (precaución).
// Campos opcionales por sección: intro (texto que explica la sección), lang (resalta como código sin marcarlo como comando de terminal), nota, tipo: 'pasos' | 'glosario'.
window.CHEATSHEETS = window.CHEATSHEETS || {};
window.CHEATSHEETS.gradle = {
  meta: { id: 'gradle', nombre: 'Gradle', subtitulo: 'Tareas, dependencias, wrapper, tests y multi-proyecto' },
  secciones: [
    {
      id: 'empezar-de-cero',
      titulo: 'Empezar de cero',
      tipo: 'pasos',
      intro: 'Sigue estos pasos en orden, en PowerShell, parado en la carpeta del proyecto. Cada paso indica qué deberías ver si salió bien.',
      items: [
        {
          cmd: 'java -version',
          desc: 'Confirma qué JDK está activo. Gradle corre sobre el JDK de JAVA_HOME (o el que esté en PATH), y la versión de Gradle debe soportar ese JDK.',
          ej: 'java version "21.0.5" 2024-10-15 LTS'
        },
        {
          cmd: 'gradle -v',
          alias: 'gradle --version',
          desc: 'Comprueba si hay una instalación global de Gradle y qué versión es, junto con el JDK y el sistema operativo detectados.',
          tip: 'Si el proyecto ya trae gradlew/gradlew.bat, no necesitas Gradle instalado globalmente: el wrapper lo descarga solo.'
        },
        {
          cmd: '.\\gradlew.bat -v',
          desc: 'En un proyecto que ya tiene wrapper, confirma la versión exacta de Gradle que va a usar ese repo (definida en gradle/wrapper/gradle-wrapper.properties).',
          warn: 'La primera vez descarga la distribución de Gradle desde services.gradle.org; requiere salida a internet una sola vez.'
        },
        {
          cmd: 'gradle wrapper --gradle-version 8.10.2',
          desc: 'Si el proyecto no trae wrapper todavía, lo genera: crea gradlew, gradlew.bat y gradle/wrapper/ fijando la versión exacta de Gradle para todo el equipo.',
          tip: 'Commitea gradlew, gradlew.bat y la carpeta gradle/wrapper/ (incluido gradle-wrapper.jar) para que cualquiera pueda compilar sin instalar nada.'
        },
        {
          cmd: '.\\gradlew.bat tasks',
          desc: 'Lista las tareas disponibles del proyecto, agrupadas por categoría (build, verification, help, etc.).',
          ej: 'Build tasks\n-----------\nassemble - Assembles the outputs of this project.\nbuild - Assembles and tests this project.'
        },
        {
          cmd: '.\\gradlew.bat clean build',
          desc: 'Primera corrida real: borra build/, compila, corre los tests y empaqueta el artefacto.',
          ej: 'BUILD SUCCESSFUL in 12s'
        }
      ]
    },
    {
      id: 'tareas-del-ciclo-de-build',
      titulo: 'Tareas del ciclo de build',
      intro: 'A diferencia de Maven, Gradle no tiene fases fijas sino un grafo de tareas con dependencias. Pedir una tarea ejecuta también todas de las que depende (ej. build corre assemble y check).',
      items: [
        { cmd: 'gradle compileJava', desc: 'Compila el código fuente principal (src/main/java) a build/classes.' },
        { cmd: 'gradle compileTestJava', desc: 'Compila también el código de test (src/test/java), sin ejecutarlo.' },
        { cmd: 'gradle classes', desc: 'Compila y procesa los recursos del código principal, sin empaquetar.' },
        { cmd: 'gradle test', desc: 'Compila y ejecuta los tests unitarios.' },
        { cmd: 'gradle check', desc: 'Corre todas las verificaciones de calidad: tests más cualquier plugin enganchado (checkstyle, pmd, jacoco verification, etc.).' },
        { cmd: 'gradle jar', desc: 'Empaqueta las clases compiladas en un .jar dentro de build/libs/.' },
        { cmd: 'gradle assemble', desc: 'Genera todos los artefactos (jar, war, etc.) sin correr los tests.' },
        { cmd: 'gradle build', desc: 'Build completo: assemble + check. Es la tarea más habitual.' },
        { cmd: 'gradle clean', desc: 'Borra la carpeta build/ con todo lo generado por builds anteriores.' },
        { cmd: 'gradle clean build', desc: 'Build limpio de principio a fin.', tip: 'Gradle es incremental: si nada cambió, marca las tareas como UP-TO-DATE y no las repite. Usa clean solo cuando quieras partir de cero.' },
        { cmd: 'gradle publishToMavenLocal', desc: 'Instala el artefacto en el repositorio Maven local (~/.m2/repository), equivalente a mvn install; requiere el plugin maven-publish.' },
        { cmd: 'gradle publish', desc: 'Sube el artefacto a los repositorios remotos declarados en publishing { }; se usa en CI, no en local.' },
        { cmd: 'gradle bootRun', desc: 'Si el proyecto usa Spring Boot, arranca la aplicación directamente desde Gradle.' },
        { cmd: 'gradle bootJar', desc: 'Si el proyecto usa Spring Boot, genera el jar ejecutable con todas las dependencias embebidas.' }
      ]
    },
    {
      id: 'opciones-utiles-de-la-cli',
      titulo: 'Opciones útiles de la CLI',
      intro: 'Estas banderas se combinan con cualquier tarea, por ejemplo gradle build -x test --parallel.',
      items: [
        { cmd: 'gradle <tarea> -x <otraTarea>', desc: 'Excluye una tarea (y las que solo dependan de ella) de la ejecución.', alias: 'gradle <tarea> --exclude-task <otraTarea>' },
        { cmd: 'gradle build -x test', desc: 'Atajo muy común: build completo sin ejecutar los tests.' },
        { cmd: 'gradle <tarea> --offline', desc: 'Modo offline: usa solo lo que ya está en la caché local, sin consultar repositorios remotos.' },
        { cmd: 'gradle <tarea> --refresh-dependencies', desc: 'Ignora la caché y vuelve a resolver todas las dependencias contra los repositorios remotos.', warn: 'Es el equivalente a -U de Maven; úsalo solo cuando sospeches de una caché corrupta o de un SNAPSHOT desactualizado.' },
        { cmd: 'gradle <tarea> --info', desc: 'Salida con más detalle (nivel INFO): útil para ver por qué una tarea se ejecutó o se saltó.' },
        { cmd: 'gradle <tarea> --debug', desc: 'Salida en modo debug, muy verbosa.', tip: 'Primer recurso para diagnosticar un build que falla sin explicación clara.' },
        { cmd: 'gradle <tarea> --stacktrace', desc: 'Muestra el stacktrace de la excepción que rompió el build.', alias: 'gradle <tarea> -s' },
        { cmd: 'gradle <tarea> --full-stacktrace', desc: 'Stacktrace completo, incluyendo los frames internos de Gradle.', alias: 'gradle <tarea> -S' },
        { cmd: 'gradle <tarea> --quiet', desc: 'Salida silenciosa: solo errores y lo que el propio build imprime.', alias: 'gradle <tarea> -q' },
        { cmd: 'gradle <tarea> --scan', desc: 'Publica un Build Scan con el detalle completo de la ejecución (tiempos, dependencias, tests).', warn: 'Sube información del build a scans.gradle.com; confirma que tu organización lo permite.' },
        { cmd: 'gradle <tarea> --parallel', desc: 'Ejecuta en paralelo las tareas de proyectos independientes en un multi-proyecto.' },
        { cmd: 'gradle <tarea> --continue', desc: 'No se detiene en el primer fallo: sigue con las tareas independientes y reporta todos los errores al final.' },
        { cmd: 'gradle <tarea> --dry-run', desc: 'Muestra qué tareas se ejecutarían, en orden, sin ejecutarlas.', alias: 'gradle <tarea> -m' },
        { cmd: 'gradle <tarea> --rerun-tasks', desc: 'Fuerza a re-ejecutar todas las tareas aunque estén UP-TO-DATE.' },
        { cmd: 'gradle <tarea> --build-cache', desc: 'Reutiliza resultados de tareas desde la caché de build, incluso entre builds distintos.' },
        { cmd: 'gradle -p <ruta> <tarea>', desc: 'Ejecuta el build de un proyecto que no está en la carpeta actual.', alias: 'gradle --project-dir <ruta> <tarea>' },
        { cmd: 'gradle <tarea> -Pclave=valor', desc: 'Pasa una propiedad de proyecto, accesible en build.gradle como project.property o directamente por nombre.' },
        { cmd: 'gradle <tarea> -Dclave=valor', desc: 'Pasa una propiedad de sistema JVM al proceso de Gradle.' },
        { cmd: 'gradle --stop', desc: 'Detiene todos los daemons de Gradle en ejecución.', tip: 'Gradle mantiene un daemon en segundo plano para acelerar builds; deténlo si quedó colgado o antes de cambiar JAVA_HOME.' },
        { cmd: 'gradle --status', desc: 'Lista los daemons de Gradle activos y su estado.' },
        { cmd: 'gradle <tarea> --no-daemon', desc: 'Ejecuta sin usar el daemon (más lento, pero aislado); habitual en CI.' }
      ]
    },
    {
      id: 'dependencias',
      titulo: 'Dependencias',
      items: [
        { cmd: 'gradle dependencies', desc: 'Muestra el árbol completo de dependencias de todas las configuraciones, directas y transitivas.' },
        { cmd: 'gradle dependencies --configuration runtimeClasspath', desc: 'Limita el árbol a una configuración concreta (runtimeClasspath, compileClasspath, testRuntimeClasspath).' },
        { cmd: 'gradle dependencyInsight --dependency <nombre> --configuration runtimeClasspath', desc: 'Explica por qué una dependencia está en el classpath y de dónde viene su versión; útil para rastrear conflictos.', ej: 'org.slf4j:slf4j-api:2.0.16\n   Selection reasons:\n      - By conflict resolution' },
        { cmd: 'gradle buildEnvironment', desc: 'Muestra las dependencias del propio build (plugins y buildscript), no las del código de la aplicación.' },
        { cmd: 'gradle <tarea> --refresh-dependencies', desc: 'Fuerza a revisar nuevas versiones de dependencias SNAPSHOT y dinámicas, ignorando la caché.' },
        { cmd: 'gradle dependencies --write-locks', desc: 'Genera o actualiza los archivos de bloqueo (gradle.lockfile) para fijar las versiones resueltas.', warn: 'Requiere activar dependencyLocking en build.gradle; revisa el diff del lockfile antes de commitear.' },
        { cmd: 'gradle dependencyUpdates', desc: 'Con el plugin com.github.ben-manes.versions, muestra qué dependencias tienen una versión más nueva disponible.' },
        { cmd: 'gradle properties', desc: 'Muestra todas las propiedades del proyecto (versión, grupo, directorios, etc.).' },
        { cmd: 'gradle help --task <tarea>', desc: 'Describe una tarea: su tipo, opciones disponibles y a qué grupo pertenece.' }
      ]
    },
    {
      id: 'testing-y-cobertura',
      titulo: 'Testing y cobertura',
      items: [
        { cmd: 'gradle test', desc: 'Ejecuta todos los tests unitarios del proyecto.' },
        { cmd: 'gradle test --tests <Clase>', desc: 'Ejecuta solo los tests de una clase concreta.', alias: 'gradle test --tests "*<Clase>"' },
        { cmd: 'gradle test --tests <Clase>.<metodo>', desc: 'Ejecuta un único método de test dentro de una clase.' },
        { cmd: 'gradle test --tests "<paquete>.*"', desc: 'Ejecuta todos los tests de un paquete.' },
        { cmd: 'gradle test --rerun', desc: 'Fuerza a re-ejecutar los tests aunque nada haya cambiado (Gradle 7.6+).', alias: 'gradle cleanTest test', tip: 'Por defecto Gradle salta los tests si ni el código ni los tests cambiaron; usa esto para obligarlo.' },
        { cmd: 'gradle test --fail-fast', desc: 'Detiene la ejecución de tests en el primer fallo.' },
        { cmd: 'gradle test -i', desc: 'Muestra la salida estándar de los tests (System.out, logs) en la consola.' },
        { cmd: 'gradle integrationTest', desc: 'Ejecuta los tests de integración si el proyecto definió una tarea separada con ese nombre.' },
        { cmd: 'gradle jacocoTestReport', desc: 'Genera el reporte de cobertura de Jacoco en build/reports/jacoco/test/html/index.html.' },
        { cmd: 'gradle jacocoTestCoverageVerification', desc: 'Falla el build si la cobertura no alcanza los umbrales configurados en build.gradle.' },
        { cmd: 'gradle test jacocoTestReport', desc: 'Corre los tests y genera el reporte de cobertura en una sola pasada.' },
        { cmd: 'build/reports/tests/test/index.html', desc: 'Reporte HTML de resultados de tests que Gradle genera siempre tras correr test; ábrelo en el navegador.', tip: 'Cuando un test falla, la consola imprime la ruta exacta a este reporte.' }
      ]
    },
    {
      id: 'calidad-de-codigo',
      titulo: 'Calidad de código',
      items: [
        { cmd: 'gradle check', desc: 'Corre todas las verificaciones: tests y cualquier plugin de calidad enganchado.' },
        { cmd: 'gradle checkstyleMain', desc: 'Corre Checkstyle sobre el código principal y falla el build si hay violaciones.' },
        { cmd: 'gradle checkstyleTest', desc: 'Igual que el anterior, pero sobre el código de test.' },
        { cmd: 'gradle pmdMain', desc: 'Corre el análisis estático de PMD sobre el código principal.' },
        { cmd: 'gradle spotbugsMain', desc: 'Si el proyecto usa SpotBugs, corre el análisis de bugs potenciales por bytecode.' },
        { cmd: 'gradle spotlessCheck', desc: 'Si el proyecto usa Spotless, verifica que el formato del código cumpla las reglas.' },
        { cmd: 'gradle spotlessApply', desc: 'Corrige automáticamente el formato del código según las reglas de Spotless.' },
        { cmd: 'gradle sonar', desc: 'Con el plugin de SonarQube, envía el análisis a un servidor Sonar.', warn: 'Requiere el token y la URL del servidor configurados; normalmente se corre solo en CI.' }
      ]
    },
    {
      id: 'mas-tareas-y-diagnostico',
      titulo: 'Más tareas y diagnóstico',
      items: [
        { cmd: 'gradle tasks --all', desc: 'Lista todas las tareas, incluidas las internas que tasks oculta por defecto.' },
        { cmd: 'gradle run', desc: 'Con el plugin application, ejecuta la clase main declarada en mainClass.' },
        { cmd: 'gradle installDist', desc: 'Con el plugin application, genera la distribución ejecutable (scripts + libs) en build/install/.' },
        { cmd: 'gradle shadowJar', desc: 'Con el plugin Shadow, genera un fat jar con todas las dependencias embebidas.' },
        { cmd: 'gradle war', desc: 'Con el plugin war, empaqueta una aplicación web en un .war.' },
        { cmd: 'gradle javadoc', desc: 'Genera la documentación Javadoc en build/docs/javadoc/.' },
        { cmd: 'gradle sourcesJar', desc: 'Genera el jar con el código fuente, si el proyecto lo configuró (withSourcesJar()).' },
        { cmd: 'gradle <tarea> --console=plain', desc: 'Salida de texto plano sin barras de progreso; útil en CI o al redirigir a un archivo.' },
        { cmd: 'gradle <tarea> --warning-mode all', desc: 'Muestra todas las advertencias de deprecación, útil antes de actualizar de versión de Gradle.' },
        { cmd: 'gradle <tarea> --configuration-cache', desc: 'Reutiliza la fase de configuración entre ejecuciones para acelerar builds repetidos.' },
        { cmd: 'gradle <tarea> --profile', desc: 'Genera un reporte de tiempos por tarea en build/reports/profile/.' },
        { cmd: 'gradle <tarea> --no-build-cache', desc: 'Desactiva la caché de build para esta ejecución.' },
        { cmd: 'gradle <tarea> -Dorg.gradle.java.home="<ruta-al-jdk>"', desc: 'Ejecuta Gradle con un JDK concreto sin tocar JAVA_HOME.' },
        { cmd: 'gradle wrapper --gradle-version 8.10.2 --distribution-type bin', desc: 'Genera el wrapper con distribución bin (más liviana) en vez de all (incluye fuentes y docs para el IDE).' }
      ]
    },
    {
      id: 'multi-proyecto',
      titulo: 'Multi-proyecto',
      intro: 'Aplica cuando settings.gradle declara varios subproyectos con include. Las rutas de proyecto usan dos puntos, como :servicio-a.',
      items: [
        { cmd: 'gradle projects', desc: 'Lista el proyecto raíz y todos sus subproyectos.' },
        { cmd: 'gradle :<proyecto>:build', desc: 'Ejecuta una tarea solo en el subproyecto indicado (y las de sus dependencias de proyecto).' },
        { cmd: 'gradle :<proyecto>:test', desc: 'Corre solo los tests de un subproyecto.' },
        { cmd: 'gradle build', desc: 'Parado en la raíz, ejecuta build en todos los subproyectos.' },
        { cmd: 'gradle :<proyecto>:dependencies', desc: 'Muestra el árbol de dependencias de un subproyecto concreto.' },
        { cmd: 'gradle <tarea> -x :<proyecto>:<tarea>', desc: 'Excluye la tarea de un subproyecto específico del build.' },
        { cmd: 'gradle :<proyecto>:build --build-cache --parallel', desc: 'Reconstruye un subproyecto reutilizando caché y paralelismo; combina bien en repos grandes.' },
        { cmd: 'gradle <tarea> --include-build <ruta>', desc: 'Sustituye temporalmente una dependencia por el build local de otro proyecto (composite build).', tip: 'Útil para probar un cambio en una librería propia sin tener que publicarla en el repositorio local.' }
      ]
    },
    {
      id: 'el-wrapper-gradlew',
      titulo: 'El wrapper (gradlew)',
      intro: 'El wrapper fija la versión exacta de Gradle para todo el equipo y CI, sin depender de lo que cada quien tenga instalado globalmente.',
      items: [
        { cmd: 'gradle wrapper', desc: 'Genera el wrapper usando la versión de Gradle con la que se ejecuta el comando.' },
        { cmd: 'gradle wrapper --gradle-version 8.10.2', desc: 'Genera o actualiza el wrapper fijando una versión exacta de Gradle.' },
        { cmd: '.\\gradlew.bat wrapper --gradle-version 8.10.2', desc: 'Actualiza la versión de Gradle de un proyecto que ya tiene wrapper, usando el wrapper actual.', tip: 'Corre el comando dos veces: la primera actualiza el properties, la segunda descarga la nueva versión y regenera los scripts.' },
        { cmd: '.\\gradlew.bat <tarea>', desc: 'Ejecuta el wrapper en Windows / PowerShell.', warn: 'Necesita el prefijo .\\ en PowerShell; escribir solo gradlew.bat falla si la carpeta actual no está en PATH.' },
        { cmd: './gradlew <tarea>', desc: 'Ejecuta el wrapper en Linux, macOS o WSL (mismo repo, script equivalente a gradlew.bat).' },
        { cmd: 'git update-index --chmod=+x gradlew', desc: 'En Windows, marca el script gradlew (sin extensión) como ejecutable dentro del repo git, para que no falle al clonarlo en Linux/CI.', tip: 'Windows no tiene bit de ejecución nativo; sin este paso, un checkout en Linux puede dejar gradlew sin permiso de ejecución.' },
        { cmd: 'gradle/wrapper/gradle-wrapper.properties', desc: 'Archivo donde vive la versión fijada (distributionUrl) y su checksum opcional. Se versiona en git junto con gradle-wrapper.jar.' }
      ]
    },
    {
      id: 'archivos-principales-de-gradle',
      titulo: 'Archivos principales de Gradle',
      items: [
        { cmd: "rootProject.name = 'mi-servicio'", desc: 'En settings.gradle, define el nombre del proyecto raíz.' },
        { cmd: "include 'servicio-a', 'servicio-b'", desc: 'En settings.gradle, declara los subproyectos que forman un multi-proyecto.' },
        { cmd: "plugins { id 'java' }", desc: 'Aplica el plugin java: agrega las tareas compileJava, test, jar, build, etc.' },
        { cmd: "plugins { id 'org.springframework.boot' version '3.3.4' }", desc: 'Aplica un plugin externo con una versión concreta, resuelto desde el Plugin Portal.' },
        { cmd: "group = 'com.miempresa'", desc: 'Identifica la organización dueña del artefacto; junto con el nombre del proyecto y version forma sus coordenadas.' },
        { cmd: "version = '1.0.0'", desc: 'Versión del artefacto. Un sufijo -SNAPSHOT indica una versión en desarrollo.' },
        { cmd: "java { toolchain { languageVersion = JavaLanguageVersion.of(21) } }", desc: 'Fija la versión de Java con la que se compila, independientemente del JDK que tenga cada desarrollador.', tip: 'Con toolchains Gradle descarga o ubica el JDK correcto automáticamente.' },
        { cmd: "repositories { mavenCentral() }", desc: 'Declara de dónde se descargan las dependencias; mavenCentral() es el repositorio público estándar.' },
        { cmd: "dependencies { implementation 'org.slf4j:slf4j-api:2.0.16' }", desc: 'Dependencia necesaria para compilar y ejecutar, pero no expuesta a quienes consuman este módulo.' },
        { cmd: "dependencies { api 'com.google.guava:guava:33.3.1-jre' }", desc: 'Dependencia que además se expone a los consumidores del módulo; requiere el plugin java-library.' },
        { cmd: "dependencies { compileOnly 'org.projectlombok:lombok:1.18.34' }", desc: 'Solo disponible al compilar, no se empaqueta ni está en runtime (típico de Lombok o APIs provistas).' },
        { cmd: "dependencies { runtimeOnly 'org.postgresql:postgresql:42.7.4' }", desc: 'Solo disponible al ejecutar, no al compilar (típico de drivers JDBC).' },
        { cmd: "dependencies { testImplementation 'org.junit.jupiter:junit-jupiter:5.11.2' }", desc: 'Limita una dependencia al código de test; no se empaqueta en el artefacto final.' },
        { cmd: "dependencies { implementation platform('org.springframework.boot:spring-boot-dependencies:3.3.4') }", desc: 'Importa un BOM para fijar versiones consistentes sin repetirlas en cada dependencia.' },
        { cmd: "tasks.named('test') { useJUnitPlatform() }", desc: 'Configura la tarea test para usar JUnit 5; sin esto, los tests JUnit Jupiter no se detectan.' },
        { cmd: "tasks.register('saludar') { doLast { println 'Hola' } }", desc: 'Define una tarea propia que se ejecuta con gradle saludar.' },
        { cmd: 'org.gradle.parallel=true', desc: 'En gradle.properties, activa por defecto la ejecución en paralelo de proyectos independientes.' },
        { cmd: 'org.gradle.caching=true', desc: 'En gradle.properties, activa por defecto la caché de build.' },
        { cmd: 'org.gradle.jvmargs=-Xmx2g', desc: 'En gradle.properties, ajusta la memoria de la JVM del daemon de Gradle.' }
      ],
      lang: 'groovy',
      nota: 'Estos fragmentos se escriben dentro de build.gradle, settings.gradle o gradle.properties (sintaxis Groovy; en build.gradle.kts cambia ligeramente). No se ejecutan directamente en la terminal.'
    },
    {
      id: 'comandos-practicos-combinados',
      titulo: 'Comandos prácticos combinados',
      items: [
        { cmd: '.\\gradlew.bat clean build', desc: 'Build completo con el gate de calidad, tal como correría en CI antes de aceptar un cambio.' },
        { cmd: '.\\gradlew.bat build -x test', desc: 'Genera rápido el artefacto sin esperar a que corran los tests.' },
        { cmd: '.\\gradlew.bat test --tests <Clase>', desc: 'Corre un solo test class puntual mientras se depura.' },
        { cmd: '.\\gradlew.bat test jacocoTestReport', desc: 'Corre los tests y deja el reporte de cobertura listo para abrir.' },
        { cmd: '.\\gradlew.bat dependencyInsight --dependency slf4j-api --configuration runtimeClasspath', desc: 'Rastrea de dónde viene una versión concreta de slf4j cuando hay un conflicto de versiones.' },
        { cmd: '.\\gradlew.bat dependencies --configuration runtimeClasspath', desc: 'Revisión rápida de lo que realmente se empaqueta, útil antes de un escaneo de seguridad de dependencias (SCA).' },
        { cmd: '.\\gradlew.bat build --refresh-dependencies', desc: 'Build forzando a revalidar todas las dependencias contra el remoto.' },
        { cmd: '.\\gradlew.bat :<proyecto>:build --parallel --build-cache', desc: 'En un multi-proyecto, reconstruye rápido solo el módulo que estás tocando.' },
        { cmd: '.\\gradlew.bat bootRun', desc: 'Levanta una aplicación Spring Boot en local sin generar el jar.' },
        { cmd: 'gradle init', desc: 'Bootstrap interactivo de un proyecto Gradle nuevo: pregunta tipo de proyecto, lenguaje y DSL (Groovy o Kotlin).' }
      ],
      nota: 'Ejemplos listos para adaptar. Reemplaza nombres de clases, proyectos y rutas antes de ejecutarlos.'
    },
    {
      id: 'problemas-comunes-en-windows',
      titulo: 'Problemas comunes en Windows',
      intro: 'Los errores que más aparecen al trabajar con Gradle en Windows, y qué ejecutar para resolverlos.',
      items: [
        {
          cmd: '$env:JAVA_HOME',
          desc: 'Comprueba qué JDK está usando Gradle. Si sale vacío o apunta a una versión distinta a la esperada, ahí suele estar el problema.',
          tip: 'Gradle usa JAVA_HOME si existe; si no, el java.exe que esté primero en PATH.'
        },
        {
          cmd: 'where.exe gradle',
          desc: 'Muestra desde qué rutas se encuentra gradle. Si aparece más de una instalación, la primera de la lista es la que realmente se ejecuta.'
        },
        {
          cmd: '.\\gradlew.bat',
          desc: 'Corrige el error "gradlew.bat no se reconoce como comando" en PowerShell: hay que anteponer .\\, la carpeta actual no está en PATH.'
        },
        {
          cmd: 'gradle --stop',
          desc: 'Detiene los daemons activos. Hazlo tras cambiar JAVA_HOME o si el build se queda colgado, porque el daemon conserva el JDK con el que arrancó.'
        },
        {
          cmd: 'Remove-Item -Recurse -Force "$env:USERPROFILE\\.gradle\\caches"',
          desc: 'Borra la caché global de Gradle cuando una dependencia quedó corrupta o a medio descargar, para forzar que se vuelva a bajar todo.',
          warn: 'Es una medida drástica: la siguiente corrida descargará todo de nuevo. Prueba primero --refresh-dependencies.'
        },
        {
          cmd: 'gradle build --refresh-dependencies',
          desc: 'Cuando el error es sobre una dependencia que "no coincide" con lo esperado, fuerza a Gradle a revalidar contra el remoto en vez de confiar en la caché local.'
        },
        {
          cmd: 'Remove-Item -Recurse -Force .gradle, build',
          desc: 'Limpia la caché local del proyecto y los resultados de build cuando Gradle se comporta de forma inconsistente tras cambios grandes.'
        },
        {
          desc: '"Unsupported class file major version" o "Could not determine java version" al correr Gradle.',
          cmd: 'gradle -v',
          tip: 'Suele significar que la versión de Gradle no soporta el JDK activo (o al revés). Actualiza el wrapper a una versión más nueva o apunta JAVA_HOME a un JDK compatible.'
        },
        {
          desc: '"Could not resolve ..." detrás de un proxy corporativo.',
          cmd: 'org.gradle.jvmargs=-Dhttps.proxyHost=<host> -Dhttps.proxyPort=<puerto>',
          tip: 'Agrega estas propiedades en ~/.gradle/gradle.properties (global del usuario) para no modificar el repo.'
        }
      ]
    },
    {
      id: 'glosario-de-terminos',
      titulo: 'Glosario de términos',
      tipo: 'glosario',
      items: [
        { term: 'Gradle', def: 'Herramienta de build y gestión de dependencias para JVM y otros lenguajes, basada en scripts (Groovy o Kotlin) y un grafo de tareas.' },
        { term: 'build.gradle', def: 'Script principal de un proyecto: declara plugins, dependencias, repositorios y configuración de tareas. Su variante en Kotlin es build.gradle.kts.' },
        { term: 'settings.gradle', def: 'Archivo que define el nombre del proyecto raíz y qué subproyectos forman el build.' },
        { term: 'Tarea (task)', def: 'Unidad de trabajo de Gradle, como compileJava o test. Las tareas pueden depender unas de otras formando un grafo dirigido.' },
        { term: 'Plugin', def: 'Componente que agrega tareas, convenciones y configuración a un proyecto, como java, application o org.springframework.boot.' },
        { term: 'Configuración (configuration)', def: 'Agrupación nombrada de dependencias, como implementation, runtimeOnly o testImplementation, que define cuándo se usan.' },
        { term: 'implementation', def: 'Configuración para dependencias necesarias al compilar y ejecutar este módulo, que no se exponen a los módulos que lo consumen.' },
        { term: 'api', def: 'Configuración para dependencias que sí se exponen a los consumidores del módulo; disponible con el plugin java-library.' },
        { term: 'Wrapper (gradlew / gradlew.bat)', def: 'Script que descarga (la primera vez) y ejecuta la versión exacta de Gradle fijada en gradle/wrapper/gradle-wrapper.properties, para que todos —y CI— usen la misma versión sin instalación global.' },
        { term: 'Daemon', def: 'Proceso de Gradle que queda en segundo plano entre ejecuciones para acelerar los builds siguientes evitando arrancar la JVM cada vez.' },
        { term: 'Build incremental', def: 'Capacidad de Gradle de saltar tareas cuyas entradas y salidas no cambiaron, marcándolas como UP-TO-DATE.' },
        { term: 'Build cache', def: 'Caché de resultados de tareas, reutilizable entre builds y máquinas, que evita recalcular lo que ya se produjo con las mismas entradas.' },
        { term: 'Multi-proyecto', def: 'Build con un proyecto raíz y varios subproyectos declarados con include en settings.gradle.' },
        { term: 'Composite build', def: 'Mecanismo para combinar builds independientes (includeBuild) y que uno consuma el código local del otro en lugar de un artefacto publicado.' },
        { term: 'Toolchain', def: 'Característica que permite declarar la versión de Java requerida y deja que Gradle ubique o descargue el JDK adecuado.' },
        { term: 'Version catalog', def: 'Archivo gradle/libs.versions.toml que centraliza versiones y coordenadas de dependencias y plugins para reutilizarlas en todos los módulos.' },
        { term: 'BOM / platform', def: 'Bill of Materials: conjunto de versiones consistentes importado con platform(...) para no repetir versiones por dependencia.' },
        { term: 'Repositorio', def: 'Servidor del que Gradle descarga dependencias, como Maven Central, Google o un Nexus/Artifactory privado.' },
        { term: 'Caché de Gradle', def: 'Carpeta del usuario (por defecto ~/.gradle/caches) donde Gradle guarda dependencias descargadas, distribuciones y resultados.' },
        { term: 'gradle.properties', def: 'Archivo de propiedades del proyecto o del usuario (~/.gradle) para configurar el daemon, la memoria, el proxy y flags como org.gradle.parallel.' },
        { term: 'Build Scan', def: 'Reporte web detallado de una ejecución de build, generado con --scan, con tiempos, dependencias y resultados de tests.' }
      ]
    }
  ]
};
