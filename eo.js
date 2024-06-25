// 存储获取到的重定向规则
let redirects = {};

// 从外部 URL 获取 JSON 文件的函数
async function fetchRedirects() {
  const url = 'https://example.com/redirects.json'; // 替换为您的 JSON 文件 URL
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    redirects = await response.json();
    console.log('Redirects updated successfully');
  } catch (error) {
    console.error('Failed to fetch redirects:', error);
  }
}

// 定期更新重定向规则（例如每小时）
async function updateRedirects() {
  await fetchRedirects();
  setTimeout(updateRedirects, 60 * 60 * 1000); // 1 hour
}

// 初始化：立即获取重定向规则，然后开始定期更新
updateRedirects();

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname.slice(1); // 移除开头的 '/'

  if (Object.keys(redirects).length === 0) {
    // 如果重定向规则为空，尝试立即获取
    await fetchRedirects();
  }

  if (redirects.hasOwnProperty(path)) {
    // 如果路径存在于重定向对象中，执行 302 重定向
    return Response.redirect(redirects[path], 302);
  } else {
    // 如果路径不存在，返回 404 错误
    return new Response('Not Found', { status: 404 });
  }
}
