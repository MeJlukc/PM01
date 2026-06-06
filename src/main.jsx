import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';

import { demoEmployees, demoRecords } from './data/demoData.js';
import { getSavedData, saveData } from './utils/storage.js';
import { countHours } from './utils/timeUtils.js';
import { exportExcelReport } from './modules/reportStorage.js';
import { EmployeesModule } from './modules/EmployeesModule.jsx';
import { TimeModule } from './modules/TimeModule.jsx';
import { ReportsModule } from './modules/ReportsModule.jsx';
import { DocumentationModule } from './modules/DocumentationModule.jsx';

function App() {
  const [tab, setTab] = useState('time');
  const [employees, setEmployees] = useState(() => getSavedData('employees', demoEmployees));
  const [records, setRecords] = useState(() => getSavedData('records', demoRecords));

  const [employeeForm, setEmployeeForm] = useState({ name: '', position: '', rate: '' });
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  const [recordForm, setRecordForm] = useState({
    employeeId: demoEmployees[0].id,
    date: new Date().toISOString().slice(0, 10),
    start: '09:00',
    end: '17:00',
    comment: '',
  });

  useEffect(() => {
    saveData('employees', employees);
  }, [employees]);

  useEffect(() => {
    saveData('records', records);
  }, [records]);

  useEffect(() => {
    if (employees.length > 0 && !employees.find((employee) => employee.id === recordForm.employeeId)) {
      setRecordForm((form) => ({ ...form, employeeId: employees[0].id }));
    }
  }, [employees, recordForm.employeeId]);

  const report = useMemo(() => {
    return employees.map((employee) => {
      const employeeRecords = records.filter((record) => record.employeeId === employee.id);
      const totalHours = employeeRecords.reduce((sum, record) => sum + countHours(record.start, record.end), 0);

      return {
        employee,
        totalHours: +totalHours.toFixed(2),
        salary: +(totalHours * Number(employee.rate || 0)).toFixed(2),
        recordsCount: employeeRecords.length,
      };
    });
  }, [employees, records]);

  function saveEmployee(event) {
    event.preventDefault();
    if (!employeeForm.name || !employeeForm.position || !employeeForm.rate) return;

    if (editEmployeeId) {
      setEmployees((list) =>
        list.map((employee) =>
          employee.id === editEmployeeId
            ? { ...employee, ...employeeForm, rate: Number(employeeForm.rate) }
            : employee
        )
      );
      setEditEmployeeId(null);
    } else {
      setEmployees((list) => [
        ...list,
        {
          id: 'emp_' + Date.now(),
          name: employeeForm.name,
          position: employeeForm.position,
          rate: Number(employeeForm.rate),
        },
      ]);
    }

    setEmployeeForm({ name: '', position: '', rate: '' });
  }

  function startEditEmployee(employee) {
    setEmployeeForm({ name: employee.name, position: employee.position, rate: employee.rate });
    setEditEmployeeId(employee.id);
    setTab('employees');
  }

  function deleteEmployee(id) {
    setEmployees((list) => list.filter((employee) => employee.id !== id));
    setRecords((list) => list.filter((record) => record.employeeId !== id));
  }

  function addRecord(event) {
    event.preventDefault();
    if (!recordForm.employeeId || !recordForm.date || !recordForm.start || !recordForm.end) return;

    setRecords((list) => [...list, { ...recordForm, id: 'rec_' + Date.now() }]);
    setRecordForm((form) => ({ ...form, comment: '' }));
  }

  function deleteRecord(id) {
    setRecords((list) => list.filter((record) => record.id !== id));
  }

  function getEmployeeName(id) {
    const employee = employees.find((item) => item.id === id);
    return employee ? employee.name : 'Сотрудник удален';
  }

  function exportExcel() {
    exportExcelReport({ employees, records, report });
  }

  function resetDemoData() {
    setEmployees(demoEmployees);
    setRecords(demoRecords);
  }

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="tag">Практика 09.02.07 · учебный React-проект</p>
          <h1>Учет времени работы сотрудников</h1>
          <p>
            Простое веб-приложение с модулями сотрудников, учета времени и отчетности.
            Данные сохраняются в браузере, отчет можно посмотреть на странице и экспортировать в Excel.
          </p>
        </div>
        <button onClick={exportExcel} className="mainButton">Экспорт Excel</button>
      </header>

      <nav className="tabs">
        <button className={tab === 'time' ? 'active' : ''} onClick={() => setTab('time')}>Учет времени</button>
        <button className={tab === 'employees' ? 'active' : ''} onClick={() => setTab('employees')}>Сотрудники</button>
        <button className={tab === 'report' ? 'active' : ''} onClick={() => setTab('report')}>Отчет</button>
        <button className={tab === 'docs' ? 'active' : ''} onClick={() => setTab('docs')}>Документация</button>
      </nav>

      {tab === 'time' && (
        <TimeModule
          employees={employees}
          records={records}
          recordForm={recordForm}
          setRecordForm={setRecordForm}
          addRecord={addRecord}
          deleteRecord={deleteRecord}
          getEmployeeName={getEmployeeName}
        />
      )}

      {tab === 'employees' && (
        <EmployeesModule
          employees={employees}
          employeeForm={employeeForm}
          setEmployeeForm={setEmployeeForm}
          editEmployeeId={editEmployeeId}
          saveEmployee={saveEmployee}
          startEditEmployee={startEditEmployee}
          deleteEmployee={deleteEmployee}
        />
      )}

      {tab === 'report' && (
        <ReportsModule report={report} exportExcel={exportExcel} />
      )}

      {tab === 'docs' && (
        <DocumentationModule resetDemoData={resetDemoData} />
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
