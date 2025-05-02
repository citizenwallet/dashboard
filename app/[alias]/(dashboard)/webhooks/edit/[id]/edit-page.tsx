"use client"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Webhook } from "@/services/chain-db/webhooks"
import { Config } from "@citizenwallet/sdk"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { deleteWebhookAction, updateWebhookAction } from "../../action"
import { Event } from "@/services/chain-db/event"


const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    event_topic: z.string().optional(),
    url: z.string().url({ message: "Please enter a valid URL" }),
})

type WebhookFormProps = {
    webhook?: Webhook
    config: Config
    events: Event[]
    selectedEvent: Event | null
}

export function WebhookForm({
    webhook,
    config,
    events,
    selectedEvent
}: WebhookFormProps
) {

    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [open, setOpen] = useState(false)
    const [eventTopic, setEventTopic] = useState<Event | null>(selectedEvent)

    // Initialize the form with default values or existing webhook data
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: webhook?.name || "",
            event_topic: webhook?.event_topic || "",
            url: webhook?.url || "",
        },
    })

    // Handle form submission
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSaving(true)

        try {
            await updateWebhookAction({
                config,
                id: webhook?.id || "",
                webhook: {
                    ...values,
                    event_contract: eventTopic?.contract,
                    event_topic: eventTopic?.topic
                }
            });

            toast.success('Webhook updated successfully', {
                onAutoClose: () => {
                    router.push(`/${config.community.alias}/webhooks`);
                }
            });
        } catch (error) {
            console.error(error)
            toast.error('Could not update webhook');
        } finally {
            setIsSaving(false)
        }
    }


    // Handle webhook deletion
    async function deleteWebhook() {
        if (!webhook?.id) return
        try {
            await deleteWebhookAction({
                config,
                id: webhook.id
            });
            setIsDeleting(true)
            toast.success('Webhook removed successfully', {
                onAutoClose: () => {
                    router.push(`/${config.community.alias}/webhooks`);
                }
            });
        } catch (error) {
            console.error(error)
            toast.error('Could not remove webhook');
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="space-y-6">
            <Form {...form}>

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
                    name="event_topic"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Topic</FormLabel>
                            <FormControl>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="w-full justify-between"
                                        >
                                            {eventTopic
                                                ? eventTopic.name
                                                : "Select event..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search event..." />
                                            <CommandList>
                                                <CommandEmpty>No event found.</CommandEmpty>
                                                <CommandGroup>
                                                    {events.map((event) => (
                                                        <CommandItem
                                                            key={event.id}
                                                            value={event.id}
                                                            onSelect={(currentValue) => {
                                                                setEventTopic(currentValue === eventTopic?.id ? null : event)
                                                                setOpen(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    eventTopic?.id === event.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {event.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
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

                    <Button type="submit" disabled={isSaving} onClick={form.handleSubmit(onSubmit)}>
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>

            </Form>
        </div>
    )
}
