export function convertDate(dateString: string): string {
  const [day, month, year] = dateString.split('-');

  return `${year}-${month}-${day}`;
}
