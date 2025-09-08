export interface ImageFile {
  file: File;
  preview: string;
}

export interface GeneratedResult {
  image: string | null;
  text: string | null;
}