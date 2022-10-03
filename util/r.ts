export function random(max: number) {
  return Math.random() * max
}

export function dataset(size: number, max: number) {
  const arr = []
  for (let i = 0; i < size; i++) arr.push(random(max))
  return arr
}
