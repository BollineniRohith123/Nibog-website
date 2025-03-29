export function formatDate(date: string | Date): string {
  const formattedDate = new Date(date);
  return formattedDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  });
}

export function formatTime(date: string | Date): string {
  const formattedTime = new Date(date);
  return formattedTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (
    monthDifference < 0 || 
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  
  return age;
}
