"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Bot, BrainCircuit, ClipboardList, Home, LogOut, Plus, Settings, User2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isDemo, setIsDemo] = useState(true)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar pathname={pathname} />
        <SidebarInset>
          <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-800/50 bg-black/30 px-8 backdrop-blur">
            <SidebarTrigger />
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">Agent 47</h1>
                {isDemo && (
                  <div className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">Demo</div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Button className="btn btn-primary" size="sm" asChild>
                  <Link href="/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Agent
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border border-gray-800/50 rounded-lg shadow-md">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-800/50" />
                    <DropdownMenuItem className="hover:bg-gray-800/50 focus:bg-gray-800/50">
                      <User2 className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-800/50 focus:bg-gray-800/50">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-800/50" />
                    <DropdownMenuItem className="hover:bg-gray-800/50 focus:bg-gray-800/50">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <main className="mx-auto max-w-[1440px] flex-1 overflow-auto px-8 py-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function AppSidebar({ pathname }: { pathname: string }) {
  return (
    <Sidebar className="border-r border-gray-800/50">
      <SidebarHeader className="flex h-16 items-center border-b border-gray-800/50 px-6">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-accent" />
          <span className="text-lg font-bold">Agent 47</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/"}
                  className={pathname === "/" ? "bg-gray-800/50 border-l-2 border-accent" : ""}
                >
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/create"}
                  className={pathname === "/create" ? "bg-gray-800/50 border-l-2 border-accent" : ""}
                >
                  <Link href="/create">
                    <Plus className="h-4 w-4" />
                    <span>Create Agent</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/multi-agent"}
                  className={pathname === "/multi-agent" ? "bg-gray-800/50 border-l-2 border-accent" : ""}
                >
                  <Link href="/multi-agent">
                    <Bot className="h-4 w-4" />
                    <span>Multi-Agent View</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/logs"}
                  className={pathname === "/logs" ? "bg-gray-800/50 border-l-2 border-accent" : ""}
                >
                  <Link href="/logs">
                    <ClipboardList className="h-4 w-4" />
                    <span>Agent Logs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 uppercase text-xs tracking-wider">Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <BarChart3 className="h-4 w-4" />
                    <span>Performance</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-800/50 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-400">Demo Account</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
