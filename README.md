# نظام إدارة النتائج

تطبيق ويب تدريبي لإدارة درجات الطلاب وتفعيل لجنة الرأفة باستخدام HTML وCSS وBootstrap وJavaScript.

## هيكل المشروع

```text
student-results-manager/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    └── main.js
```

## التشغيل

1. فك ضغط المشروع.
2. افتح `index.html` في متصفح حديث.
3. يلزم اتصال بالإنترنت لتحميل Bootstrap وخط Cairo من روابط CDN.

## الوظائف

- إدخال اسم الطالب وثلاث درجات ونسبة الحضور.
- التحقق من القيم (مطلوبة ومن 0 إلى 100) باستخدام setters و`throw new Error`.
- تغليف الدرجات والحضور باستخدام Private Fields (`#`).
- التقاط الأخطاء وعرضها داخل الصفحة باستخدام `try...catch`.
- حفظ كائنات الطلاب في `studentsList`.
- استخراج الطلاب الذين يتراوح متوسطهم بين 40 و49 باستخدام `filter`.
- إضافة خمس درجات لمتوسطاتهم باستخدام `map`.
- حساب المتوسط العام بعد الرأفة باستخدام `reduce` مع منع القسمة على صفر.

## رفع المشروع على GitHub

من داخل مجلد المشروع نفّذ:

```bash
git init
git add .
git commit -m "Build student results management app"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

استبدل `USERNAME` و`REPOSITORY` باسم حسابك واسم المستودع. اجعل المستودع عامًا إذا كان مطلوبًا من جهة التكليف أن تتمكن من مشاهدة المشروع.
