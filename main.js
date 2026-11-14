"use strict";

// قائمة حفظ كائنات الطلاب.
const studentsList = [];

// عناصر واجهة المستخدم.
const studentForm = document.getElementById("studentForm");
const studentNameInput = document.getElementById("studentName");
const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");
const attendanceInput = document.getElementById("attendance");
const errorBox = document.getElementById("errorBox");
const studentsListBox = document.getElementById("studentsList");
const studentsEmpty = document.getElementById("studentsEmpty");
const studentCount = document.getElementById("studentCount");
const mercyBtn = document.getElementById("mercyBtn");
const reportBox = document.getElementById("reportBox");

/**
 * يتحقق من أن القيمة غير فارغة، رقمية، وتقع بين 0 و100.
 * تُستخدم الدالة داخل setters حتى تكون الحماية مركزية.
 */
function validatePercentage(value, fieldName) {
  if (value === "" || value === null || value === undefined) {
    throw new Error(`حقل ${fieldName} مطلوب ولا يمكن تركه فارغًا.`);
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    throw new Error(`يجب إدخال قيمة رقمية صحيحة في حقل ${fieldName}.`);
  }

  if (numericValue < 0 || numericValue > 100) {
    throw new Error(`قيمة ${fieldName} يجب أن تكون بين 0 و100.`);
  }

  return numericValue;
}

// كلاس الطالب مع تغليف البيانات الحساسة باستخدام Private Fields.
class Student {
  #grade1;
  #grade2;
  #grade3;
  #attendance;

  constructor(name, grade1, grade2, grade3, attendance) {
    const cleanName = String(name ?? "").trim();
    if (!cleanName) {
      throw new Error("يرجى إدخال اسم الطالب.");
    }

    this.name = cleanName;
    this.grade1 = grade1;
    this.grade2 = grade2;
    this.grade3 = grade3;
    this.attendance = attendance;
  }

  set grade1(value) {
    this.#grade1 = validatePercentage(value, "درجة المادة الأولى");
  }
  get grade1() { return this.#grade1; }

  set grade2(value) {
    this.#grade2 = validatePercentage(value, "درجة المادة الثانية");
  }
  get grade2() { return this.#grade2; }

  set grade3(value) {
    this.#grade3 = validatePercentage(value, "درجة المادة الثالثة");
  }
  get grade3() { return this.#grade3; }

  set attendance(value) {
    this.#attendance = validatePercentage(value, "نسبة الحضور");
  }
  get attendance() { return this.#attendance; }

  get average() {
    return (this.#grade1 + this.#grade2 + this.#grade3) / 3;
  }
}

function formatNumber(value) {
  return Number(value).toFixed(2);
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("d-none");
}

function clearError() {
  errorBox.textContent = "";
  errorBox.classList.add("d-none");
}

function clearInputs() {
  studentForm.reset();
  studentNameInput.focus();
}

function renderStudent(student) {
  // نستخدم textContent لإنشاء النص بأمان دون تفسير اسم الطالب كـ HTML.
  const item = document.createElement("div");
  item.className = "student-item";

  const details = document.createElement("div");
  const name = document.createElement("div");
  name.className = "student-name";
  name.textContent = student.name;

  const meta = document.createElement("div");
  meta.className = "student-meta";
  meta.textContent = `الحضور: ${formatNumber(student.attendance)}%`;

  details.append(name, meta);

  const average = document.createElement("span");
  average.className = "student-average";
  average.textContent = `المتوسط: ${formatNumber(student.average)}`;

  item.append(details, average);
  studentsListBox.appendChild(item);

  studentsEmpty?.remove();
  studentCount.textContent = `${studentsList.length} طالب`;
}

// إضافة طالب مع اصطياد الأخطاء وعرضها للمستخدم.
studentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearError();

  try {
    const student = new Student(
      studentNameInput.value,
      grade1Input.value,
      grade2Input.value,
      grade3Input.value,
      attendanceInput.value
    );

    studentsList.push(student);
    renderStudent(student);
    reportBox.innerHTML = '<div class="empty-state">تم تحديث قائمة الطلاب. فعّل اللجنة لإنشاء تقرير جديد.</div>';
    clearInputs();
  } catch (error) {
    showError(error.message);
  }
});

// لجنة الرأفة: Filter ثم Map ثم Reduce.
mercyBtn.addEventListener("click", () => {
  clearError();

  const strugglingStudents = studentsList.filter((student) =>
    student.average >= 40 && student.average <= 49
  );

  if (strugglingStudents.length === 0) {
    reportBox.innerHTML = `
      <div class="report-title">التقرير النهائي للجنة الرأفة</div>
      <div class="empty-state">لا يوجد طلاب متوسط درجاتهم بين 40 و49.</div>
      <div class="report-stat">
        <span>عدد الطلاب المتعثرين</span>
        <strong>0</strong>
      </div>
      <div class="report-stat">
        <span>المتوسط العام بعد الرأفة</span>
        <strong>لا يوجد</strong>
      </div>
    `;
    return;
  }

  const studentsAfterMercy = strugglingStudents.map((student) => ({
    name: student.name,
    originalAverage: student.average,
    newAverage: student.average + 5
  }));

  const totalAfterMercy = studentsAfterMercy.reduce(
    (total, student) => total + student.newAverage,
    0
  );

  const generalAverageAfterMercy =
    totalAfterMercy / studentsAfterMercy.length;

  const namesHtml = studentsAfterMercy
    .map((student) => `
      <li>
        <strong>${escapeHtml(student.name)}</strong>
        — ${formatNumber(student.originalAverage)} ←
        ${formatNumber(student.newAverage)} بعد الرأفة
      </li>
    `)
    .join("");

  reportBox.innerHTML = `
    <div class="report-title">التقرير النهائي للجنة الرأفة</div>
    <div class="report-stat">
      <span>عدد الطلاب المتعثرين</span>
      <strong>${studentsAfterMercy.length}</strong>
    </div>
    <div class="report-stat">
      <span>المتوسط العام بعد الرأفة</span>
      <strong>${formatNumber(generalAverageAfterMercy)}%</strong>
    </div>
    <div class="fw-bold mt-3">أسماء الطلاب ودرجاتهم بعد التعديل:</div>
    <ol class="report-names">${namesHtml}</ol>
  `;
});

// حماية أسماء الطلاب عند إدراجها داخل قالب HTML في التقرير.
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[character];
  });
}
