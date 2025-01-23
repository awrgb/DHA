"use client"

import { useEffect, useState, useTransition } from "react"

import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { getUserProfile, settings } from "@/actions/settings"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { SettingsSchema } from "@/resources/schemas"
import { UserProfile } from "@/types/api"

export const dynamic = "force-dynamic"

const SettingsPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [isPending, setIsPending] = useState(false)
  const [isTransitionPending, startTransition] = useTransition()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingValues, setPendingValues] = useState<z.infer<
    typeof SettingsSchema
  > | null>(null)

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
      role: (user?.role as "admin" | "user") ?? "user",
      isTwoFactorEnabled: user?.is_two_factor_enabled ?? false,
      password: undefined,
      newPassword: undefined,
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { UserProfile: user, success, error } = await getUserProfile()
        if (error) {
          setError(error)
          return
        }

        if (success && user) {
          form.reset({
            name: user.name ?? "",
            username: user.username ?? "",
            email: user.email ?? "",
            role: user.role ?? "user",
            isTwoFactorEnabled: user.is_two_factor_enabled ?? false,
            password: undefined,
            newPassword: undefined,
          })
          setUser(user)
        }
      } catch (error) {
        console.error("[GET_USER_PROFILE]", error)
        setError("Failed to load profile")
      }
    }
    fetchProfile()
  }, [form])

  const handleSubmit = async (values: z.infer<typeof SettingsSchema>) => {
    try {
      setError(undefined)
      setSuccess(undefined)
      setIsPending(true)
      setPendingValues(null)
      setShowConfirmDialog(false)

      const result = await settings(values)

      if (result?.error) {
        setError(result.error)
        return
      }

      if (result?.success) {
        setSuccess(result.success)
        form.reset({
          ...values,
          password: undefined,
          newPassword: undefined,
        })

        startTransition(() => {
          router.refresh()
        })
      }
    } catch (error) {
      console.error("[SETTINGS]", error)
      setError("Something went wrong!")
    } finally {
      setIsPending(false)
    }
  }

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    if (values.password && values.newPassword) {
      setPendingValues(values)
      setShowConfirmDialog(true)
    } else {
      handleSubmit(values)
    }
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">⚙️ Settings</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault()

              form.handleSubmit(
                (values) => {
                  onSubmit(values)
                },
                (errors) => {
                  console.error("Form validation failed:", errors)
                }
              )(e)
            }}
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="john@example.com"
                        type="email"
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!user?.is_oauth && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="******"
                            type="password"
                            disabled={isPending || isTransitionPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="******"
                            type="password"
                            disabled={isPending || isTransitionPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {user?.role === "admin" && (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        disabled={isPending || isTransitionPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!user?.is_oauth && (
                <FormField
                  control={form.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Two Factor Authentication</FormLabel>
                        <FormDescription>
                          Enable two factor authentication for your account
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={isPending || isTransitionPending}
                          checked={field.value}
                          onCheckedChange={async (checked) => {
                            field.onChange(checked)
                            // Submit only 2FA change
                            const result = await settings({
                              isTwoFactorEnabled: checked,
                              role: user?.role || "user",
                              name: user?.name || "",
                              email: user?.email || "",
                            })

                            if (result?.error) {
                              setError(result.error)
                              return
                            }

                            if (result?.success) {
                              setSuccess(result.success)
                              startTransition(() => {
                                router.refresh()
                              })
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
            {user?.is_oauth && (
              <FormMessage>
                Social login accounts cannot modify their credentials
              </FormMessage>
            )}
            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}
            <Button disabled={isPending || isTransitionPending} type="submit">
              Save
            </Button>
          </form>
        </Form>

        <ConfirmDialog
          title="Confirm Password Change"
          description="Are you sure you want to change your password? You will need to use the new password for your next login."
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={() => {
            if (pendingValues) {
              handleSubmit(pendingValues)
              setShowConfirmDialog(false)
              setPendingValues(null)
            }
          }}
          onCancel={() => {
            setShowConfirmDialog(false)
            setPendingValues(null)
            form.reset({
              ...form.getValues(),
              password: undefined,
              newPassword: undefined,
            })
          }}
        />
      </CardContent>
    </Card>
  )
}

export default SettingsPage
