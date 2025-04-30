"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Webhook } from "@/services/chain-db/webhooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    eventTopic: z.string().min(1, { message: "Event topic is required" }),
    url: z.string().url({ message: "Please enter a valid URL" }),
})

type WebhookFormProps = {
    webhook?: Webhook
}

export function WebhookForm({ webhook }: WebhookFormProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Initialize the form with default values or existing webhook data
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: webhook?.name || "",
            eventTopic: webhook?.event_topic || "",
            url: webhook?.url || "",
        },
    })

    // Handle form submission
    async function onSubmit(values: z.infer<typeof formSchema>) {

        setIsSaving(true)


    }

    // Handle webhook deletion
    async function deleteWebhook() {
        if (!webhook?.id) return


        setIsDeleting(true)

    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="My Webhook" {...field} />
                                </FormControl>
                                <FormDescription>A descriptive name for your webhook.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="eventTopic"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event Topic</FormLabel>
                                <FormControl>
                                    <Input placeholder="Event topic" {...field} />
                                </FormControl>
                                <FormDescription>The event that will trigger this webhook.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/webhook" {...field} />
                                </FormControl>
                                <FormDescription>The URL that will receive the webhook payload.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-between">
                        {webhook?.id ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                        disabled={isDeleting}
                                        onClick={() => setIsDialogOpen(true)}
                                    >
                                        <Trash2 size={16} />
                                        Remove
                                    </Button>
                                </div>

                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Remove Webhook</DialogTitle>
                                            <DialogDescription>
                                                Are you sure you want to remove this webhook?
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="sm:justify-start gap-2">
                                            <Button
                                                disabled={isDeleting}
                                                onClick={deleteWebhook}
                                                type="button"
                                                variant="destructive"
                                            >
                                                {isDeleting ? "Removing..." : "Remove"}
                                            </Button>
                                            <DialogClose asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    disabled={isDeleting}
                                                >
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </>
                        ) : (
                            <div />
                        )}

                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
