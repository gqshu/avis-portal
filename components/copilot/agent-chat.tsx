"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useI18n } from "@/lib/i18n/i18n-context"
import type { Agent } from "@/lib/types/agent"

// Mock agents for the dropdown
const mockAgents = [
  { id: "agent-001", name: "Video Surveillance Agent" },
  { id: "agent-002", name: "Data Processing Agent" },
  { id: "agent-003", name: "Anomaly Detection Agent" },
]

interface Message {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
}

export function AgentChat() {
  const { t } = useI18n()
  const [selectedAgent, setSelectedAgent] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [agents, setAgents] = useState<Pick<Agent, "id" | "name">[]>(mockAgents)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedAgent) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate agent response after a short delay
    setTimeout(() => {
      const selectedAgentName = agents.find((a) => a.id === selectedAgent)?.name || "Agent"
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `This is a simulated response from ${selectedAgentName}. The actual agent integration will be implemented in a future update.`,
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentMessage])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col overflow-hidden border-0 rounded-none shadow-none">
        <CardHeader className="py-2 px-4 border-b">
          <div className="flex justify-end items-center">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t("copilot.selectAgent")} />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-4 py-2">
            {messages.length === 0 && !selectedAgent && (
              <div className="h-full flex items-center justify-center text-center text-gray-500">
                <div></div>
              </div>
            )}

            {messages.length === 0 && selectedAgent && (
              <div className="h-full flex items-center justify-center text-center text-gray-500">
                <div>
                  <p>{t("copilot.startChat")}</p>
                  <p className="text-sm mt-2">
                    {t("copilot.agent")}: {agents.find((a) => a.id === selectedAgent)?.name}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.sender === "user"
                        ? "bg-[#6C47FF] text-white"
                        : "bg-gray-100 text-gray-800 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === "agent" ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      <span className="text-xs font-medium">
                        {message.sender === "user"
                          ? t("copilot.you")
                          : agents.find((a) => a.id === selectedAgent)?.name || t("copilot.agent")}
                      </span>
                      <span className="text-xs opacity-70 ml-auto">{formatTime(message.timestamp)}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="px-4 py-3 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedAgent ? t("copilot.messagePlaceholder") : t("copilot.noAgentSelected")}
                disabled={!selectedAgent}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || !selectedAgent}
                className="bg-[#6C47FF] hover:bg-[#5A3CD7]"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">{t("copilot.send")}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
