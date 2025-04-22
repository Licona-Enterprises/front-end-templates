"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bot, Brain, Check, ChevronRight, Clock, Cog, FileText, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const steps = [
  { id: "persona", title: "Persona", icon: Brain },
  { id: "knowledge", title: "Knowledge", icon: FileText },
  { id: "tools", title: "Tools", icon: Cog },
  { id: "execution", title: "Execution", icon: Clock },
  { id: "review", title: "Review", icon: Check },
]

const personaOptions = [
  {
    id: "defi-optimizer",
    name: "DeFi Optimizer",
    description: "Optimizes yield across DeFi protocols based on risk parameters",
    icon: Bot,
  },
  {
    id: "bitcoin-accumulator",
    name: "Bitcoin Accumulator",
    description: "Accumulates Bitcoin using dollar-cost averaging and market timing",
    icon: Bot,
  },
  {
    id: "stablecoin-manager",
    name: "Stablecoin Manager",
    description: "Manages stablecoin allocations for maximum yield with minimal risk",
    icon: Bot,
  },
  {
    id: "altcoin-trader",
    name: "Altcoin Trader",
    description: "Trades altcoins based on technical analysis and market sentiment",
    icon: Bot,
  },
  {
    id: "custom",
    name: "Custom Agent",
    description: "Create a completely custom agent with your own parameters",
    icon: Bot,
  },
]

const knowledgeBaseOptions = [
  {
    id: "defi-protocols",
    name: "DeFi Protocols",
    description: "Knowledge about major DeFi protocols, risks, and yield strategies",
  },
  {
    id: "market-data",
    name: "Market Data",
    description: "Historical market data, trends, and technical analysis patterns",
  },
  {
    id: "crypto-news",
    name: "Crypto News",
    description: "Recent crypto news, sentiment analysis, and market events",
  },
  {
    id: "custom",
    name: "Custom Knowledge",
    description: "Upload your own documents to create a custom knowledge base",
  },
]

const toolOptions = [
  {
    id: "swap",
    name: "Token Swapping",
    description: "Ability to swap between different tokens",
  },
  {
    id: "lending",
    name: "Lending & Borrowing",
    description: "Interact with lending protocols to lend or borrow assets",
  },
  {
    id: "staking",
    name: "Staking",
    description: "Stake assets for yield generation",
  },
  {
    id: "portfolio",
    name: "Portfolio Balancing",
    description: "Rebalance portfolio based on target allocations",
  },
]

export function AgentCreationWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    persona: "",
    customPersona: "",
    knowledgeBase: [],
    customKnowledge: "",
    tools: [],
    frequency: "hourly",
    objective: "",
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit form
      router.push("/")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleToolToggle = (toolId: string) => {
    const tools = [...formData.tools] as string[]
    if (tools.includes(toolId)) {
      setFormData({ ...formData, tools: tools.filter((id) => id !== toolId) })
    } else {
      setFormData({ ...formData, tools: [...tools, toolId] })
    }
  }

  const handleKnowledgeToggle = (knowledgeId: string) => {
    const knowledgeBase = [...formData.knowledgeBase] as string[]
    if (knowledgeBase.includes(knowledgeId)) {
      setFormData({ ...formData, knowledgeBase: knowledgeBase.filter((id) => id !== knowledgeId) })
    } else {
      setFormData({ ...formData, knowledgeBase: [...knowledgeBase, knowledgeId] })
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Create Agent</h2>
        <p className="text-gray-400">Configure your autonomous agent to execute your strategy</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex w-full items-center gap-1">
          {steps.map((step, index) => (
            <div key={step.id} className="flex w-full items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  index < currentStep
                    ? "border-accent bg-accent text-white"
                    : index === currentStep
                      ? "border-accent text-accent"
                      : "border-gray-600 text-gray-600"
                }`}
              >
                {index < currentStep ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 transition-all duration-300 ${index < currentStep ? "bg-accent" : "bg-gray-600"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden items-center justify-center gap-4 text-sm text-gray-400 md:flex">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center gap-1 transition-all duration-300 ${index <= currentStep ? "text-white" : ""}`}
          >
            <step.icon className="h-4 w-4" />
            <span>{step.title}</span>
          </div>
        ))}
      </div>

      <Card className="rounded-2xl border border-gray-800 bg-card shadow-md">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription className="text-gray-400">
            {currentStep === 0 && "Choose or create a persona for your agent"}
            {currentStep === 1 && "Select knowledge sources for your agent"}
            {currentStep === 2 && "Configure the tools your agent can use"}
            {currentStep === 3 && "Set execution parameters and objectives"}
            {currentStep === 4 && "Review your agent configuration"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Persona */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="My Autonomous Agent"
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-700 bg-gray-800 focus:border-accent focus:ring-accent"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what this agent does..."
                    value={formData.description}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-700 bg-gray-800 focus:border-accent focus:ring-accent"
                  />
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-4">
                <Label className="text-gray-400 uppercase text-xs tracking-widest">Select a Persona</Label>
                <RadioGroup
                  value={formData.persona}
                  onValueChange={(value) => handleSelectChange("persona", value)}
                  className="grid gap-4 md:grid-cols-2"
                >
                  {personaOptions.map((persona) => (
                    <div key={persona.id}>
                      <RadioGroupItem value={persona.id} id={persona.id} className="peer sr-only" />
                      <Label
                        htmlFor={persona.id}
                        className="flex cursor-pointer flex-col space-y-2 rounded-xl border border-gray-700 p-4 transition-all duration-300 hover:bg-gray-800 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10"
                      >
                        <div className="flex items-center gap-2">
                          <persona.icon className="h-5 w-5 text-accent" />
                          <span className="font-medium">{persona.name}</span>
                        </div>
                        <p className="text-sm text-gray-400">{persona.description}</p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {formData.persona === "custom" && (
                <div className="grid gap-2">
                  <Label htmlFor="customPersona">Custom Persona Description</Label>
                  <Textarea
                    id="customPersona"
                    name="customPersona"
                    placeholder="Describe the persona and behavior of your agent..."
                    value={formData.customPersona}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-700 bg-gray-800 focus:border-accent focus:ring-accent"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Knowledge */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-gray-400 uppercase text-xs tracking-widest">Select Knowledge Sources</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  {knowledgeBaseOptions.map((knowledge) => (
                    <div
                      key={knowledge.id}
                      className={`flex cursor-pointer flex-col space-y-2 rounded-xl border border-gray-700 p-4 transition-all duration-300 hover:bg-gray-800 ${
                        formData.knowledgeBase.includes(knowledge.id) ? "border-accent bg-accent/10" : ""
                      }`}
                      onClick={() => handleKnowledgeToggle(knowledge.id)}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-accent" />
                        <span className="font-medium">{knowledge.name}</span>
                      </div>
                      <p className="text-sm text-gray-400">{knowledge.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {formData.knowledgeBase.includes("custom") && (
                <div className="grid gap-2">
                  <Label htmlFor="customKnowledge">Custom Knowledge Description</Label>
                  <Textarea
                    id="customKnowledge"
                    name="customKnowledge"
                    placeholder="Describe the custom knowledge sources you want to provide..."
                    value={formData.customKnowledge}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-700 bg-gray-800 focus:border-accent focus:ring-accent"
                  />
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-2xl border border-gray-600 hover:bg-gray-800"
                    >
                      Upload Documents
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Tools */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-gray-400 uppercase text-xs tracking-widest">Select Tools</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  {toolOptions.map((tool) => (
                    <div
                      key={tool.id}
                      className={`flex cursor-pointer flex-col space-y-2 rounded-xl border border-gray-700 p-4 transition-all duration-300 hover:bg-gray-800 ${
                        formData.tools.includes(tool.id) ? "border-accent bg-accent/10" : ""
                      }`}
                      onClick={() => handleToolToggle(tool.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Cog className="h-5 w-5 text-accent" />
                        <span className="font-medium">{tool.name}</span>
                      </div>
                      <p className="text-sm text-gray-400">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-700 p-4">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-accent" />
                  <span className="font-medium">Simulated Portfolio</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Your agent will have access to a simulated portfolio with mock assets for demonstration purposes.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Execution */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="frequency">Execution Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value) => handleSelectChange("frequency", value)}>
                    <SelectTrigger className="rounded-xl border border-gray-700 bg-gray-800">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-gray-700 bg-card">
                      <SelectItem value="minutes">Every 5 minutes</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="manual">Manual Trigger Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="objective">Agent Objective</Label>
                  <Textarea
                    id="objective"
                    name="objective"
                    placeholder="Describe the objective and success criteria for this agent..."
                    value={formData.objective}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-700 bg-gray-800 focus:border-accent focus:ring-accent"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-gray-700 p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <span className="font-medium">Execution Timeline</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  In this demo, agent execution will be simulated with pre-generated results to showcase the platform's
                  capabilities.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-700 p-4">
                <h3 className="text-lg font-medium">Agent Configuration</h3>
                <div className="mt-4 grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-400">Name</div>
                    <div className="col-span-2 text-sm">{formData.name || "Unnamed Agent"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-400">Description</div>
                    <div className="col-span-2 text-sm">{formData.description || "No description provided"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-400">Persona</div>
                    <div className="col-span-2 text-sm">
                      {personaOptions.find((p) => p.id === formData.persona)?.name || "Custom Persona"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-400">Knowledge Base</div>
                    <div className="col-span-2 text-sm">
                      {formData.knowledgeBase.length > 0
                        ? formData.knowledgeBase
                            .map((kb) => knowledgeBaseOptions.find((k) => k.id === kb)?.name)
                            .join(", ")
                        : "No knowledge base selected"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-400">Tools</div>
                    <div className="col-span-2 text-sm">
                      {formData.tools.length > 0
                        ? formData.tools.map((t) => toolOptions.find((tool) => tool.id === t)?.name).join(", ")
                        : "No tools selected"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-400">Frequency</div>
                    <div className="col-span-2 text-sm">
                      {formData.frequency === "minutes" && "Every 5 minutes"}
                      {formData.frequency === "hourly" && "Hourly"}
                      {formData.frequency === "daily" && "Daily"}
                      {formData.frequency === "weekly" && "Weekly"}
                      {formData.frequency === "manual" && "Manual Trigger Only"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-400">Objective</div>
                    <div className="col-span-2 text-sm">{formData.objective || "No objective provided"}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-warning">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Demo Mode</span>
                </div>
                <p className="mt-2 text-sm">
                  This agent will be created in demo mode with simulated data and transactions. No real assets will be
                  used.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-800">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="rounded-2xl border border-gray-600 hover:bg-gray-800"
          >
            Back
          </Button>
          <Button onClick={handleNext} className="btn btn-primary">
            {currentStep < steps.length - 1 ? (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Create Agent"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
