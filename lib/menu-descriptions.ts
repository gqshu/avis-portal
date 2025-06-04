import { useI18n } from "@/lib/i18n/i18n-context"

// Function to get localized menu descriptions
export function getMenuDescriptions() {
  const { t } = useI18n()

  return {
    // Agent Tasks
    taskEditor: t("menuDescriptions.taskEditor"),
    taskManagement: t("menuDescriptions.taskManagement"),

    // Agent Deployments
    runAgents: t("menuDescriptions.runAgents"),
    agentRuntime: t("menuDescriptions.agentRuntime"),

    // Monitoring
    alerts: t("menuDescriptions.alerts"),
    performance: t("menuDescriptions.performance"),
    logs: t("menuDescriptions.logs"),

    // Analysis
    resultDashboard: t("menuDescriptions.resultDashboard"),
    queryMemory: t("menuDescriptions.queryMemory"),

    // Other
    copilot: t("menuDescriptions.copilot"),
    settings: t("menuDescriptions.settings"),
  }
}
