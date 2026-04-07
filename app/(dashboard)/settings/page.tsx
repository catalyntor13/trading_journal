"use client"

import { Key, User, CreditCard, ShieldAlert, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Session } from "@/lib/auth-types"




export default function SettingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { data, isPending } = authClient.useSession()
    const session = data as Session;
    const [isOpen, setIsOpen] = useState(false)

    const [name, setName] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const [isUpdatingName, setIsUpdatingName] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [isDeletingAccount, setIsDeletingAccount] = useState(false)
    const [isGoogleAuth, setIsGoogleAuth] = useState(false)


    const expireDate = new Date(session?.user?.subscriptionEndDate);




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


    const handleCancelSubscription = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/billing/cancel", {
                method: "POST",
            });

            if (!res.ok) {
                throw new Error("Failed to cancel subscription");
            }

            toast.success("Subscription cancelled successfully");
            setIsOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Failed to cancel subscription", error);
            toast.error("Failed to cancel subscription");
        } finally {
            setLoading(false)
        }
    }

    const handleRenewPlan = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/billing/checkout", {
                method: "POST",
            });

            if (!res.ok) {
                throw new Error("Failed to renew subscription");
            }

            const data = await res.json();
            window.location.href = data.checkoutUrl;
        } catch (error) {
            console.error("Failed to renew subscription", error);
            toast.error("Failed to renew subscription");
        } finally {
            setLoading(false)
        }
    }


    return (
        <section className="p-4 md:p-8 bg-background/50 min-h-full flex justify-center">
            <div className="w-full max-w-5xl">
                {/* Header */}
                <div className="mb-8 px-2 md:px-0">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Settings</h1>
                    <p className="text-muted-foreground">Manage your account preferences, security, and subscription.</p>
                </div>

                {/* Main Unified Container */}
                <div className="bg-card w-full border border-border shadow-sm rounded-2xl overflow-hidden divide-y divide-border">

                    {/* Profile Information Section */}
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-12">
                        <div className="md:w-1/3 shrink-0">
                            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                                <User className="w-4 h-4 text-emerald-500" />
                                Profile Display
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                                Update your personal details. Changing your display name will update it across the platform.
                            </p>
                        </div>
                        <div className="md:w-2/3 space-y-6 max-w-xl w-full">
                            <div className="space-y-2">
                                <label className="text-sm text-foreground font-medium">Display Name</label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={isPending || isUpdatingName}
                                        className="w-full sm:flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50"
                                        placeholder="Your name"
                                    />
                                    <Button
                                        onClick={handleUpdateName}
                                        disabled={isPending || isUpdatingName || name === session?.user?.name}
                                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white min-w-[100px]"
                                    >
                                        {isUpdatingName ? <Loader2 className="animate-spin w-4 h-4" /> : "Save"}
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-foreground font-medium">Email Address</label>
                                <input
                                    type="email"
                                    value={session?.user?.email || ""}
                                    disabled
                                    className="w-full bg-muted/40 border border-border rounded-lg px-4 py-2 text-muted-foreground cursor-not-allowed opacity-70"
                                />
                                <p className="text-xs text-muted-foreground">To change your associated email address, please contact support.</p>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Section */}
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-12 bg-muted/10">
                        <div className="md:w-1/3 shrink-0">
                            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-blue-500" />
                                Billing & Subscription
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                                Manage your current plan, check your billing cycle, or cancel your subscription.
                            </p>
                        </div>
                        <div className="md:w-2/3 max-w-xl w-full">
                            <div className="bg-background p-5 rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-3">
                                        <span className="text-foreground font-semibold">Pro Plan</span>
                                        {session?.user?.subscriptionStatus === "canceled" ? (
                                            <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold border border-red-500/20">Canceled</span>
                                        ) : (
                                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20">Active</span>
                                        )}
                                    </div>
                                    {session?.user?.subscriptionStatus === "canceled" ? (
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            Your subscription will end on <span className="font-medium text-foreground">{expireDate?.toLocaleDateString()}</span>.
                                        </p>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">
                                            Renews automatically on <span className="font-medium text-foreground">{expireDate?.toLocaleDateString()}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="shrink-0 w-full sm:w-auto">
                                    {session?.user?.subscriptionStatus === "canceled" ? (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-colors"
                                                >
                                                    Renew Plan
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Renew Subscription</DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to renew your subscription?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <Button onClick={handleRenewPlan}>Renew</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full sm:w-auto border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 transition-colors shadow-sm dark:border-red-900/50 dark:hover:bg-red-900/20 dark:text-red-500">
                                                    Cancel Plan
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px] bg-popover border-border text-popover-foreground">
                                                <DialogHeader>
                                                    <DialogTitle>Cancel Subscription</DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to cancel your subscription? You will still be able to access all Pro features until your current billing period ends.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter className="mt-4 gap-2 sm:gap-0">
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Keep Subscription</Button>
                                                    </DialogClose>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={handleCancelSubscription}
                                                        disabled={loading}
                                                    >
                                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                        Yes, Cancel Subscription
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-12">
                        <div className="md:w-1/3 shrink-0">
                            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                                <Key className="w-4 h-4 text-orange-500" />
                                Security Settings
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                                Update your password to keep your account secure. Use a strong, unique password.
                            </p>
                        </div>
                        <div className="md:w-2/3 max-w-xl w-full">
                            {isGoogleAuth ? (
                                <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-600 dark:text-orange-400">
                                    <p className="text-sm flex items-center gap-2 font-medium">
                                        <ShieldAlert className="w-4 h-4" />
                                        Google Authentication Linked
                                    </p>
                                    <p className="text-xs mt-1.5 opacity-80 leading-relaxed">
                                        You are authenticated via Google, so you do not have a separate password for this platform.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-foreground font-medium">Current Password</label>
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                disabled={isChangingPassword}
                                                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all disabled:opacity-50"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-foreground font-medium">New Password</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                disabled={isChangingPassword}
                                                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all disabled:opacity-50"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-start sm:justify-end">
                                        <Button
                                            onClick={handleChangePassword}
                                            disabled={isChangingPassword || !currentPassword || !newPassword}
                                            className="bg-foreground text-background hover:bg-foreground/90 transition-colors w-full sm:w-auto font-medium"
                                        >
                                            {isChangingPassword ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                                            Update Password
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-12 bg-destructive/5">
                        <div className="md:w-1/3 shrink-0">
                            <h2 className="text-base font-semibold text-destructive flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" />
                                Danger Zone
                            </h2>
                            <p className="text-sm text-destructive/80 mt-1.5 leading-relaxed">
                                Irreversible and destructive actions for your account data. Proceed with caution.
                            </p>
                        </div>
                        <div className="md:w-2/3 max-w-xl w-full flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                            <div>
                                <p className="text-foreground font-medium text-sm">Delete Account</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Permanently remove your account and all associated content.</p>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" className="w-full sm:w-auto bg-destructive/90 hover:bg-destructive text-white shadow-sm border border-destructive/30 shrink-0">
                                        {isDeletingAccount ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                                        Delete Account
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] bg-popover border-border text-popover-foreground">
                                    <DialogHeader>
                                        <DialogTitle className="text-destructive flex items-center gap-2">
                                            <ShieldAlert className="w-5 h-5" />
                                            Delete Account
                                        </DialogTitle>
                                        <DialogDescription className="text-muted-foreground pt-2">
                                            Are you absolutely sure you want to permanently delete your account? This action cannot be undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                                        <DialogClose asChild>
                                            <Button variant="outline" className="border-border">Cancel</Button>
                                        </DialogClose>
                                        <Button
                                            onClick={handleDeleteAccount}
                                            disabled={isDeletingAccount}
                                            variant="destructive"
                                            className="bg-destructive hover:bg-destructive/90 text-white"
                                        >
                                            {isDeletingAccount ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                                            Confirm Delete
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
