// 所有的 mock 数据都在这里定义
// 添加新的 systemcode 时只需在这里添加对应的数据对象即可
export default {
  // celue策略相关
  celue: {
    "selectOptions": [
      { "id": 1, "label": "策略A", "value": "strategy_a" },
      { "id": 2, "label": "策略B", "value": "strategy_b" },
      { "id": 3, "label": "策略C", "value": "strategy_c" }
    ]
  },
  // 指标相关
  zhibiao: {
    "selectOptions": [
      { "id": 1, "label": "RSI", "value": "rsi" },
      { "id": 2, "label": "MACD", "value": "macd" },
      { "id": 3, "label": "KDJ", "value": "kdj" }
    ]
  },
  // 周期相关
  zhouqi: {
    "selectOptions": [
      { "id": 1, "label": "日K", "value": "day" },
      { "id": 2, "label": "周K", "value": "week" },
      { "id": 3, "label": "月K", "value": "month" }
    ]
  }
  // 要添加新的类型，直接在这里添加新的对象即可
  // 例如：
  /*
  newType: {
    "selectOptions": [
      { "id": 1, "label": "选项1", "value": "value1" },
      { "id": 2, "label": "选项2", "value": "value2" }
    ]
  }
  */
}