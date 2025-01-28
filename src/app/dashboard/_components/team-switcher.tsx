"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import useAuthStore from "@/store"

// Import Organization type (adjust path if needed)
// import { Organization } from '@/types';
// Or define it here if it's not defined elsewhere:
type Organization = {
    id: string;
    name: string;
    // ... other properties of your Organization type
};

export function TeamSwitcher() {
    const { isMobile } = useSidebar()
    const [orgData, setOrgData] = useState<Organization | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { userOrgId } = useAuthStore()

    useEffect(() => {
        const fetchOrgData = async () => {
            if (!userOrgId) {
                setLoading(false);
                return
            }
            try {
                setLoading(true)
                // Use the new endpoint to fetch organization by ID
                const response = await fetch(`/api/places/get-org-by-id?organizationId=${userOrgId}`)

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const orgData = await response.json()

                if (orgData.success) {
                    // Update state with the fetched organization
                    setOrgData(orgData.data)
                } else {
                    setError(orgData.error || 'Organization not found')
                }
            } catch (error) {
                console.error('Error fetching organization data:', error)
                setError('Failed to load organization data')
            } finally {
                setLoading(false)
            }
        }

        fetchOrgData()
    }, [userOrgId])

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-6 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                {/* Placeholder for organization logo */}
                                <span className="text-xs">{orgData?.name ? orgData.name.charAt(0) : ''}</span>
                            </div>

                            {loading ? (
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate">Loading...</span>
                                </div>
                            ) : error ? (
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate text-red-500">{error}</span>
                                </div>
                            ) : (
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {orgData?.name || 'Unknown Organization'}
                                    </span>
                                </div>
                            )}

                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
