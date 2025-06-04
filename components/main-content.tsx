"use client"

import { useI18n } from "@/lib/i18n/i18n-context"
import { TaskEditor } from "@/components/task-editor/task-editor"
import { TaskManagement } from "@/components/task-management/task-management"
import { AgentRuntime } from "@/components/agent-runtime/agent-runtime"
import { AgentDeployment } from "@/components/agent-deployment/agent-deployment"
import { QueryMemory } from "@/components/query-memory/query-memory"
import { getMenuDescriptions } from "@/lib/menu-descriptions"

// Import components
import { BlankPanel } from "@/components/monitoring/blank-panel"
import { LogsPanel } from "@/components/monitoring/logs-panel"
import { PerformancePanel } from "@/components/monitoring/performance-panel"
import { AgentChat } from "@/components/copilot/agent-chat"

interface MainContentProps {
  activeItem: string
  activePrimaryItem: string
}

export function MainContent({ activeItem, activePrimaryItem }: MainContentProps) {
  const { t } = useI18n()
  const menuDescriptions = getMenuDescriptions()

  // Get display name for the active item and primary item
  const getDisplayName = (id: string) => {
    // This is a simplified mapping - in a real app, you'd use a more robust approach
    const displayNames: Record<string, string> = {
      taskEditor: t("sidebar.menu.agentTasks.items.taskEditor"),
      taskManagement: t("sidebar.menu.agentTasks.items.taskManagement"),
      runAgents: t("sidebar.menu.agentDeployments.items.runAgents"),
      agentRuntime: t("sidebar.menu.agentDeployments.items.agentRuntime"),
      alerts: t("sidebar.menu.monitoring.items.alerts"),
      performance: t("sidebar.menu.monitoring.items.performance"),
      logs: t("sidebar.menu.monitoring.items.logs"),
      resultDashboard: t("sidebar.menu.analysis.items.resultDashboard"),
      queryMemory: t("sidebar.menu.analysis.items.queryMemory"),
      copilot: t("sidebar.menu.copilot"),
      settings: t("sidebar.menu.settings"),
      agentTasks: t("sidebar.menu.agentTasks.title"),
      agentDeployments: t("sidebar.menu.agentDeployments.title"),
      monitoring: t("sidebar.menu.monitoring.title"),
      analysis: t("sidebar.menu.analysis.title"),
    }

    return displayNames[id] || id
  }

  const activeItemDisplay = getDisplayName(activeItem)
  const activePrimaryItemDisplay = getDisplayName(activePrimaryItem)

  // Get the description for the active item
  const activeItemDescription = menuDescriptions[activeItem] || ""

  // Render specific content based on active item
  const renderContent = () => {
    switch (activeItem) {
      case "taskEditor":
        return <TaskEditor />
      case "taskManagement":
        return <TaskManagement />
      case "agentRuntime":
        return <AgentRuntime />
      case "runAgents":
        return <AgentDeployment />
      case "alerts":
        return <BlankPanel title={t("sidebar.menu.monitoring.items.alerts")} />
      case "performance":
        return (
          <div className="h-full">
            <PerformancePanel />
          </div>
        )
      case "logs":
        return <LogsPanel />
      case "resultDashboard":
        return <BlankPanel title={t("sidebar.menu.analysis.items.resultDashboard")} />
      case "queryMemory":
        return <QueryMemory />
      case "copilot":
        return (
          <div className="h-full p-0">
            <AgentChat />
          </div>
        )
      case "settings":
        return <BlankPanel title={t("sidebar.menu.settings")} />
      default:
        return (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium">{t("mainContent.dashboard", { section: activeItemDisplay })}</h2>

            <p className="text-gray-500">
              {t("mainContent.contentDescription", {
                section: activeItemDisplay,
                parent: activePrimaryItemDisplay,
              })}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <h3 className="mb-2 font-medium">{t("mainContent.card", { number: i })}</h3>
                  <div className="h-32 rounded-md bg-gray-100"></div>
                  <p className="mt-2 text-sm text-gray-500">{t("mainContent.sampleContent")}</p>
                </div>
              ))}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex-1 w-full overflow-auto bg-gray-50">
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">{activeItemDisplay}</h1>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-500">{activePrimaryItemDisplay}</span>
        </div>
      </div>

      <div className={`${activeItem === "copilot" ? "p-0" : "p-6"} h-[calc(100%-64px)]`}>
        {/* Add description heading */}
        {activeItemDescription &&
          activeItem !== "copilot" &&
          activeItem !== "logs" &&
          activeItem !== "performance" &&
          activeItem !== "queryMemory" && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-600">{activeItemDescription}</h2>
            </div>
          )}

        {renderContent()}
      </div>
    </div>
  )
}
