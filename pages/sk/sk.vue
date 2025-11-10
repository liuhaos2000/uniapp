<template>
	<view class="page">
		<div id="sk-chart" class="chart-container"></div>
	</view>
	<view>
		<uni-forms ref="dynamicForm" :rules="dynamicRules" :modelValue="dynamicFormData">
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
					<button class="sk-bt" type="primary" size="mini" @click="submit('dynamicForm')">RUN</button>
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
		const { initAndRender, resize } = useSkLogic()
		// 下拉框
		const dataList = ref([])
		const selected = ref(0)

		// 表格相关的响应式数据
		const loading = ref(false)
		const tableData = ref([
			{ buyDate: '2025-01-10', sellDate: '2025-02-15', warehousePosition: '50%', profitMargin: '+8.5%' },
			{ buyDate: '2025-03-05', sellDate: '2025-04-01', warehousePosition: '30%', profitMargin: '-2.1%' },
			{ buyDate: '2025-05-12', sellDate: '2025-06-20', warehousePosition: '80%', profitMargin: '+15.7%' }
		])
		const pageCurrent = ref(1)
		const pageSize = ref(10)
		const total = ref(0)

		// 表格相关的方法
		function selectionChange(e) {
			console.log('选中的数据', e.detail.index)
		}

		function change(e) {
			pageCurrent.value = e.current
			// 这里可以调用获取数据的方法
		}

		function formSubmit(e) {
			// uni-app form submit: prevent default and handle values
			if (e && e.preventDefault) e.preventDefault()
			console.log('form submitted; selected:', selected.value)
			// you can perform form actions here
		}

		function resizeHandler() {
			resize()
		}

		function bindPickerChange(e) {
			index.value = e.detail.value
		}

		function onDataSelectChange(val) {
			// uni-data-select may emit an object or an id/value. Normalize both cases.
			// if (!val) return
			// if (typeof val === 'object' && val.label) {
			// 	selected.value = val
			// } else {
			// 	const found = dataList.value.find(item => item.id === val || item.value === val)
			// 	if (found) selected.value = found
			// }
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
			pageCurrent,
			pageSize,
			total,
			selectionChange,
			change,
			formSubmit
		}
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