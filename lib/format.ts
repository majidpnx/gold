import dayjs from 'dayjs';
import 'dayjs/locale/fa';

export function formatToman(amount: number): string {
  return amount.toLocaleString('fa-IR') + ' تومان';
}

export function formatDate(date: string | Date): string {
  return dayjs(date).locale('fa').format('YYYY/MM/DD HH:mm');
}
