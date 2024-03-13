import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DotFilledIcon, DotIcon } from "@radix-ui/react-icons";

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
      className={active ? "relative border-purple" : "relative border-grey"}
      style={{
        maxWidth: 300,
        cursor: !!onClick ? "pointer" : "default",
        borderColor: active ? "purple" : "grey",
      }}
      onClick={() => !!onClick && onClick(id)}
    >
      {active ? (
        <DotFilledIcon className="absolute right-1 top-1" />
      ) : (
        <DotIcon className="absolute right-1 top-1" />
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
