import { SuperBlocks } from '../../../shared/config/curriculum';

export function isOldRespCert(superBlock: string): boolean {
  return superBlock === String(SuperBlocks.RespWebDesign);
}

export function isExamCert(superBlock: string): boolean {
  return superBlock === String(SuperBlocks.FoundationalCSharp);
}
