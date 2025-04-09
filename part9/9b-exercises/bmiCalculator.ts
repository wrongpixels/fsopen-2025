type BmiRange = 'Underweight' | 'Normal' | 'Overweight' | 'Obese'

const getBmiRange = (result: number): BmiRange => {
  console.log(result)
  if (result < 18.5) {
    return 'Underweight'
  }
  if (result >= 30) {
    return 'Obese'
  }
  if (result > 25) {
    return 'Overweight'
  }
  return 'Normal'
}

const calculateBmi = (height: number, weight: number): string => {
  const result: number = weight / (height / 100) ** 2
  return `${getBmiRange(result)} range`
}

try {
  console.log(calculateBmi(180, 74))
} catch (e) {
  console.log(
    e instanceof Error ? `Error: ${e.message}` : 'Error: Something went wrong!'
  )
}
