export type AdminMediaKind = "product-image" | "product-video" | "banner-image";

export type UploadedAdminMedia = {
  kind: AdminMediaKind;
  url: string;
  publicId: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
};

type UploadAdminMediaInput = {
  apiBaseUrl: string;
  token: string;
  file: File;
  kind: AdminMediaKind;
};

type DeleteAdminMediaInput = {
  apiBaseUrl: string;
  token: string;
  publicId: string;
};

const readErrorMessage = async (response: Response) => {
  try {
    const payload = await response.json();
    return payload?.error || payload?.message || "Request failed";
  } catch {
    return "Request failed";
  }
};

export const uploadAdminMedia = async ({
  apiBaseUrl,
  token,
  file,
  kind,
}: UploadAdminMediaInput): Promise<UploadedAdminMedia> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("kind", kind);

  const response = await fetch(`${apiBaseUrl}/admin/media/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const payload = await response.json();
  if (!payload?.success || !payload?.data?.url) {
    throw new Error(payload?.error || "Failed to upload media");
  }

  return payload.data as UploadedAdminMedia;
};

export const deleteAdminMedia = async ({
  apiBaseUrl,
  token,
  publicId,
}: DeleteAdminMediaInput): Promise<void> => {
  const normalizedPublicId = publicId.trim();
  if (!normalizedPublicId) return;

  await fetch(`${apiBaseUrl}/admin/media/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ publicId: normalizedPublicId }),
  });
};
