"use client"

import { useState, useEffect } from 'react'
import { runIntegrationTests } from '@/lib/integration-test'

export default function IntegrationTestPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  // 捕获控制台输出
  useEffect(() => {
    if (!isRunning) return

    const originalConsoleLog = console.log
    const originalConsoleError = console.error
    
    console.log = (...args) => {
      originalConsoleLog(...args)
      setTestResults(prev => [...prev, args.join(' ')])
    }
    
    console.error = (...args) => {
      originalConsoleError(...args)
      setTestResults(prev => [...prev, `错误: ${args.join(' ')}`])
    }
    
    // 运行测试
    runIntegrationTests().finally(() => {
      setIsRunning(false)
      // 恢复控制台函数
      console.log = originalConsoleLog
      console.error = originalConsoleError
    })
    
    return () => {
      console.log = originalConsoleLog
      console.error = originalConsoleError
    }
  }, [isRunning])

  const startTest = () => {
    setTestResults([])
    setIsRunning(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">前后端集成测试</h1>
      
      <button 
        onClick={startTest}
        disabled={isRunning}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-6 disabled:opacity-50"
      >
        {isRunning ? '测试运行中...' : '运行集成测试'}
      </button>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">测试结果:</h2>
        
        {testResults.length === 0 && !isRunning ? (
          <p className="text-gray-500">点击按钮开始测试</p>
        ) : (
          <div className="bg-black text-white p-4 rounded font-mono text-sm h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result.startsWith('错误') ? (
                  <span className="text-red-400">{result}</span>
                ) : (
                  <span>{result}</span>
                )}
              </div>
            ))}
            {isRunning && <div className="animate-pulse">测试运行中...</div>}
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">注意事项:</h2>
        <ul className="list-disc pl-5">
          <li className="mb-1">确保后端服务器已启动且运行在 <code>http://localhost:5000</code></li>
          <li className="mb-1">部分测试需要用户登录 (会自动注册并登录测试账号)</li>
          <li className="mb-1">如遇到CORS错误，请确保后端已正确配置跨域</li>
          <li className="mb-1">测试可能会修改数据库中的数据，请勿在生产环境使用</li>
        </ul>
      </div>
    </div>
  )
} 