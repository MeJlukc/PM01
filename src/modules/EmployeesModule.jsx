export function EmployeesModule({
  employees,
  employeeForm,
  setEmployeeForm,
  editEmployeeId,
  saveEmployee,
  startEditEmployee,
  deleteEmployee,
}) {
  return (
    <main className="grid">
      <section className="card">
        <h2>{editEmployeeId ? 'Редактировать сотрудника' : 'Добавить сотрудника'}</h2>
        <form onSubmit={saveEmployee} className="form">
          <label>ФИО
            <input value={employeeForm.name} onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })} placeholder="Иванов Иван" />
          </label>
          <label>Должность
            <input value={employeeForm.position} onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })} placeholder="Программист" />
          </label>
          <label>Ставка за час
            <input type="number" value={employeeForm.rate} onChange={(e) => setEmployeeForm({ ...employeeForm, rate: e.target.value })} placeholder="350" />
          </label>
          <button className="mainButton">Сохранить</button>
        </form>
      </section>

      <section className="card wide">
        <h2>Список сотрудников</h2>
        {employees.map((employee) => (
          <div className="employee" key={employee.id}>
            <div>
              <b>{employee.name}</b>
              <p>{employee.position} · {employee.rate} ₽/час</p>
            </div>
            <div>
              <button className="small" onClick={() => startEditEmployee(employee)}>Изменить</button>
              <button className="small danger" onClick={() => deleteEmployee(employee.id)}>Удалить</button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
