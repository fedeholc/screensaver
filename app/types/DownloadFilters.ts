export { DownloadFiltersSchema };

import { z } from "zod";

export type DownloadFilters = {
  subPageMustInclude: string;
  imgMustInclude: string;
  minImageWidth: number;
  minImageHeight: number;
}

const DownloadFiltersSchema = z.object({
  minImageWidth: z.number(),
  minImageHeight: z.number(),
  imgMustInclude: z.string(),
  subPageMustInclude: z.string(),
});
