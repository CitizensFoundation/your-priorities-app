export class LiveWorkflowApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}
export class LiveWorkflowApi {
  constructor(readonly groupId: number) {}
  get base() {
    return `/api/live-workflows/groups/${this.groupId}`;
  }
  async request<T>(route = "", method = "GET", body?: unknown): Promise<T> {
    const response = await fetch(`${this.base}${route}`, {
      method,
      credentials: "same-origin",
      headers: body === undefined ? {} : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const result = (await response
      .json()
      .catch(() => ({ error: `Request failed (${response.status})` }))) as T & {
      error?: string;
    };
    if (!response.ok)
      throw new LiveWorkflowApiError(
        result.error ?? "Workflow request failed",
        response.status,
      );
    return result;
  }
  async upload(
    file: File,
    onProgress: (fraction: number) => void,
  ): Promise<YpWorkflowAsset> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${this.base}/assets`);
      xhr.setRequestHeader("content-type", "application/octet-stream");
      xhr.setRequestHeader("x-file-name", encodeURIComponent(file.name));
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) onProgress(event.loaded / event.total);
      };
      xhr.onerror = () => reject(new Error("Upload connection failed"));
      xhr.onabort = () => reject(new Error("Upload cancelled"));
      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText) as YpWorkflowAsset & {
            error?: string;
          };
          if (xhr.status >= 400)
            reject(new Error(data.error ?? "Upload failed"));
          else resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      xhr.send(file);
    });
  }
}
export function dollars(micros: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(micros / 1_000_000);
}
