/**
 * Utility to extract raw text content from PDF files directly in the browser
 * using dynamic script loading of CDN PDF.js.
 * This ensures zero bundle size overhead and avoids complex Vite/esbuild packaging constraints.
 */

export function loadPdfJS(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(pdfjsLib);
      } else {
        reject(new Error("PDF.js loaded but pdfjsLib global variable not found."));
      }
    };
    script.onerror = () => {
      reject(new Error("Failed to load PDF.js from CDN."));
    };
    document.head.appendChild(script);
  });
}

export async function extractTextFromPdf(
  file: File,
  onProgress: (percent: number, message: string) => void
): Promise<string> {
  onProgress(5, "Initializing browser PDF parser...");
  
  const pdfjsLib = await loadPdfJS();
  onProgress(15, "Reading PDF file buffer...");

  const arrayBuffer = await file.arrayBuffer();
  
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  onProgress(25, `Successfully loaded PDF (${numPages} pages). Extracting text...`);

  let fullText = "";
  
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    
    fullText += pageText + "\n\n";

    // Progressive real-time feedback
    const percent = Math.min(25 + Math.round((pageNum / numPages) * 50), 75);
    onProgress(percent, `Extracting page ${pageNum} / ${numPages}...`);
  }

  return fullText;
}
