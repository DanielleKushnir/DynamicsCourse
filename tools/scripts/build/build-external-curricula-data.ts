import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { submitTypes } from '../../../shared/config/challenge-types';
import { type ChallengeNode } from '../../../client/src/redux/prop-types';
import { SuperBlocks } from '../../../shared/config/curriculum';

type Intro = { [keyValue in SuperBlocks]: IntroProps };
export type Curriculum<T> = {
  [keyValue in SuperBlocks]: T extends CurriculumProps
    ? CurriculumProps
    : GeneratedCurriculumProps;
};

interface IntroProps extends CurriculumProps {
  title: string;
  intro: string[];
}

export interface CurriculumProps {
  intro: string[];
  blocks: Record<string, Block<ChallengeNode['challenge'][]>>;
}

interface GeneratedCurriculumProps {
  intro: string[];
  blocks: Record<string, Block<Record<string, unknown>>>;
}

interface Block<T> {
  desc: string[];
  intro: string[];
  challenges: T;
  meta: Record<string, unknown>;
}

export const orderedSuperBlockInfo = [
  { dashedName: SuperBlocks.RespWebDesignNew, public: true },
  { dashedName: SuperBlocks.DataAnalysisPy, public: true },
  { dashedName: SuperBlocks.MachineLearningPy, public: true },
  { dashedName: SuperBlocks.A2English, public: true },
  { dashedName: SuperBlocks.TheOdinProject, public: true },
  { dashedName: SuperBlocks.RespWebDesign, public: true },
  { dashedName: SuperBlocks.PythonForEverybody, public: true },
  { dashedName: SuperBlocks.FullStackDeveloper, public: false },
  { dashedName: SuperBlocks.JsAlgoDataStructNew, public: false },
  { dashedName: SuperBlocks.FrontEndDevLibs, public: false },
  { dashedName: SuperBlocks.DataVis, public: false },
  { dashedName: SuperBlocks.BackEndDevApis, public: false },
  { dashedName: SuperBlocks.QualityAssurance, public: false },
  { dashedName: SuperBlocks.SciCompPy, public: false },
  { dashedName: SuperBlocks.FoundationalCSharp, public: false },
  { dashedName: SuperBlocks.JsAlgoDataStruct, public: false }
];

const dashedNames = orderedSuperBlockInfo.map(({ dashedName }) => dashedName);

export function buildExtCurriculumData(
  ver: string,
  curriculum: Curriculum<CurriculumProps>
): void {
  const staticFolderPath = resolve(__dirname, '../../../client/static');
  const dataPath = `${staticFolderPath}/curriculum-data/`;
  const blockIntroPath = resolve(
    __dirname,
    '../../../client/i18n/locales/english/intro.json'
  );

  mkdirSync(dataPath, { recursive: true });

  parseCurriculumData();
  getSubmitTypes();

  function parseCurriculumData() {
    const superBlockKeys = Object.values(SuperBlocks).filter(x =>
      dashedNames.includes(x)
    );

    writeToFile('available-superblocks', {
      superblocks: orderedSuperBlockInfo.map(x => ({
        ...x,
        title: getSuperBlockTitle(x.dashedName)
      }))
    });

    for (const superBlockKey of superBlockKeys) {
      const superBlock = <Curriculum<GeneratedCurriculumProps>>{};
      const blockNames = Object.keys(curriculum[superBlockKey].blocks);

      if (blockNames.length === 0) continue;

      superBlock[superBlockKey] = <GeneratedCurriculumProps>{};
      superBlock[superBlockKey].intro = getSuperBlockDescription(superBlockKey);
      superBlock[superBlockKey].blocks = {};

      for (const blockName of blockNames) {
        superBlock[superBlockKey]['blocks'][blockName] = <
          Block<Record<string, unknown>>
        >{};

        superBlock[superBlockKey]['blocks'][blockName]['desc'] =
          getBlockDescription(superBlockKey, blockName);

        superBlock[superBlockKey]['blocks'][blockName]['challenges'] =
          curriculum[superBlockKey]['blocks'][blockName]['meta'];

        const blockChallenges =
          curriculum[superBlockKey]['blocks'][blockName]['challenges'];

        for (const challenge of blockChallenges) {
          const challengeId = challenge.id;
          const challengePath = `challenges/${superBlockKey}/${blockName}/${challengeId}`;

          writeToFile(challengePath, challenge);
        }
      }

      writeToFile(superBlockKey, superBlock);
    }
  }

  function writeToFile(fileName: string, data: Record<string, unknown>): void {
    const filePath = `${dataPath}/${ver}/${fileName}.json`;
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  function getBlockDescription(
    superBlockKeys: SuperBlocks,
    blockKey: string
  ): string[] {
    const intros = JSON.parse(readFileSync(blockIntroPath, 'utf-8')) as Intro;

    return intros[superBlockKeys]['blocks'][blockKey]['intro'];
  }

  function getSuperBlockDescription(superBlockKey: SuperBlocks): string[] {
    const superBlockIntro = JSON.parse(
      readFileSync(blockIntroPath, 'utf-8')
    ) as Intro;
    return superBlockIntro[superBlockKey]['intro'];
  }

  function getSuperBlockTitle(superBlock: SuperBlocks): string {
    const superBlocks = JSON.parse(
      readFileSync(blockIntroPath, 'utf-8')
    ) as Intro;

    return superBlocks[superBlock].title;
  }

  function getSubmitTypes() {
    writeFileSync(
      `${dataPath}/submit-types.json`,
      JSON.stringify(submitTypes, null, 2)
    );
  }
}
