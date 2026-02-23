"use client"

import { Key, User, CreditCard, ShieldAlert, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
    const router = useRouter()
    const { data: session, isPending } = authClient.useSession()

    const [name, setName] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const [isUpdatingName, setIsUpdatingName] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [isDeletingAccount, setIsDeletingAccount] = useState(false)
    const [isGoogleAuth, setIsGoogleAuth] = useState(false)

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name)
        }

        const checkGoogleAuth = async () => {
            try {
                const res = await authClient.listAccounts()
                if (res.data) {
                    const hasGoogle = res.data.some((acc: any) => acc.providerId === "google" || acc.provider === "google")
                    setIsGoogleAuth(hasGoogle)
                }
            } catch (error) {
                console.error("Failed to list accounts", error)
            }
        }

        if (session?.user) {
            checkGoogleAuth()
        }
    }, [session])

    const handleUpdateName = async () => {
        if (!name) return
        setIsUpdatingName(true)
        await authClient.updateUser({
            name: name
        }, {
            onSuccess: () => {
                toast.success("Name updated successfully")
                setIsUpdatingName(false)
            },
            onError: (ctx) => {
                toast.error(ctx.error.message || "Failed to update name")
                setIsUpdatingName(false)
            }
        })
    }

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) {
            toast.error("Please fill in both password fields.")
            return
        }
        setIsChangingPassword(true)
        await authClient.changePassword({
            newPassword: newPassword,
            currentPassword: currentPassword,
            revokeOtherSessions: true
        }, {
            onSuccess: () => {
                toast.success("Password changed successfully")
                setCurrentPassword("")
                setNewPassword("")
                setIsChangingPassword(false)
            },
            onError: (ctx) => {
                toast.error(ctx.error.message || "Failed to change password")
                setIsChangingPassword(false)
            }
        })
    }

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) return
        setIsDeletingAccount(true)
        await authClient.deleteUser({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Account deleted successfully")
                    router.push("/login")
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message || "Failed to delete account")
                    setIsDeletingAccount(false)
                }
            }
        })
    }
    return (
        <section className="p-6 bg-background/50 min-h-full space-y-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your profile, security, and subscription preferences</p>
                </div>

                <div className="space-y-6">

                    {/* Profile Information */}
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <h2 className="text-xl font-semibold text-card-foreground mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-emerald-500" />
                            Profile Information
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm text-muted-foreground font-medium">Display Name</label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={isPending || isUpdatingName}
                                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                                    />
                                    <Button onClick={handleUpdateName} disabled={isPending || isUpdatingName || name === session?.user?.name} className="h-[42px] bg-emerald-600 hover:bg-emerald-700 text-white">
                                        {isUpdatingName ? <Loader2 className="animate-spin w-4 h-4" /> : "Save"}
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-muted-foreground font-medium">Email Address</label>
                                <input
                                    type="email"
                                    value={session?.user?.email || ""}
                                    disabled
                                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-muted-foreground cursor-not-allowed"
                                />
                                <p className="text-xs text-muted-foreground">Contact support to change your email address.</p>
                            </div>
                        </div>

                        {/* Subscription Status */}
                        <div className="mt-8 pt-6 border-t border-border">
                            <h3 className="text-lg font-medium text-card-foreground mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-purple-500" />
                                Current Subscription
                            </h3>
                            <div className="bg-muted/30 p-4 rounded-xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-foreground font-semibold text-lg">Pro Plan</span>
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">Active</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm">Next billing date: <span className="text-foreground">October 24, 2026</span></p>
                                </div>
                                <div className="flex gap-3">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="border-border bg-background text-foreground hover:bg-muted">Change Plan</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[700px] bg-popover border-border text-popover-foreground">
                                            <DialogHeader>
                                                <DialogTitle className="text-popover-foreground text-xl">Choose your plan</DialogTitle>
                                                <DialogDescription className="text-muted-foreground">
                                                    Unlock advanced features with our Pro plan.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                                {/* ESSENTIAL PLAN */}
                                                <div className="border border-border rounded-xl p-5 bg-card flex flex-col relative overflow-hidden">
                                                    <div className="mb-4">
                                                        <h3 className="text-lg font-semibold text-card-foreground">Essential</h3>
                                                        <p className="text-muted-foreground text-sm">Perfect for getting started</p>
                                                    </div>
                                                    <div className="mb-6">
                                                        <span className="text-3xl font-bold text-card-foreground">$0</span>
                                                        <span className="text-muted-foreground">/month</span>
                                                    </div>
                                                    <ul className="space-y-3 mb-8 text-sm text-muted-foreground flex-1">
                                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Basic Analytics</li>
                                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> up to 3 Accounts</li>
                                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 5 Strategies</li>
                                                    </ul>
                                                    <Button disabled className="w-full bg-muted text-muted-foreground border border-border">Current Plan</Button>
                                                </div>

                                                {/* PRO PLAN */}
                                                <div className="border border-emerald-500/50 rounded-xl p-5 bg-emerald-500/5 flex flex-col relative">
                                                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                                        RECOMMENDED
                                                    </div>
                                                    <div className="mb-4">
                                                        <h3 className="text-lg font-semibold text-foreground">Pro Trader</h3>
                                                        <p className="text-emerald-500/80 text-sm">For serious traders</p>
                                                    </div>
                                                    <div className="mb-6">
                                                        <span className="text-3xl font-bold text-foreground">$29</span>
                                                        <span className="text-muted-foreground">/month</span>
                                                    </div>
                                                    <ul className="space-y-3 mb-8 text-sm text-muted-foreground flex-1">
                                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Advanced Analytics & Charts</li>
                                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited Accounts</li>
                                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited Strategies</li>
                                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Priority Support</li>
                                                    </ul>
                                                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                                                        Upgrade to Pro
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">Cancel Subscription</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <h2 className="text-xl font-semibold text-card-foreground mb-6 flex items-center gap-2">
                            <Key className="w-5 h-5 text-orange-500" />
                            Change Password
                        </h2>
                        {isGoogleAuth ? (
                            <div className="p-4 bg-muted/50 rounded-xl border border-border">
                                <p className="text-muted-foreground">You are authenticated using Google.</p>
                            </div>
                        ) : (
                            <div className="max-w-md space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground font-medium">Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        disabled={isChangingPassword}
                                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground font-medium">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={isChangingPassword}
                                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                                    />
                                </div>
                                <Button onClick={handleChangePassword} disabled={isChangingPassword || !currentPassword || !newPassword} className="bg-muted hover:bg-muted/80 text-foreground border border-border">
                                    {isChangingPassword ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                                    Update Password
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Danger Zone - Delete Account */}
                    <div className="bg-destructive/5 border border-destructive/20 p-6 rounded-2xl">
                        <h2 className="text-xl font-semibold text-destructive mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5" />
                            Danger Zone
                        </h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-foreground font-medium">Delete Account</p>
                                <p className="text-sm text-muted-foreground mt-1">Permanently remove your account and all of its content.</p>
                            </div>
                            <Button onClick={handleDeleteAccount} disabled={isDeletingAccount} variant="destructive" className="bg-destructive/10 hover:bg-destructive text-destructive hover:text-white border border-destructive/30">
                                {isDeletingAccount ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                                Delete Account
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
