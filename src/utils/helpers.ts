export function parseFraction(input: string): number {
  if (!input) return 0;
  const trimmed = input.trim();
  if (trimmed.includes(" ")) {
    const [whole, frac] = trimmed.split(" ");
    return parseFloat(whole) + parseFraction(frac);
  }

  if (trimmed.includes("/")) {
    const [num, denom] = trimmed.split("/");
    return parseFloat(num) / parseFloat(denom);
  }

  return parseFloat(trimmed);
}

export function formatNumber(value: number): string {
  if (isNaN(value)) return "0";
  return value.toLocaleString("en-NG");
}
