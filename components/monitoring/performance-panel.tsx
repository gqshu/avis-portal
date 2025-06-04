"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnginePerformanceView } from "./engine-performance-view"
import { AgentPerformanceView } from "./agent-performance-view"
import { useI18n } from "@/lib/i18n/i18n-context"

export function PerformancePanel() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<string>("engines")

  return (
    <div className="h-full overflow-auto">
      <Tabs defaultValue="engines" value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        <TabsList className="grid w-full grid-cols-2 h-8 text-xs">
          <TabsTrigger value="engines" className="text-xs">
            {t("performance.enginePerformance")}
          </TabsTrigger>
          <TabsTrigger value="agents" className="text-xs">
            {t("performance.agentPerformance")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="engines" className="mt-0 h-[calc(100%-44px)]">
          <EnginePerformanceView />
        </TabsContent>
        <TabsContent value="agents" className="mt-0 h-[calc(100%-44px)]">
          <AgentPerformanceView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
