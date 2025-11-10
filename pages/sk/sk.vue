<template>
	<view class="page">
		<div id="sk-chart" class="chart-container"></div>
	</view>
	<view>
		<uni-forms ref="form"  :modelValue="formData">
			<view class="uni-list sk-div">
				<view class="uni-list-cell">
					<uni-section title="本地数据" type="line">
						<view class="uni-px-5 uni-pb-5">
							<uni-data-select v-model="selected" :localdata="dataList" @change="onDataSelectChange">
								
							</uni-data-select>
						</view>
					</uni-section>
				</view>

				<view class="button-group sk-btdiv">
					<button class="sk-bt" type="primary" size="mini" @click="formSubmit">RUN</button>
				</view>
			</view>
		</uni-forms>
	</view>
	<view style="padding-bottom: 50px;">
		<view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th width="80" align="center">買入日</uni-th>
					<uni-th width="80" align="center">賣出日</uni-th>
					<uni-th width="20" align="center">倉位</uni-th>
					<uni-th width="20" align="center">盈利</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index">
					<uni-td>{{ item.buyDate }}</uni-td>
					<uni-td>{{ item.sellDate }}</uni-td>
					<uni-td align="right">{{ item.warehousePosition }}</uni-td>
					<uni-td align="right">{{ item.profitMargin }}</uni-td>
				</uni-tr>
			</uni-table>

		</view>
	</view>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useSkLogic } from './skLogic'
import { SK_CONSTANTS } from './skConstants'
import uniTable from '@dcloudio/uni-ui/lib/uni-table/uni-table.vue'
import uniTr from '@dcloudio/uni-ui/lib/uni-tr/uni-tr.vue'
import uniTh from '@dcloudio/uni-ui/lib/uni-th/uni-th.vue'
import uniTd from '@dcloudio/uni-ui/lib/uni-td/uni-td.vue'
import uniPagination from '@dcloudio/uni-ui/lib/uni-pagination/uni-pagination.vue'
import uniDataSelect from '@dcloudio/uni-ui/lib/uni-data-select/uni-data-select.vue'
import getSystemCode from '@/services/syscode/getSystemCode.js'
import getHuiceData from '@/services/sk/getHuice.js'
import { useRoute } from 'vue-router';

export default {
	name: 'SkPage',
	components: {
		uniTable,
		uniTr,
		uniTh,
		uniTd,
		uniPagination,
		uniDataSelect
	},
	setup() {
		// inputParms  
		const route = useRoute();

		const { initAndRender, resize } = useSkLogic()
		// 下拉框
		const dataList = ref([])
		const selected = ref(0)

		// 表格相关的响应式数据
		const loading = ref(false)
		const tableData = ref([])

		// 加载表格数据的方法
		const loadTableData = async () => {
			try {
				loading.value = true
				const data = await getHuiceData(route.query.skId, selected.value)
				console.log('getHuiceData:', data); // 调试输出
				tableData.value = data.historyList
			} catch (e) {
				console.error('表格数据加载失败', e)
			} finally {
				loading.value = false
			}
		}

		// 表格相关的方法
		function selectionChange(e) {
			console.log('选中的数据', e.detail.index)
		}


		const formSubmit = async (praams) => {
			await loadTableData()
		}

		function resizeHandler() {
			resize()
		}

		function bindPickerChange(e) {
			index.value = e.detail.value
		}

		function onDataSelectChange(val) {

		}

		onMounted(async () => {

			// add resize listener for responsiveness
			window.addEventListener('resize', resizeHandler)

			// 使用 getSystemCode 加载下拉框数据
			try {
				const syscodeData = await getSystemCode('celue')
				console.log('syscodeData:', syscodeData);
				if (syscodeData && Array.isArray(syscodeData)) {
					dataList.value = syscodeData
					selected.value = dataList.value.length > 0 ? dataList.value[0] : null
				} else if (syscodeData && Array.isArray(syscodeData.selectOptions)) {
					dataList.value = syscodeData.selectOptions
					selected.value = dataList.value.length > 0 ? 1 : 0
				}
			} catch (e) {
				console.error('下拉框数据加载失败', e)
			}

			// init chart and render with data from service/mock
			const { initAndRender } = useSkLogic()
			
			try {
				await initAndRender(SK_CONSTANTS.CHART_CONTAINER_ID)
				console.log('sk chart initialized')
			} catch (e) {
				console.error('Failed to initialize sk chart:', e)
			}
			// 加载表格数据
			await loadTableData()
		})

		onBeforeUnmount(() => {
			window.removeEventListener('resize', resizeHandler)
		})

		return {
			bindPickerChange,
			// uni-data-select mock data + selected
			dataList,
			selected,
			onDataSelectChange,
			// 表格相关的数据
			loading,
			tableData,
			selectionChange,
			formSubmit
		}
	},

	// keep uni-app onLoad lifecycle to receive navigation params
	async onLoad(option) {
	}


}
</script>

<style lang="scss">
.chart-container {
	width: 100%;
	height: 60vh;
	/* fits full viewport height; adjust as needed */
}

.page {
	width: 100%;
	height: 100%;
}

.sk-div {
	padding: 8px 8px 8px 8px;
}

.sk-btdiv {
	padding: 16px 0 8px 0;
}

.sk-bt {
	width: 100%;
}
</style>