import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";

export function EvidenceListInput({
  value,
  onChange
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [url, setUrl] = useState("");

  return (
    <div className="space-y-2">
      <Input
        label="Evidence URL"
        placeholder="https://..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          const u = url.trim();
          if (!u) return;
          onChange([...value, u]);
          setUrl("");
        }}
      >
        Add evidence
      </Button>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((e, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== idx))}
              title="Remove"
            >
              <Badge tone="slate">{e.length > 22 ? e.slice(0, 22) + "…" : e}</Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
