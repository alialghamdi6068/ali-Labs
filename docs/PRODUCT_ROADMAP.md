# Ali Labs — خطة الوصول إلى مستوى منصة احترافية

هذه الخطة تبني Ali Labs كمنصة مستقلة لا تنسخ Modrinth حرفيًا. لا تُعتبر أي مرحلة مكتملة إلا بعد تشغيلها واختبارها من الواجهة ومن API.

## المرحلة 1 — الأساس الإنتاجي

- اعتماد خادم Node واحد واضح خلف HTTPS على الاستضافة ذات التخزين الدائم.
- نقل البيانات من JSON إلى قاعدة محلية transactional (MySQL أو PostgreSQL داخل Docker على نفس الخادم).
- فصل طبقات API، المصادقة، المشاريع، الإصدارات، التخزين، المراجعة، المجتمع، والتحليلات.
- توحيد مصدر البيانات: لا تعتمد صفحات Explore وProject وDashboard على catalog تجريبي.
- إضافة migrations، seed development، health/readiness، structured logging، ونسخ احتياطي/استعادة قابلة للاختبار.

## المرحلة 2 — النشر والإصدارات

- إنشاء المشروع وإدارته.
- رفع JAR/ZIP/MRPACK/7Z مع حجم ونوع وتوقيع ومحتوى واضح.
- quarantine قبل النشر، verdict من scanner، ثم مراجعة بشرية.
- ربط كل إصدار بإصدارات Minecraft والـloaders والتبعيات.
- صفحة جميع الإصدارات مع release/beta/alpha، changelog، تنزيل، أرشفة، وإعادة إصدار.
- عدم السماح بتنزيل إصدار غير approved وclean.

## المرحلة 3 — Developer Studio والفرق

- لوحة واحدة تعرض كل المشاريع والإصدارات والملفات والـloaders والإحصائيات.
- Teams وmembers وinvitations وRBAC مستقل لكل مشروع.
- أدوار owner/manager/developer/reviewer/viewer.
- audit trail لكل تغيير.
- تحليلات مشاهدات وتنزيلات ومصادر الزيارات.

## المرحلة 4 — Explore والمجتمع

- فهرسة بحث حقيقية مع pagination وsort وfilters.
- Trending/New/Featured تعتمد على بيانات حقيقية.
- favorites/follows/comments/discussions/reviews/notifications/activity.
- صفحات مشروع كاملة: overview، versions، changelog، gallery، dependencies، community.
- واجهة عربية وإنجليزية مع RTL/LTR وتبديل لغة.

## المرحلة 5 — Security Center والموثوقية

- rate limits وCSRF/origin/session policies.
- scanner مع عزل خارج عملية API وfail-closed.
- security events وmoderation logs وabuse controls.
- تشفير الحقول والنسخ الاحتياطية، إدارة مفاتيح من البيئة، وعدم وضع الأسرار في Git.
- backups متعددة تشمل DB والملفات، checksum، restore drill دوري.

## المرحلة 6 — الأداء والنشر

- background jobs للرفع والفحص والتحليلات والتنظيف.
- cache للكتالوج والصفحات العامة.
- حدود CPU/RAM وtimeouts وconcurrency.
- GitHub Actions للـlint/typecheck/unit/integration/security/upload/restore.
- Docker deployment على الاستضافة 12GB مع HTTPS وhealth checks وrestart policy.
- اختبار حمل واقعي قبل إعلان الجاهزية.

## تعريف الإنجاز

الميزة لا تُعلن مكتملة إذا كانت مجرد عنصر UI أو مسار غير موصول. يلزم لكل ميزة: API، تخزين دائم، صلاحيات، حالات فشل، واجهة، اختبار آلي، واختبار smoke من الخادم.
