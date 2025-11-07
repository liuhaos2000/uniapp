<template>
	<view class="page">
		<div id="sk-chart" class="chart-container"></div>
	</view>
</template>

<script>
import { onMounted, onBeforeUnmount } from 'vue'
import { useSkLogic } from './skLogic'
import { SK_CONSTANTS } from './skConstants'

export default {
  name: 'SkPage',
  setup() {
	const { initAndRender, resize } = useSkLogic()

	function resizeHandler() {
	  resize()
	}

	onMounted(() => {
	  // add resize listener for responsiveness
	  window.addEventListener('resize', resizeHandler)
	})

	onBeforeUnmount(() => {
	  window.removeEventListener('resize', resizeHandler)
	})

	return {}
  },

  // keep uni-app onLoad lifecycle to receive navigation params
  async onLoad(option) {
	// init chart and render with data from service/mock
	const { initAndRender } = useSkLogic()
	try {
	  await initAndRender(SK_CONSTANTS.CHART_CONTAINER_ID, option)
	  console.log('sk chart initialized')
	} catch (e) {
	  console.error('Failed to initialize sk chart:', e)
	}
  }
}
</script>

<style lang="scss">
.chart-container {
	width: 100%;
	height: 60vh; /* fits full viewport height; adjust as needed */
}

.page {
	width: 100%;
	height: 100%;
}
</style>