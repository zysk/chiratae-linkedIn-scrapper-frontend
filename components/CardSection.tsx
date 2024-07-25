import React from "react";
 
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type TitleSectionProps = {
  title: string;
  subtitle?: string;
};

const CardSection = ({ children, title, description }: { children: React.ReactNode, title: string, description: string }) => {
    return (
        <Card className="w-full">
            {
              (title || description ) && 
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description ? <CardDescription>{description}</CardDescription> : ""}
              </CardHeader>
            }
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
  };

export default CardSection;
