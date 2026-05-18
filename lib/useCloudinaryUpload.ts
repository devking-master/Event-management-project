import { useState } from "react";

interface UploadOptions {
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
}

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = async (
    file: File,
    options?: UploadOptions
  ): Promise<string | null> => {
    if (!file) return null;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default");
      formData.append("folder", "eventflow");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      options?.onError?.(message);
      console.error("Cloudinary upload error:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
