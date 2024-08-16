import type { Image } from "@/app/types/db/Image";

export { getAlbumImages, getRandomAlbum };

async function getRandomAlbum(): Promise<Image[]> {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch("/api/randomalbum");
      let album = await response.json();
      console.log("get album id", album[0].id);
      let Images = await getAlbumImages(album[0].id);
      resolve(Images);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
}

async function getAlbumImages(albumId: string): Promise<Image[]> {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch("/api/album/" + albumId);
      let Images: Image[] = await response.json();

      if (Images.length > 0) {
        resolve(Images);
      } else {
        reject(new Error("No images found for album " + albumId));
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
}
