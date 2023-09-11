<script setup lang="ts">
let isDark: boolean

// 核心切换方法
function toggleDark() {
  const root = document.documentElement
  isDark = root.classList.contains('dark')
  root.classList.remove(isDark ? 'dark' : '-')
  root.classList.add(isDark ? '-' : 'dark')
}
// 采用过渡效果切换
function toggleViewTransition(event: MouseEvent) {
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
  ]
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    toggleDark()
    await nextTick()
  })

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: isDark ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 300,
        easing: 'ease-in',
        pseudoElement: isDark
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })
}
// 环境判断
function toogleTheme(event: MouseEvent) {
  // @ts-expect-error: Transition API
  // 检测浏览器是否支持页面过渡效果，以及用户是否启用了减少动画的偏好
  const isSupport = document.startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isSupport) {
    toggleDark()
    return
  }
  toggleViewTransition(event)
}
</script>

<template>
  <div title="Toggle Color Scheme" class="dark:i-icon-park-outline-moon i-icon-park-outline-sun hover" @click="toogleTheme" />
</template>
