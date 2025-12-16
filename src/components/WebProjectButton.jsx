import { useState } from 'react';
import { FileCode, Download, Loader2 } from 'lucide-react';
import { processAIResponseAndDownload } from '../utils/zipGenerator';

const WEB_PROJECT_PROMPT = `Genera un projecte web complet amb els següents fitxers. És MOLT IMPORTANT que generis TOTS els fitxers amb el format EXACTE especificat:

**FITXERS OBLIGATORIS:**

1. **index.html** - Pàgina principal HTML5
2. **css/styles.css** - Full d'estils CSS
3. **js/script.js** - Codi JavaScript

**FORMAT OBLIGATORI per cada fitxer:**

Per HTML:
\`\`\`html:index.html
<!DOCTYPE html>
<html>
...codi complet aquí...
</html>
\`\`\`

Per CSS:
\`\`\`css:css/styles.css
/* Estils complets aquí */
body { ... }
\`\`\`

Per JavaScript:
\`\`\`js:js/script.js
// Codi JavaScript complet aquí
console.log('...');
\`\`\`

**IMPORTANT:**
- Genera SEMPRE els 3 fitxers complets
- NO utilitzis assets en base64 (són massa grans)
- Utilitza només CSS i JavaScript per crear el disseny
- El codi ha de ser funcional i modern
- Inclou comentaris explicatius

**TEMA DEL PROJECTE:** [TEMA A ESPECIFICAR PER L'USUARI]

Genera ara els 3 fitxers complets seguint EXACTAMENT el format especificat.`;

function WebProjectButton({ onSend, disabled, lastMessage }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerateProject = () => {
    setShowDialog(true);
  };

  const handleConfirm = async () => {
    if (!projectName.trim()) {
      alert('Si us plau, especifica un tema per al projecte');
      return;
    }

    setShowDialog(false);
    setHasGenerated(true);
    
    // Enviar el prompt amb el tema especificat
    const finalPrompt = WEB_PROJECT_PROMPT.replace('[TEMA A ESPECIFICAR PER L\'USUARI]', projectName);
    onSend(finalPrompt, []);
  };

  const handleDownloadLastProject = async () => {
    if (!lastMessage || lastMessage.role !== 'assistant') {
      alert('No hi ha cap resposta de l\'IA per processar');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processAIResponseAndDownload(
        lastMessage.content,
        projectName || 'web-project'
      );

      if (result.success) {
        alert(`✅ Projecte descarregat correctament!\n\nFitxers generats: ${result.filesCount}\n${result.files.join('\n')}`);
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ Error processant el projecte: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Botons flotants a la part superior dreta */}
      <div className="fixed top-4 right-4 flex gap-2 z-40">
        <button
          onClick={handleGenerateProject}
          disabled={disabled}
          className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full shadow-lg transition-all hover:scale-110"
          title="Generar projecte web complet"
        >
          <FileCode size={20} />
        </button>

        {hasGenerated && lastMessage && lastMessage.role === 'assistant' && (
          <button
            onClick={handleDownloadLastProject}
            disabled={disabled || isProcessing}
            className="p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full shadow-lg transition-all hover:scale-110"
            title="Descarregar última resposta com a ZIP"
          >
            {isProcessing ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Download size={20} />
            )}
          </button>
        )}
      </div>

      {/* Dialog per especificar el tema del projecte */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Generar Projecte Web</h3>
            <p className="text-gray-300 text-sm mb-4">
              Especifica el tema o descripció del projecte web que vols generar:
            </p>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Ex: Portfolio personal, Landing page de producte..."
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirm();
                }
              }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel·lar
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Generar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WebProjectButton;
