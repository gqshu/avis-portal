"use client"

import { useState } from "react"
import { AgentSidebar } from "@/components/agent-sidebar"
import { MainContent } from "@/components/main-content"

export default function DashboardPage() {
  const [activeItem, setActiveItem] = useState("taskEditor")
  const [activePrimaryItem, setActivePrimaryItem] = useState("agentTasks")

  return (
    <>
      <AgentSidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        activePrimaryItem={activePrimaryItem}
        setActivePrimaryItem={setActivePrimaryItem}
      />
      <MainContent activeItem={activeItem} activePrimaryItem={activePrimaryItem} />
    </>
  )
}
