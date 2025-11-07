// 导入全局配置
import ENV from '@/config/env.js'

const API_URL = `${ENV.API.BASE_URL}/${ENV.API.VERSION}/syscode/getSystemCode`

/**
 * 获取系统码数据
 * @param {string} codeType - 码类型，如 'celue'，会加载 mock/syscode/celue.json
 */
export const getSystemCode = async (codeType) => {
  if (ENV.USE_MOCK) {
    if (ENV.MOCK.DELAY > 0) await new Promise(r => setTimeout(r, ENV.MOCK.DELAY))
    // 动态加载 mock 数据
    try {
      const mockData = require(`@/mock/syscode/${codeType}.json`)
      return mockData
    } catch (e) {
      console.error(`mock 加载失败: ${codeType}.json`, e)
      return null
    }
  }

  try {
    // 真实请求时将参数传递给后端
    const response = await uni.request({
      url: API_URL,
      method: 'GET',
      timeout: ENV.API.TIMEOUT,
      data: { codeType }
    })
    return response.data
  } catch (error) {
    console.error('获取系统码数据失败：', error)
    throw error
  }
}

export default getSystemCode
