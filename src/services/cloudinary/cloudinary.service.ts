import { Readable } from "stream";

import type {
  UploadApiErrorResponse,
  UploadApiResponse,
  UploadApiOptions,
} from "cloudinary";

import { cloudinary } from "../../config/cloudinary";

export type CloudinaryResourceType =
  | "image"
  | "video"
  | "raw";

/* ---------------------------------------------
   FILE NAME HELPERS
--------------------------------------------- */

const sanitizeFileName = (fileName: string) => {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const getExtension = (fileName: string) => {
  const match = fileName.match(/\.([^.]+)$/);

  return match ? match[1].toLowerCase() : "";
};

/* ---------------------------------------------
   RESOURCE TYPE
--------------------------------------------- */

export const getCloudinaryResourceType = (
  mimetype: string,
): CloudinaryResourceType => {
  if (mimetype.startsWith("image/")) {
    return "image";
  }

  if (mimetype.startsWith("video/")) {
    return "video";
  }

  return "raw";
};

/* ---------------------------------------------
   UPLOAD
--------------------------------------------- */

export const uploadFileToCloudinary = async (
  buffer: Buffer,
  originalName: string,
  mimetype: string,
): Promise<UploadApiResponse> => {
  const resourceType =
    getCloudinaryResourceType(mimetype);

  const sanitizedName =
    sanitizeFileName(originalName) || "file";

  const extension = getExtension(originalName);

  const uniqueName =
    `${Date.now()}-${sanitizedName}`;

  /*
   * Cloudinary:
   * - image/video public IDs should NOT contain extensions
   * - raw public IDs MUST contain the extension
   */

  const publicId =
    resourceType === "raw" && extension
      ? `nbca/files/${uniqueName}.${extension}`
      : `nbca/files/${uniqueName}`;

  const options: UploadApiOptions = {
    resource_type: resourceType,
    public_id: publicId,
    overwrite: false,
  };

  return new Promise(
    (
      resolve,
      reject,
    ) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          options,
          (
            error:
              | UploadApiErrorResponse
              | undefined,
            result:
              | UploadApiResponse
              | undefined,
          ) => {
            if (error) {
              reject(error);
              return;
            }

            if (!result) {
              reject(
                new Error(
                  "Cloudinary upload returned no result",
                ),
              );
              return;
            }

            resolve(result);
          },
        );

      Readable.from(buffer).pipe(
        uploadStream,
      );
    },
  );
};

/* ---------------------------------------------
   DELETE USING PUBLIC ID
--------------------------------------------- */

export const deleteFileFromCloudinary =
  async (
    publicId: string,
    resourceType: CloudinaryResourceType = "raw",
  ) => {
    return cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: resourceType,
        invalidate: true,
      },
    );
  };

/* ---------------------------------------------
   EXTRACT CLOUDINARY INFORMATION FROM URL
--------------------------------------------- */

export const getCloudinaryFileInfo = (
  fileUrl: string,
): {
  publicId: string;
  resourceType: CloudinaryResourceType;
} | null => {
  try {
    const url = new URL(fileUrl);

    /*
     * Expected Cloudinary URL:
     *
     * https://res.cloudinary.com/CLOUD_NAME/
     * image/upload/v123456/nbca/files/file.jpg
     *
     * or
     *
     * https://res.cloudinary.com/CLOUD_NAME/
     * raw/upload/v123456/nbca/files/file.pdf
     */

    const pathParts = url.pathname
      .split("/")
      .filter(Boolean);

    const resourceTypeIndex =
      pathParts.findIndex(
        (part) =>
          part === "image" ||
          part === "video" ||
          part === "raw",
      );

    if (resourceTypeIndex === -1) {
      return null;
    }

    const resourceType =
      pathParts[
        resourceTypeIndex
      ] as CloudinaryResourceType;

    /*
     * Find the "upload" segment.
     */

    const uploadIndex =
      pathParts.findIndex(
        (part, index) =>
          index > resourceTypeIndex &&
          part === "upload",
      );

    if (uploadIndex === -1) {
      return null;
    }

    /*
     * Everything after upload contains:
     *
     * version/
     * public_id
     *
     * The version normally starts with "v"
     * followed by numbers.
     */

    let publicIdParts =
      pathParts.slice(uploadIndex + 1);

    if (
      publicIdParts.length > 0 &&
      /^v\d+$/.test(publicIdParts[0])
    ) {
      publicIdParts =
        publicIdParts.slice(1);
    }

    if (publicIdParts.length === 0) {
      return null;
    }

    let publicId =
      publicIdParts.join("/");

    /*
     * For image/video assets Cloudinary public IDs
     * do not contain the file extension.
     *
     * Raw assets DO contain the extension.
     */

    if (
      resourceType === "image" ||
      resourceType === "video"
    ) {
      publicId =
        publicId.replace(
          /\.[^/.]+$/,
          "",
        );
    }

    return {
      publicId,
      resourceType,
    };
  } catch (error) {
    console.error(
      "Failed to parse Cloudinary URL:",
      error,
    );

    return null;
  }
};

/* ---------------------------------------------
   DELETE USING CLOUDINARY URL
--------------------------------------------- */

export const deleteFileFromCloudinaryByUrl =
  async (
    fileUrl: string,
  ) => {
    const fileInfo =
      getCloudinaryFileInfo(fileUrl);

    /*
     * If this isn't a Cloudinary URL,
     * don't attempt deletion.
     */

    if (!fileInfo) {
      return {
        success: false,
        skipped: true,
        message:
          "Not a valid Cloudinary file URL",
      };
    }

    const result =
      await deleteFileFromCloudinary(
        fileInfo.publicId,
        fileInfo.resourceType,
      );

    return {
      success: true,
      skipped: false,
      publicId: fileInfo.publicId,
      resourceType:
        fileInfo.resourceType,
      result,
    };
  };