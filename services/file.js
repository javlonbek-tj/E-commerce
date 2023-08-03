import fs from 'fs';

function deleteFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function deleteFiles(files) {
  try {
    const unlinkPromises = files.map(filePath => deleteFile(filePath));
    await Promise.all(unlinkPromises);
  } catch (err) {
    throw err;
  }
}

export function deleteImage(imageUrl) {
  if (imageUrl.length >= 2) {
    deleteFiles(imageUrl);
  } else {
    deleteFile(imageUrl[0]);
  }
}

export function getImageUrl(images) {
  const imageUrl = [];

  for (let i = 1; i <= 3; i++) {
    const imageKey = `image${i}`;
    if (images[imageKey]) {
      imageUrl.push(images[imageKey][0].path);
    }
  }

  return imageUrl;
}

export function deleteImageIfError(imageUrl) {
  if (imageUrl.length >= 2) {
    deleteFiles(imageUrl);
  } else {
    deleteFile(imageUrl[0]);
  }
}
