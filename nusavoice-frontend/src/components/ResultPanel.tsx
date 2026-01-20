import { useRef } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultPanelProps {
  audioUrl: string | null;
  hasGenerated: boolean;
}

export function ResultPanel({ audioUrl, hasGenerated }: ResultPanelProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleDownload = () => {
    if (!audioUrl) return;
    
    // Create a temporary anchor element for download
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `nusavoice-audio-${Date.now()}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto mt-6 w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-soft">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Result
        </h2>
      </div>

      {/* Audio Player Area */}
      <div className="mb-4 rounded-lg border border-border bg-muted/50 p-6">
        {hasGenerated ? (
          <div className="space-y-4">
            <audio
              ref={audioRef}
              controls
              className="w-full"
              src={audioUrl || undefined}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Audio will appear here after generation.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasGenerated || !audioUrl}
          onClick={handleDownload}
          className="gap-1"
        >
          <Download className="h-3 w-3" />
          Download
        </Button>
      </div>
    </div>
  );
}

