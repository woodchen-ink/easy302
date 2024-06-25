// 从外部 URL 获取 JSON 文件的函数
async function fetchRedirects() {
  const url = 'https://l-file.czl.net/url.json';
  try {
    const response = await fetch(url);
    if (response.status === 404) {
      console.warn('Redirects file not found. Using empty redirects.');
      return {};
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch redirects:', error);
    return null;
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname.slice(1);

  // 检查是否请求状态页面
  if (path === 'status') {
    return handleStatusRequest();
  }

  const redirects = await fetchRedirects();

  if (redirects === null) {
    return new Response('Internal Server Error', { status: 500 });
  }

  if (Object.keys(redirects).length === 0) {
    return new Response('Not Found', { status: 404 });
  }

  if (redirects.hasOwnProperty(path)) {
    return Response.redirect(redirects[path], 302);
  } else {
    return new Response('Not Found', { status: 404 });
  }
}

async function handleStatusRequest() {
  const redirects = await fetchRedirects();
  const status = {
    service: 'Redirect Service',
    status: redirects !== null ? 'OK' : 'Error',
    redirectCount: redirects ? Object.keys(redirects).length : 0,
    lastUpdated: new Date().toISOString()
  };

  return new Response(JSON.stringify(status, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
