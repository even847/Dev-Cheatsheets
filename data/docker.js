// Datos de la guía de Docker. Para agregar un comando: añade un objeto { cmd, desc } al arreglo items de su sección.
window.CHEATSHEETS = window.CHEATSHEETS || {};
window.CHEATSHEETS.docker = {
  "meta": {
    "id": "docker",
    "nombre": "Docker",
    "subtitulo": "Comandos, Dockerfile, Compose y glosario"
  },
  "notas": [
    "Convención: reemplaza los valores entre < >. Se muestra primero la sintaxis explícita por recurso (container, image, volume o network). Cuando existe, también se indica el alias corto, que sigue siendo válido y muy utilizado.",
    "Antes de ejecutar rm, prune, down -v o system prune, revisa el contexto activo y confirma qué datos podrían eliminarse."
  ],
  "secciones": [
    {
      "id": "informacion-ayuda-y-contexto",
      "titulo": "Información, ayuda y contexto",
      "items": [
        {
          "cmd": "docker version",
          "desc": "Muestra las versiones del cliente y del servidor Docker y confirma si pueden comunicarse."
        },
        {
          "cmd": "docker system info",
          "desc": "Muestra información detallada del motor: imágenes, contenedores, almacenamiento, CPU, memoria y configuración.",
          "alias": "docker info"
        },
        {
          "cmd": "docker --help",
          "desc": "Lista comandos principales y opciones globales."
        },
        {
          "cmd": "docker <comando> --help",
          "desc": "Muestra sintaxis, argumentos y opciones de un comando específico."
        },
        {
          "cmd": "docker context ls",
          "desc": "Lista los contextos configurados y marca cuál está activo."
        },
        {
          "cmd": "docker context show",
          "desc": "Muestra el nombre del contexto activo."
        },
        {
          "cmd": "docker context use <contexto>",
          "desc": "Cambia el motor Docker al que se enviarán los comandos siguientes.",
          "warn": "Confirma el contexto antes de eliminar recursos."
        },
        {
          "cmd": "docker context inspect <contexto>",
          "desc": "Muestra la configuración y endpoints de un contexto."
        },
        {
          "cmd": "docker system df",
          "desc": "Resume el espacio usado por imágenes, contenedores, volúmenes y caché de construcción."
        },
        {
          "cmd": "docker system events",
          "desc": "Muestra en tiempo real eventos del daemon como create, start, stop, die, pull y destroy.",
          "alias": "docker events"
        }
      ]
    },
    {
      "id": "imagenes-y-registros",
      "titulo": "Imágenes y registros",
      "items": [
        {
          "cmd": "docker image ls",
          "desc": "Lista las imágenes almacenadas localmente.",
          "alias": "docker images"
        },
        {
          "cmd": "docker image ls -a",
          "desc": "Lista todas las imágenes, incluidas capas intermedias."
        },
        {
          "cmd": "docker image pull <imagen>:<tag>",
          "desc": "Descarga una imagen y etiqueta desde un registro.",
          "alias": "docker pull <imagen>:<tag>"
        },
        {
          "cmd": "docker search <nombre>",
          "desc": "Busca repositorios públicos en Docker Hub."
        },
        {
          "cmd": "docker image inspect <imagen>",
          "desc": "Muestra metadatos detallados de una imagen en JSON."
        },
        {
          "cmd": "docker image history <imagen>",
          "desc": "Muestra las capas y comandos que formaron la imagen."
        },
        {
          "cmd": "docker image tag <origen> <destino>:<tag>",
          "desc": "Crea otra etiqueta que apunta a la misma imagen."
        },
        {
          "cmd": "docker login [registro]",
          "desc": "Autentica el cliente contra Docker Hub u otro registro."
        },
        {
          "cmd": "docker logout [registro]",
          "desc": "Elimina las credenciales guardadas para el registro indicado."
        },
        {
          "cmd": "docker image push <repositorio>/<imagen>:<tag>",
          "desc": "Publica una imagen etiquetada en un registro.",
          "alias": "docker push <repositorio>/<imagen>:<tag>"
        },
        {
          "cmd": "docker image rm <imagen>",
          "desc": "Elimina una imagen local.",
          "alias": "docker rmi",
          "warn": "No podrá eliminarse si un contenedor dependiente sigue existiendo, salvo uso forzado."
        },
        {
          "cmd": "docker image prune",
          "desc": "Elimina imágenes colgantes sin etiqueta."
        },
        {
          "cmd": "docker image prune -a",
          "desc": "Elimina imágenes no utilizadas por ningún contenedor.",
          "warn": "Puede borrar imágenes etiquetadas que deban descargarse o reconstruirse nuevamente."
        },
        {
          "cmd": "docker image save -o imagen.tar <imagen>",
          "desc": "Guarda una imagen, sus capas y etiquetas en un archivo tar."
        },
        {
          "cmd": "docker image load -i imagen.tar",
          "desc": "Restaura imágenes y etiquetas desde un archivo creado con image save."
        },
        {
          "cmd": "docker image import rootfs.tar <imagen>:<tag>",
          "desc": "Crea una imagen desde un archivo de sistema de archivos; no recupera historial completo."
        }
      ]
    },
    {
      "id": "crear-y-ejecutar-contenedores",
      "titulo": "Crear y ejecutar contenedores",
      "items": [
        {
          "cmd": "docker container run <imagen>",
          "desc": "Descarga la imagen si falta, crea un contenedor y lo inicia.",
          "alias": "docker run <imagen>"
        },
        {
          "cmd": "docker container run --name <nombre> <imagen>",
          "desc": "Crea e inicia un contenedor con un nombre personalizado.",
          "alias": "docker run --name <nombre> <imagen>"
        },
        {
          "cmd": "docker container run -d <imagen>",
          "desc": "Ejecuta el contenedor en segundo plano.",
          "alias": "docker run -d <imagen>"
        },
        {
          "cmd": "docker container run --rm <imagen> <comando>",
          "desc": "Elimina automáticamente el contenedor cuando termina.",
          "alias": "docker run --rm <imagen> <comando>"
        },
        {
          "cmd": "docker container run -it <imagen> sh",
          "desc": "Crea un contenedor con terminal interactiva y abre sh.",
          "alias": "docker run -it <imagen> sh"
        },
        {
          "cmd": "docker container run -p 8080:80 <imagen>",
          "desc": "Publica el puerto 80 del contenedor en el 8080 del host.",
          "alias": "docker run -p 8080:80 <imagen>"
        },
        {
          "cmd": "docker container run -p 127.0.0.1:8080:80 <imagen>",
          "desc": "Publica el puerto solamente en la interfaz local del host.",
          "alias": "docker run -p 127.0.0.1:8080:80 <imagen>"
        },
        {
          "cmd": "docker container run -P <imagen>",
          "desc": "Publica todos los puertos EXPOSE usando puertos disponibles del host.",
          "alias": "docker run -P <imagen>"
        },
        {
          "cmd": "docker container run -e CLAVE=valor <imagen>",
          "desc": "Define una variable de entorno dentro del contenedor.",
          "alias": "docker run -e CLAVE=valor <imagen>"
        },
        {
          "cmd": "docker container run --env-file .env <imagen>",
          "desc": "Carga variables de entorno desde un archivo.",
          "alias": "docker run --env-file .env <imagen>"
        },
        {
          "cmd": "docker container run -w /app <imagen>",
          "desc": "Establece el directorio de trabajo inicial dentro del contenedor.",
          "alias": "docker run -w /app <imagen>"
        },
        {
          "cmd": "docker container run --entrypoint <ejecutable> <imagen>",
          "desc": "Reemplaza el ENTRYPOINT configurado en la imagen.",
          "alias": "docker run --entrypoint <ejecutable> <imagen>"
        },
        {
          "cmd": "docker container create --name <nombre> <imagen>",
          "desc": "Crea el contenedor sin iniciarlo.",
          "alias": "docker create --name <nombre> <imagen>"
        }
      ]
    },
    {
      "id": "ciclo-de-vida-de-contenedores",
      "titulo": "Ciclo de vida de contenedores",
      "items": [
        {
          "cmd": "docker container ls",
          "desc": "Lista los contenedores en ejecución. Equivale a docker container ls.",
          "alias": "docker ps"
        },
        {
          "cmd": "docker container ls -a",
          "desc": "Lista contenedores activos y detenidos.",
          "alias": "docker ps -a"
        },
        {
          "cmd": "docker container ls -q",
          "desc": "Muestra solamente los identificadores de contenedores activos.",
          "alias": "docker ps -q"
        },
        {
          "cmd": "docker container start <contenedor>",
          "desc": "Inicia un contenedor previamente creado o detenido.",
          "alias": "docker start <contenedor>"
        },
        {
          "cmd": "docker container stop <contenedor>",
          "desc": "Solicita una detención ordenada y fuerza la terminación al agotarse el tiempo.",
          "alias": "docker stop <contenedor>"
        },
        {
          "cmd": "docker container restart <contenedor>",
          "desc": "Detiene y vuelve a iniciar un contenedor.",
          "alias": "docker restart <contenedor>"
        },
        {
          "cmd": "docker container pause <contenedor>",
          "desc": "Suspende temporalmente todos los procesos del contenedor.",
          "alias": "docker pause <contenedor>"
        },
        {
          "cmd": "docker container unpause <contenedor>",
          "desc": "Reanuda los procesos de un contenedor pausado.",
          "alias": "docker unpause <contenedor>"
        },
        {
          "cmd": "docker container kill <contenedor>",
          "desc": "Envía una señal de terminación inmediata al proceso principal.",
          "alias": "docker kill <contenedor>",
          "warn": "Prefiere docker container stop cuando necesites una detención ordenada."
        },
        {
          "cmd": "docker container kill --signal SIGTERM <contenedor>",
          "desc": "Envía una señal específica al proceso principal.",
          "alias": "docker kill --signal SIGTERM <contenedor>"
        },
        {
          "cmd": "docker container wait <contenedor>",
          "desc": "Espera hasta que el contenedor termine y devuelve su código de salida.",
          "alias": "docker wait <contenedor>"
        },
        {
          "cmd": "docker container rename <actual> <nuevo>",
          "desc": "Cambia el nombre de un contenedor.",
          "alias": "docker rename <actual> <nuevo>"
        },
        {
          "cmd": "docker container rm <contenedor>",
          "desc": "Elimina un contenedor detenido.",
          "alias": "docker rm <contenedor>"
        },
        {
          "cmd": "docker container rm -f <contenedor>",
          "desc": "Fuerza la detención y eliminación de un contenedor.",
          "alias": "docker rm -f <contenedor>",
          "warn": "Puede interrumpir el proceso sin darle tiempo para limpiar o guardar estado."
        },
        {
          "cmd": "docker container prune",
          "desc": "Elimina todos los contenedores detenidos.",
          "warn": "Revisa la lista y la confirmación antes de continuar."
        }
      ]
    },
    {
      "id": "inspeccion-terminal-y-diagnostico",
      "titulo": "Inspección, terminal y diagnóstico",
      "items": [
        {
          "cmd": "docker container logs <contenedor>",
          "desc": "Muestra stdout y stderr registrados por el contenedor.",
          "alias": "docker logs <contenedor>"
        },
        {
          "cmd": "docker container logs -f <contenedor>",
          "desc": "Sigue los logs en tiempo real.",
          "alias": "docker logs -f <contenedor>"
        },
        {
          "cmd": "docker container logs --tail 100 <contenedor>",
          "desc": "Muestra únicamente las últimas 100 líneas.",
          "alias": "docker logs --tail 100 <contenedor>"
        },
        {
          "cmd": "docker container logs --since 30m <contenedor>",
          "desc": "Muestra logs generados durante los últimos 30 minutos.",
          "alias": "docker logs --since 30m <contenedor>"
        },
        {
          "cmd": "docker container exec -it <contenedor> sh",
          "desc": "Abre una shell interactiva dentro de un contenedor activo.",
          "alias": "docker exec -it <contenedor> sh"
        },
        {
          "cmd": "docker container exec <contenedor> <comando>",
          "desc": "Ejecuta un comando nuevo dentro de un contenedor activo.",
          "alias": "docker exec <contenedor> <comando>"
        },
        {
          "cmd": "docker container attach <contenedor>",
          "desc": "Conecta la terminal al proceso principal del contenedor.",
          "alias": "docker attach <contenedor>",
          "warn": "Ctrl+C puede detener el proceso principal; para diagnóstico suele ser preferible exec o logs."
        },
        {
          "cmd": "docker container inspect <contenedor>",
          "desc": "Muestra configuración, estado, mounts, red, puertos y healthcheck en JSON.",
          "alias": "docker inspect <contenedor>"
        },
        {
          "cmd": "docker container inspect --format '{{.State.Status}}' <contenedor>",
          "desc": "Extrae un campo concreto de inspect mediante una plantilla.",
          "alias": "docker inspect --format '{{.State.Status}}' <contenedor>"
        },
        {
          "cmd": "docker container inspect --size <contenedor>",
          "desc": "Añade el tamaño de la capa escribible y el tamaño virtual.",
          "alias": "docker inspect --size <contenedor>"
        },
        {
          "cmd": "docker container port <contenedor>",
          "desc": "Muestra los puertos publicados del contenedor.",
          "alias": "docker port <contenedor>"
        },
        {
          "cmd": "docker container top <contenedor>",
          "desc": "Lista los procesos ejecutados dentro del contenedor.",
          "alias": "docker top <contenedor>"
        },
        {
          "cmd": "docker container stats",
          "desc": "Muestra en vivo CPU, memoria, red y E/S de los contenedores.",
          "alias": "docker stats"
        },
        {
          "cmd": "docker container stats --no-stream",
          "desc": "Muestra una sola lectura del consumo y termina.",
          "alias": "docker stats --no-stream"
        },
        {
          "cmd": "docker container diff <contenedor>",
          "desc": "Lista archivos añadidos, modificados o eliminados respecto de la imagen."
        },
        {
          "cmd": "docker container cp <contenedor>:/ruta ./destino",
          "desc": "Copia archivos desde un contenedor al host.",
          "alias": "docker cp <contenedor>:/ruta ./destino"
        },
        {
          "cmd": "docker container cp ./archivo <contenedor>:/ruta",
          "desc": "Copia archivos desde el host al contenedor.",
          "alias": "docker cp ./archivo <contenedor>:/ruta"
        },
        {
          "cmd": "docker container export -o rootfs.tar <contenedor>",
          "desc": "Exporta el sistema de archivos del contenedor; no incluye volúmenes."
        },
        {
          "cmd": "docker container commit <contenedor> <imagen>:<tag>",
          "desc": "Crea una imagen desde los cambios de un contenedor.",
          "alias": "docker commit <contenedor> <imagen>:<tag>",
          "warn": "Para trabajo reproducible, expresa los cambios en un Dockerfile."
        },
        {
          "cmd": "docker container update --memory 768m --cpus 1.5 <contenedor>",
          "desc": "Modifica límites compatibles de un contenedor existente.",
          "alias": "docker update --memory 768m --cpus 1.5 <contenedor>"
        }
      ]
    },
    {
      "id": "volumenes-y-bind-mounts",
      "titulo": "Volúmenes y bind mounts",
      "items": [
        {
          "cmd": "docker volume ls",
          "desc": "Lista los volúmenes administrados por Docker."
        },
        {
          "cmd": "docker volume create <volumen>",
          "desc": "Crea un volumen con nombre."
        },
        {
          "cmd": "docker volume inspect <volumen>",
          "desc": "Muestra controlador, punto de montaje y metadatos del volumen."
        },
        {
          "cmd": "docker container run -v <volumen>:/datos <imagen>",
          "desc": "Monta un volumen con nombre dentro del contenedor.",
          "alias": "docker run -v <volumen>:/datos <imagen>"
        },
        {
          "cmd": "docker container run -v \"${PWD}:/app\" <imagen>",
          "desc": "Monta la carpeta actual del host dentro del contenedor.",
          "alias": "docker run -v \"${PWD}:/app\" <imagen>"
        },
        {
          "cmd": "docker container run --mount type=volume,src=<vol>,dst=/datos <imagen>",
          "desc": "Monta un volumen usando sintaxis explícita.",
          "alias": "docker run --mount type=volume,src=<vol>,dst=/datos <imagen>"
        },
        {
          "cmd": "docker container run --mount type=bind,src=\"${PWD}\",dst=/app,readonly <imagen>",
          "desc": "Monta la carpeta actual como bind mount de solo lectura.",
          "alias": "docker run --mount type=bind,src=\"${PWD}\",dst=/app,readonly <imagen>"
        },
        {
          "cmd": "docker volume rm <volumen>",
          "desc": "Elimina un volumen que no está en uso.",
          "warn": "El contenido del volumen se pierde."
        },
        {
          "cmd": "docker volume prune",
          "desc": "Elimina por defecto los volúmenes anónimos locales que no utiliza ningún contenedor.",
          "warn": "Un volumen desconectado puede contener datos importantes."
        }
      ]
    },
    {
      "id": "redes-y-puertos",
      "titulo": "Redes y puertos",
      "items": [
        {
          "cmd": "docker network ls",
          "desc": "Lista las redes Docker."
        },
        {
          "cmd": "docker network create <red>",
          "desc": "Crea una red bridge definida por el usuario."
        },
        {
          "cmd": "docker network inspect <red>",
          "desc": "Muestra subred, gateway y contenedores conectados."
        },
        {
          "cmd": "docker network connect <red> <contenedor>",
          "desc": "Conecta un contenedor existente a otra red."
        },
        {
          "cmd": "docker network disconnect <red> <contenedor>",
          "desc": "Desconecta un contenedor de una red."
        },
        {
          "cmd": "docker network rm <red>",
          "desc": "Elimina una red sin contenedores conectados."
        },
        {
          "cmd": "docker network prune",
          "desc": "Elimina redes sin uso."
        },
        {
          "cmd": "docker container run --network <red> <imagen>",
          "desc": "Crea un contenedor conectado a la red indicada.",
          "alias": "docker run --network <red> <imagen>"
        },
        {
          "cmd": "docker container run --network <red> --network-alias <alias> <imagen>",
          "desc": "Conecta el contenedor a la red y le asigna un alias DNS dentro de ella.",
          "alias": "docker run --network <red> --network-alias <alias> <imagen>"
        },
        {
          "cmd": "docker network connect --alias <alias> <red> <contenedor>",
          "desc": "Conecta un contenedor existente a una red y le asigna un alias DNS."
        },
        {
          "cmd": "docker container run --network none <imagen>",
          "desc": "Crea un contenedor sin conectividad de red externa administrada por Docker.",
          "alias": "docker run --network none <imagen>"
        },
        {
          "cmd": "docker container run --add-host nombre:IP <imagen>",
          "desc": "Añade una entrada nombre-IP al archivo hosts del contenedor.",
          "alias": "docker run --add-host nombre:IP <imagen>"
        }
      ]
    },
    {
      "id": "construccion-de-imagenes",
      "titulo": "Construcción de imágenes",
      "items": [
        {
          "cmd": "docker build -t <imagen>:<tag> .",
          "desc": "Construye una imagen desde el Dockerfile y contexto del directorio actual."
        },
        {
          "cmd": "docker build -f Dockerfile.dev -t <imagen>:dev .",
          "desc": "Construye usando un Dockerfile de nombre o ubicación diferente."
        },
        {
          "cmd": "docker build --no-cache -t <imagen> .",
          "desc": "Construye ignorando la caché existente."
        },
        {
          "cmd": "docker build --pull -t <imagen> .",
          "desc": "Intenta descargar una versión más reciente de la imagen base antes de construir."
        },
        {
          "cmd": "docker build --build-arg CLAVE=valor -t <imagen> .",
          "desc": "Pasa un argumento declarado con ARG durante la construcción."
        },
        {
          "cmd": "docker build --target <etapa> -t <imagen> .",
          "desc": "Detiene una construcción multi-stage en la etapa nombrada."
        },
        {
          "cmd": "docker buildx inspect [<builder>]",
          "desc": "Muestra información detallada del builder seleccionado o del indicado."
        },
        {
          "cmd": "docker builder prune",
          "desc": "Elimina caché de construcción no utilizada.",
          "warn": "Las próximas construcciones pueden tardar más."
        },
        {
          "cmd": "docker buildx ls",
          "desc": "Lista builders y plataformas soportadas por Buildx."
        },
        {
          "cmd": "docker buildx create --name <builder> --use",
          "desc": "Crea un builder Buildx y lo selecciona."
        },
        {
          "cmd": "docker buildx build --platform linux/amd64,linux/arm64 -t <imagen> --push .",
          "desc": "Construye y publica una imagen multi-arquitectura."
        }
      ]
    },
    {
      "id": "docker-compose-ciclo-de-vida",
      "titulo": "Docker Compose: ciclo de vida",
      "items": [
        {
          "cmd": "docker compose version",
          "desc": "Muestra la versión de Docker Compose."
        },
        {
          "cmd": "docker compose config",
          "desc": "Valida y muestra la configuración Compose efectiva."
        },
        {
          "cmd": "docker compose build",
          "desc": "Construye las imágenes definidas con build."
        },
        {
          "cmd": "docker compose pull",
          "desc": "Descarga las imágenes referenciadas por los servicios."
        },
        {
          "cmd": "docker compose up",
          "desc": "Crea, inicia y adjunta los servicios del proyecto."
        },
        {
          "cmd": "docker compose up -d",
          "desc": "Levanta los servicios en segundo plano."
        },
        {
          "cmd": "docker compose up -d --build",
          "desc": "Reconstruye imágenes necesarias y levanta el proyecto en segundo plano."
        },
        {
          "cmd": "docker compose ps",
          "desc": "Muestra contenedores y estado de los servicios."
        },
        {
          "cmd": "docker compose logs",
          "desc": "Muestra los logs agregados del proyecto."
        },
        {
          "cmd": "docker compose logs -f --tail 100 <servicio>",
          "desc": "Sigue los últimos 100 logs del servicio indicado."
        },
        {
          "cmd": "docker compose exec <servicio> sh",
          "desc": "Abre una shell dentro del contenedor activo del servicio."
        },
        {
          "cmd": "docker compose run --rm <servicio> <comando>",
          "desc": "Crea un contenedor temporal con la configuración del servicio y ejecuta una tarea."
        },
        {
          "cmd": "docker compose stop",
          "desc": "Detiene los servicios sin eliminar sus contenedores."
        },
        {
          "cmd": "docker compose start",
          "desc": "Inicia contenedores de servicios previamente detenidos."
        },
        {
          "cmd": "docker compose restart [servicio]",
          "desc": "Reinicia todos los servicios o el servicio indicado."
        },
        {
          "cmd": "docker compose rm",
          "desc": "Elimina contenedores detenidos de servicios."
        },
        {
          "cmd": "docker compose down",
          "desc": "Detiene y elimina contenedores y redes del proyecto; conserva volúmenes con nombre."
        },
        {
          "cmd": "docker compose down -v",
          "desc": "También elimina los volúmenes declarados por el proyecto.",
          "warn": "Destruye datos persistentes guardados en esos volúmenes."
        },
        {
          "cmd": "docker compose down --remove-orphans",
          "desc": "También elimina contenedores del proyecto que ya no están definidos en el archivo."
        }
      ]
    },
    {
      "id": "docker-compose-consulta-y-funciones-avanzadas",
      "titulo": "Docker Compose: consulta y funciones avanzadas",
      "items": [
        {
          "cmd": "docker compose ls",
          "desc": "Lista proyectos Compose activos o conocidos."
        },
        {
          "cmd": "docker compose images",
          "desc": "Lista imágenes utilizadas por los contenedores del proyecto."
        },
        {
          "cmd": "docker compose top",
          "desc": "Muestra procesos ejecutados por los servicios."
        },
        {
          "cmd": "docker compose stats",
          "desc": "Muestra consumo de recursos de los servicios."
        },
        {
          "cmd": "docker compose events",
          "desc": "Muestra eventos en tiempo real del proyecto."
        },
        {
          "cmd": "docker compose port <servicio> <puerto>",
          "desc": "Muestra el puerto público asignado a un puerto del servicio."
        },
        {
          "cmd": "docker compose up -d --scale worker=3",
          "desc": "Levanta tres réplicas del servicio worker."
        },
        {
          "cmd": "docker compose watch",
          "desc": "Observa cambios y aplica acciones de sincronización o reconstrucción configuradas."
        },
        {
          "cmd": "docker compose -f compose.yaml -f compose.dev.yaml up -d",
          "desc": "Combina varios archivos Compose y levanta la configuración resultante."
        },
        {
          "cmd": "docker compose --profile debug up -d",
          "desc": "Activa los servicios pertenecientes al perfil debug."
        },
        {
          "cmd": "docker compose config --services",
          "desc": "Lista los nombres de los servicios de la configuración efectiva."
        },
        {
          "cmd": "docker compose config --volumes",
          "desc": "Lista los volúmenes declarados en la configuración efectiva."
        }
      ]
    },
    {
      "id": "recursos-seguridad-y-salud",
      "titulo": "Recursos, seguridad y salud",
      "items": [
        {
          "cmd": "docker container run --memory 512m <imagen>",
          "desc": "Limita la memoria disponible para el contenedor.",
          "alias": "docker run --memory 512m <imagen>"
        },
        {
          "cmd": "docker container run --cpus 1.5 <imagen>",
          "desc": "Limita el contenedor a una cantidad equivalente de CPU.",
          "alias": "docker run --cpus 1.5 <imagen>"
        },
        {
          "cmd": "docker container run --restart no <imagen>",
          "desc": "No reinicia automáticamente el contenedor.",
          "alias": "docker run --restart no <imagen>"
        },
        {
          "cmd": "docker container run --restart on-failure:5 <imagen>",
          "desc": "Reinicia tras errores hasta un máximo de cinco intentos.",
          "alias": "docker run --restart on-failure:5 <imagen>"
        },
        {
          "cmd": "docker container run --restart unless-stopped <imagen>",
          "desc": "Reinicia salvo que el usuario lo haya detenido explícitamente.",
          "alias": "docker run --restart unless-stopped <imagen>"
        },
        {
          "cmd": "docker container run --read-only <imagen>",
          "desc": "Vuelve de solo lectura el sistema de archivos raíz del contenedor.",
          "alias": "docker run --read-only <imagen>"
        },
        {
          "cmd": "docker container run --tmpfs /tmp <imagen>",
          "desc": "Monta almacenamiento temporal en memoria en /tmp.",
          "alias": "docker run --tmpfs /tmp <imagen>"
        },
        {
          "cmd": "docker container run --user 1000:1000 <imagen>",
          "desc": "Ejecuta el proceso con UID y GID específicos.",
          "alias": "docker run --user 1000:1000 <imagen>"
        },
        {
          "cmd": "docker container run --init <imagen>",
          "desc": "Añade un pequeño init para reenviar señales y recoger procesos huérfanos.",
          "alias": "docker run --init <imagen>"
        },
        {
          "cmd": "docker container run --cap-drop ALL --cap-add NET_BIND_SERVICE <imagen>",
          "desc": "Elimina capacidades Linux y devuelve solamente la indicada.",
          "alias": "docker run --cap-drop ALL --cap-add NET_BIND_SERVICE <imagen>"
        },
        {
          "cmd": "docker container run --security-opt no-new-privileges <imagen>",
          "desc": "Impide que los procesos obtengan privilegios adicionales.",
          "alias": "docker run --security-opt no-new-privileges <imagen>"
        },
        {
          "cmd": "docker container run --health-cmd='<comando>' --health-interval=30s <imagen>",
          "desc": "Define una prueba de salud y su intervalo.",
          "alias": "docker run --health-cmd='<comando>' --health-interval=30s <imagen>"
        },
        {
          "cmd": "docker container inspect --format '{{json .State.Health}}' <contenedor>",
          "desc": "Muestra el estado y resultados del healthcheck.",
          "alias": "docker inspect --format '{{json .State.Health}}' <contenedor>"
        },
        {
          "cmd": "docker scout quickview <imagen>",
          "desc": "Muestra una vista rápida de análisis de la imagen si Docker Scout está disponible."
        },
        {
          "cmd": "docker scout cves <imagen>",
          "desc": "Lista vulnerabilidades conocidas de la imagen si Docker Scout está disponible."
        }
      ]
    },
    {
      "id": "limpieza-del-entorno",
      "titulo": "Limpieza del entorno",
      "items": [
        {
          "cmd": "docker container prune",
          "desc": "Elimina contenedores detenidos."
        },
        {
          "cmd": "docker image prune",
          "desc": "Elimina imágenes colgantes."
        },
        {
          "cmd": "docker image prune -a",
          "desc": "Elimina imágenes no utilizadas por contenedores."
        },
        {
          "cmd": "docker volume prune",
          "desc": "Elimina por defecto los volúmenes anónimos locales que no utiliza ningún contenedor."
        },
        {
          "cmd": "docker network prune",
          "desc": "Elimina redes no utilizadas."
        },
        {
          "cmd": "docker builder prune",
          "desc": "Elimina caché de construcción no utilizada."
        },
        {
          "cmd": "docker system prune",
          "desc": "Elimina contenedores detenidos, redes sin uso, imágenes colgantes y caché no utilizada."
        },
        {
          "cmd": "docker system prune -a",
          "desc": "Además elimina imágenes no utilizadas aunque tengan etiqueta.",
          "warn": "Puede requerir volver a descargar o construir imágenes."
        },
        {
          "cmd": "docker system prune --volumes",
          "desc": "Incluye en la limpieza los volúmenes anónimos que no utiliza ningún contenedor.",
          "warn": "Los datos guardados en los volúmenes eliminados se pierden."
        }
      ]
    },
    {
      "id": "docker-swarm-referencia-complementaria",
      "titulo": "Docker Swarm — referencia complementaria",
      "items": [
        {
          "cmd": "docker swarm init",
          "desc": "Inicializa un nodo como manager de un nuevo Swarm."
        },
        {
          "cmd": "docker swarm join-token worker",
          "desc": "Muestra el comando/token para unir workers."
        },
        {
          "cmd": "docker node ls",
          "desc": "Lista nodos del Swarm; se ejecuta en un manager."
        },
        {
          "cmd": "docker service create --name <servicio> <imagen>",
          "desc": "Crea un servicio distribuido en el Swarm."
        },
        {
          "cmd": "docker service ls",
          "desc": "Lista servicios del Swarm."
        },
        {
          "cmd": "docker service ps <servicio>",
          "desc": "Lista tareas y nodos asignados a un servicio."
        },
        {
          "cmd": "docker service scale <servicio>=3",
          "desc": "Escala el servicio a tres réplicas."
        },
        {
          "cmd": "docker service update --image <imagen>:<tag> <servicio>",
          "desc": "Actualiza la imagen utilizada por un servicio."
        },
        {
          "cmd": "docker service rm <servicio>",
          "desc": "Elimina un servicio del Swarm."
        },
        {
          "cmd": "docker stack deploy -c compose.yaml <stack>",
          "desc": "Despliega un stack en Swarm desde un archivo Compose compatible."
        },
        {
          "cmd": "docker stack ls",
          "desc": "Lista stacks desplegados."
        },
        {
          "cmd": "docker stack rm <stack>",
          "desc": "Elimina un stack del Swarm."
        }
      ]
    },
    {
      "id": "instrucciones-principales-de-dockerfile",
      "titulo": "Instrucciones principales de Dockerfile",
      "items": [
        {
          "cmd": "# syntax=docker/dockerfile:1",
          "desc": "Selecciona la versión de sintaxis del frontend de Dockerfile; se coloca como primera línea."
        },
        {
          "cmd": "FROM <imagen>:<tag>",
          "desc": "Define la imagen base e inicia una etapa de construcción."
        },
        {
          "cmd": "FROM <imagen>:<tag> AS <etapa>",
          "desc": "Inicia una etapa con nombre para una construcción multi-stage."
        },
        {
          "cmd": "WORKDIR /ruta",
          "desc": "Establece el directorio de trabajo para las instrucciones posteriores."
        },
        {
          "cmd": "COPY <origen> <destino>",
          "desc": "Copia archivos o carpetas desde el contexto de construcción a la imagen."
        },
        {
          "cmd": "COPY --from=<etapa> <origen> <destino>",
          "desc": "Copia artefactos desde otra etapa de una construcción multi-stage."
        },
        {
          "cmd": "ADD <origen> <destino>",
          "desc": "Añade archivos y admite funciones adicionales como URLs o extracción de archivos tar; para copias normales se prefiere COPY."
        },
        {
          "cmd": "RUN <comando>",
          "desc": "Ejecuta un comando durante la construcción y guarda el resultado en una nueva capa."
        },
        {
          "cmd": "ENV CLAVE=valor",
          "desc": "Define una variable de entorno persistente en la imagen y en sus contenedores."
        },
        {
          "cmd": "ARG NOMBRE=valor",
          "desc": "Declara una variable disponible durante la construcción; puede recibirse con --build-arg."
        },
        {
          "cmd": "EXPOSE <puerto>",
          "desc": "Documenta el puerto que escucha la aplicación; no lo publica en el host."
        },
        {
          "cmd": "USER <usuario>[:<grupo>]",
          "desc": "Selecciona el usuario y grupo para las instrucciones siguientes y la ejecución del contenedor."
        },
        {
          "cmd": "VOLUME [\"/datos\"]",
          "desc": "Declara un punto de montaje para datos persistentes; la ubicación del host se decide al ejecutar."
        },
        {
          "cmd": "HEALTHCHECK [opciones] CMD <comando>",
          "desc": "Define una prueba que permite marcar el contenedor como starting, healthy o unhealthy."
        },
        {
          "cmd": "CMD [\"ejecutable\", \"argumento\"]",
          "desc": "Define el comando o los argumentos predeterminados del contenedor; docker run puede reemplazarlos."
        },
        {
          "cmd": "ENTRYPOINT [\"ejecutable\", \"argumento\"]",
          "desc": "Define el ejecutable principal del contenedor; los argumentos de docker run normalmente se agregan al final."
        },
        {
          "cmd": "LABEL clave=valor",
          "desc": "Añade metadatos a la imagen."
        },
        {
          "cmd": "STOPSIGNAL SIGTERM",
          "desc": "Define la señal que Docker enviará para detener el contenedor."
        }
      ],
      "lang": "dockerfile",
      "nota": "Estas instrucciones se escriben dentro del archivo Dockerfile; no se ejecutan directamente en la terminal."
    },
    {
      "id": "campos-principales-de-compose-yaml",
      "titulo": "Campos principales de compose.yaml",
      "items": [
        {
          "cmd": "name: mi-proyecto",
          "desc": "Define explícitamente el nombre del proyecto Compose."
        },
        {
          "cmd": "services:",
          "desc": "Agrupa los servicios que componen la aplicación."
        },
        {
          "cmd": "  api:",
          "desc": "Declara un servicio llamado api; el nombre funciona como DNS dentro de las redes del proyecto."
        },
        {
          "cmd": "    image: repositorio/imagen:tag",
          "desc": "Indica la imagen que utilizará el servicio."
        },
        {
          "cmd": "    build: .",
          "desc": "Construye la imagen usando el contexto del directorio indicado."
        },
        {
          "cmd": "    build.context: .",
          "desc": "Define explícitamente el contexto de construcción."
        },
        {
          "cmd": "    build.dockerfile: Dockerfile.dev",
          "desc": "Selecciona un Dockerfile diferente del predeterminado."
        },
        {
          "cmd": "    command: [\"npm\", \"start\"]",
          "desc": "Reemplaza el CMD configurado en la imagen."
        },
        {
          "cmd": "    entrypoint: [\"/app/iniciar.sh\"]",
          "desc": "Reemplaza el ENTRYPOINT configurado en la imagen."
        },
        {
          "cmd": "    working_dir: /app",
          "desc": "Establece el directorio de trabajo del servicio."
        },
        {
          "cmd": "    environment:",
          "desc": "Define variables de entorno directamente en la configuración."
        },
        {
          "cmd": "    env_file: .env",
          "desc": "Carga variables de entorno desde un archivo."
        },
        {
          "cmd": "    ports: [\"8080:80\"]",
          "desc": "Publica el puerto 80 del contenedor en el 8080 del host."
        },
        {
          "cmd": "    expose: [\"3000\"]",
          "desc": "Documenta o expone el puerto para otros servicios sin publicarlo en el host."
        },
        {
          "cmd": "    volumes: [\"datos:/var/lib/app\"]",
          "desc": "Monta un volumen o bind mount dentro del servicio."
        },
        {
          "cmd": "    networks: [app-net]",
          "desc": "Conecta el servicio a una o más redes declaradas."
        },
        {
          "cmd": "    depends_on:",
          "desc": "Expresa dependencias de inicio; no garantiza por sí solo que la aplicación dependiente ya esté lista."
        },
        {
          "cmd": "    restart: unless-stopped",
          "desc": "Define la política de reinicio del servicio."
        },
        {
          "cmd": "    healthcheck:",
          "desc": "Configura la prueba de salud del servicio."
        },
        {
          "cmd": "    profiles: [debug]",
          "desc": "Hace que el servicio se active solamente con el perfil indicado."
        },
        {
          "cmd": "volumes:",
          "desc": "Declara los volúmenes con nombre utilizados por el proyecto."
        },
        {
          "cmd": "networks:",
          "desc": "Declara las redes utilizadas por el proyecto."
        }
      ],
      "lang": "yaml",
      "nota": "Estos campos se escriben dentro de compose.yaml. El campo superior version se considera obsoleto y no es necesario."
    },
    {
      "id": "comandos-practicos-combinados",
      "titulo": "Comandos prácticos combinados",
      "items": [
        {
          "cmd": "docker container run -d --name web -p 8080:80 nginx:alpine",
          "desc": "Levanta Nginx en segundo plano y permite acceder desde http://localhost:8080.",
          "alias": "docker run -d --name web -p 8080:80 nginx:alpine"
        },
        {
          "cmd": "docker network create app-net",
          "desc": "Crea una red privada para que los contenedores se resuelvan por nombre."
        },
        {
          "cmd": "docker volume create postgres-data",
          "desc": "Crea un volumen administrado para conservar los datos de PostgreSQL."
        },
        {
          "cmd": "docker container run -d --name db --network app-net --network-alias postgres -v postgres-data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=<clave> postgres:17-alpine",
          "desc": "Levanta PostgreSQL con persistencia, contraseña, red y alias DNS.",
          "alias": "docker run -d --name db --network app-net --network-alias postgres -v postgres-data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=<clave> postgres:17-alpine"
        },
        {
          "cmd": "docker container run -d --name api --network app-net -p 127.0.0.1:3000:3000 -e DB_HOST=postgres <imagen-api>",
          "desc": "Levanta una API conectada a PostgreSQL y publica su puerto solamente en el equipo local.",
          "alias": "docker run -d --name api --network app-net -p 127.0.0.1:3000:3000 -e DB_HOST=postgres <imagen-api>"
        },
        {
          "cmd": "docker container run --rm -it -v \"${PWD}:/app\" -w /app node:22-alpine npm test",
          "desc": "Ejecuta pruebas de Node sobre la carpeta actual y elimina el contenedor al finalizar.",
          "alias": "docker run --rm -it -v \"${PWD}:/app\" -w /app node:22-alpine npm test"
        },
        {
          "cmd": "docker build -t mi-api:1.0 . && docker run --rm -p 127.0.0.1:3000:3000 mi-api:1.0",
          "desc": "Construye una imagen y, si la construcción termina correctamente, ejecuta un contenedor temporal."
        },
        {
          "cmd": "docker compose config && docker compose up -d --build",
          "desc": "Valida compose.yaml y, si es correcto, construye y levanta los servicios."
        },
        {
          "cmd": "docker compose logs -f --tail 100 <servicio>",
          "desc": "Sigue los últimos 100 registros del servicio para diagnosticar su inicio."
        },
        {
          "cmd": "docker compose down",
          "desc": "Detiene y elimina contenedores y redes del proyecto sin borrar los volúmenes con nombre."
        }
      ],
      "nota": "Ejemplos listos para adaptar. Reemplaza nombres, imágenes, puertos y contraseñas antes de ejecutarlos."
    },
    {
      "id": "glosario-de-terminos",
      "titulo": "Glosario de términos",
      "items": [
        {
          "term": "Docker",
          "def": "Plataforma para construir, distribuir y ejecutar aplicaciones en contenedores."
        },
        {
          "term": "Docker Engine",
          "def": "Conjunto formado por el daemon, la API y las herramientas que ejecutan y administran contenedores."
        },
        {
          "term": "Docker daemon (dockerd)",
          "def": "Servicio en segundo plano que administra imágenes, contenedores, redes y volúmenes."
        },
        {
          "term": "Docker CLI",
          "def": "Programa de terminal que envía comandos al Docker Engine."
        },
        {
          "term": "Host",
          "def": "Equipo o máquina virtual donde se ejecuta Docker."
        },
        {
          "term": "Imagen",
          "def": "Plantilla inmutable formada por capas que contiene la aplicación y sus dependencias."
        },
        {
          "term": "Contenedor",
          "def": "Instancia ejecutable y aislada creada a partir de una imagen."
        },
        {
          "term": "Capa",
          "def": "Cambio de solo lectura que forma parte de una imagen y puede reutilizarse entre construcciones."
        },
        {
          "term": "Caché de construcción",
          "def": "Resultado reutilizable de pasos anteriores que acelera docker build."
        },
        {
          "term": "Registro",
          "def": "Servicio que almacena y distribuye imágenes, como Docker Hub o un registro privado."
        },
        {
          "term": "Repositorio de imágenes",
          "def": "Colección de versiones relacionadas de una imagen dentro de un registro."
        },
        {
          "term": "Tag o etiqueta",
          "def": "Nombre de versión asociado a una imagen, por ejemplo postgres:17-alpine."
        },
        {
          "term": "Docker Hub",
          "def": "Registro público y servicio de distribución de imágenes administrado por Docker."
        },
        {
          "term": "Dockerfile",
          "def": "Archivo de instrucciones utilizado para construir una imagen."
        },
        {
          "term": ".dockerignore",
          "def": "Archivo que excluye rutas del contexto enviado al proceso de construcción."
        },
        {
          "term": "Contexto de construcción",
          "def": "Conjunto de archivos disponibles para COPY, ADD y el proceso de build."
        },
        {
          "term": "BuildKit",
          "def": "Motor moderno de construcción de imágenes utilizado por Docker."
        },
        {
          "term": "Buildx",
          "def": "Extensión de la CLI para usar BuildKit, builders avanzados y múltiples arquitecturas."
        },
        {
          "term": "Multi-stage build",
          "def": "Dockerfile con varias etapas que permite copiar solo el resultado necesario a la imagen final."
        },
        {
          "term": "Volumen",
          "def": "Almacenamiento persistente administrado por Docker e independiente del ciclo de vida del contenedor."
        },
        {
          "term": "Bind mount",
          "def": "Montaje que vincula una ruta específica del host con una ruta del contenedor."
        },
        {
          "term": "tmpfs",
          "def": "Montaje temporal almacenado en memoria y no persistente en disco."
        },
        {
          "term": "Red Docker",
          "def": "Red virtual que permite comunicación y resolución DNS entre contenedores."
        },
        {
          "term": "Mapeo de puertos",
          "def": "Asociación entre un puerto del host y un puerto del contenedor, por ejemplo 8080:80."
        },
        {
          "term": "Variable de entorno",
          "def": "Valor de configuración disponible para los procesos del contenedor."
        },
        {
          "term": "Docker Compose",
          "def": "Herramienta y especificación para definir y operar aplicaciones de varios contenedores."
        },
        {
          "term": "Proyecto Compose",
          "def": "Conjunto de servicios, redes y volúmenes administrados conjuntamente por Compose."
        },
        {
          "term": "Servicio Compose",
          "def": "Definición de cómo ejecutar uno o más contenedores con una misma configuración."
        },
        {
          "term": "Healthcheck",
          "def": "Prueba periódica que determina si la aplicación dentro del contenedor responde correctamente."
        },
        {
          "term": "Contenedor efímero",
          "def": "Contenedor diseñado para poder eliminarse y recrearse sin conservar estado interno importante."
        },
        {
          "term": "Orquestación",
          "def": "Automatización del despliegue, escalado, actualización y recuperación de contenedores."
        },
        {
          "term": "Docker Swarm",
          "def": "Orquestador integrado en Docker Engine para ejecutar servicios distribuidos en varios nodos."
        },
        {
          "term": "OCI",
          "def": "Estándares abiertos para formatos de imágenes y ejecución de contenedores."
        },
        {
          "term": "Alpine Linux",
          "def": "Distribución Linux pequeña usada con frecuencia como base de imágenes; no es un componente de Docker."
        },
        {
          "term": "Nginx",
          "def": "Servidor web y proxy inverso usado frecuentemente en contenedores; no es un componente de Docker."
        }
      ],
      "tipo": "glosario",
      "nota": "Glosario breve para reconocer rápidamente los términos usados en Docker y en esta chuleta."
    }
  ]
};
