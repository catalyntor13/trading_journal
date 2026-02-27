"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { deleteStrategy } from "@/app/actions/strategies"
import { toast } from "react-hot-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function DeleteStrategyButton({ id, name }: { id: string, name: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [open, setOpen] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteStrategy(id)
        setIsDeleting(false)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success("Strategy deleted successfully")
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-border/50 text-card-foreground overflow-hidden shadow-2xl p-6">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                            Delete Strategy
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-muted-foreground pt-4 text-left">
                        Are you absolutely sure you want to delete the strategy <span className="font-semibold text-foreground">"{name}"</span>?
                        This action cannot be undone and will permanently remove it from your records.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 sm:justify-end gap-3 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="bg-background hover:bg-muted border-border/50"
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/20"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Yes, Delete Strategy
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
