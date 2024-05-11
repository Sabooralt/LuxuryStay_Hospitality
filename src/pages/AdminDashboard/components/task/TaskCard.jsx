import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

export const TaskCard = () => {
  return ( 
    <Card className="p-4 grid shadow-none rounded-[0.2rem] gap-2">
      <CardHeader className="grid p-0">
        <div className="justify-between grid items-center grid-cols-2 gap-1">
            
        <p className="font-semibold capitalize">William Smith</p> <p className="text-muted-foreground text-sm ml-auto">a month ago</p>
        <p className="m-0 font-medium text-xs capitalize space-y-0-0">meeting tomorrow</p>
        </div>
      </CardHeader>

      <CardDescription className="line-clamp-[2] text-ellipsis overflow-hidden">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus, commodi nihil dolorum aperiam nobis modi voluptate beatae sint vitae suscipit.
      </CardDescription>

      <CardContent className="flex flex-row justify-between items-center p-0">

        <Badge>Dollar</Badge>

      </CardContent>
    </Card>
  );
};
