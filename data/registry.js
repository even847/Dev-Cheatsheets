// Registro de herramientas. Para agregar una nueva:
//   1) crea data/<id>.js con el mismo formato que data/docker.js
//   2) agrega una entrada aquí (estado: 'listo'). Nada más.
window.REGISTRY = [
  {
    id: 'docker',
    nombre: 'Docker',
    descripcion: 'Contenedores, imágenes, redes, volúmenes, Compose y Dockerfile.',
    color: '#2496ed',
    estado: 'listo'
  },
  {
    id: 'kubernetes',
    nombre: 'Kubernetes',
    descripcion: 'kubectl, pods, deployments, services y manifiestos.',
    color: '#326ce5',
    estado: 'listo'
  },
  {
    id: 'git',
    nombre: 'Git',
    descripcion: 'Commits, ramas, merge, rebase, stash y remotos.',
    color: '#f05032',
    estado: 'listo'
  },
  {
    id: 'scoop',
    nombre: 'Scoop',
    descripcion: 'Instalar y mantener herramientas en Windows desde la terminal.',
    color: '#e8a33d',
    estado: 'listo'
  },
  {
    id: 'maven',
    nombre: 'Maven',
    descripcion: 'Ciclo de vida, dependencias, perfiles y plugins.',
    color: '#c71a36',
    estado: 'listo'
  },
  {
    id: 'node',
    nombre: 'Node.js',
    descripcion: 'nvm, node y npm: versiones, paquetes y scripts.',
    color: '#5fa04e',
    estado: 'listo'
  },
  {
    id: 'powershell',
    nombre: 'PowerShell',
    descripcion: 'Archivos, procesos, red y variables de entorno en Windows.',
    color: '#2671be',
    estado: 'listo'
  }
];
