import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default async function MembersPage() {

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>Members of the community.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1"></CardContent>
    </Card>
  );
}
