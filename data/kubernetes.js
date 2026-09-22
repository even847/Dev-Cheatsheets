// Guía de Kubernetes (kubectl).
// Campos opcionales por entrada: desc, ej (salida de ejemplo), alias, tip (consejo), warn (precaución).
// Campos opcionales por sección: intro (texto que explica la sección), nota, tipo: 'pasos' | 'glosario'.
window.CHEATSHEETS = window.CHEATSHEETS || {};
window.CHEATSHEETS.kubernetes = {
  meta: { id: 'kubernetes', nombre: 'Kubernetes', subtitulo: 'kubectl, pods, deployments, services y manifiestos' },
  secciones: [
    {
      id: 'empezar-de-cero',
      titulo: 'Empezar de cero',
      tipo: 'pasos',
      intro: 'Sigue estos pasos en orden, en PowerShell. Cada paso indica qué deberías ver si salió bien.',
      items: [
        {
          cmd: 'winget install -e --id Kubernetes.kubectl',
          desc: 'Instala kubectl, el cliente de línea de comandos para hablar con un cluster de Kubernetes.',
          tip: 'Si usas Docker Desktop con Kubernetes habilitado, kubectl ya viene incluido.'
        },
        {
          cmd: 'kubectl version --client',
          desc: 'Confirma que kubectl quedó instalado y qué versión es.',
          ej: 'Client Version: v1.31.0'
        },
        {
          cmd: 'kubectl cluster-info',
          desc: 'Confirma que kubectl puede conectarse a un cluster y muestra las URLs del control plane.'
        },
        {
          cmd: 'kubectl config current-context',
          desc: 'Muestra a qué cluster y usuario apunta kubectl en este momento.'
        },
        {
          cmd: 'kubectl get nodes',
          desc: 'Lista los nodos del cluster; confirma que hay al menos uno en estado Ready.'
        },
        {
          cmd: 'kubectl create namespace <namespace>',
          desc: 'Crea un namespace propio para no mezclar tus pruebas con otros recursos del cluster.'
        },
        {
          cmd: 'kubectl apply -f <archivo.yaml>',
          desc: 'Crea o actualiza los recursos declarados en un manifiesto YAML.'
        },
        {
          cmd: 'kubectl get pods',
          desc: 'Lista los pods del namespace actual y su estado.',
          ej: 'NAME                     READY   STATUS    RESTARTS   AGE\nmi-app-6f9d8c7b8-abcde   1/1     Running   0          12s'
        }
      ]
    },
    {
      id: 'contexto-y-configuracion',
      titulo: 'Contexto y configuración',
      intro: 'El kubeconfig (por defecto ~/.kube/config) guarda clusters, usuarios y contextos; kubectl siempre opera contra el contexto activo.',
      items: [
        { cmd: 'kubectl config get-contexts', desc: 'Lista todos los contextos (cluster + usuario + namespace) disponibles en el kubeconfig.' },
        { cmd: 'kubectl config use-context <contexto>', desc: 'Cambia el contexto activo, es decir, a qué cluster apuntan los siguientes comandos.' },
        { cmd: 'kubectl config current-context', desc: 'Muestra el contexto activo.' },
        { cmd: 'kubectl config set-context --current --namespace=<namespace>', desc: 'Cambia el namespace por defecto del contexto activo, para no repetir -n en cada comando.' },
        { cmd: 'kubectl config view', desc: 'Muestra el contenido completo del kubeconfig activo (clusters, usuarios, contextos).' },
        { cmd: 'kubectl config view --minify', desc: 'Muestra solo la configuración del contexto activo, sin el resto de clusters y usuarios.' }
      ]
    },
    {
      id: 'pods',
      titulo: 'Pods',
      items: [
        { cmd: 'kubectl get pods', desc: 'Lista los pods del namespace actual.' },
        { cmd: 'kubectl get pods -A', desc: 'Lista los pods de todos los namespaces.', alias: 'kubectl get pods --all-namespaces' },
        { cmd: 'kubectl get pods -o wide', desc: 'Agrega columnas extra: IP del pod, nodo donde corre, etc.' },
        { cmd: 'kubectl describe pod <pod>', desc: 'Muestra el detalle completo del pod: contenedores, eventos, volúmenes y por qué no arrancó si falló.' },
        { cmd: 'kubectl logs <pod>', desc: 'Muestra los logs del contenedor principal del pod.' },
        { cmd: 'kubectl logs -f <pod>', desc: 'Sigue los logs en tiempo real.' },
        { cmd: 'kubectl logs <pod> -c <contenedor>', desc: 'Muestra los logs de un contenedor específico cuando el pod tiene más de uno.' },
        { cmd: 'kubectl exec -it <pod> -- sh', desc: 'Abre una shell interactiva dentro del contenedor principal del pod.' },
        { cmd: 'kubectl port-forward <pod> 8080:80', desc: 'Redirige el puerto 80 del pod al 8080 de tu máquina, para probarlo sin exponerlo con un Service.' },
        { cmd: 'kubectl delete pod <pod>', desc: 'Elimina un pod.', warn: 'Si el pod pertenece a un Deployment o ReplicaSet, Kubernetes crea uno nuevo automáticamente para reemplazarlo.' }
      ]
    },
    {
      id: 'deployments',
      titulo: 'Deployments',
      items: [
        { cmd: 'kubectl create deployment <nombre> --image=<imagen>', desc: 'Crea un Deployment nuevo, que a su vez crea un ReplicaSet y los pods necesarios.' },
        { cmd: 'kubectl get deployments', desc: 'Lista los Deployments del namespace actual.', alias: 'kubectl get deploy' },
        { cmd: 'kubectl scale deployment <nombre> --replicas=<n>', desc: 'Cambia la cantidad de réplicas (pods) que el Deployment debe mantener.' },
        { cmd: 'kubectl set image deployment/<nombre> <contenedor>=<imagen>:<tag>', desc: 'Actualiza la imagen de un contenedor del Deployment, disparando un rollout progresivo.' },
        { cmd: 'kubectl rollout status deployment/<nombre>', desc: 'Muestra el progreso de un despliegue en curso.' },
        { cmd: 'kubectl rollout history deployment/<nombre>', desc: 'Lista las revisiones anteriores del Deployment.' },
        { cmd: 'kubectl rollout undo deployment/<nombre>', desc: 'Revierte el Deployment a la revisión anterior.' },
        { cmd: 'kubectl delete deployment <nombre>', desc: 'Elimina el Deployment junto con su ReplicaSet y sus pods.' }
      ]
    },
    {
      id: 'services',
      titulo: 'Services',
      items: [
        { cmd: 'kubectl expose deployment <nombre> --port=80 --target-port=8080', desc: 'Crea un Service que expone el Deployment y distribuye tráfico entre sus pods.' },
        { cmd: 'kubectl get svc', desc: 'Lista los Services del namespace actual.', alias: 'kubectl get services' },
        { cmd: 'kubectl describe svc <servicio>', desc: 'Muestra el detalle del Service: tipo, IP, puertos y a qué pods apunta (selector).' },
        { cmd: 'kubectl expose deployment <nombre> --type=NodePort --port=80', desc: 'Crea un Service de tipo NodePort, accesible desde fuera del cluster en un puerto del nodo.' },
        { cmd: 'kubectl expose deployment <nombre> --type=LoadBalancer --port=80', desc: 'Crea un Service de tipo LoadBalancer; en un proveedor cloud aprovisiona un balanceador externo.' },
        { cmd: 'kubectl delete svc <servicio>', desc: 'Elimina un Service.' }
      ]
    },
    {
      id: 'configmaps-y-secrets',
      titulo: 'ConfigMaps y Secrets',
      items: [
        { cmd: 'kubectl create configmap <nombre> --from-literal=<clave>=<valor>', desc: 'Crea un ConfigMap con un valor puntual, para configuración no sensible.' },
        { cmd: 'kubectl create configmap <nombre> --from-file=<archivo>', desc: 'Crea un ConfigMap a partir del contenido de un archivo.' },
        { cmd: 'kubectl get configmaps', desc: 'Lista los ConfigMaps del namespace actual.', alias: 'kubectl get cm' },
        { cmd: 'kubectl create secret generic <nombre> --from-literal=<clave>=<valor>', desc: 'Crea un Secret con un valor puntual (contraseñas, tokens), guardado codificado en base64.', warn: 'base64 no es cifrado: cualquiera con acceso de lectura al Secret puede decodificarlo.' },
        { cmd: 'kubectl get secrets', desc: 'Lista los Secrets del namespace actual.' },
        { cmd: 'kubectl describe secret <nombre>', desc: 'Muestra los metadatos del Secret sin revelar su contenido en texto plano.' }
      ]
    },
    {
      id: 'manifiestos-y-apply',
      titulo: 'Manifiestos y apply',
      intro: 'La forma declarativa de trabajar: describes el estado deseado en YAML y Kubernetes se encarga de aplicarlo.',
      items: [
        { cmd: 'kubectl apply -f <archivo.yaml>', desc: 'Crea o actualiza los recursos definidos en el archivo, según lo que ya exista en el cluster.' },
        { cmd: 'kubectl apply -f <carpeta>/', desc: 'Aplica todos los manifiestos YAML de una carpeta en un solo comando.' },
        { cmd: 'kubectl diff -f <archivo.yaml>', desc: 'Muestra qué cambiaría en el cluster si aplicaras el archivo, sin aplicarlo todavía.' },
        { cmd: 'kubectl delete -f <archivo.yaml>', desc: 'Elimina los recursos definidos en el archivo.' },
        { cmd: 'kubectl explain <recurso>', desc: 'Muestra la documentación y los campos disponibles de un tipo de recurso, directamente desde el cluster.', ej: 'kubectl explain deployment.spec.replicas' },
        { cmd: 'kubectl get <recurso> -o yaml', desc: 'Exporta la definición completa de un recurso ya existente en formato YAML.' }
      ]
    },
    {
      id: 'namespaces-y-recursos-generales',
      titulo: 'Namespaces y recursos generales',
      items: [
        { cmd: 'kubectl get namespaces', desc: 'Lista los namespaces del cluster.', alias: 'kubectl get ns' },
        { cmd: 'kubectl create namespace <namespace>', desc: 'Crea un namespace nuevo.' },
        { cmd: 'kubectl get all -n <namespace>', desc: 'Lista los recursos principales (pods, deployments, services, etc.) de un namespace.' },
        { cmd: 'kubectl describe node <nodo>', desc: 'Muestra el detalle de un nodo: capacidad, recursos asignados y condiciones.' },
        { cmd: 'kubectl top pod', desc: 'Muestra el consumo de CPU y memoria de los pods.', warn: 'Requiere metrics-server instalado en el cluster; sin él, el comando falla.' },
        { cmd: 'kubectl top node', desc: 'Muestra el consumo de CPU y memoria de los nodos.', warn: 'También requiere metrics-server.' }
      ]
    },
    {
      id: 'depuracion',
      titulo: 'Depuración',
      items: [
        { cmd: 'kubectl get events --sort-by=.lastTimestamp', desc: 'Lista los eventos recientes del namespace, ordenados por fecha; primer lugar para ver por qué algo no arrancó.' },
        { cmd: 'kubectl describe pod <pod>', desc: 'Su sección Events explica fallos de scheduling, imágenes que no se pudieron descargar o healthchecks fallidos.' },
        { cmd: 'kubectl logs <pod> --previous', desc: 'Muestra los logs del contenedor anterior, cuando el pod se reinició (por ejemplo, en CrashLoopBackOff).' },
        { cmd: 'kubectl exec -it <pod> -- sh', desc: 'Entra al contenedor para inspeccionar archivos, variables de entorno o conectividad de red desde adentro.' },
        { cmd: 'kubectl cp <pod>:/ruta ./destino', desc: 'Copia archivos desde un pod al equipo local.' },
        { cmd: 'kubectl get pod <pod> -o jsonpath="{.status.phase}"', desc: 'Extrae un campo puntual del estado del pod sin tener que leer todo el YAML.' }
      ]
    },
    {
      id: 'comandos-practicos-combinados',
      titulo: 'Comandos prácticos combinados',
      items: [
        { cmd: 'kubectl create deployment mi-app --image=nginx:alpine && kubectl expose deployment mi-app --port=80', desc: 'Despliega una imagen y la expone con un Service en dos pasos.' },
        { cmd: 'kubectl apply -f k8s/ && kubectl rollout status deployment/mi-app', desc: 'Aplica todos los manifiestos de una carpeta y espera a que el despliegue termine.' },
        { cmd: 'kubectl logs -f -l app=<nombre>', desc: 'Sigue los logs de todos los pods que coincidan con una etiqueta, sin buscar el nombre exacto del pod.' },
        { cmd: 'kubectl get pods -w', desc: 'Observa en vivo los cambios de estado de los pods (creaciones, reinicios, terminaciones).' },
        { cmd: 'kubectl rollout undo deployment/<nombre> && kubectl rollout status deployment/<nombre>', desc: 'Revierte un despliegue problemático y espera a que el rollback termine.' }
      ],
      nota: 'Ejemplos listos para adaptar. Reemplaza nombres, imágenes y namespaces antes de ejecutarlos.'
    },
    {
      id: 'problemas-comunes-en-windows',
      titulo: 'Problemas comunes en Windows',
      intro: 'Los errores que más aparecen al trabajar con kubectl en Windows, y qué ejecutar para resolverlos.',
      items: [
        {
          cmd: 'winget install -e --id Kubernetes.kubectl',
          desc: 'Instala o repara kubectl cuando el comando no se reconoce en PowerShell.',
          alias: 'scoop install kubectl'
        },
        {
          cmd: '$env:KUBECONFIG',
          desc: 'Muestra qué archivo de configuración está usando kubectl. Si sale vacío, usa el valor por defecto: $HOME\\.kube\\config.'
        },
        {
          cmd: "kubectl get pods -o jsonpath='{.items[0].metadata.name}'",
          desc: 'En PowerShell, usa comillas simples para envolver expresiones jsonpath con llaves; con comillas dobles suelen romperse por cómo PowerShell interpreta los caracteres especiales.',
          tip: 'Si necesitas comillas dentro de la expresión, usa el operador --% para desactivar el parseo de PowerShell sobre el resto del comando.'
        },
        {
          cmd: 'kubectl config use-context docker-desktop',
          desc: 'Si usas Docker Desktop con Kubernetes habilitado, este es el contexto local que crea automáticamente.'
        },
        {
          cmd: 'wsl --status',
          desc: 'Confirma que WSL2 está activo; Docker Desktop y Kubernetes local dependen de él en Windows.'
        }
      ]
    },
    {
      id: 'glosario-de-terminos',
      titulo: 'Glosario de términos',
      tipo: 'glosario',
      items: [
        { term: 'Pod', def: 'La unidad mínima desplegable en Kubernetes: uno o más contenedores que comparten red y almacenamiento.' },
        { term: 'Deployment', def: 'Controlador que declara cuántas réplicas de un pod deben existir y gestiona sus actualizaciones progresivas (rollouts).' },
        { term: 'ReplicaSet', def: 'Objeto que garantiza que un número fijo de réplicas de un pod estén corriendo; normalmente lo gestiona un Deployment, no se crea a mano.' },
        { term: 'Service', def: 'Recurso que expone un conjunto de pods bajo una IP y nombre DNS estables, balanceando el tráfico entre ellos.' },
        { term: 'Namespace', def: 'Partición lógica del cluster para agrupar y aislar recursos entre equipos o entornos.' },
        { term: 'ConfigMap', def: 'Objeto que guarda configuración no sensible como pares clave-valor, consumible por los pods como variables de entorno o archivos.' },
        { term: 'Secret', def: 'Objeto similar a un ConfigMap pero pensado para datos sensibles; se guarda codificado en base64, no cifrado.' },
        { term: 'Nodo', def: 'Máquina (física o virtual) del cluster donde corren los pods.' },
        { term: 'kubelet', def: 'Agente que corre en cada nodo y se asegura de que los contenedores descritos en los pods estén corriendo.' },
        { term: 'Manifiesto', def: 'Archivo YAML o JSON que declara el estado deseado de uno o más recursos de Kubernetes.' },
        { term: 'kubeconfig', def: 'Archivo que guarda clusters, usuarios y contextos que kubectl puede usar para conectarse; por defecto en ~/.kube/config.' },
        { term: 'Contexto', def: 'Combinación de cluster, usuario y namespace que kubectl usa para saber a dónde y cómo conectarse.' },
        { term: 'Control plane', def: 'Conjunto de componentes que administran el estado del cluster (API server, scheduler, controller manager, etcd).' },
        { term: 'Rollout', def: 'Proceso de actualizar gradualmente los pods de un Deployment a una nueva versión, sin causar downtime.' }
      ]
    }
  ]
};
