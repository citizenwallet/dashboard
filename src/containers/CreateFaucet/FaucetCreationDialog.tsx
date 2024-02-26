"use client";

import { Config } from "@citizenwallet/sdk";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button, Theme } from "@radix-ui/themes";
import { Faucet } from ".";
import "@radix-ui/themes/styles.css";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useMediaQuery from "@/hooks/mediaQuery";

interface FaucetCreationDialogProps {
  faucet: Faucet;
  community: Config;
}

export default function FaucetCreationDialog({
  faucet,
  community: { community, token },
}: FaucetCreationDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isDesktop === undefined) {
    return null;
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="cursor-pointer" variant="soft">
            Create <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Theme accentColor="purple" grayColor="sand" radius="large">
            <DialogHeader>
              <DialogTitle>Create {faucet.title}</DialogTitle>
              <DialogDescription>{token.name}</DialogDescription>
            </DialogHeader>
            <div> hello</div>
            <DialogFooter>
              <Button variant="soft">Submit</Button>
            </DialogFooter>
          </Theme>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="soft" className="cursor-pointer">
          Create <PlusIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Theme accentColor="purple" grayColor="sand" radius="large">
          <DrawerHeader>
            <DrawerTitle>Create {faucet.title}</DrawerTitle>
            <DrawerDescription>{token.name}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant="soft">Submit</Button>
          </DrawerFooter>
        </Theme>
      </DrawerContent>
    </Drawer>
  );
}
