import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Share, Plus } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const InstallAppButton = () => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (!isInstallable) {
    return null;
  }

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else {
      await installApp();
    }
  };

  return (
    <>
      <Button
        onClick={handleInstall}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </Button>

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-semibold mb-4">Install on iPhone/iPad</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                  <Share className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Step 1</p>
                  <p className="text-muted-foreground">Tap the Share button in Safari</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                  <Plus className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Step 2</p>
                  <p className="text-muted-foreground">Scroll down and tap "Add to Home Screen"</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                  <Download className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Step 3</p>
                  <p className="text-muted-foreground">Tap "Add" to install the app</p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full mt-6"
            >
              Got it!
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallAppButton;
