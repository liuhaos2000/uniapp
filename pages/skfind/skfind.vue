<template>
	<view class="uni-container">
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
						<button class="sk-bt" type="primary" size="mini" @click="formSubmit">
							查詢
						</button>
					</view>
				</view>
			</uni-forms>
		</view>
		<view style="padding-bottom: 50px;">
			<view class="uni-container">
				<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据"
					@selection-change="selectionChange">
					<uni-tr>
						<uni-th width="80" align="center">代碼</uni-th>
						<uni-th width="80" align="center">名稱</uni-th>
						<uni-th width="20" align="center">價格</uni-th>
						<uni-th width="20" align="center">漲跌</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index" @click="handleRowClick(item)" 
							:class="{ 'positive-movement': item.movement > 0, 'negative-movement': item.movement < 0 }">
						<uni-td>{{ item.skId }}</uni-td>
						<uni-td>{{ item.skName }}</uni-td>
						<uni-td align="right">{{ item.price }}</uni-td>
						<uni-td align="right">{{ item.movement }}</uni-td>
					</uni-tr>
				</uni-table>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import findSk from '@/services/sk/findSk.js'
	import uniTable from '@dcloudio/uni-ui/lib/uni-table/uni-table.vue'
	import uniTr from '@dcloudio/uni-ui/lib/uni-tr/uni-tr.vue'
	import uniTh from '@dcloudio/uni-ui/lib/uni-th/uni-th.vue'
	import uniTd from '@dcloudio/uni-ui/lib/uni-td/uni-td.vue'
	import getStrategy2 from '@/services/sk/getStrategy2.js'
	import uniDataSelect from '@dcloudio/uni-ui/lib/uni-data-select/uni-data-select.vue'


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
			const data = await findSk(selected.value)
			console.log('findsk:', data); // 调试输出
			tableData.value = data.findSkList
		} catch (e) {
			console.error('表格数据加载失败', e)
		} finally {
			loading.value = false
		}
	}

	onMounted(async () => {
		// 1 使用 getStrategy2 加载下拉框数据
		try {
			const strategy2 = await getStrategy2()
			console.log('strategy:', strategy2.data);
			if (strategy2.data && Array.isArray(strategy2.data)) {
				dataList.value = strategy2.data
				selected.value = dataList.value.length > 0 ? dataList.value[0].value : null
			} 
		} catch (e) {
			console.error('下拉框数据加载失败', e)
		}

		// 2 加载表格数据
		await loadTableData()
	})

	function onDataSelectChange(val) {

	}

	const formSubmit = async (praams) => {
		await loadTableData()
	}

	// 处理表格行点击事件
	const handleRowClick = (item) => {
		// 使用 uni.navigateTo 进行页面跳转
		uni.navigateTo({
			url: `/pages/sk/sk?skId=${item.skId}`,
			animationType: 'slide-in-right',
			animationDuration: 200
		})
	}

</script>

<style>
	.sk-div {
		padding: 8px 8px 8px 8px;
	}
	.sk-btdiv {
		padding: 16px 0 8px 0;
	}
	.sk-bt {
		width: 100%;
	}
	/* 涨幅大于0的行 */
	.positive-movement {
		color: #ee6666; /* 浅红色背景 */
	}

	/* 涨幅小于0的行 */
	.negative-movement {
		color: #54ac54; /* 浅绿色背景 */
	}

	/* 确保 td 继承 tr 的字体颜色 */
	.positive-movement td {
		color: inherit !important; /* 继承父元素的颜色 */
	}
	.negative-movement td {
		color: inherit !important; /* 继承父元素的颜色 */
	}
</style>
