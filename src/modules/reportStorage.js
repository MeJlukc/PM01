import * as XLSX from 'xlsx';
import { countHours } from '../utils/timeUtils.js';

export function exportExcelReport({ employees, records, report }) {
  const rows = records.map((record) => {
    const employee = employees.find((item) => item.id === record.employeeId);
    const hours = countHours(record.start, record.end);
    const rate = employee ? Number(employee.rate) : 0;

    return {
      Дата: record.date,
      Сотрудник: employee ? employee.name : 'Сотрудник удален',
      Должность: employee ? employee.position : '-',
      'Начало работы': record.start,
      'Окончание работы': record.end,
      Часы: hours,
      'Ставка в час': rate,
      'Сумма к оплате': +(hours * rate).toFixed(2),
      Комментарий: record.comment,
    };
  });

  const summary = report.map((item) => ({
    Сотрудник: item.employee.name,
    Должность: item.employee.position,
    'Кол-во записей': item.recordsCount,
    'Всего часов': item.totalHours,
    'Ставка в час': item.employee.rate,
    'Сумма к оплате': item.salary,
  }));

  const workbook = XLSX.utils.book_new();
  const recordsSheet = XLSX.utils.json_to_sheet(rows);
  const reportSheet = XLSX.utils.json_to_sheet(summary);

  recordsSheet['!cols'] = [
    { wch: 12 }, { wch: 22 }, { wch: 18 }, { wch: 15 }, { wch: 18 },
    { wch: 10 }, { wch: 14 }, { wch: 16 }, { wch: 35 },
  ];
  reportSheet['!cols'] = [
    { wch: 22 }, { wch: 18 }, { wch: 14 }, { wch: 12 }, { wch: 14 }, { wch: 16 },
  ];

  XLSX.utils.book_append_sheet(workbook, recordsSheet, 'Записи времени');
  XLSX.utils.book_append_sheet(workbook, reportSheet, 'Отчет');
  XLSX.writeFile(workbook, 'otchet_uchet_vremeni.xlsx');
}
