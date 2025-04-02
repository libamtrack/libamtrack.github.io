import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'What is libamtrack?',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
       libamtrack implements several routines related to modelling of solid state radiation detectors, proton and ion beam models and radiation transport in matter.
      </>
    ),
  },
  {
    title: 'Key Features',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <div className='text--left'>
        <ul>
          <li>Stopping power for proton and ion beams.</li>
          <li>Detector response calculations.</li>
          <li>Amorphous track structure models</li>
          <li>Track structure models.</li>
          <li>Multiple Coulomb scattering.</li>
          <li>Bortfeld and Wilkens pencil beam models.</li>
          <li>Katz cell survival and detector response model.</li>
          <li>Vavilov and Landau energy loss models.</li>
          <li>Dose to fluence conversion.</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Easy access',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Libamtrack is an free and open-source project.
        Access via a web interface or Python wrapper. 
        It works on Linux, Windows, and macOS.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h2">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
