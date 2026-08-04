import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    // Lazy Loading: 각 라우트 컴포넌트를 별도 청크로 분리해 필요할 때만 로드한다.
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/umbrella',
    name: 'umbrella',
    component: () => import('../views/UmbrellaView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    // Catch-all Route: 위 규칙 중 어느 것과도 매칭되지 않는 모든 경로를 404 페이지로 보낸다.
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  // GitHub Pages는 서버 라우팅 재작성을 지원하지 않는 정적 호스팅이라
  // 새로고침/직접 접속 시 404가 나지 않도록 해시 기반 라우팅을 사용한다.
  history: createWebHashHistory(),
  routes,
})

export default router
