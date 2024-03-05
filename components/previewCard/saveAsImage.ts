import { Dispatch, RefObject, SetStateAction } from 'react';
import errorGeneralHelper from '@/lib/frontend/errorGeneralHelper';
import genFileNameAtFrontend from '@/lib/frontend/genFileNameAtFrontend';
import html2canvas from 'html2canvas';

interface Props {
  previewCardDiv?: HTMLDivElement
  previewCardRef?: RefObject<HTMLDivElement>
  setIsSaving?: Dispatch<SetStateAction<boolean>>
}

function downloadAsPng(canvas: HTMLCanvasElement) {
  const tempDomNode = document.createElement('a');
  tempDomNode.href = canvas.toDataURL('image/png');
  tempDomNode.download = genFileNameAtFrontend() + '.png';
  tempDomNode.click();
}

export default async function saveAsImage({
  setIsSaving,
  previewCardRef,
  previewCardDiv
}: Props) {
  setIsSaving && setIsSaving(true);
  try {
    const targetDiv = previewCardRef ? previewCardRef.current : previewCardDiv;
    if (!targetDiv) return;
    const canvas = await html2canvas(targetDiv);
    downloadAsPng(canvas);
  } catch (err) {
    errorGeneralHelper(err, 'html2canvas unknown error');
  } finally {
    setIsSaving && setIsSaving(false);
  }
}
