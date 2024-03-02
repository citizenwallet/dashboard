import {
  Box,
  Button,
  IconButton,
  Text,
  TextField,
  Theme,
} from "@radix-ui/themes";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useState } from "react";
import { CheckoutActions } from "@citizenwallet/sdk";
import { Label } from "@/components/ui/label";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function Container({
  isDesktop,
  actions,
  sessionOwner,
  sessionOwnerError,
  handleClose,
}: {
  isDesktop?: boolean;
  actions: CheckoutActions;
  sessionOwner?: string;
  sessionOwnerError?: boolean;
  handleClose: () => void;
}) {
  const [owner, setOwner] = useState(sessionOwner ?? "");

  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwner(e.target.value);
  };

  const handleClearInput = () => {
    setOwner("");
  };

  const handleConfirm = () => {
    if (!owner || !owner.trim()) {
      return;
    }

    const isValid = actions.setSessionOwner(owner);

    if (isValid) {
      handleClose();
    }
  };

  const Title = sessionOwner ? "Modify Owner" : "Set Owner";
  const Description = sessionOwner
    ? "Change the owner of the faucet."
    : "Set the owner of the faucet.";

  const Content = (
    <Box className="w-full flex flex-col gap-4 p-4 px-6">
      <Label>{sessionOwner ? "New owner" : "Owner"}</Label>
      <TextField.Root>
        <TextField.Input
          type="text"
          placeholder="0x..."
          size="3"
          className={
            owner && sessionOwnerError
              ? "w-full max-w-sm border-red-500"
              : "w-full max-w-sm "
          }
          value={owner}
          onChange={handleOwnerChange}
        />
        {owner && (
          <TextField.Slot>
            <IconButton size="1" variant="ghost" onClick={handleClearInput}>
              <Cross2Icon height={14} width={14} />
            </IconButton>
          </TextField.Slot>
        )}
      </TextField.Root>
      {owner && sessionOwnerError && (
        <Text size="1" className="text-red-500">
          Invalid address.
        </Text>
      )}
    </Box>
  );

  const Footer = (
    <Box
      className="w-full flex flex-col justify-center items-center gap-6"
      pt="4"
      px="4"
    >
      {owner !== sessionOwner && (
        <Button
          variant="soft"
          className="w-full max-w-sm"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      )}
    </Box>
  );

  if (isDesktop) {
    return (
      <Theme
        accentColor="purple"
        grayColor="sand"
        radius="large"
        className="fadeIn"
      >
        <DialogHeader>
          <DialogTitle>{Title}</DialogTitle>
          <DialogDescription>{Description}</DialogDescription>
        </DialogHeader>
        {Content}
        <DialogFooter>{Footer}</DialogFooter>
      </Theme>
    );
  }

  return (
    <Theme
      accentColor="purple"
      grayColor="sand"
      radius="large"
      className="fadeIn"
    >
      <DrawerHeader>
        <DrawerTitle>{Title}</DrawerTitle>
        <DrawerDescription>{Description}</DrawerDescription>
      </DrawerHeader>
      {Content}
      <DrawerFooter>{Footer}</DrawerFooter>
    </Theme>
  );
}
