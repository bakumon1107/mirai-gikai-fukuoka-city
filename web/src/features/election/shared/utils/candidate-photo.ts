const PHOTO_CLASSES = [
  "bg-candidate-photo-1",
  "bg-candidate-photo-2",
  "bg-candidate-photo-3",
  "bg-candidate-photo-4",
];

/**
 * 顔写真プレースホルダーの配色クラス。
 * 表明順（0始まり）で4色を循環させる。実画像が入るまでの暫定表示。
 */
export function getCandidatePhotoClass(index: number): string {
  const normalized =
    ((index % PHOTO_CLASSES.length) + PHOTO_CLASSES.length) %
    PHOTO_CLASSES.length;
  return PHOTO_CLASSES[normalized];
}

/** プレースホルダーに表示する頭文字（姓の1文字目） */
export function getCandidateInitial(name: string): string {
  return name.trim().charAt(0);
}
