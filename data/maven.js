// Guía de Maven (mvn / mvnw).
// Campos opcionales por entrada: desc, ej (salida de ejemplo), alias, tip (consejo), warn (precaución).
// Campos opcionales por sección: intro (texto que explica la sección), lang (resalta como código sin marcarlo como comando de terminal), nota, tipo: 'pasos' | 'glosario'.
window.CHEATSHEETS = window.CHEATSHEETS || {};
window.CHEATSHEETS.maven = {
  meta: { id: 'maven', nombre: 'Maven', subtitulo: 'Ciclo de vida, dependencias, perfiles y plugins' },
  secciones: [
    {
      id: 'empezar-de-cero',
      titulo: 'Empezar de cero',
      tipo: 'pasos',
      intro: 'Sigue estos pasos en orden, en PowerShell, parado en la carpeta del proyecto. Cada paso indica qué deberías ver si salió bien.',
      items: [
        {
          cmd: 'java -version',
          desc: 'Confirma qué JDK está activo. Maven usa el JDK de JAVA_HOME, no el que declares en el pom.xml.',
          ej: 'java version "25" 2025-09-16'
        },
        {
          cmd: 'mvn -v',
          alias: 'mvn --version',
          desc: 'Comprueba si hay una instalación global de Maven y qué versión es.',
          tip: 'Si el proyecto ya trae mvnw/mvnw.cmd, no necesitas Maven instalado globalmente: el wrapper lo descarga solo.'
        },
        {
          cmd: '.\\mvnw.cmd -v',
          desc: 'En un proyecto que ya tiene wrapper, confirma la versión exacta de Maven que va a usar ese repo (definida en .mvn/wrapper/maven-wrapper.properties).',
          warn: 'La primera vez descarga el .zip de Maven desde repo.maven.apache.org; requiere salida a internet una sola vez.'
        },
        {
          cmd: 'mvn wrapper:wrapper -Dmaven=3.9.16',
          desc: 'Si el proyecto no trae wrapper todavía, lo genera: crea mvnw, mvnw.cmd y .mvn/wrapper/ fijando la versión exacta de Maven para todo el equipo.',
          tip: 'El wrapper oficial de Apache (distributionType=only-script) no versiona ningún .jar binario, solo scripts — evita el problema de commitear binarios que tenía el wrapper viejo de Takari.'
        },
        {
          cmd: '.\\mvnw.cmd clean validate',
          desc: 'Primera corrida real: limpia target/ y valida que el pom.xml esté bien formado y el proyecto sea correcto.',
          ej: '[INFO] BUILD SUCCESS'
        },
        {
          cmd: '.\\mvnw.cmd clean install',
          desc: 'Build completo: compila, corre tests, empaqueta y deja el artefacto en el repositorio local (~/.m2/repository) para que otros proyectos locales lo puedan usar como dependencia.'
        }
      ]
    },
    {
      id: 'ciclo-de-vida-y-fases',
      titulo: 'Ciclo de vida y fases',
      intro: 'Cada fase ejecuta automáticamente todas las anteriores del mismo ciclo de vida. Por ejemplo, mvn package ya corre validate, compile y test antes.',
      items: [
        { cmd: 'mvn validate', desc: 'Verifica que el proyecto esté correcto y que toda la información necesaria esté disponible.' },
        { cmd: 'mvn compile', desc: 'Compila el código fuente principal (src/main/java) a target/classes.' },
        { cmd: 'mvn test-compile', desc: 'Compila también el código de test (src/test/java), sin ejecutarlo.' },
        { cmd: 'mvn test', desc: 'Compila y ejecuta los tests unitarios con Surefire.' },
        { cmd: 'mvn package', desc: 'Empaqueta el proyecto compilado en su formato final (jar, war), en target/.' },
        { cmd: 'mvn verify', desc: 'Corre las validaciones de calidad configuradas (tests de integración con Failsafe, checkstyle, pmd, jacoco:check, etc.) sobre el paquete generado.' },
        { cmd: 'mvn install', desc: 'Instala el artefacto empaquetado en el repositorio local (~/.m2/repository), disponible para otros proyectos en esta máquina.' },
        { cmd: 'mvn deploy', desc: 'Sube el artefacto a un repositorio remoto (Nexus, Artifactory); es la fase final, se usa en CI, no en local.' },
        { cmd: 'mvn clean', desc: 'Borra la carpeta target/ con todo lo generado por builds anteriores.' },
        { cmd: 'mvn clean install', desc: 'Combinación más habitual: build limpio de principio a fin.', tip: 'clean pertenece a otro ciclo de vida (clean) que install; por eso siempre se escriben juntos si quieres partir de cero.' },
        { cmd: 'mvn clean verify', desc: 'Build limpio hasta el gate de calidad, sin instalar en el repositorio local; es lo que suele correr en CI antes de un merge.' }
      ]
    },
    {
      id: 'opciones-utiles-de-la-cli',
      titulo: 'Opciones útiles de la CLI',
      intro: 'Estas banderas se combinan con cualquier fase, por ejemplo mvn clean install -DskipTests -T 1C.',
      items: [
        { cmd: 'mvn <fase> -DskipTests', desc: 'Compila los tests pero no los ejecuta.' },
        { cmd: 'mvn <fase> -Dmaven.test.skip=true', desc: 'Ni compila ni ejecuta los tests.', warn: 'Más agresivo que -DskipTests; úsalo solo cuando ni siquiera quieres validar que los tests compilen.' },
        { cmd: 'mvn <fase> -o', desc: 'Modo offline: usa solo lo que ya está en el repositorio local, sin consultar remotos.' },
        { cmd: 'mvn <fase> -U', desc: 'Fuerza a revisar si hay versiones más nuevas de dependencias y plugins SNAPSHOT/RELEASE, ignorando la caché local.' },
        { cmd: 'mvn <fase> -X', desc: 'Salida en modo debug: muestra cada resolución de dependencia y ejecución de plugin.', tip: 'El primer paso para diagnosticar un build que falla sin explicación clara.' },
        { cmd: 'mvn <fase> -e', desc: 'Muestra el stacktrace completo del error, no solo el resumen.' },
        { cmd: 'mvn <fase> -q', desc: 'Salida silenciosa: solo errores y lo que el propio build imprime.' },
        { cmd: 'mvn <fase> -T 1C', desc: 'Build en paralelo, usando un hilo por núcleo de CPU disponible.', alias: 'mvn <fase> -T 4' },
        { cmd: 'mvn <fase> --fail-at-end', desc: 'En un multi-módulo, sigue construyendo los módulos independientes aunque uno falle, y reporta todos los errores al final.' },
        { cmd: 'mvn <fase> --fail-never', desc: 'Nunca detiene el build por un error; útil solo para diagnóstico, no para CI.' },
        { cmd: 'mvn -f ruta/otro-pom.xml <fase>', desc: 'Ejecuta contra un pom.xml que no está en la carpeta actual.' },
        { cmd: 'mvn <fase> -Dproperty=valor', desc: 'Pasa o sobrescribe una propiedad del pom.xml para esta ejecución.' }
      ]
    },
    {
      id: 'dependencias',
      titulo: 'Dependencias',
      items: [
        { cmd: 'mvn dependency:tree', desc: 'Muestra el árbol completo de dependencias, directas y transitivas, con la versión que realmente gana cada una.' },
        { cmd: 'mvn dependency:tree -Dincludes=<groupId>:<artifactId>', desc: 'Filtra el árbol para ver solo quién trae una dependencia concreta, útil para rastrear de dónde viene una versión inesperada.' },
        { cmd: 'mvn dependency:analyze', desc: 'Detecta dependencias declaradas pero no usadas, y dependencias usadas pero no declaradas explícitamente.' },
        { cmd: 'mvn dependency:resolve', desc: 'Descarga y lista las dependencias del proyecto sin compilar nada.' },
        { cmd: 'mvn dependency:purge-local-repository', desc: 'Borra del repositorio local las dependencias de este proyecto y las vuelve a descargar.', warn: 'Puede tardar bastante si el proyecto tiene muchas dependencias.' },
        { cmd: 'mvn dependency:sources', desc: 'Descarga los .jar de código fuente de las dependencias, para poder navegarlas en el IDE.' },
        { cmd: 'mvn versions:display-dependency-updates', desc: 'Muestra qué dependencias tienen una versión más nueva disponible.', ej: '[INFO]   com.fasterxml.jackson.core:jackson-databind ... 2.17.0 -> 2.18.2' },
        { cmd: 'mvn versions:display-plugin-updates', desc: 'Igual que el anterior, pero para los plugins declarados en el build.' },
        { cmd: 'mvn versions:use-latest-releases', desc: 'Actualiza automáticamente las versiones en el pom.xml a las últimas releases disponibles.', warn: 'Revisa el diff antes de commitear: puede subir versiones mayores con cambios incompatibles.' },
        { cmd: 'mvn help:effective-pom', desc: 'Muestra el pom.xml final tal como Maven lo interpreta, con toda la herencia de parents y perfiles ya resuelta.' },
        { cmd: 'mvn help:effective-settings', desc: 'Muestra la configuración final de settings.xml (repositorios, mirrors, servidores) que se está usando.' },
        { cmd: 'mvn help:describe -Dplugin=<groupId>:<artifactId>', desc: 'Describe un plugin: sus goals disponibles y parámetros configurables.' }
      ]
    },
    {
      id: 'testing-y-cobertura',
      titulo: 'Testing y cobertura',
      items: [
        { cmd: 'mvn test', desc: 'Ejecuta todos los tests unitarios del proyecto con Surefire.' },
        { cmd: 'mvn test -Dtest=<Clase>', desc: 'Ejecuta solo los tests de una clase concreta.' },
        { cmd: 'mvn test -Dtest=<Clase>#<metodo>', desc: 'Ejecuta un único método de test dentro de una clase.' },
        { cmd: 'mvn test -Dtest=<Patron>*', desc: 'Ejecuta todas las clases de test cuyo nombre haga match con el patrón.' },
        { cmd: 'mvn verify -Dit.test=<Clase>', desc: 'Ejecuta un test de integración concreto con Failsafe (los tests *IT, separados de los tests unitarios normales).' },
        { cmd: 'mvn jacoco:report', desc: 'Genera el reporte HTML de cobertura en target/site/jacoco/index.html a partir del .exec ya grabado.' },
        { cmd: 'mvn jacoco:check', desc: 'Falla el build si la cobertura no alcanza los umbrales configurados en el pom.xml.' },
        {
          cmd: 'mvn jacoco:merge',
          desc: 'Combina varios archivos .exec en uno solo antes del report/check.',
          warn: 'En Quarkus es obligatorio si usas @QuarkusTest: el classloader aumentado de Quarkus escribe target/jacoco-quarkus.exec por separado del target/jacoco.exec del agente estándar. Sin este merge, la cobertura de infraestructura/REST reporta 0% aunque los tests sí corrieron.'
        },
        { cmd: 'mvn surefire-report:report', desc: 'Genera un reporte HTML legible de los resultados de los tests ya ejecutados.' }
      ]
    },
    {
      id: 'calidad-de-codigo',
      titulo: 'Calidad de código',
      items: [
        { cmd: 'mvn checkstyle:check', desc: 'Corre las reglas de estilo configuradas y falla el build si hay violaciones.' },
        { cmd: 'mvn checkstyle:checkstyle', desc: 'Genera el reporte HTML de Checkstyle en target/site/checkstyle.html sin fallar el build.' },
        { cmd: 'mvn pmd:check', desc: 'Corre el análisis estático de PMD (complejidad, God class, etc.) y falla el build si hay violaciones.' },
        { cmd: 'mvn pmd:pmd', desc: 'Genera el reporte HTML de PMD sin fallar el build.' },
        { cmd: 'mvn pmd:cpd-check', desc: 'Detecta bloques de código duplicado (copy-paste) y falla el build si supera el umbral.' },
        { cmd: 'mvn spotbugs:check', desc: 'Si el proyecto usa SpotBugs, corre el análisis de bugs potenciales por bytecode.' },
        { cmd: 'mvn site', desc: 'Genera el sitio agregado con todos los reportes configurados (tests, cobertura, checkstyle, pmd) en target/site/.' }
      ]
    },
    {
      id: 'perfiles-y-propiedades',
      titulo: 'Perfiles y propiedades',
      items: [
        { cmd: 'mvn <fase> -P<perfil>', desc: 'Activa un perfil declarado en <profiles> del pom.xml para esta ejecución.', alias: 'mvn <fase> -P <perfil>' },
        { cmd: 'mvn <fase> -P<perfil1>,<perfil2>', desc: 'Activa varios perfiles a la vez.' },
        { cmd: 'mvn <fase> -P!<perfil>', desc: 'Desactiva explícitamente un perfil que esté activo por defecto.' },
        { cmd: 'mvn help:active-profiles', desc: 'Muestra qué perfiles están activos para esta ejecución y de dónde vienen (pom, settings, activación automática).' },
        { cmd: 'mvn <fase> -DargLine="-Xmx1024m"', desc: 'Pasa argumentos JVM extra al proceso que ejecuta los tests (usado por Surefire/Failsafe).' }
      ]
    },
    {
      id: 'multi-modulo-reactor',
      titulo: 'Multi-módulo (reactor)',
      intro: 'Aplica cuando el pom.xml raíz declara <modules>. Maven calcula el orden de build según las dependencias entre módulos.',
      items: [
        { cmd: 'mvn -pl <modulo> install', desc: 'Construye solo el módulo indicado.', alias: 'mvn --projects <modulo> install' },
        { cmd: 'mvn -pl <modulo> -am install', desc: 'Construye el módulo indicado y, antes, todos los módulos de los que depende (also-make).' },
        { cmd: 'mvn -pl <modulo> -amd install', desc: 'Construye el módulo indicado y, después, todos los módulos que dependen de él (also-make-dependents).' },
        { cmd: 'mvn -pl <modA>,<modB> install', desc: 'Construye varios módulos específicos en una sola corrida.' },
        { cmd: 'mvn -N install', desc: 'Construye únicamente el pom.xml raíz, sin recorrer sus módulos.', alias: 'mvn --non-recursive install' },
        { cmd: 'mvn -rf <modulo> install', desc: 'Reanuda el build del reactor a partir del módulo indicado, saltando los anteriores.', tip: 'Útil tras corregir un fallo en un módulo intermedio, para no reconstruir todo desde cero.' }
      ]
    },
    {
      id: 'el-wrapper-mvnw',
      titulo: 'El wrapper (mvnw)',
      intro: 'El wrapper fija la versión exacta de Maven para todo el equipo y CI, sin depender de lo que cada quien tenga instalado globalmente.',
      items: [
        { cmd: 'mvn wrapper:wrapper', desc: 'Genera el wrapper usando la versión de Maven más reciente en el momento de correrlo.' },
        { cmd: 'mvn wrapper:wrapper -Dmaven=3.9.16', desc: 'Genera el wrapper fijando una versión exacta de Maven.', tip: 'El wrapper oficial de Apache (Maven ≥ 3.3) usa distributionType=only-script: no versiona ningún .jar, solo descarga el .zip de Maven la primera vez que se ejecuta.' },
        { cmd: '.\\mvnw.cmd <fase>', desc: 'Ejecuta el wrapper en Windows / PowerShell.', warn: 'Necesita el prefijo .\\ en PowerShell; escribir solo mvnw.cmd falla si la carpeta actual no está en PATH.' },
        { cmd: './mvnw <fase>', desc: 'Ejecuta el wrapper en Linux, macOS o WSL (mismo repo, script equivalente a mvnw.cmd).' },
        { cmd: 'git update-index --chmod=+x mvnw', desc: 'En Windows, marca el script mvnw (sin extensión) como ejecutable dentro del repo git, para que no falle al clonarlo en Linux/CI.', tip: 'Windows no tiene bit de ejecución nativo; sin este paso, un checkout en Linux puede dejar mvnw sin permiso de ejecución.' },
        { cmd: '.mvn/wrapper/maven-wrapper.properties', desc: 'Archivo donde vive la versión fijada (distributionUrl) y el tipo de wrapper (distributionType). Se versiona en git; los .jar binarios del wrapper viejo (estilo Takari) no deberían estar aquí.' }
      ]
    },
    {
      id: 'campos-principales-de-pom-xml',
      titulo: 'Campos principales de pom.xml',
      items: [
        { cmd: '<groupId>com.miempresa</groupId>', desc: 'Identifica la organización o grupo dueño del artefacto; junto con artifactId y version forma las coordenadas GAV.' },
        { cmd: '<artifactId>mi-servicio</artifactId>', desc: 'Nombre del proyecto/módulo dentro del grupo.' },
        { cmd: '<version>1.0.0</version>', desc: 'Versión del artefacto. Un sufijo -SNAPSHOT indica una versión en desarrollo, no una release final.' },
        { cmd: '<packaging>jar</packaging>', desc: 'Tipo de artefacto a generar: jar, war, pom (para un aggregator), etc. jar es el valor por defecto si se omite.' },
        { cmd: '<parent>...</parent>', desc: 'Hereda configuración (dependencias, plugins, propiedades) de otro pom.xml, típicamente un BOM o el pom raíz de un multi-módulo.' },
        { cmd: '<properties>...</properties>', desc: 'Define variables reutilizables en el resto del pom, como la versión de Java o versiones de dependencias.' },
        { cmd: '<dependencies>...</dependencies>', desc: 'Lista las dependencias directas del proyecto.' },
        { cmd: '<dependency><scope>test</scope></dependency>', desc: 'Limita una dependencia a la fase de test; no se empaqueta en el artefacto final.' },
        { cmd: '<dependencyManagement>...</dependencyManagement>', desc: 'Centraliza versiones de dependencias sin agregarlas al build; los módulos hijos las declaran sin repetir la versión.' },
        { cmd: '<build><plugins>...</plugins></build>', desc: 'Configura los plugins que participan en el build, como el compiler, surefire, jacoco o checkstyle.' },
        { cmd: '<plugin><executions>...</executions></plugin>', desc: 'Define en qué fase del ciclo de vida se ejecuta un goal concreto del plugin.' },
        { cmd: '<profiles><profile>...</profile></profiles>', desc: 'Configuración alternativa (dependencias, propiedades, plugins) que solo aplica cuando el perfil está activo.' },
        { cmd: '<modules><module>...</module></modules>', desc: 'En un pom.xml raíz de tipo pom, lista los módulos hijos que forman el proyecto multi-módulo.' },
        { cmd: '<repositories>...</repositories>', desc: 'Repositorios remotos adicionales de donde Maven puede descargar dependencias, aparte de Maven Central.' }
      ],
      lang: 'xml',
      nota: 'Estos campos se escriben dentro de pom.xml; no se ejecutan directamente en la terminal.'
    },
    {
      id: 'comandos-practicos-combinados',
      titulo: 'Comandos prácticos combinados',
      items: [
        { cmd: '.\\mvnw.cmd clean verify', desc: 'Build completo con el gate de calidad, tal como correría en CI antes de aceptar un cambio.' },
        { cmd: '.\\mvnw.cmd clean install -DskipTests', desc: 'Genera rápido el artefacto para probarlo en otro proyecto local, sin esperar a que corran los tests.' },
        { cmd: 'mvn dependency:tree -Dincludes=org.slf4j', desc: 'Rastrea de dónde viene una versión concreta de slf4j cuando hay un conflicto de versiones.' },
        { cmd: 'mvn versions:display-dependency-updates', desc: 'Revisión rápida de qué dependencias conviene actualizar antes de un checkmarx/SCA scan.' },
        { cmd: '.\\mvnw.cmd test -Dtest=PolizaResourceTest -DfailIfNoTests=false', desc: 'Corre un solo test class puntual mientras se depura, sin fallar si el filtro no matchea nada.' },
        { cmd: '.\\mvnw.cmd quarkus:dev', desc: 'En un proyecto Quarkus, levanta el modo desarrollo con live reload (equivalente a lo que antes era ./gradlew quarkusDev en Gradle).' },
        { cmd: 'mvn archetype:generate', desc: 'Bootstrap interactivo de un proyecto Maven nuevo a partir de un arquetipo.' },
        { cmd: 'mvn clean install -pl mi-modulo -am -DskipTests', desc: 'En un multi-módulo, reconstruye rápido solo el módulo que estás tocando y sus dependencias, sin tests.' }
      ],
      nota: 'Ejemplos listos para adaptar. Reemplaza nombres de clases, módulos y rutas antes de ejecutarlos.'
    },
    {
      id: 'problemas-comunes-en-windows',
      titulo: 'Problemas comunes en Windows',
      intro: 'Los errores que más aparecen al trabajar con Maven en Windows, y qué ejecutar para resolverlos.',
      items: [
        {
          cmd: '$env:JAVA_HOME',
          desc: 'Comprueba qué JDK está usando Maven. Si sale vacío o apunta a una versión distinta a la que espera el pom.xml, ahí suele estar el problema.',
          tip: 'Maven usa JAVA_HOME, no el java.exe que esté primero en PATH.'
        },
        {
          cmd: 'where.exe mvn',
          desc: 'Muestra desde qué rutas se encuentra mvn. Si aparece más de una instalación, la primera de la lista es la que realmente se ejecuta.'
        },
        {
          cmd: '.\\mvnw.cmd',
          desc: 'Corrige el error "mvnw.cmd no se reconoce como comando" en PowerShell: hay que anteponer .\\, la carpeta actual no está en PATH.'
        },
        {
          cmd: 'mvn -version',
          desc: 'Al final de su salida muestra el JDK y el sistema operativo detectados; útil para confirmar que apunta al JDK correcto tras cambiar JAVA_HOME.'
        },
        {
          cmd: 'Remove-Item -Recurse -Force "$env:USERPROFILE\\.m2\\repository\\<groupId con \\ en vez de .>"',
          desc: 'Borra del repositorio local un artefacto puntual que quedó corrupto o a medio descargar, para forzar que Maven lo vuelva a bajar.',
          warn: 'Confirma la ruta exacta antes de borrar; sin el groupId/artifactId correcto puedes eliminar más de lo necesario.'
        },
        {
          cmd: 'mvn clean install -U',
          desc: 'Cuando el error es sobre una dependencia o plugin que "no coincide" con lo esperado, fuerza a Maven a revalidar contra el remoto en vez de confiar en la caché local.'
        },
        {
          desc: '"Unsupported class file major version" al compilar o correr un plugin (jacoco, archunit, etc.).',
          cmd: 'mvn -version',
          tip: 'Suele significar que el JDK activo es más nuevo que lo que ese plugin soporta. Revisa la versión del plugin en el pom.xml y súbela, o fija maven.compiler.release a una versión de Java que el plugin sí entienda.'
        }
      ]
    },
    {
      id: 'glosario-de-terminos',
      titulo: 'Glosario de términos',
      tipo: 'glosario',
      items: [
        { term: 'Maven', def: 'Herramienta de build y gestión de dependencias para proyectos Java, basada en un archivo de configuración declarativo (pom.xml).' },
        { term: 'POM', def: 'Project Object Model: el archivo pom.xml que describe el proyecto, sus dependencias, plugins y configuración de build.' },
        { term: 'GAV', def: 'groupId:artifactId:version — las tres coordenadas que identifican de forma única un artefacto Maven.' },
        { term: 'Ciclo de vida', def: 'Secuencia predefinida de fases (validate, compile, test, package, verify, install, deploy) que Maven ejecuta en orden.' },
        { term: 'Fase', def: 'Un paso del ciclo de vida, como compile o test. Ejecutar una fase corre también todas las anteriores del mismo ciclo.' },
        { term: 'Goal', def: 'Una tarea concreta de un plugin, por ejemplo compiler:compile o jacoco:report. Las fases disparan goals ligados a ellas.' },
        { term: 'Plugin', def: 'Componente que agrega goals a Maven, como maven-compiler-plugin, jacoco-maven-plugin o maven-checkstyle-plugin.' },
        { term: 'Artefacto', def: 'El resultado empaquetado del build (jar, war) identificado por su GAV.' },
        { term: 'Repositorio local', def: 'Caché en el disco del desarrollador (por defecto ~/.m2/repository) donde Maven guarda los artefactos ya descargados o instalados.' },
        { term: 'Repositorio remoto', def: 'Servidor del que Maven descarga dependencias, como Maven Central o un Nexus/Artifactory privado.' },
        { term: 'Reactor', def: 'El mecanismo que en un proyecto multi-módulo calcula el orden de build según las dependencias entre módulos.' },
        { term: 'Módulo', def: 'Un subproyecto declarado en <modules> del pom.xml raíz de un proyecto multi-módulo.' },
        { term: 'Perfil (profile)', def: 'Bloque de configuración opcional que solo se aplica cuando se activa explícitamente (-P) o por una condición automática.' },
        { term: 'SNAPSHOT', def: 'Sufijo de versión que indica una build en desarrollo, no una release final; Maven la vuelve a resolver en cada build si hay una más nueva.' },
        { term: 'BOM', def: 'Bill of Materials: un pom de tipo pom usado solo en <dependencyManagement> para fijar versiones consistentes de un conjunto de dependencias relacionadas.' },
        { term: 'Wrapper (mvnw)', def: 'Scripts (mvnw / mvnw.cmd) que descargan y usan la versión exacta de Maven fijada para el proyecto, sin depender de una instalación global.' },
        { term: 'Surefire', def: 'Plugin que ejecuta los tests unitarios durante la fase test.' },
        { term: 'Failsafe', def: 'Plugin que ejecuta los tests de integración (normalmente sufijo *IT) durante las fases integration-test/verify.' },
        { term: 'Effective POM', def: 'El pom.xml final que Maven realmente usa, con toda la herencia de parents, perfiles activos y valores por defecto ya resueltos.' },
        { term: 'settings.xml', def: 'Archivo de configuración del usuario o global (no del proyecto) con credenciales, mirrors y repositorios; suele vivir en ~/.m2/settings.xml.' }
      ]
    }
  ]
};
