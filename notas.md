pasar id de imagen a string que sea album+nro, para poder crear una entidad que sea playlist, y tenga una lista de imagenes.
//TODO: ya cambie lo del id en image downloader, ahora hay que hacer el cambio aca

------------------------
custom scrollbars https://claude.ai/chat/8b5b2a3a-7a32-4f4f-a52d-d4b25feeed7f

tablas:

Album

- id
- nombre
- descripcion
- imagen
- fecha creacion

Autor

- id
- nombre
- descripcion
- imagen

Imagenes

- id
- url
- autor_id
- album_id
- descripcion
- fuente
