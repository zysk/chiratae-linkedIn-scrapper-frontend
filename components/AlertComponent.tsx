import { AlertCircle } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { title } from "process";
import { Button } from "./ui/button";

interface Actions {
    label: string;
    cssClass: string;
    onClick: () => void;
}

interface AlertProps {
    variant?: string;
    title?: string;
    description?: string;
    actions?:Actions[] | undefined;
}

const AlertComponent: React.FC<AlertProps> = ({ variant="default", title, description, actions })=> {
  return (
    <Alert variant={variant}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <div className="flex flex-col">
            <div className="py-2">
                { description}
            </div>
            {

                actions && 
                <div className="flex">
                    {
                        actions.map(action => 
                            <div key={action.label} className="pe-2">
                                <Button 
                                    onClick={action.onClick}
                                    className={action.cssClass}
                                >
                                    {action.label}
                                </Button>
                            </div>
                        )
                    }
                </div>
            }
        </div>

      </AlertDescription>
    </Alert>
  )
}

export default AlertComponent;