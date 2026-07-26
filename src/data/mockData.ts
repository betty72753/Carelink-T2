import { ForeignCaregiver, NotificationItem } from '../types';

export const INITIAL_CAREGIVERS: ForeignCaregiver[] = [
  {
    id: 'cg-001',
    name: '西蒂 (Siti Rahma)',
    englishName: 'Siti Rahma',
    nationality: '印尼 (Indonesia)',
    nationalityCode: 'ID',
    languageCode: 'id',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    gender: '女',
    passportNumber: 'C1234567',
    arcNumber: 'A800192837',
    arcExpiryDate: '2027-02-15',
    arrivalDate: '2025-02-15',
    contractStartDate: '2025-02-15',
    contractEndDate: '2028-02-14',
    employerName: '張志明',
    patientName: '張陳秀英 (張老太太)',
    patientAge: 84,
    agencyName: '東南亞人力資源顧問有限公司',
    agencyContact: '林專員 (0912-345-678)',
    healthChecks: [
      {
        id: 'hc-01',
        stageName: '入境後 3 日內指定健康檢查',
        monthInterval: 0,
        dueDate: '2025-02-18',
        completedDate: '2025-02-17',
        status: 'completed',
        hospitalName: '臺北市立聯合醫院和平院區',
        reportFileUrl: '#',
        requiredItems: ['胸部X光攝影檢查', '腸內寄生蟲糞便檢查', '傷寒檢查', '梅毒血清檢查', '身體與精神檢查'],
        note: '體檢結果合格（文號：北市衛醫字第11400123號）'
      },
      {
        id: 'hc-02',
        stageName: '入境滿 6 個月定期健康檢查',
        monthInterval: 6,
        dueDate: '2025-08-15',
        completedDate: '2025-08-10',
        status: 'completed',
        hospitalName: '馬偕紀念醫院臺北院區',
        reportFileUrl: '#',
        requiredItems: ['胸部X光攝影檢查', '腸內寄生蟲糞便檢查', '身體檢查'],
        note: '體檢報告已備查並上傳勞動部系統'
      },
      {
        id: 'hc-03',
        stageName: '入境滿 18 個月定期健康檢查',
        monthInterval: 18,
        dueDate: '2026-08-15', // Upcoming in ~20 days!
        status: 'pending',
        hospitalName: '臺北市立聯合醫院仁愛院區 (預約診所)',
        requiredItems: ['胸部X光攝影檢查', '腸內寄生蟲糞便檢查', '皮膚檢查', '身體檢查'],
        note: '⚠️ 提醒雇主：距離法定體檢截止日尚餘 21 天，請盡速安排前往指定醫院體檢。'
      },
      {
        id: 'hc-04',
        stageName: '入境滿 30 個月定期健康檢查',
        monthInterval: 30,
        dueDate: '2027-08-15',
        status: 'upcoming',
        requiredItems: ['胸部X光攝影檢查', '腸內寄生蟲糞便檢查', '傷寒檢查', '身體檢查'],
        note: '尚未到期（預計 2027 年 7 月開啟預約通知）'
      }
    ],
    workflowSteps: [
      {
        id: 'wf-01',
        stepNumber: 1,
        title: '長照照顧需求評估與巴氏量表',
        subtitle: '醫療機構評估合格',
        description: '前往指定醫院開立巴氏量表（Barthel Index）評估分數 35 分，符合外籍家庭看護工申請門檻。',
        status: 'completed',
        officialDocumentNo: '衛部評字第 114012019 號',
        updatedAt: '2024-11-10',
        responsibleParty: '臺大醫院開立 / 雇主申請'
      },
      {
        id: 'wf-02',
        stepNumber: 2,
        title: '勞動部初次招募許可核發',
        subtitle: '取得招募許可函',
        description: '向勞動部勞動力發展署申請招募許可，獲得引進外籍家庭看護工之法律配額。',
        status: 'completed',
        officialDocumentNo: '勞職許字第 113088921 號',
        updatedAt: '2024-12-05',
        responsibleParty: '勞動部勞動力發展署'
      },
      {
        id: 'wf-03',
        stepNumber: 3,
        title: '海外面試選工與國外簽署',
        subtitle: '完成印尼履歷與視訊面試',
        description: '經由人力仲介提供履歷，完成雙向視訊面試並與西蒂 (Siti Rahma) 確認薪資及照顧工作內容。',
        status: 'completed',
        updatedAt: '2024-12-20',
        responsibleParty: '印尼海外派遣仲介公司'
      },
      {
        id: 'wf-04',
        stepNumber: 4,
        title: '海外簽證與入境桃園機場交接',
        subtitle: '移工抵台，關懷服務接機',
        description: '完成印尼代表處驗證與中華民國駐外館處工作簽證，西蒂於桃園國際機場順利抵台，仲介完成專車接送。',
        status: 'completed',
        updatedAt: '2025-02-15',
        responsibleParty: '移民署 / 外國人入國工作關懷服務站'
      },
      {
        id: 'wf-05',
        stepNumber: 5,
        title: '入境 3 天健檢與勞動部聘僱許可',
        subtitle: '完成聘僱許可備查',
        description: '入境 3 天內於和平醫院完成體檢合格，並向勞動部取得「外籍看護工聘僱許可函」。',
        status: 'completed',
        officialDocumentNo: '勞職聘字第 114033281 號',
        updatedAt: '2025-02-22',
        responsibleParty: '勞動部 / 人力仲介'
      },
      {
        id: 'wf-06',
        stepNumber: 6,
        title: '外僑居留證 (ARC) 申辦與指紋建檔',
        subtitle: '取得三年期居留證',
        description: '向移民署服務站完成外籍勞工指紋採集與居留證申辦，獲得居留許可。',
        status: 'completed',
        officialDocumentNo: '移民證字第 114099812 號',
        updatedAt: '2025-03-01',
        responsibleParty: '內政部移民署'
      },
      {
        id: 'wf-07',
        stepNumber: 7,
        title: '履約期維護與定期健檢追蹤',
        subtitle: '進行中：滿 18 個月體檢預備',
        description: '正常履約服務中。當前急需辦理【入境滿 18 個月定期健康檢查】，請於 2026/08/15 前完成。',
        status: 'in_progress',
        estimatedCompletionDate: '2026-08-15',
        responsibleParty: '雇主與移工共同配合辦理',
        requiredAction: '請點擊下方「前往健檢提醒」安排特約醫院體檢預約'
      },
      {
        id: 'wf-08',
        stepNumber: 8,
        title: '期滿續聘意願確認與文件簽署',
        subtitle: '待辦理：簽署續聘合約與授權',
        description: '合約第二年期將至，請雇主確認續聘意願，並線上簽署「勞動契約續簽協議書」與「勞健保投保聲明」。',
        status: 'action_required',
        estimatedCompletionDate: '2026-08-30',
        responsibleParty: '雇主端線上簽署',
        requiredAction: '【待簽署】線上電子簽章作業',
        linkedDocumentId: 'doc-001'
      }
    ],
    documents: [
      {
        id: 'doc-001',
        title: '外籍家庭看護工勞動契約續聘意願協議書',
        type: 'employment_contract',
        categoryName: '勞動合約',
        description: '約定第二年度續聘薪資（基本薪資 $20,000 元/月）、休假折算加班費規範、及生活照顧照顧標準。',
        status: 'pending_signature',
        createdAt: '2026-07-20',
        signDeadline: '2026-08-10',
        fileSize: '1.2 MB',
        summaryBulletPoints: [
          '每月基本薪資為新臺幣 20,000 元整。',
          '雇主按月依規定發給，每週提供休假 1 日，若因照顧需求經移工同意加班，給付加班費每日新臺幣 667 元。',
          '雇主需提供合適之獨立膳宿與安全工作環境。',
          '本契約一式兩份，由雇主與移工雙方以電子或紙本簽署後生效。'
        ]
      },
      {
        id: 'doc-002',
        title: '私立就業服務機構委任服務契約書',
        type: 'service_agreement',
        categoryName: '仲介服務',
        description: '雇主委任東南亞人力資源顧問有限公司辦理體檢安排、行政展延、行蹤通報與翻譯輔導服務。',
        status: 'signed',
        createdAt: '2025-02-15',
        signedAt: '2025-02-15',
        signDeadline: '2025-02-20',
        fileSize: '850 KB',
        summaryBulletPoints: [
          '服務內容包含：定期健康檢查提醒與追蹤、勞健保申辦、居留證展延、生活溝通雙語翻譯。',
          '仲介服務費收取符合勞動部法令規定標準（不得超收費用）。'
        ]
      },
      {
        id: 'doc-003',
        title: '外籍移工薪資明細與就業安定費代轉授權書',
        type: 'salary_authorization',
        categoryName: '薪資財會',
        description: '雇主代扣移工健保費、健保個人自付額，及由雇主定期繳納衛生福利部就業安定費聲明。',
        status: 'pending_signature',
        createdAt: '2026-07-22',
        signDeadline: '2026-08-15',
        fileSize: '620 KB',
        summaryBulletPoints: [
          '明確列出每月代扣全民健康保險個人負擔部分（約 $426 元）。',
          '雇主承諾依法定期繳納勞動部就業安定費（每月 $2,000 元）。',
          '提供雙語薪資簽收單供移工每月簽字核對。'
        ]
      },
      {
        id: 'doc-004',
        title: '定期健康檢查個人資料與同意書',
        type: 'health_consent',
        categoryName: '衛生醫療',
        description: '授權指定醫院將體檢結果同步通報衛生局及勞動部資訊系統，供雇主及仲介登錄備查。',
        status: 'signed',
        createdAt: '2025-02-16',
        signedAt: '2025-02-16',
        signDeadline: '2025-02-18',
        fileSize: '410 KB',
        summaryBulletPoints: [
          '同意將胸部X光及腸內寄生蟲檢查結果傳送至衛福部疾管署系統。',
          '若檢查不合格需於 30 日內進行複檢。'
        ]
      }
    ]
  },
  {
    id: 'cg-002',
    name: '阮氏梅 (Nguyen Thi Mai)',
    englishName: 'Nguyen Thi Mai',
    nationality: '越南 (Vietnam)',
    nationalityCode: 'VN',
    languageCode: 'vi',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    gender: '女',
    passportNumber: 'N9876543',
    arcNumber: 'C900281726',
    arcExpiryDate: '2026-11-30',
    arrivalDate: '2023-11-30',
    contractStartDate: '2023-11-30',
    contractEndDate: '2026-11-29',
    employerName: '張志明',
    patientName: '張老先生 (張伯伯)',
    patientAge: 88,
    agencyName: '新台亞人力仲介有限公司',
    agencyContact: '陳經理 (0923-888-999)',
    healthChecks: [
      {
        id: 'hc-11',
        stageName: '入境後 3 日內指定健康檢查',
        monthInterval: 0,
        dueDate: '2023-12-03',
        completedDate: '2023-12-02',
        status: 'completed',
        hospitalName: '新光吳火獅紀念醫院',
        reportFileUrl: '#',
        requiredItems: ['胸部X光', '腸寄生蟲', '傷寒', '梅毒血清'],
        note: '合格'
      },
      {
        id: 'hc-12',
        stageName: '入境滿 6 個月定期健康檢查',
        monthInterval: 6,
        dueDate: '2024-05-30',
        completedDate: '2024-05-25',
        status: 'completed',
        hospitalName: '臺北市立聯合醫院陽明院區',
        reportFileUrl: '#',
        requiredItems: ['胸部X光', '腸寄生蟲', '身體檢查'],
        note: '合格'
      },
      {
        id: 'hc-13',
        stageName: '入境滿 18 個月定期健康檢查',
        monthInterval: 18,
        dueDate: '2025-05-30',
        completedDate: '2025-05-28',
        status: 'completed',
        hospitalName: '臺北市立聯合醫院陽明院區',
        reportFileUrl: '#',
        requiredItems: ['胸部X光', '腸寄生蟲', '身體檢查'],
        note: '合格'
      },
      {
        id: 'hc-14',
        stageName: '入境滿 30 個月定期健康檢查',
        monthInterval: 30,
        dueDate: '2026-05-30',
        completedDate: '2026-05-20',
        status: 'completed',
        hospitalName: '臺北市立聯合醫院陽明院區',
        reportFileUrl: '#',
        requiredItems: ['胸部X光', '腸寄生蟲', '傷寒'],
        note: '合格（已完成三年內所有法定體檢）'
      }
    ],
    workflowSteps: [
      {
        id: 'wf-11',
        stepNumber: 1,
        title: '三年滿期續聘與申請許可',
        subtitle: '進行中：準備勞動部期滿續聘申請',
        description: '阮氏梅即將於 2026/11/29 屆滿 3 年期，雇主與移工雙方皆意願原領續聘，正進行期滿續聘文件整理。',
        status: 'in_progress',
        officialDocumentNo: '續字第 115002129 號案處理中',
        estimatedCompletionDate: '2026-09-15',
        responsibleParty: '張志明 (雇主) / 仲介專員'
      }
    ],
    documents: [
      {
        id: 'doc-11',
        title: '外籍看護工期滿原雇主直聘/續聘同意書',
        type: 'employment_contract',
        categoryName: '期滿續聘',
        description: '張志明雇主與阮氏梅續簽第二個三年聘僱合約。',
        status: 'pending_signature',
        createdAt: '2026-07-15',
        signDeadline: '2026-08-20',
        fileSize: '1.5 MB',
        summaryBulletPoints: [
          '合約展延 3 年（2026/11/30 至 2029/11/29）。',
          '依法給予年資滿 3 年之特別休假 14 天及返國休假權益。',
          '基本薪資及加班費依最新法定公告給付。'
        ]
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    title: '🩺 體檢提醒：Siti Rahma 滿 18 個月健檢倒數',
    message: '看護工 Siti Rahma 入境滿 18 個月定期健康檢查將於 2026/08/15 到期（剩餘 21 天），請盡速聯繫特約醫院預約體檢，以免逾期受罰。',
    category: 'health_check',
    timestamp: '2026-07-25 10:30',
    isRead: false,
    actionUrl: 'health_checks',
    actionLabel: '前往預約體檢',
    caregiverId: 'cg-001',
    priority: 'high'
  },
  {
    id: 'notif-02',
    title: '📝 文件簽署通知：勞動契約續聘意願協議書待簽章',
    message: '【請雇主即時簽署】Siti Rahma 之「外籍家庭看護工勞動契約續聘意願協議書」已製作完成，請點擊進行線上電子簽章。',
    category: 'contract_signing',
    timestamp: '2026-07-24 16:15',
    isRead: false,
    actionUrl: 'documents',
    actionLabel: '立即線上簽署',
    caregiverId: 'cg-001',
    priority: 'high'
  },
  {
    id: 'notif-03',
    title: '📋 申請進度更新：居留證 ARC 展延審查通過',
    message: '移民署已核准 Siti Rahma 之居留許可展延，新有效期限至 2027/02/15。居留證實體卡片預計 3 個工作天內寄達仲介公司。',
    category: 'workflow_progress',
    timestamp: '2026-07-20 09:00',
    isRead: true,
    actionUrl: 'workflow',
    actionLabel: '查看流程細節',
    caregiverId: 'cg-001',
    priority: 'normal'
  },
  {
    id: 'notif-04',
    title: '💰 繳費提醒：115年第2季就業安定費繳款單已核發',
    message: '勞動部發布衛生福利部就業安定費 $2,000 元繳款單，繳費期限至 2026/08/31 止，可至超商或網路銀行轉帳繳納。',
    category: 'payment_reminder',
    timestamp: '2026-07-15 14:00',
    isRead: true,
    actionUrl: 'payment',
    actionLabel: '下載電子繳款單',
    caregiverId: 'cg-001',
    priority: 'normal'
  }
];

export const TAIWAN_HEALTH_CHECK_HOSPITALS = [
  { name: '臺北市立聯合醫院 和平婦幼院區', city: '臺北市', address: '臺北市中正區中華路二段33號', phone: '02-2388-7080' },
  { name: '臺北市立聯合醫院 仁愛院區', city: '臺北市', address: '臺北市大安區仁愛路四段10號', phone: '02-2709-3600' },
  { name: '臺北市立聯合醫院 陽明院區', city: '臺北市', address: '臺北市士林區雨聲街105號', phone: '02-2835-3456' },
  { name: '馬偕紀念醫院 臺北院區', city: '臺北市', address: '臺北市中山區中山北路二段92號', phone: '02-2543-3535' },
  { name: '衛生福利部雙和醫院', city: '新北市', address: '新北市中和區中正路291號', phone: '02-2249-0088' },
  { name: '新光吳火獅紀念醫院', city: '臺北市', address: '臺北市士林區文昌路95號', phone: '02-2833-2211' }
];
