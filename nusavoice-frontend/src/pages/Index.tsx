import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { GeneratorCard } from '@/components/GeneratorCard';
import { ResultPanel } from '@/components/ResultPanel';
import { Footer } from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';
import { generateTTS, type TTSPayload } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = async (payload: TTSPayload) => {
    setIsGenerating(true);

    try {
      const response = await generateTTS(payload);
      setAudioUrl(response.audio_url || null);
      setHasGenerated(true);
      toast({
        title: 'Generation Complete',
        description: 'Your audio has been generated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'An error occurred while generating audio. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      
      <main className="flex-1">
        <div className="container px-4 pb-12">
          <Hero />
          <GeneratorCard onGenerate={handleGenerate} isGenerating={isGenerating} />
          <ResultPanel
            audioUrl={audioUrl}
            hasGenerated={hasGenerated}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

