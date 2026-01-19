import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const transcript = [
  { speaker: "AI Agent", text: "Hi, this is Alex from Premium Realty. I understand you're interested in properties in the Miami area. Is now a good time to chat?" },
  { speaker: "Lead", text: "Yes, I have a few minutes." },
  { speaker: "AI Agent", text: "Perfect! To help find the best options for you, are you looking to buy or sell a property?" },
  { speaker: "Lead", text: "I'm looking to buy a home for my family." },
  { speaker: "AI Agent", text: "Great! And what's your approximate budget range for this purchase?" },
];

// Full conversation script for audio generation
const fullConversationScript = `Hi, this is Alex from Premium Realty. I understand you're interested in properties in the Miami area. Is now a good time to chat?

Yes, I have a few minutes.

Perfect! To help find the best options for you, are you looking to buy or sell a property?

I'm looking to buy a home for my family.

Great! And what's your approximate budget range for this purchase?`;

const DemoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const generateAudio = async () => {
    if (audioUrl) return audioUrl;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ 
            text: fullConversationScript,
            voiceId: "CwhRBWXzGAHq8TQ4Fs17" // Roger - professional male voice
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      return url;
    } catch (error) {
      console.error("Failed to generate audio:", error);
      toast.error("Failed to generate audio demo. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = async () => {
    if (isLoading) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      return;
    }

    // Generate audio if not already generated
    const url = await generateAudio();
    if (!url) return;

    // Create or reuse audio element
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        setProgress(0);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      });
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      
      // Update progress
      progressIntervalRef.current = window.setInterval(() => {
        if (audioRef.current) {
          const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(currentProgress);
        }
      }, 100);
    } catch (error) {
      console.error("Failed to play audio:", error);
      toast.error("Failed to play audio. Please try again.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const currentTime = audioRef.current ? audioRef.current.currentTime : 0;
  const totalDuration = duration || 30; // Estimate 30 seconds if not loaded

  return (
    <section id="demo" className="py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
            Live Demo
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Hear Our AI Agent in Action
          </h2>
          <p className="text-lg text-muted-foreground">
            Listen to a real AI-generated sample call and see how naturally our AI qualifies leads.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Audio Player */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-hero-gradient flex items-center justify-center">
                    <Volume2 className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground text-lg">
                      Sample AI Call
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Buyer lead qualification • Powered by ElevenLabs
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(totalDuration)}</span>
                  </div>
                </div>

                {/* Play Button */}
                <Button
                  onClick={togglePlay}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Audio...
                    </>
                  ) : isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause Demo
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Play Sample Call
                    </>
                  )}
                </Button>

                {!audioUrl && !isLoading && (
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Audio is generated in real-time using AI voice technology
                  </p>
                )}
              </div>
            </motion.div>

            {/* Transcript */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-card rounded-2xl border border-border p-8 shadow-lg h-full">
                <h3 className="font-display font-bold text-foreground text-lg mb-6">
                  Call Transcript
                </h3>
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {transcript.map((line, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        line.speaker === "AI Agent" ? "" : "flex-row-reverse"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          line.speaker === "AI Agent"
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary text-foreground"
                        }`}
                      >
                        {line.speaker === "AI Agent" ? "AI" : "L"}
                      </div>
                      <div
                        className={`flex-1 rounded-xl p-3 text-sm ${
                          line.speaker === "AI Agent"
                            ? "bg-accent/10 text-foreground"
                            : "bg-secondary text-foreground"
                        }`}
                      >
                        {line.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
