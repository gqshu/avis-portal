"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, HardDrive, MemoryStickIcon as Memory, CpuIcon as Gpu, Server } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"

// Define the engine type
interface Engine {
  id: string
  hostname: string
  status: "connected" | "disconnected" | "warning"
  runningTasks: number
  totalTasks: number
  specs: {
    cpuCores: number
    memoryTotal: number // in GB
    diskTotal: number // in GB
    gpuModel: string
    gpuMemory: number // in GB
  }
  metrics: {
    cpu: number[]
    memory: number[]
    disk: number[]
    gpu: number[]
    timestamps: string[]
  }
}

// Sample data for demonstration
const sampleEngines: Engine[] = [
  {
    id: "engine-01",
    hostname: "engine-01.avis.local",
    status: "connected",
    runningTasks: 3,
    totalTasks: 5,
    specs: {
      cpuCores: 16,
      memoryTotal: 64, // 64GB
      diskTotal: 1024, // 1TB
      gpuModel: "NVIDIA A100",
      gpuMemory: 40, // 40GB
    },
    metrics: {
      cpu: generateMetricData(60, 20, 80),
      memory: generateMetricData(60, 30, 70),
      disk: generateMetricData(60, 40, 60),
      gpu: generateMetricData(60, 10, 90),
      timestamps: generateTimestamps(60),
    },
  },
  {
    id: "engine-02",
    hostname: "engine-02.avis.local",
    status: "warning",
    runningTasks: 4,
    totalTasks: 4,
    specs: {
      cpuCores: 32,
      memoryTotal: 128, // 128GB
      diskTotal: 2048, // 2TB
      gpuModel: "NVIDIA A6000",
      gpuMemory: 48, // 48GB
    },
    metrics: {
      cpu: generateMetricData(60, 40, 95),
      memory: generateMetricData(60, 50, 85),
      disk: generateMetricData(60, 60, 75),
      gpu: generateMetricData(60, 30, 80),
      timestamps: generateTimestamps(60),
    },
  },
  {
    id: "engine-03",
    hostname: "engine-03.avis.local",
    status: "disconnected",
    runningTasks: 0,
    totalTasks: 3,
    specs: {
      cpuCores: 8,
      memoryTotal: 32, // 32GB
      diskTotal: 512, // 512GB
      gpuModel: "NVIDIA T4",
      gpuMemory: 16, // 16GB
    },
    metrics: {
      cpu: generateMetricData(60, 0, 0),
      memory: generateMetricData(60, 0, 0),
      disk: generateMetricData(60, 0, 0),
      gpu: generateMetricData(60, 0, 0),
      timestamps: generateTimestamps(60),
    },
  },
  {
    id: "engine-04",
    hostname: "engine-04.avis.local",
    status: "connected",
    runningTasks: 2,
    totalTasks: 6,
    specs: {
      cpuCores: 24,
      memoryTotal: 96, // 96GB
      diskTotal: 1536, // 1.5TB
      gpuModel: "NVIDIA RTX A5000",
      gpuMemory: 24, // 24GB
    },
    metrics: {
      cpu: generateMetricData(60, 15, 65),
      memory: generateMetricData(60, 25, 55),
      disk: generateMetricData(60, 35, 45),
      gpu: generateMetricData(60, 5, 85),
      timestamps: generateTimestamps(60),
    },
  },
]

// Helper function to generate random metric data
function generateMetricData(count: number, min: number, max: number): number[] {
  return Array.from({ length: count }, () => {
    if (min === 0 && max === 0) return 0 // For disconnected engines
    return Math.floor(Math.random() * (max - min + 1)) + min
  })
}

// Helper function to generate timestamps for the last hour
function generateTimestamps(count: number): string[] {
  const now = new Date()
  return Array.from({ length: count }, (_, i) => {
    const time = new Date(now.getTime() - (count - i) * 60000) // One minute intervals
    return time.toISOString()
  })
}

export function EnginePerformanceView() {
  const { t } = useI18n()
  const engines = useMemo(() => sampleEngines, [])

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "disconnected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get the current value (last value in the array)
  const getCurrentValue = (values: number[]) => {
    return values.length > 0 ? values[values.length - 1] : 0
  }

  // Get color based on usage percentage
  const getUsageColor = (value: number) => {
    if (value >= 90) return "text-red-600"
    if (value >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  // Format capacity
  const formatCapacity = (value: number, unit: string) => {
    if (value >= 1024 && unit === "GB") {
      return `${(value / 1024).toFixed(1)}TB`
    }
    return `${value}${unit}`
  }

  // Render a mini sparkline chart with timestamps
  const renderSparkline = (data: number[], timestamps: string[], height = 40) => {
    if (data.every((val) => val === 0)) {
      return <div className="h-[40px] bg-gray-100 rounded-sm"></div>
    }

    const max = Math.max(...data, 100) // Ensure max is at least 100 for percentage
    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 100
        const y = 100 - (value / max) * 100
        return `${x},${y}`
      })
      .join(" ")

    // Get timestamps for x-axis (show 5 points)
    const timeLabels = []
    const step = Math.floor(timestamps.length / 4)
    for (let i = 0; i < timestamps.length; i += step) {
      if (timeLabels.length < 5) {
        const date = new Date(timestamps[i])
        timeLabels.push({
          position: (i / (timestamps.length - 1)) * 100,
          label: `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`,
        })
      }
    }

    return (
      <div className="h-[40px] w-full relative">
        <svg width="100%" height={height} preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            vectorEffect="non-scaling-stroke"
          />
          <polygon points={`0,100 ${points} 100,100`} fill="currentColor" className="text-primary/10" strokeWidth="0" />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-gray-500">
          {timeLabels.map((label, i) => (
            <div key={i} style={{ position: "absolute", left: `${label.position}%`, transform: "translateX(-50%)" }}>
              {label.label}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 overflow-auto h-full pr-2">
      {engines.map((engine) => (
        <Card key={engine.id} className={`${engine.status === "disconnected" ? "opacity-60" : ""} shadow-sm`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{engine.hostname}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-500">{engine.id}</p>
                  <div className="flex items-center text-xs text-gray-600">
                    <Server className="h-3 w-3 mr-1" />
                    <span>
                      {t("performance.tasks")}: {engine.runningTasks}/{engine.totalTasks}
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className={`${getStatusBadgeColor(engine.status)} border-0`}>
                {t(`agentRuntime.engines.statuses.${engine.status}`)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {/* CPU Usage */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Cpu className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm font-medium">
                    {t("performance.cpuCores")} ({engine.specs.cpuCores} cores)
                  </span>
                </div>
                <span className={`text-sm font-bold ${getUsageColor(getCurrentValue(engine.metrics.cpu))}`}>
                  {getCurrentValue(engine.metrics.cpu)}%
                </span>
              </div>
              {renderSparkline(engine.metrics.cpu, engine.metrics.timestamps)}
            </div>

            {/* Memory Usage */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Memory className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm font-medium">
                    {t("performance.memory")} ({formatCapacity(engine.specs.memoryTotal, "GB")})
                  </span>
                </div>
                <span className={`text-sm font-bold ${getUsageColor(getCurrentValue(engine.metrics.memory))}`}>
                  {getCurrentValue(engine.metrics.memory)}%
                </span>
              </div>
              {renderSparkline(engine.metrics.memory, engine.metrics.timestamps)}
            </div>

            {/* Disk Usage */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <HardDrive className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm font-medium">
                    {t("performance.disk")} ({formatCapacity(engine.specs.diskTotal, "GB")})
                  </span>
                </div>
                <span className={`text-sm font-bold ${getUsageColor(getCurrentValue(engine.metrics.disk))}`}>
                  {getCurrentValue(engine.metrics.disk)}%
                </span>
              </div>
              {renderSparkline(engine.metrics.disk, engine.metrics.timestamps)}
            </div>

            {/* GPU Usage */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Gpu className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm font-medium">
                    {t("performance.gpu")} ({formatCapacity(engine.specs.gpuMemory, "GB")})
                  </span>
                </div>
                <span className={`text-sm font-bold ${getUsageColor(getCurrentValue(engine.metrics.gpu))}`}>
                  {getCurrentValue(engine.metrics.gpu)}%
                </span>
              </div>
              {renderSparkline(engine.metrics.gpu, engine.metrics.timestamps)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
