import { useState, useMemo } from 'react';
import { ChevronDown, Loader2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { type TTSPayload } from '@/lib/api';

interface GeneratorCardProps {
  onGenerate: (payload: TTSPayload) => void;
  isGenerating: boolean;
}

export function GeneratorCard({ onGenerate, isGenerating }: GeneratorCardProps) {
  const [voice, setVoice] = useState<'female' | 'male'>('female');
  const [text, setText] = useState('');
  const [speed, setSpeed] = useState(1.0);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const wordCount = useMemo(() => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [text]);

  const charCount = text.length;
  const isOverLimit = wordCount > 120;
  const canGenerate = text.trim().length > 0 && !isOverLimit && !isGenerating;

  // Dynamic estimation: ~0.45s per word (average speaking rate)
  const estimatedTime = useMemo(() => {
    if (wordCount === 0) return null;
    const seconds = Math.max(1, Math.round(wordCount * 0.45 / speed));
    return seconds;
  }, [wordCount, speed]);

  const handleGenerate = () => {
    if (!canGenerate) return;
    onGenerate({
      voice,
      text: text.trim(),
      speed,
      format: 'wav',
    });
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-card">
      {/* Voice Model */}
      <div className="mb-6">
        <Label htmlFor="voice" className="mb-2 block text-sm font-medium">
          Voice Model
        </Label>
        <Select value={voice} onValueChange={(v) => setVoice(v as 'female' | 'male')}>
          <SelectTrigger id="voice" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="female">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary" />
                <span>Indonesian Female (Natural & Clear)</span>
              </div>
            </SelectItem>
            <SelectItem value="male">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary" />
                <span>Indonesian Male (Deep & Narrative)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Input Text */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <Label htmlFor="text" className="text-sm font-medium">
            Input Text
          </Label>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className={isOverLimit ? 'font-medium text-destructive' : ''}>
              Words: {wordCount}/120
            </span>
            <span>Chars: {charCount}/800</span>
          </div>
        </div>
        <Textarea
          id="text"
          placeholder="Masukkan teks bahasa Indonesia di sini…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[140px] resize-none"
          maxLength={800}
        />
        {isOverLimit && (
          <p className="mt-2 text-sm text-destructive">
            Text exceeds 120 word limit. Please shorten your text.
          </p>
        )}
      </div>

      {/* Advanced Settings */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen} className="mb-6">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between px-0 hover:bg-transparent">
            <span className="text-sm font-medium">Advanced Settings</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isAdvancedOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-6 rounded-lg border border-border bg-muted/50 p-4">
          {/* Speed Slider */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <Label className="text-sm font-medium">Speed</Label>
              <span className="text-sm text-muted-foreground">{speed.toFixed(1)}x</span>
            </div>
            <Slider
              value={[speed]}
              onValueChange={([v]) => setSpeed(v)}
              min={0.8}
              max={1.2}
              step={0.1}
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>0.8x</span>
              <span>1.2x</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Info */}
      {estimatedTime && (
        <div className="mb-6 flex justify-end text-xs text-muted-foreground">
          <span>Estimated generation time: ~{estimatedTime}s</span>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!canGenerate}
          onClick={handleGenerate}
          className="min-w-[160px]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : (
            'Generate Audio'
          )}
        </Button>
      </div>
    </div>
  );
}

