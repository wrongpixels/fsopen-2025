interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescribed extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescribed {
  kind: 'basic';
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: 'group';
}

interface CoursePartBackground extends CoursePartDescribed {
  backgroundMaterial: string;
  kind: 'background';
}
interface CoursePartSpecial extends CoursePartDescribed {
  requirements: string[];
  kind: 'special';
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

interface HeaderProps {
  name: string;
}

interface CourseParts {
  parts: CoursePart[];
}

interface TotalProps {
  totalExercises: number;
}

interface PartProps {
  part: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Header = ({ name }: HeaderProps) => <h1>{name}</h1>;

const Part = ({ part }: PartProps) => {
  const drawPartData = (part: CoursePart) => {
    switch (part.kind) {
      case 'basic':
        return <i>{part.description}</i>;
      case 'background':
        return (
          <>
            <div>
              <i>{part.description}</i>
            </div>
            Submit to:{' '}
            <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a>
          </>
        );
      case 'group':
        return <>Project exercises: {part.groupProjectCount}</>;
      case 'special':
        return (
          <>
            <div>
              <i>{part.description}</i>
            </div>
            Required skills: {part.requirements.join(', ')}
          </>
        );
      default:
        return assertNever(part);
    }
  };
  return (
    <div>
      <b>
        {part.name} {part.exerciseCount}
      </b>
      <div>{drawPartData(part)}</div>
    </div>
  );
};

const Content = (props: CourseParts) => {
  return props.parts.map((p, i: number) => {
    return (
      <p key={i}>
        <Part part={p} />
      </p>
    );
  });
};

const Total = ({ totalExercises }: TotalProps) => (
  <b>Number of exercises {totalExercises}</b>
);

const App = () => {
  const courseName = 'Half Stack application development';
  const courseParts: CoursePart[] = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
      description: 'This is an awesome course part',
      kind: 'basic',
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: 'group',
    },
    {
      name: 'Basics of type Narrowing',
      exerciseCount: 7,
      description: 'How to go from unknown to string',
      kind: 'basic',
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
      description: 'Confusing description',
      backgroundMaterial:
        'https://type-level-typescript.com/template-literal-types',
      kind: 'background',
    },
    {
      name: 'TypeScript in frontend',
      exerciseCount: 10,
      description: 'a hard part',
      kind: 'basic',
    },
    {
      name: 'Backend development',
      exerciseCount: 21,
      description: 'Typing the backend',
      requirements: ['nodejs', 'jest'],
      kind: 'special',
    },
  ];

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  );

  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;
