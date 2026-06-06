import { countHours } from '../utils/timeUtils.js';

export function TimeModule({
  employees,
  records,
  recordForm,
  setRecordForm,
  addRecord,
  deleteRecord,
  getEmployeeName,
}) {
  return (
    <main className="grid">
      <section className="card">
        <h2>Добавить рабочее время</h2>
        <form onSubmit={addRecord} className="form">
          <label>Сотрудник
            <select value={recordForm.employeeId} onChange={(e) => setRecordForm({ ...recordForm, employeeId: e.target.value })}>
              {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
            </select>
          </label>
          <label>Дата
            <input type="date" value={recordForm.date} onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })} />
          </label>
          <div className="row">
            <label>Начало
              <input type="time" value={recordForm.start} onChange={(e) => setRecordForm({ ...recordForm, start: e.target.value })} />
            </label>
            <label>Конец
              <input type="time" value={recordForm.end} onChange={(e) => setRecordForm({ ...recordForm, end: e.target.value })} />
            </label>
          </div>
          <label>Комментарий
            <textarea value={recordForm.comment} onChange={(e) => setRecordForm({ ...recordForm, comment: e.target.value })} placeholder="Например: разработка отчета" />
          </label>
          <button className="mainButton">Добавить запись</button>
        </form>
      </section>

      <section className="card wide">
        <h2>Записи времени</h2>
        <div className="tableBox">
          <table>
            <thead>
              <tr>
                <th>Дата</th><th>Сотрудник</th><th>Время</th><th>Часы</th><th>Комментарий</th><th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{getEmployeeName(record.employeeId)}</td>
                  <td>{record.start} - {record.end}</td>
                  <td>{countHours(record.start, record.end)}</td>
                  <td>{record.comment || '-'}</td>
                  <td><button className="small danger" onClick={() => deleteRecord(record.id)}>Удалить</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
