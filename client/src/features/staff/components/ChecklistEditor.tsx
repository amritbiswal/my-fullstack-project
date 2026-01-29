import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useState } from "react";

type Checklist = Record<string, any>;

const DEFAULT_CHECKLIST_KEYS = [
  { key: "itemClean", label: "Item clean", type: "boolean" },
  { key: "fullyWorking", label: "Fully working", type: "boolean" },
  { key: "photosValid", label: "Photos valid", type: "boolean" },
  { key: "serialMatched", label: "Serial matched (optional)", type: "boolean" }
] as const;

export function ChecklistEditor({
  value,
  onChange
}: {
  value: Checklist;
  onChange: (next: Checklist) => void;
}) {
  const [customKey, setCustomKey] = useState("");
  const [customVal, setCustomVal] = useState("");

  function setBool(k: string, v: boolean) {
    onChange({ ...value, [k]: v });
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="text-sm font-semibold">Checklist</div>

      <div className="space-y-2">
        {DEFAULT_CHECKLIST_KEYS.map((c) => (
          <div key={c.key} className="flex items-center justify-between">
            <div className="text-sm text-slate-700">{c.label}</div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={value[c.key] === true ? "primary" : "secondary"}
                onClick={() => setBool(c.key, true)}
              >
                Yes
              </Button>
              <Button
                type="button"
                size="sm"
                variant={value[c.key] === false ? "primary" : "secondary"}
                onClick={() => setBool(c.key, false)}
              >
                No
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100" />

      <div className="text-sm font-semibold">Custom field (optional)</div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Key" value={customKey} onChange={(e) => setCustomKey(e.target.value)} placeholder="e.g. scratches" />
        <Input label="Value" value={customVal} onChange={(e) => setCustomVal(e.target.value)} placeholder="e.g. minor" />
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          const k = customKey.trim();
          if (!k) return;
          onChange({ ...value, [k]: customVal.trim() });
          setCustomKey("");
          setCustomVal("");
        }}
      >
        Add custom field
      </Button>
    </Card>
  );
}
