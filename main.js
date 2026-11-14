'use strict';

// مصفوفة لحفظ الطلاب الذين تمت إضافتهم.
const studentsList = [];

// الإمساك بعناصر الصفحة.
const studentForm = document.getElementById('studentForm');
const studentName = document.getElementById('studentName');
const grade1 = document.getElementById('grade1');
const grade2 = document.getElementById('grade2');
const grade3 = document.getElementById('grade3');
const attendance = document.getElementById('attendance');
const errorBox = document.getElementById('errorBox');
const studentsBox = document.getElementById('studentsList');
const studentCount = document.getElementById('studentCount');
const mercyBtn = document.getElementById('mercyBtn');
const reportBox = document.getElementById('reportBox');

// التحقق من أن القيمة موجودة ورقم من 0 إلى 100.
function checkValue(value, fieldName) {
  if (value === '') {
    throw new Error('من فضلك أدخل ' + fieldName);
  }
  const number = Number(value);
  if (Number.isNaN(number) || number < 0 || number > 100) {
    throw new Error(fieldName + ' يجب أن تكون رقمًا من 0 إلى 100');
  }
  return number;
}

// كلاس الطالب مع إخفاء الدرجات والحضور باستخدام Private Fields.
class Student {
  #grade1;
  #grade2;
  #grade3;
  #attendance;

  constructor(name, firstGrade, secondGrade, thirdGrade, studentAttendance) {
    if (name.trim() === '') {
      throw new Error('من فضلك أدخل اسم الطالب');
    }
    this.name = name.trim();
    this.grade1 = firstGrade;
    this.grade2 = secondGrade;
    this.grade3 = thirdGrade;
    this.attendance = studentAttendance;
  }

  set grade1(value) { this.#grade1 = checkValue(value, 'درجة المادة الأولى'); }
  get grade1() { return this.#grade1; }
  set grade2(value) { this.#grade2 = checkValue(value, 'درجة المادة الثانية'); }
  get grade2() { return this.#grade2; }
  set grade3(value) { this.#grade3 = checkValue(value, 'درجة المادة الثالثة'); }
  get grade3() { return this.#grade3; }
  set attendance(value) { this.#attendance = checkValue(value, 'نسبة الحضور'); }
  get attendance() { return this.#attendance; }

  get average() {
    return (this.#grade1 + this.#grade2 + this.#grade3) / 3;
  }
}

// إضافة طالب عند إرسال النموذج.
studentForm.addEventListener('submit', function (event) {
  event.preventDefault();
  errorBox.textContent = '';
  errorBox.classList.add('d-none');

  try {
    const student = new Student(
      studentName.value,
      grade1.value,
      grade2.value,
      grade3.value,
      attendance.value
    );

    studentsList.push(student);

    // إنشاء عناصر HTML وعرض بيانات الطالب.
    const item = document.createElement('div');
    item.className = 'student-item';
    const info = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'student-name';
    name.textContent = student.name;
    const attendanceText = document.createElement('div');
    attendanceText.className = 'student-meta';
    attendanceText.textContent = 'الحضور: ' + student.attendance + '%';
    info.appendChild(name);
    info.appendChild(attendanceText);
    const average = document.createElement('span');
    average.className = 'student-average';
    average.textContent = 'المتوسط: ' + student.average.toFixed(2);
    item.appendChild(info);
    item.appendChild(average);
    studentsBox.appendChild(item);

    const emptyMessage = document.getElementById('studentsEmpty');
    if (emptyMessage) emptyMessage.remove();
    studentCount.textContent = studentsList.length + ' طالب';
    studentForm.reset();
    reportBox.innerHTML = '<div class="empty-state">اضغط على زر لجنة الرأفة لعرض التقرير.</div>';
  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.classList.remove('d-none');
  }
});

// لجنة الرأفة: filter لاختيار الطلاب، map لإضافة 5 درجات، reduce لحساب المتوسط.
mercyBtn.addEventListener('click', function () {
  const strugglingStudents = studentsList.filter(function (student) {
    return student.average >= 40 && student.average <= 49;
  });

  if (strugglingStudents.length === 0) {
    reportBox.innerHTML = `
      <h3 class="h6 report-title">التقرير النهائي للجنة الرأفة</h3>
      <p>عدد الطلاب المتعثرين: <strong>0</strong></p>
      <p class="mb-0">لا يوجد طلاب متوسط درجاتهم بين 40 و49.</p>
    `;
    return;
  }

  const studentsAfterMercy = strugglingStudents.map(function (student) {
    return { name: student.name, newAverage: student.average + 5 };
  });

  const totalAverages = studentsAfterMercy.reduce(function (total, student) {
    return total + student.newAverage;
  }, 0);

  const generalAverage = totalAverages / studentsAfterMercy.length;

  // عرض التقرير باستخدام Template Literals.
  const namesList = studentsAfterMercy.map(function (student) {
    return `<li>${escapeHTML(student.name)} - المتوسط بعد الرأفة: ${student.newAverage.toFixed(2)}</li>`;
  }).join('');

  reportBox.innerHTML = `
    <h3 class="h6 report-title">التقرير النهائي للجنة الرأفة</h3>
    <p>عدد الطلاب المتعثرين: <strong>${studentsAfterMercy.length}</strong></p>
    <p>المتوسط العام بعد الرأفة: <strong>${generalAverage.toFixed(2)}</strong></p>
    <h4 class="h6 mt-3">أسماء الطلاب:</h4>
    <ol class="report-names">${namesList}</ol>
  `;
});

// منع تفسير الرموز التي قد يكتبها المستخدم على أنها HTML داخل التقرير.
function escapeHTML(text) {
  return String(text).replace(/[&<>\"']/g, function (character) {
    const symbols = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#039;' };
    return symbols[character];
  });
}
