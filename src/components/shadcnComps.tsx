import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Account } from "@/types";

type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
  {
    value: "backlog",
    label: "Backlog",
  },
  {
    value: "todo",
    label: "Todo",
  },
  {
    value: "in progress",
    label: "In Progress",
  },
  {
    value: "done",
    label: "Done",
  },
  {
    value: "canceled",
    label: "Canceled",
  },
];

export function BankUser({ setTargetAccount, accounts, target }: any) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center space-x-4 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            {target ? <>{target}</> : <>Select Account</>}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput
              className="font-semibold"
              placeholder="Search account ..."
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {accounts.map((account: Account) => (
                  <CommandItem
                    key={account.accountNumber}
                    value={account.accountNumber}
                    onSelect={(value) => {
                      setTargetAccount(value);
                      setOpen(false);
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          fontFamily: "'Public Sans',sans-serif",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        {account.userId[0].toUpperCase() +
                          account.userId.slice(1)}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "'Public Sans',sans-serif",
                          color: "rgb(107 114 128 / var(--tw-text-opacity, 1))",
                        }}
                      >
                        {account.accountNumber}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
