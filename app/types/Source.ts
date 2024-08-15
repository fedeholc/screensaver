export {  SourceSchema };

import { z } from "zod";
export type Source = {
  id: string;
  url: string;
  name: string;
}

const SourceSchema = z.object({
  id: z.string(),
  url: z.string(),
  name: z.string(),
});

