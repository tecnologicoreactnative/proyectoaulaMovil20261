// Hook helper for uploading images to Cloudinary
// Supports:
// - base64 string (raw or data URI)
// - React Native file object: { uri, name, type }
// - remote URL (will be sent as-is to Cloudinary)
// Options:
// { cloudName, uploadPreset, folder, tags, public_id, timeout, retries, onProgress, extra }
// Example:
// const res = await uploadToCloudinary(file, { cloudName: 'demo', uploadPreset: 'unsigned_preset', onProgress: p=>console.log(p) })

export default function uploadToCloudinary(input, options = {}) {
  const {
    cloudName = "",
    uploadPreset = "",
    folder,
    tags,
    public_id,
    timeout = 60000,
    retries = 0,
    onProgress,
    extra = {},
  } = options;

  if (!cloudName) {
    return Promise.reject(
      new Error("Cloudinary config missing: provide cloudName in options"),
    );
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  function buildFormData() {
    const form = new FormData();

    // Upload preset (unsigned) if provided
    if (uploadPreset) form.append("upload_preset", uploadPreset);

    if (folder) form.append("folder", folder);
    if (tags) form.append("tags", Array.isArray(tags) ? tags.join(",") : tags);
    if (public_id) form.append("public_id", public_id);

    // attach any extra fields
    Object.keys(extra || {}).forEach((key) => {
      const val = extra[key];
      if (val !== undefined && val !== null) form.append(key, String(val));
    });

    // handle different input types
    if (!input) throw new Error("No input provided to uploadToCloudinary");

    // If input is an object with uri (React Native file)
    if (typeof input === "object" && input.uri) {
      // In React Native FormData, append the { uri, name, type }
      const name =
        input.name ||
        "photo." + (input.type ? input.type.split("/").pop() : "jpg");
      const type = input.type || "image/jpeg";
      form.append("file", { uri: input.uri, name, type });
    } else if (typeof input === "string") {
      const trimmed = input.trim();
      // data URI
      if (/^data:\w+\/[a-zA-Z+.-]+;base64,/.test(trimmed)) {
        form.append("file", trimmed);
      } else if (/^[A-Za-z0-9+/=\s]+$/.test(trimmed) && trimmed.length > 100) {
        // likely raw base64 (heuristic): wrap as data URI
        const cleaned = trimmed.replace(/\s+/g, "");
        form.append("file", `data:image/jpeg;base64,${cleaned}`);
      } else {
        // assume remote URL
        form.append("file", trimmed);
      }
    } else {
      throw new Error("Unsupported input type for uploadToCloudinary");
    }

    return form;
  }

  function sendWithXHR(form, timeoutMs) {
    return new Promise((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();
        let timedOut = false;

        const timer = setTimeout(() => {
          timedOut = true;
          try {
            xhr.abort();
          } catch (e) {}
          reject(new Error("Cloudinary upload timed out"));
        }, timeoutMs || timeout);

        xhr.open("POST", url);

        xhr.onload = () => {
          clearTimeout(timer);
          if (timedOut) return;
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const json = JSON.parse(xhr.responseText);
              resolve(json);
            } catch (e) {
              reject(new Error("Invalid JSON response from Cloudinary"));
            }
          } else {
            reject(
              new Error(
                `Cloudinary upload failed: ${xhr.status} ${xhr.responseText}`,
              ),
            );
          }
        };

        xhr.onerror = () => {
          clearTimeout(timer);
          if (timedOut) return;
          reject(new Error("Network error during Cloudinary upload"));
        };

        if (xhr.upload && typeof onProgress === "function") {
          xhr.upload.onprogress = (ev) => {
            if (ev.lengthComputable) {
              const percent = Math.round((ev.loaded / ev.total) * 100);
              try {
                onProgress(percent, ev);
              } catch (e) {}
            }
          };
        }

        xhr.send(form);
      } catch (err) {
        reject(err);
      }
    });
  }

  async function sendWithFetch(form, timeoutMs) {
    const controller =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    const signal = controller ? controller.signal : undefined;

    const timer = controller
      ? setTimeout(() => controller.abort(), timeoutMs || timeout)
      : null;

    try {
      const res = await fetch(url, { method: "POST", body: form, signal });
      if (timer) clearTimeout(timer);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
      }
      return await res.json();
    } catch (err) {
      if (err.name === "AbortError")
        throw new Error("Cloudinary upload timed out");
      throw err;
    }
  }

  // retry loop
  return (async () => {
    const form = buildFormData();
    let attempt = 0;
    let lastErr = null;
    while (attempt <= retries) {
      try {
        // Prefer XHR when available so we can report progress
        if (typeof XMLHttpRequest !== "undefined") {
          return await sendWithXHR(form, timeout);
        } else {
          return await sendWithFetch(form, timeout);
        }
      } catch (err) {
        lastErr = err;
        attempt += 1;
        if (attempt > retries) break;
        // exponential backoff
        const backoff = 500 * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, backoff));
      }
    }
    throw lastErr || new Error("Cloudinary upload failed");
  })();
}
