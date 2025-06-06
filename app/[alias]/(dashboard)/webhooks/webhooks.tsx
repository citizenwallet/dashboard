"use client"
import UrlPagination from '@/components/custom/pagination-via-url';
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from "@/components/ui/separator";
import { Event } from '@/services/chain-db/event';
import { Webhook } from '@/services/chain-db/webhooks';
import { Config } from '@citizenwallet/sdk';
import { Check, ChevronsUpDown, Copy, Plus } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { createColumns } from './_components/columns';
import { createWebhookAction } from './action';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";



export default function Webhooks({
    data,
    count,
    config,
    secret,
    events
}: {
    data: Webhook[]
    count: number
    config: Config
    secret: string
    events: Event[]
}) {

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [eventTopic, setEventTopic] = useState<Event | null>(null);
    const [showError, setShowError] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const isValidUrl = (urlString: string) => {
        try {
            new URL(urlString);
            return true;
        } catch (e) {
            console.error(e)
            setShowError(true);
            return false;
        }
    };

    const handleCreateWebhook = async () => {


        if (!isValidUrl(url)) {
            toast.error('Please enter a valid URL');
            return;
        }

        if (!eventTopic) {
            toast.error('Please select an event');
            return;
        }

        try {
            await createWebhookAction({
                config,
                webhook: {
                    name,
                    url,
                    event_topic: eventTopic?.topic || '',
                    event_contract: eventTopic?.contract || '',
                    alias: config.community.alias
                }
            });

            toast.success('Webhook created successfully');
            router.refresh();
            setIsAddDialogOpen(false);
            setName('');
            setUrl('');
            setEventTopic(null);

        } catch (error) {

            console.error(error);
            toast.error('Failed to create webhook');

        }
    }


    const copyToClipboard = () => {
        navigator.clipboard.writeText(secret || '');
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 3000);
    };


    return (
        <>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <div className="flex justify-start mb-4">
                        <Button >
                            <Plus size={16} />
                            Add Webhook
                        </Button>
                    </div>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Webhook</DialogTitle>
                        <DialogDescription>
                            Add a new webhook to your project.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">

                            <label htmlFor="eventTopic" className="text-sm font-medium">
                                Event Topic
                            </label>

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


                            <label htmlFor="name" className="text-sm font-medium mt-4">
                                Name
                            </label>
                            <Input id="name" placeholder="Webhook Name" value={name} onChange={(e) => setName(e.target.value)} />

                            <label htmlFor="url" className="text-sm font-medium mt-4">
                                URL
                            </label>
                            <Input id="url" placeholder="Webhook URL" value={url}
                                className={`${showError ? 'border-red-500' : ''}`}
                                onChange={(e) => setUrl(e.target.value)} />

                        </div>

                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsAddDialogOpen(false);
                                setShowError(false);
                                setName('');
                                setUrl('');
                                setEventTopic(null);

                            }}
                        >
                            cancel
                        </Button>
                        <Button
                            className="mb-2 md:mb-0"
                            onClick={handleCreateWebhook}
                        >

                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex items-center gap-2 my-2 p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer select-none w-fit">
                <span className="text-sm font-medium text-gray-700">
                    Copy Webhook Secret
                </span>
                {isCopied ? (
                    <Check className="ml-1 h-4 w-4 text-green-500" />
                ) : (
                    <Copy className="ml-1 h-4 w-4 text-gray-500 hover:text-gray-700" onClick={copyToClipboard} />
                )}
            </div>


            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto rounded-md border">
                    <div className="flex-1 overflow-hidden">
                        <div className="h-full overflow-y-auto rounded-md ">
                            <DataTable columns={createColumns(config)} data={data} />
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="sticky bottom-0 left-0 right-0 bg-background flex flex-col sm:flex-row justify-between items-center gap-2 pb-4">
                        <p className="text-sm text-gray-500 whitespace-nowrap">
                            Total: {count}
                        </p>
                        <UrlPagination totalPages={Math.ceil(count / 25)} />
                    </div>
                </div>
            </div>
        </>
    )
}
