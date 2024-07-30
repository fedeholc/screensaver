- Ojo, si en la página principal el contenedor/main es flex row o column afecta a si la imagen toma el 100% de la altura o ancho

- Por otra parte, conviene que sea imagen o el background el que cambia?

- Probé poniendo el componente Slides (el que muestra las imagenes) como hermano de los que tiene las listas de albumes, todos en la pág principa, y mandado al de slides al fondo con posición absoluta y zindex. No sé si sería mejor como componente padre de los otros pero creo que para evitar re-renders es mejor así.