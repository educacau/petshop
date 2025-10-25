const resolveApiUrl = () => {
  const raw = import.meta.env.VITE_API_URL;

  if (!raw) {
    return '/api';
  }

  if (typeof window === 'undefined') {
    return raw;
  }

  try {
    const url = new URL(raw, window.location.origin);

    if (url.hostname === 'backend') {
      url.hostname = window.location.hostname;
      if (!url.port) {
        url.port = '3000';
      }

      if (window.location.protocol === 'https:') {
        url.protocol = 'https:';
      }

      return url.toString();
    }

    return url.toString();
  } catch (error) {
    console.warn('[env] Unable to parse VITE_API_URL, falling back to /api', error);
    return '/api';
  }
};

export const env = {
  apiUrl: resolveApiUrl()
};
