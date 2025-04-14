interface HeaderProps {
  name: string;
}

interface CourseParts {
  parts: CoursePart[];
}

interface CoursePart {
  name: string;
  exerciseCount: number;
}

interface TotalProps {
  totalExercises: number;
}

const Header = ({ name }: HeaderProps) => <h1>{name}</h1>;

const Content = (props: CourseParts) => {
  return props.parts.map((p, i: number) => {
    return (
      <div key={i}>
        {p.name} {p.exerciseCount}
      </div>
    );
  });
};

const Total = ({ totalExercises }: TotalProps) => (
  <p>Number of exercises {totalExercises}</p>
);

const App = () => {
  const courseName = 'Half Stack application development';
  const courseParts: CoursePart[] = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
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
