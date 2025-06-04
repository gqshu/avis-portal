"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, X, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useI18n } from "@/lib/i18n/i18n-context"

interface SettingsPanelProps {
  activeItem: string
  activePrimaryItem: string
}

export function SettingsPanel({ activeItem, activePrimaryItem }: SettingsPanelProps) {
  const { t } = useI18n()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    advanced: true,
    notifications: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Get display name for the active item
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
      copilot: t("sidebar.menu.copilot"),
    }

    return displayNames[id] || id
  }

  if (isCollapsed) {
    return (
      <div className="w-[50px] flex-shrink-0 bg-white border-l border-gray-200 flex flex-col items-center py-4">
        <button onClick={() => setIsCollapsed(false)} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    )
  }

  // For Task Editor, show an empty panel with just a save button
  if (activeItem === "taskEditor") {
    return (
      <div className="w-[300px] flex-shrink-0 bg-white border-l border-gray-200 shadow-sm flex flex-col h-screen">
        <div className="flex items-center justify-between border-b border-gray-200 p-3">
          <h2 className="font-semibold text-gray-800 text-sm">
            {t("settingsPanel.title", { section: getDisplayName(activeItem) })}
          </h2>
          <button onClick={() => setIsCollapsed(true)} className="p-1 rounded-full hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-3">{/* Empty panel for Task Editor */}</div>

        <div className="border-t border-gray-200 p-3">
          <Button className="w-full bg-[#6C47FF] hover:bg-[#5A3CD7] h-8 text-xs">
            {t("settingsPanel.saveButton")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[300px] flex-shrink-0 bg-white border-l border-gray-200 shadow-sm flex flex-col h-screen">
      <div className="flex items-center justify-between border-b border-gray-200 p-3">
        <h2 className="font-semibold text-gray-800 text-sm">
          {t("settingsPanel.title", { section: getDisplayName(activeItem) })}
        </h2>
        <button onClick={() => setIsCollapsed(true)} className="p-1 rounded-full hover:bg-gray-100">
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-5">
        {/* General Settings Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("general")}>
            <h3 className="font-medium text-gray-700 text-xs">{t("settingsPanel.sections.general.title")}</h3>
            {expandedSections.general ? (
              <ChevronUp className="h-3 w-3 text-gray-500" />
            ) : (
              <ChevronDown className="h-3 w-3 text-gray-500" />
            )}
          </div>

          {expandedSections.general && (
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs">
                  {t("settingsPanel.sections.general.name")}
                </Label>
                <Input
                  id="name"
                  placeholder={t("settingsPanel.sections.general.namePlaceholder")}
                  className="h-7 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="description" className="text-xs">
                  {t("settingsPanel.sections.general.description")}
                </Label>
                <Input
                  id="description"
                  placeholder={t("settingsPanel.sections.general.descriptionPlaceholder")}
                  className="h-7 text-xs"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enabled" className="text-xs">
                  {t("settingsPanel.sections.general.enabled")}
                </Label>
                <Switch id="enabled" defaultChecked />
              </div>
            </div>
          )}
        </div>

        {/* Advanced Settings Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("advanced")}>
            <h3 className="font-medium text-gray-700 text-xs">{t("settingsPanel.sections.advanced.title")}</h3>
            {expandedSections.advanced ? (
              <ChevronUp className="h-3 w-3 text-gray-500" />
            ) : (
              <ChevronDown className="h-3 w-3 text-gray-500" />
            )}
          </div>

          {expandedSections.advanced && (
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <Label htmlFor="priority" className="text-xs">
                  {t("settingsPanel.sections.advanced.priority")}
                </Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="priority" className="h-7 text-xs">
                    <SelectValue placeholder={t("settingsPanel.sections.advanced.priorityPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="text-xs">
                      {t("settingsPanel.sections.advanced.priorityOptions.low")}
                    </SelectItem>
                    <SelectItem value="medium" className="text-xs">
                      {t("settingsPanel.sections.advanced.priorityOptions.medium")}
                    </SelectItem>
                    <SelectItem value="high" className="text-xs">
                      {t("settingsPanel.sections.advanced.priorityOptions.high")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="timeout" className="text-xs">
                    {t("settingsPanel.sections.advanced.timeout")}
                  </Label>
                  <span className="text-xs text-gray-500">30</span>
                </div>
                <Slider defaultValue={[30]} max={120} step={1} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="retries" className="text-xs">
                  {t("settingsPanel.sections.advanced.maxRetries")}
                </Label>
                <Input id="retries" type="number" defaultValue="3" className="h-7 text-xs" />
              </div>
            </div>
          )}
        </div>

        {/* Notifications Section */}
        <div className="space-y-2">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("notifications")}
          >
            <h3 className="font-medium text-gray-700 text-xs">{t("settingsPanel.sections.notifications.title")}</h3>
            {expandedSections.notifications ? (
              <ChevronUp className="h-3 w-3 text-gray-500" />
            ) : (
              <ChevronDown className="h-3 w-3 text-gray-500" />
            )}
          </div>

          {expandedSections.notifications && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="text-xs">
                  {t("settingsPanel.sections.notifications.emailNotifications")}
                </Label>
                <Switch id="email-notifications" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="slack-notifications" className="text-xs">
                  {t("settingsPanel.sections.notifications.slackNotifications")}
                </Label>
                <Switch id="slack-notifications" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="error-alerts" className="text-xs">
                  {t("settingsPanel.sections.notifications.errorAlerts")}
                </Label>
                <Switch id="error-alerts" defaultChecked />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 p-3">
        <Button className="w-full bg-[#6C47FF] hover:bg-[#5A3CD7] h-8 text-xs">{t("settingsPanel.saveButton")}</Button>
      </div>
    </div>
  )
}
