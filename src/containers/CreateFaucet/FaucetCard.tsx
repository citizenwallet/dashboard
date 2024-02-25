import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flex, Text } from "@radix-ui/themes";

interface FaucetCardProps {
  id: string;
  title: string;
  description: string;
  active: boolean;
  onClick?: (id: string) => void;
}

export default function FaucetCard({
  id,
  title,
  description,
  active,
  onClick,
}: FaucetCardProps) {
  return (
    <Card
      className={active ? "border-2 border-purple " : "border-2 border-grey"}
      style={{
        maxWidth: 300,
        cursor: !!onClick ? "pointer" : "default",
        borderColor: active ? "purple" : "grey",
      }}
      onClick={() => !!onClick && onClick(id)}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
