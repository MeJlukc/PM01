export function ReportsModule({ report, exportExcel }) {
  return (
    <main className="card">
      <div className="reportHeader">
        <div>
          <h2>Отчет по сотрудникам</h2>
          <p>Здесь видно итоговое количество часов и сумма к оплате.</p>
        </div>
        <button onClick={exportExcel} className="mainButton">Скачать Excel</button>
      </div>
      <div className="tableBox">
        <table>
          <thead>
            <tr>
              <th>Сотрудник</th><th>Должность</th><th>Записей</th><th>Всего часов</th><th>Ставка</th><th>Итого</th>
            </tr>
          </thead>
          <tbody>
            {report.map((item) => (
              <tr key={item.employee.id}>
                <td>{item.employee.name}</td>
                <td>{item.employee.position}</td>
                <td>{item.recordsCount}</td>
                <td>{item.totalHours}</td>
                <td>{item.employee.rate} ₽</td>
                <td><b>{item.salary} ₽</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
