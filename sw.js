// 记住这个版本号！
const CACHE_NAME = 'koko-cache-v1';

// 这是管家要缓存的核心文件列表
const FILES_TO_CACHE = [
  './',              // 缓存根目录 (必须有)
  './index.html'     // 缓存你的App主文件 (必须是你改名后的名字)
  // './icon-192.png', // 你也可以把图标加进来
  // './icon-512.png'
];

// 1. 安装：把文件装进“v1号”缓存箱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] 正在缓存核心文件...');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// 2. 激活：新管家上任，清理旧箱子
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[SW] 正在删除旧缓存', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// 3. 拦截：用户要东西时，先从缓存里找
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 缓存里有？太好了，直接给！(实现离线)
        if (response) {
          return response;
        }
        // 缓存里没有？联网去要。
        return fetch(event.request);
      })
  );
});