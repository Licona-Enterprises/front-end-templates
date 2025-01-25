"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  agentName: z.string().min(2, {
    message: "Agent name must be at least 2 characters.",
  }),
  strategyType: z.string(),
  startingPortfolio: z.number().min(100, {
    message: "Starting portfolio must be at least 100.",
  }),
  maxTradeFrequency: z.number().min(1).max(100),
  tokenPreference: z.array(z.string()).min(1, {
    message: "Select at least one token.",
  }),
  persona: z.string().min(10, {
    message: "Persona must be at least 10 characters.",
  }),
  knowledgeBase: z
    .instanceof(File)
    .optional()
    .or(
      z.string().min(1, {
        message: "Please upload a knowledge base file or enter a URL.",
      }),
    ),
})

export default function LaunchAgentPage() {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentName: "",
      strategyType: "",
      startingPortfolio: 1000,
      maxTradeFrequency: 10,
      tokenPreference: [],
      persona: "",
      knowledgeBase: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "Agent Launched",
      description: `${values.agentName} has been successfully launched.`,
    })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Launch Agent</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="agentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Trading Agent" {...field} />
                </FormControl>
                <FormDescription>Give your agent a unique name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="strategyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Strategy Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a strategy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="momentum">Momentum</SelectItem>
                    <SelectItem value="arbitrage">Arbitrage</SelectItem>
                    <SelectItem value="meanReversion">Mean Reversion</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Choose the trading strategy for your agent.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startingPortfolio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starting Portfolio</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
                </FormControl>
                <FormDescription>Enter the initial portfolio value in USD.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxTradeFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Trade Frequency (per hour)</FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={100}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormDescription>Set the maximum number of trades per hour.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tokenPreference"
            render={() => (
              <FormItem>
                <FormLabel>Token Preference</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {["BTC", "ETH", "XRP", "LTC", "ADA"].map((token) => (
                      <Button
                        key={token}
                        type="button"
                        variant={selectedTokens.includes(token) ? "default" : "outline"}
                        onClick={() => {
                          const newSelection = selectedTokens.includes(token)
                            ? selectedTokens.filter((t) => t !== token)
                            : [...selectedTokens, token]
                          setSelectedTokens(newSelection)
                          form.setValue("tokenPreference", newSelection)
                        }}
                      >
                        {token}
                      </Button>
                    ))}
                  </div>
                </FormControl>
                <FormDescription>Select the tokens your agent will trade.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="persona"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent Persona</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your agent's personality and behavior..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Define your agent's persona and characteristics.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="knowledgeBase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Knowledge Base</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".txt,.pdf,.doc,.docx"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                    <span className="text-sm text-muted-foreground">or</span>
                    <Input
                      type="url"
                      placeholder="Enter knowledge base URL"
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </div>
                </FormControl>
                <FormDescription>Upload a file or provide a URL for the agent's knowledge base.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Launch Agent</Button>
        </form>
      </Form>
    </div>
  )
}

