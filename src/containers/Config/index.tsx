"use client";

import { isAddress } from "ethers";
import { useDebouncedCallback } from "use-debounce";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfigLogic } from "@/state/config/logic";
import { ConfigStep, useConfigStore } from "@/state/config/state";
import ConfigPageTemplate from "@/templates/Config";
import CommunityCheckout from "@/containers/Config/CommunityCheckout";
import {
  CaretDownIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import {
  Avatar,
  Box,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import CoinIcon from "@/assets/icons/coin.svg";
import { useEffect, useState } from "react";
import {
  CommunityFactoryContractService,
  NETWORKS,
  Network,
  useERC20,
  useSafeEffect,
} from "@citizenwallet/sdk";

export default function Container({}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [validAddress, setValidAddress] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [valid, setValid] = useState(false);

  const logic = useConfigLogic();
  const step = useConfigStore((state) => state.step);
  const invalidUrl = useConfigStore((state) => state.invalidUrl);
  const network = useConfigStore((state) => state.network);
  const scan = useConfigStore((state) => state.scan);
  const node = useConfigStore((state) => state.node);
  const community = useConfigStore((state) => state.community);
  const deployment = useConfigStore((state) => state.deployment);

  const [erc20Subscribe, erc20Actions] = useERC20(network, validAddress);

  const metadata = erc20Subscribe((state) => state.metadata);

  const networks = Object.values(NETWORKS);

  useEffect(() => {
    return () => {
      // clear object URL
      if (file) {
        URL.revokeObjectURL(file);
      }
    };
  }, [file]);

  const handleStepChange = (step: ConfigStep) => {
    logic.setStep(step);
  };

  const handleChainSelect = (network: Network) => {
    logic.selectNetwork(network);
  };

  const handleTokenChange = useDebouncedCallback((address: string) => {
    const isValid = isAddress(address);

    setIsTokenValid(isValid);

    if (!isValid) {
      setValidAddress("");
      return;
    }

    setValidAddress(address);
  }, 500);

  useSafeEffect(() => {
    if (!isAddress(validAddress)) {
      erc20Actions.clearMetadata();
      return () => {};
    }

    erc20Actions.getMetadata();
  }, [validAddress]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "name":
        setName(e.target.value);
        break;
      case "description":
        setDescription(e.target.value);
        break;
      case "tokenAddress":
        setTokenAddress(e.target.value);
        handleTokenChange(e.target.value);
        break;
      case "url":
        setUrl(e.target.value);
        break;
    }
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (file) {
      URL.revokeObjectURL(file);
    }

    if (e.target.files) {
      setFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCommunityContinue = () => {
    if (!file) {
      return;
    }
    logic.communityContinue(
      name,
      description,
      url,
      validAddress,
      metadata,
      file
    );
  };

  const handleValidityChange = (value: boolean) => {
    console.log("valid", value);
    setValid(value);
  };

  const handleDeploy = (
    owner: string,
    factoryService: CommunityFactoryContractService
  ) => {
    if (!network || !community || !valid || deployment.loading) {
      return;
    }

    logic.deploy(owner, network, factoryService);
  };

  return (
    <ConfigPageTemplate
      Content={
        <Accordion type="single" collapsible value={step}>
          <AccordionItem value="chain">
            <AccordionTrigger
              onClick={() => handleStepChange(ConfigStep.Chain)}
            >
              <Flex justify="center" align="center" gap="2">
                {network ? network.name : "Chain"}
                {scan && node ? (
                  <CheckCircledIcon height={14} width={14} color="green" />
                ) : (
                  <CircleIcon height={14} width={14} />
                )}
              </Flex>
            </AccordionTrigger>
            <AccordionContent>
              <Flex direction="column" align="center" gap="4">
                <Box>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="flex flex-col justify-center">
                      <Button variant="outline" color="gray" className="w-48">
                        <Flex justify="between" align="center" width="100%">
                          <Text>{network ? network.name : "Select Chain"}</Text>{" "}
                          <CaretDownIcon />
                        </Flex>
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      {networks.map((n) => (
                        <DropdownMenu.Item
                          key={n.chainId}
                          onClick={() => handleChainSelect(n)}
                        >
                          {n.name}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Box>
              </Flex>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="community">
            <AccordionTrigger
              onClick={() => handleStepChange(ConfigStep.Community)}
            >
              <Flex justify="center" align="center" gap="2">
                {community ? community.name : "Community"}
                {community ? (
                  <CheckCircledIcon height={14} width={14} color="green" />
                ) : (
                  <CircleIcon height={14} width={14} />
                )}
              </Flex>
            </AccordionTrigger>
            <AccordionContent>
              <Flex direction="column" justify="start" align="stretch" gap="2">
                <Flex justify="center">
                  <Card style={{ maxWidth: 300 }}>
                    <Flex gap="3" align="center" className="overflow-hidden">
                      <Avatar
                        size="3"
                        src={file ?? CoinIcon}
                        radius="full"
                        fallback={
                          metadata.symbol.trim() ? metadata.symbol : "MT"
                        }
                      />
                      <Box>
                        <Text
                          as="div"
                          size="2"
                          weight="bold"
                          className="truncate"
                        >
                          {name.trim() ? name : "Community Name"}
                        </Text>
                        <Text as="div" size="2" color="gray">
                          {description.trim()
                            ? description
                            : "Token Description"}
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                </Flex>
                <Flex justify="center">
                  <Flex
                    direction="column"
                    gap="3"
                    justify="center"
                    align="center"
                    style={{ maxWidth: 300 }}
                    className="overflow-hidden"
                  >
                    <Box>
                      <Text
                        as="div"
                        size="2"
                        weight="bold"
                        className="truncate"
                      >
                        {metadata.name.trim() ? metadata.name : "Token Name"}
                      </Text>
                      <Text as="div" size="2" color="gray" align="center">
                        10.00 {metadata.symbol.trim() ? metadata.symbol : "MT"}
                      </Text>
                    </Box>
                  </Flex>
                </Flex>

                <Label>Community Name</Label>
                <TextField.Root>
                  <TextField.Input
                    type="text"
                    name="name"
                    autoComplete="off"
                    placeholder="Community Name"
                    value={name}
                    onChange={handleValueChange}
                  />
                </TextField.Root>
                <Label>Community Description</Label>
                <TextField.Root>
                  <TextField.Input
                    type="text"
                    name="description"
                    autoComplete="off"
                    placeholder="Community Description"
                    value={description}
                    onChange={handleValueChange}
                  />
                </TextField.Root>
                <Label>Community URL</Label>
                <TextField.Root>
                  <TextField.Input
                    type="text"
                    name="url"
                    autoComplete="off"
                    placeholder="https://mycommunity.com"
                    style={{
                      border: invalidUrl ? "1px solid red" : undefined,
                    }}
                    value={url}
                    onChange={handleValueChange}
                  />
                </TextField.Root>
                {invalidUrl && (
                  <Text size="1" color="red">
                    Invalid url.
                  </Text>
                )}
                <Label>Token Address</Label>
                <TextField.Root>
                  <TextField.Slot>
                    {metadata.symbol && metadata.name ? (
                      <CheckCircledIcon height={14} width={14} color="green" />
                    ) : !isTokenValid && tokenAddress.trim().length > 0 ? (
                      <CrossCircledIcon height={14} width={14} />
                    ) : (
                      <CircleIcon height={14} width={14} />
                    )}
                  </TextField.Slot>
                  <TextField.Input
                    type="text"
                    name="tokenAddress"
                    autoComplete="off"
                    placeholder="My Token"
                    value={tokenAddress}
                    onChange={handleValueChange}
                  />
                </TextField.Root>
                <Label>Token Logo</Label>
                <Input
                  type="file"
                  name="file"
                  accept=".jpg,.jpeg,.png,.svg"
                  onChange={handleLogoSelect}
                />
                <Flex width="100%" justify="center">
                  <Button variant="soft" onClick={handleCommunityContinue}>
                    Continue
                  </Button>
                </Flex>
              </Flex>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="checkout">
            <AccordionTrigger
              onClick={() => handleStepChange(ConfigStep.Checkout)}
            >
              <Flex justify="center" align="center" gap="2">
                Publishing{" "}
                {valid ? (
                  <CheckCircledIcon height={14} width={14} color="green" />
                ) : (
                  <CircleIcon height={14} width={14} />
                )}
              </Flex>
            </AccordionTrigger>
            <AccordionContent>
              {network && (
                <CommunityCheckout
                  network={network}
                  onValidityChange={handleValidityChange}
                  onCheckout={handleDeploy}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      }
    />
  );
}
