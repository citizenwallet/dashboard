'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export interface DeployOptionsProps {
  title: string;
  description: string;
  features: string[];
  handleSelect: () => void;
}

export default function DeployOptions({
  title,
  description,
  features,
  handleSelect
}: DeployOptionsProps) {
  return (
    <Card className="border border-gray-200 flex flex-col h-full  min-h-[280px] w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <p className="text-gray-600 mt-2">{description}</p>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ul className="space-y-2 text-gray-700">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          className="w-full py-2"
          onClick={handleSelect}
          variant="default"
        >
          {title}
        </Button>
      </CardFooter>
    </Card>
  );
}
