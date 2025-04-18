import React from 'react';
import { SuperBlocks } from '../../../shared/config/curriculum';
import APIIcon from './icons/api';
import D3Icon from './icons/d3';
import JavaScriptIcon from './icons/javascript';
import ReactIcon from './icons/react';
import TensorflowIcon from './icons/tensorflow';
import Analytics from './icons/analytics';
import Clipboard from './icons/clipboard';
import PythonIcon from './icons/python';
import ResponsiveDesign from './icons/responsive-design';
import VikingHelmet from './icons/viking-helmet';
import CSharpLogo from './icons/c-sharp-logo';
import A2EnglishIcon from './icons/a2-english';
import Code from './icons/code';

const iconMap = {
  [SuperBlocks.RespWebDesignNew]: ResponsiveDesign,
  [SuperBlocks.RespWebDesign]: ResponsiveDesign,
  [SuperBlocks.JsAlgoDataStruct]: JavaScriptIcon,
  [SuperBlocks.JsAlgoDataStructNew]: JavaScriptIcon,
  [SuperBlocks.FrontEndDevLibs]: ReactIcon,
  [SuperBlocks.DataVis]: D3Icon,
  [SuperBlocks.BackEndDevApis]: APIIcon,
  [SuperBlocks.QualityAssurance]: Clipboard,
  [SuperBlocks.SciCompPy]: PythonIcon,
  [SuperBlocks.DataAnalysisPy]: Analytics,
  [SuperBlocks.MachineLearningPy]: TensorflowIcon,
  [SuperBlocks.TheOdinProject]: VikingHelmet,
  [SuperBlocks.FoundationalCSharp]: CSharpLogo,
  [SuperBlocks.FullStackDeveloper]: Code,
  [SuperBlocks.A2English]: A2EnglishIcon,
  [SuperBlocks.PythonForEverybody]: PythonIcon
};

type SuperBlockIconProps = {
  superBlock: SuperBlocks;
} & React.SVGProps<SVGSVGElement>;

export function SuperBlockIcon(props: SuperBlockIconProps): JSX.Element {
  const { superBlock, ...iconProps } = props;
  const Icon = iconMap[superBlock] ? iconMap[superBlock] : ResponsiveDesign;

  return <Icon {...iconProps} />;
}
