"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  Edit3,
  Play,
  Bell,
  PieChart,
  MessageSquare,
  SettingsIcon,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useI18n } from "@/lib/i18n/i18n-context"
import { LanguageSwitcher } from "@/lib/i18n/language-switcher"

interface AgentSidebarProps {
  activeItem: string
  setActiveItem: (item: string) => void
  activePrimaryItem: string
  setActivePrimaryItem: (item: string) => void
}

export function AgentSidebar({
  activeItem,
  setActiveItem,
  activePrimaryItem,
  setActivePrimaryItem,
}: AgentSidebarProps) {
  const { t } = useI18n()
  const { state } = useSidebar()
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    agentTasks: true,
    agentDeployments: false,
    monitoring: false,
    analysis: false,
  })

  const toggleExpand = (item: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }))
    setActivePrimaryItem(item)
  }

  const handleItemClick = (primary: string, item: string) => {
    setActiveItem(item)
    setActivePrimaryItem(primary)

    // Ensure the parent is expanded when clicking a subitem
    if (!expandedItems[primary]) {
      setExpandedItems((prev) => ({
        ...prev,
        [primary]: true,
      }))
    }
  }

  const menuItems = [
    {
      id: "agentTasks",
      name: t("sidebar.menu.agentTasks.title"),
      icon: <Edit3 className="h-5 w-5" />,
      subitems: [
        { id: "taskEditor", name: t("sidebar.menu.agentTasks.items.taskEditor") },
        { id: "taskManagement", name: t("sidebar.menu.agentTasks.items.taskManagement") },
      ],
    },
    {
      id: "agentDeployments",
      name: t("sidebar.menu.agentDeployments.title"),
      icon: <Play className="h-5 w-5" />,
      subitems: [
        { id: "runAgents", name: t("sidebar.menu.agentDeployments.items.runAgents") },
        { id: "agentRuntime", name: t("sidebar.menu.agentDeployments.items.agentRuntime") },
      ],
    },
    {
      id: "monitoring",
      name: t("sidebar.menu.monitoring.title"),
      icon: <Bell className="h-5 w-5" />,
      subitems: [
        { id: "alerts", name: t("sidebar.menu.monitoring.items.alerts") },
        { id: "performance", name: t("sidebar.menu.monitoring.items.performance") },
        { id: "logs", name: t("sidebar.menu.monitoring.items.logs") },
      ],
    },
    {
      id: "analysis",
      name: t("sidebar.menu.analysis.title"),
      icon: <PieChart className="h-5 w-5" />,
      subitems: [
        { id: "resultDashboard", name: t("sidebar.menu.analysis.items.resultDashboard") },
        { id: "queryMemory", name: t("sidebar.menu.analysis.items.queryMemory") },
      ],
    },
    {
      id: "copilot",
      name: t("sidebar.menu.copilot"),
      icon: <MessageSquare className="h-5 w-5" />,
      subitems: [],
    },
    {
      id: "settings",
      name: t("sidebar.menu.settings"),
      icon: <SettingsIcon className="h-5 w-5" />,
      subitems: [],
    },
  ]

  const isCollapsed = state === "collapsed"
  const currentYear = new Date().getFullYear()

  return (
    <Sidebar
      className="w-[250px] flex-shrink-0 border-r border-gray-200"
      variant="sidebar"
      collapsible="icon"
      style={{ width: isCollapsed ? "64px" : "250px", transition: "width 0.3s ease" }}
    >
      <div className="flex h-16 items-center px-4 border-b border-gray-200 bg-[#2A2D35] justify-between">
        <div className="flex items-center gap-2 text-white">
          {!isCollapsed && (
            <h1 className="text-xl font-bold">
              <span className="text-[#6C47FF]">M+</span> Insight
            </h1>
          )}
          {isCollapsed && (
            <div className="h-6 w-6 text-[#6C47FF] font-bold text-lg flex items-center justify-center">M+</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isCollapsed && <LanguageSwitcher />}
          <SidebarTrigger className="text-white" />
        </div>
      </div>
      <SidebarContent className="bg-[#2A2D35] h-full flex flex-col">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              {item.subitems.length > 0 ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:bg-[#3A3D45] rounded-md",
                      activePrimaryItem === item.id && "bg-[#3A3D45]",
                    )}
                  >
                    {item.icon}
                    {!isCollapsed && (
                      <>
                        <span>{item.name}</span>
                        {expandedItems[item.id] ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>
                  {expandedItems[item.id] && !isCollapsed && (
                    <div className="ml-9 mt-1 space-y-1">
                      {item.subitems.map((subitem) => (
                        <button
                          key={subitem.id}
                          onClick={() => handleItemClick(item.id, subitem.id)}
                          className={cn(
                            "flex w-full items-center rounded-md px-3 py-1.5 text-sm text-white hover:bg-[#3A3D45]",
                            activeItem === subitem.id && "bg-[#6C47FF] text-white font-medium",
                          )}
                        >
                          {subitem.name}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleItemClick(item.id, item.id)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:bg-[#3A3D45] rounded-md",
                    activeItem === item.id && "bg-[#6C47FF] text-white",
                  )}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.name}</span>}
                </button>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="mt-auto">
          <SidebarFooter className="flex flex-col gap-2">
            <button
              onClick={() => router.push("/")}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:bg-[#3A3D45] rounded-md"
              aria-label={t("sidebar.logout")}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span>{t("sidebar.logout")}</span>}
            </button>

            {!isCollapsed && (
              <div className="px-3 py-2 text-xs text-gray-400 border-t border-gray-700">
                © {currentYear} modelplus.ai
              </div>
            )}
          </SidebarFooter>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
