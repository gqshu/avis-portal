"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AgentSidebar } from "@/components/agent-sidebar"
import { SettingsPanel } from "@/components/settings-panel"
import { MainContent } from "@/components/main-content"

export function AgentDashboard() {
  const [activeItem, setActiveItem] = useState("taskEditor")
  const [activePrimaryItem, setActivePrimaryItem] = useState("agentTasks")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Update the hideSettingsPanel condition to include "performance"
  const hideSettingsPanel = [
    "settings",
    "taskManagement",
    "agentRuntime",
    "runAgents",
    "copilot",
    "logs",
    "performance",
  ].includes(activeItem)

  return (
    <SidebarProvider defaultOpen={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex h-screen w-full overflow-hidden">
        <AgentSidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          activePrimaryItem={activePrimaryItem}
          setActivePrimaryItem={setActivePrimaryItem}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <MainContent activeItem={activeItem} activePrimaryItem={activePrimaryItem} />
        </div>
        {!hideSettingsPanel && <SettingsPanel activeItem={activeItem} activePrimaryItem={activePrimaryItem} />}
      </div>
    </SidebarProvider>
  )
}
