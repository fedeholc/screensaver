export { AlbumFields, AlbumSchema };
export type { Album };

import { z } from 'zod';

const AlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  dateCreated: z.string(),
});

enum AlbumFields {
  id = "id",
  name = "nombre",
  description = "description",
  image = "image",
  dateCreated = "dateCreated",
}

type Album = {
  id: string;
  name: string;
  description: string;
  image: string;
  dateCreated: string;
};
