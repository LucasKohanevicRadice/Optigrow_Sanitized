import { storage } from "../../lib/firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FIREBASE_STORAGE_FOLDER } from "../Consts/api/fireBaseStorage.js/consts";

export async function uploadImage(
  file,
  folder = FIREBASE_STORAGE_FOLDER,
  onProgress
) {
  const safeName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
  const storageRef = ref(storage, `${folder}/${safeName}`);
  const task = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => {
        if (onProgress) {
          const pct = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );
          onProgress(pct);
        }
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, path: task.snapshot.ref.fullPath });
      }
    );
  });
}
