import JSZip from 'jszip';

/**
 * Extreu fitxers del text de resposta de l'IA
 * Espera blocs de codi amb el format:
 * ```filename
 * contingut
 * ```
 */
export function extractFilesFromResponse(responseText) {
  const files = [];
  
  // Pattern per trobar blocs de codi amb nom de fitxer
  const codeBlockPattern = /```(?:html|css|javascript|js)?:?([\w\/\-\.]+)\n([\s\S]*?)```/gi;
  
  let match;
  while ((match = codeBlockPattern.exec(responseText)) !== null) {
    const filename = match[1].trim();
    const content = match[2].trim();
    
    files.push({
      path: filename,
      content: content
    });
  }
  
  // També buscar assets en base64 amb el format: [filename.ext](data:...)
  const base64Pattern = /\[([^\]]+\.(png|jpg|jpeg|gif|svg|ico|webp))\]\(data:([^;]+);base64,([^\)]+)\)/gi;
  
  while ((match = base64Pattern.exec(responseText)) !== null) {
    const filename = match[1];
    const mimeType = match[3];
    const base64Data = match[4];
    
    files.push({
      path: filename,
      content: base64Data,
      isBase64: true
    });
  }
  
  return files;
}

/**
 * Crea un ZIP amb els fitxers extrets
 */
export async function createZipFromFiles(files, projectName = 'web-project') {
  const zip = new JSZip();
  
  files.forEach(file => {
    if (file.isBase64) {
      // Afegir fitxer binari des de base64
      zip.file(file.path, file.content, { base64: true });
    } else {
      // Afegir fitxer de text
      zip.file(file.path, file.content);
    }
  });
  
  // Generar el ZIP
  const blob = await zip.generateAsync({ type: 'blob' });
  
  // Descarregar el ZIP
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${projectName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Processa la resposta de l'IA i genera el ZIP
 */
export async function processAIResponseAndDownload(responseText, projectName = 'web-project') {
  try {
    const files = extractFilesFromResponse(responseText);
    
    if (files.length === 0) {
      throw new Error('No s\'han trobat fitxers a la resposta de l\'IA');
    }
    
    await createZipFromFiles(files, projectName);
    
    return {
      success: true,
      filesCount: files.length,
      files: files.map(f => f.path)
    };
  } catch (error) {
    console.error('Error processant resposta:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
