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
  
  console.log('🔍 Buscant fitxers a la resposta...');
  
  // Pattern millorat per trobar blocs de codi amb nom de fitxer
  // Suporta: ```html:index.html, ```css:css/styles.css, ```js:js/script.js
  const codeBlockPattern = /```(?:html|css|javascript|js)?:?([\w\/\-\.]+)\n([\s\S]*?)```/gi;
  
  let match;
  while ((match = codeBlockPattern.exec(responseText)) !== null) {
    const filename = match[1].trim();
    const content = match[2].trim();
    
    console.log(`✅ Trobat fitxer de codi: ${filename} (${content.length} chars)`);
    
    files.push({
      path: filename,
      content: content
    });
  }
  
  // També buscar assets en base64 amb diversos formats:
  // Format 1: [filename.ext](data:image/png;base64,...)
  // Format 2: **filename.ext**: data:image/png;base64,...
  const base64Pattern1 = /\[([^\]]+\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf))\]\(data:([^;]+);base64,([^\)]+)\)/gi;
  
  while ((match = base64Pattern1.exec(responseText)) !== null) {
    const filename = match[1];
    const mimeType = match[3];
    const base64Data = match[4];
    
    console.log(`✅ Trobat asset base64: ${filename} (${base64Data.length} chars)`);
    
    files.push({
      path: filename,
      content: base64Data,
      isBase64: true
    });
  }
  
  // Format alternatiu: **filename.ext**: data:...
  const base64Pattern2 = /\*\*([^\*]+\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf))\*\*:\s*data:([^;]+);base64,([^\s]+)/gi;
  
  while ((match = base64Pattern2.exec(responseText)) !== null) {
    const filename = match[1];
    const mimeType = match[3];
    const base64Data = match[4];
    
    console.log(`✅ Trobat asset base64 (format 2): ${filename} (${base64Data.length} chars)`);
    
    files.push({
      path: filename,
      content: base64Data,
      isBase64: true
    });
  }
  
  console.log(`📦 Total fitxers trobats: ${files.length}`);
  
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
