import { Year } from '@prisma/client'
import { FacultyID } from './enum'

export const allowedCorsDomains = [
  'http://localhost:3000',
  'https://loykrathongcu.com',
  'https://dev.loykrathongcu.com',
]

export const facultyList = {
  '20': { facultyEn: 'Graduate School', facultyTh: 'บัณฑิตวิทยาลัย' },
  '21': { facultyEn: 'Faculty of Engineering', facultyTh: 'คณะวิศวกรรมศาสตร์' },
  '22': { facultyEn: 'Faculty of Arts', facultyTh: 'คณะอักษรศาสตร์' },
  '23': { facultyEn: 'Faculty of Science', facultyTh: 'คณะวิทยาศาสตร์' },
  '24': {
    facultyEn: 'Faculty of Political Science',
    facultyTh: 'คณะรัฐศาสตร์',
  },
  '25': {
    facultyEn: 'Faculty of Architecture',
    facultyTh: 'คณะสถาปัตยกรรมศาสตร์',
  },
  '26': {
    facultyEn: 'Faculty of Commerce And Accountancy',
    facultyTh: 'คณะพาณิชยศาสตร์และการบัญชี',
  },
  '27': { facultyEn: 'Faculty of Education', facultyTh: 'คณะครุศาสตร์' },
  '28': {
    facultyEn: 'Faculty of Communication Arts',
    facultyTh: 'คณะนิเทศศาสตร์',
  },
  '29': { facultyEn: 'Faculty of Economics', facultyTh: 'คณะเศรษฐศาสตร์' },
  '30': { facultyEn: 'Faculty of Medicine', facultyTh: 'คณะแพทยศาสตร์' },
  '31': {
    facultyEn: 'Faculty of Veterinary Science',
    facultyTh: 'คณะสัตวแพทยศาสตร์',
  },
  '32': { facultyEn: 'Faculty of Dentistry', facultyTh: 'คณะทันตแพทยศาสตร์' },
  '33': {
    facultyEn: 'Faculty of Pharmaceutical Sciences',
    facultyTh: 'คณะเภสัชศาสตร์',
  },
  '34': { facultyEn: 'Faculty of Law', facultyTh: 'คณะนิติศาสตร์' },
  '35': {
    facultyEn: 'Faculty of Fine And Applied Arts',
    facultyTh: 'คณะศิลปกรรมศาสตร์',
  },
  '36': { facultyEn: 'Faculty of Nursing', facultyTh: 'คณะพยาบาลศาสตร์' },
  '37': {
    facultyEn: 'Faculty of Allied Health Sciences',
    facultyTh: 'คณะสหเวชศาสตร์',
  },
  '38': { facultyEn: 'Faculty of Psychology', facultyTh: 'คณะจิตวิทยา' },
  '39': {
    facultyEn: 'Faculty of Sports Science',
    facultyTh: 'คณะวิทยาศาสตร์การกีฬา',
  },
  '40': {
    facultyEn: 'School of Agricultural Resources',
    facultyTh: 'สำนักวิชาทรัพยากรการเกษตร',
  },
  '51': {
    facultyEn: 'College of Population Studies',
    facultyTh: 'วิทยาลัยประชากรศาสตร์',
  },
  '53': {
    facultyEn: 'College of Public Health Sciences',
    facultyTh: 'วิทยาลัยวิทยาศาสตร์สาธารณสุข',
  },
  '55': { facultyEn: 'Language Institute', facultyTh: 'สถาบันภาษา' },
  '56': {
    facultyEn: 'School of Integrated Innovation',
    facultyTh: 'สถาบันนวัตกรรมบูรณาการ',
  },
  '58': {
    facultyEn: 'Sasin Graduate Institute of Business Administion',
    facultyTh: 'สถาบันบัณฑิตบริหารธุรกิจ ศศินทร์ฯ',
  },
  '99': { facultyEn: 'Other University', facultyTh: 'มหาวิทยาลัยอื่น' },
  '01': {
    facultyEn: 'The Sirindhorn Thai Language Institute',
    facultyTh: 'สถาบันภาษาไทยสิรินธร',
  },
  '02': {
    facultyEn: 'office of Academic Affairs',
    facultyTh: 'ศูนย์การศึกษาทั่วไป',
  },
}

export const facultySelectionList = [
  {
    value: FacultyID.ENGINEER,
    content: 'คณะวิศวกรรมศาสตร์',
  },
  {
    value: FacultyID.ARTS,
    content: 'คณะอักษรศาสตร์',
  },
  {
    value: FacultyID.SCIENCE,
    content: 'คณะวิทยาศาสตร์',
  },
  {
    value: FacultyID.POLITICAL_SCIENCE,
    content: 'คณะรัฐศาสตร์',
  },
  {
    value: FacultyID.ARCHITECTURE,
    content: 'คณะสถาปัตยกรรมศาสตร์',
  },
  {
    value: FacultyID.COMMERCE_ACCOUNTANCY,
    content: 'คณะพาณิชยศาสตร์และการบัญชี',
  },
  {
    value: FacultyID.EDUCATION,
    content: 'คณะครุศาสตร์',
  },
  {
    value: FacultyID.ECONOMICS,
    content: 'คณะเศรษฐศาสตร์',
  },
  {
    value: FacultyID.MEDICINE,
    content: 'คณะแพทยศาสตร์',
  },
  {
    value: FacultyID.VETERINARY_SCIENCE,
    content: 'คณะสัตวแพทยศาสตร์',
  },
  {
    value: FacultyID.DENTISTRY,
    content: 'คณะทันตแพทยศาสตร์',
  },
  {
    value: FacultyID.PHARMACUTICAL,
    content: 'คณะสัตวแพทยศาสตร์',
  },
  {
    value: FacultyID.LAW,
    content: 'คณะนิติศาสตร์',
  },
  {
    value: FacultyID.FINE_ARTS,
    content: 'คณะศิลปกรรมศาสตร์',
  },
  {
    value: FacultyID.NURSING,
    content: 'คณะพยาบาลศาสตร์',
  },
  {
    value: FacultyID.PSYCHOLOGY,
    content: 'คณะจิตวิทยา',
  },
  {
    value: FacultyID.SPORT_SCIENCE,
    content: 'คณะวิทยาศาสตร์การกีฬา',
  },
  {
    value: FacultyID.AGRICULTURAL_RESOURCES,
    content: 'สำนักวิชาทรัพยากรการเกษตร',
  },
]

export const yearSelectionList = [
  {
    value: Year.Y1,
    content: 'ปีที่ 1',
  },
  {
    value: Year.Y2,
    content: 'ปีที่ 2',
  },
  {
    value: Year.Y3,
    content: 'ปีที่ 3',
  },
  {
    value: Year.Y4,
    content: 'ปีที่ 4',
  },
  {
    value: Year.Y5,
    content: 'ปีที่ 5',
  },
  {
    value: Year.Y6,
    content: 'ปีที่ 6',
  },
  {
    value: Year.Y7,
    content: 'ปีที่ 7',
  },
  {
    value: Year.Y8,
    content: 'ปีที่ 8',
  },
  {
    value: Year.MASTER,
    content: 'ปริญญาโท',
  },
  {
    value: Year.PHD,
    content: 'ปริญญาเอก',
  },
]
