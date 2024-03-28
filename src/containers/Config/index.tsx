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
  ArrowDownIcon,
  ArrowUpIcon,
  CaretDownIcon,
  CheckCircledIcon,
  CircleIcon,
  ColorWheelIcon,
  CrossCircledIcon,
  OpacityIcon,
  PieChartIcon,
} from "@radix-ui/react-icons";
import {
  Avatar,
  Box,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Popover,
  Text,
  TextField,
} from "@radix-ui/themes";
import CoinIcon from "@/assets/icons/coin.svg";
import { useEffect, useState } from "react";
import {
  CommunityFactoryContractService,
  NETWORKS,
  Network,
  SessionService,
  useERC20,
  useSafeEffect,
} from "@citizenwallet/sdk";
import { useRouter } from "next/navigation";
import { ColorChangeHandler, ColorResult, SketchPicker } from "react-color";

export default function Container({}) {
  const router = useRouter();

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
  const primaryColor = useConfigStore((state) => state.primaryColor);
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

  const handleColorChange: ColorChangeHandler = (color: ColorResult) => {
    logic.updatePrimaryColor(color.hex);
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (file) {
      URL.revokeObjectURL(file);
    }

    if (e.target.files) {
      const url = URL.createObjectURL(e.target.files[0]);

      setFile(url);
    }
  };

  const handleNetworkContinue = () => {
    if (!network) {
      return;
    }

    handleStepChange(ConfigStep.Community);
  };

  const handleCommunityContinue = () => {
    if (!file || !name || !description || !url || !validAddress) {
      return;
    }
    logic.communityContinue(
      name,
      description,
      url,
      validAddress,
      metadata,
      file,
      primaryColor
    );
  };

  const handleValidityChange = (value: boolean) => {
    setValid(value);
  };

  const handleDeploy = async (
    owner: string,
    factoryService: CommunityFactoryContractService,
    checkoutService: SessionService
  ) => {
    if (!network || !community || !valid || deployment.loading) {
      return;
    }

    const success = await logic.deploy(
      owner,
      factoryService,
      validAddress,
      checkoutService
    );
    if (!success) {
      return;
    }

    // redirect to home
    router.replace("/");
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
                {network && (
                  <Flex width="100%" justify="center">
                    <Button variant="soft" onClick={handleNetworkContinue}>
                      Continue
                    </Button>
                  </Flex>
                )}
              </Flex>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="community">
            <AccordionTrigger onClick={handleNetworkContinue}>
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
                <Flex align="center" justify="center" gap="4">
                  <Flex direction="column" justify="center" align="center">
                    <div
                      className="flex flex-col justify-center items-center h-12 w-12 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <ArrowUpIcon height={22} width={22} color="white" />
                    </div>
                    <Text>Send</Text>
                  </Flex>
                  <Flex direction="column" justify="center" align="center">
                    <div
                      className="flex flex-col justify-center items-center h-12 w-12 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <ArrowDownIcon height={22} width={22} color="white" />
                    </div>
                    <Text>Receive</Text>
                  </Flex>
                </Flex>
                <Label>Name</Label>
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
                <Label>Description</Label>
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
                <Label>URL</Label>
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
                <Label>Primary Color</Label>
                <Flex justify="center" align="center">
                  <Popover.Root>
                    <Popover.Trigger>
                      <Button
                        variant="solid"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <OpacityIcon height={14} width={14} />
                        {primaryColor}
                      </Button>
                    </Popover.Trigger>
                    <Popover.Content side="bottom" size="1">
                      <SketchPicker
                        disableAlpha
                        color={primaryColor}
                        onChange={handleColorChange}
                      />
                    </Popover.Content>
                  </Popover.Root>
                </Flex>
                <Label>Token Address</Label>
                <TextField.Root>
                  <TextField.Slot>
                    {metadata.symbol && metadata.name ? (
                      <CheckCircledIcon height={14} width={14} color="green" />
                    ) : !isTokenValid && tokenAddress.trim().length > 0 ? (
                      <CrossCircledIcon height={14} width={14} />
                    ) : metadata.loading ? (
                      <PieChartIcon
                        height={14}
                        width={14}
                        className="animate-spin"
                      />
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
                  accept=".svg"
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
            <AccordionTrigger onClick={handleCommunityContinue}>
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
              {network && community && (
                <CommunityCheckout
                  network={network}
                  token={validAddress}
                  loading={deployment.loading}
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
