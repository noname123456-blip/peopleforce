"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EmployeeForm from "./EmployeeForm";

interface CreateEmployeeDialogProps {
  onSuccess?: (employee: any) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CreateEmployeeDialog({ 
  onSuccess, 
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: CreateEmployeeDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  const handleSuccess = (employee: any) => {
    setOpen(false);
    if (onSuccess) onSuccess(employee);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-sm font-semibold">
          <Plus className="size-4" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold">New Employee Profile</DialogTitle>
          <DialogDescription>
            Enter the details to create a new employee profile in the system.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden p-6 pt-0">
          <EmployeeForm 
            onSuccess={handleSuccess} 
            onCancel={() => setOpen(false)} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
