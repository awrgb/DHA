"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { SettingsSchema } from "@/resources/schemas"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { getUserProfile } from "@/actions/settings"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { UserProfile } from "@/types/api"

export function NavUser() {
  const { isMobile } = useSidebar()
  const [error, setError] = useState<string | undefined>()
  const [fetchedUser, setFetchedUser] = useState<UserProfile | null>(null)

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
  })
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { UserProfile: user, success, error } = await getUserProfile()
        if (error) {
          setError(error)
          return
        }
        if (user) {
          setFetchedUser(user)
        }
      } catch (error) {
        console.error("[GET_USER_PROFILE]", error)
        setError("Failed to load profile")
      }
    }
    fetchProfile()
  }, [form])
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {fetchedUser?.image ? (
                  <AvatarImage src={fetchedUser.image} alt={fetchedUser?.name} />
                ) : (
                  <AvatarFallback className="rounded-lg">
                    {getAvatarFallback(fetchedUser?.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {fetchedUser?.name}
                </span>
                <span className="truncate text-xs">{fetchedUser?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {fetchedUser?.image ? (
                    <AvatarImage src={fetchedUser.image} alt={fetchedUser?.name} />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {getAvatarFallback(fetchedUser?.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {fetchedUser?.name}
                  </span>
                  <span className="truncate text-xs">{fetchedUser?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function getAvatarFallback(name: string | undefined): string {
  if (!name) return ""
  const [firstName, lastName] = name.split(" ")
  if (lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }
  return `${firstName.charAt(0)}`.toUpperCase()
}
