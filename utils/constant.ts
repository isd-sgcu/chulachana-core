import { Year } from '@prisma/client'
import { FacultyID } from './enum'

export const allowedCorsDomains = [
  'http://localhost:3000',
  'https://loykrathongcu.com',
  'https://dev.loykrathongcu.com',
]

export const facultyList = {
  '20': { facultyEn: 'Graduate School', facultyTh: 'บัณฑิตวิทยาลัย' },
  '21': { facultyEn: 'Engineering', facultyTh: 'วิศวกรรมศาสตร์' },
  '22': { facultyEn: 'Arts', facultyTh: 'อักษรศาสตร์' },
  '23': { facultyEn: 'Science', facultyTh: 'วิทยาศาสตร์' },
  '24': {
    facultyEn: 'Political Science',
    facultyTh: 'รัฐศาสตร์',
  },
  '25': {
    facultyEn: 'Architecture',
    facultyTh: 'สถาปัตยกรรมศาสตร์',
  },
  '26': {
    facultyEn: 'Commerce And Accountancy',
    facultyTh: 'พาณิชยศาสตร์และการบัญชี',
  },
  '27': { facultyEn: 'Education', facultyTh: 'ครุศาสตร์' },
  '28': {
    facultyEn: 'Communication Arts',
    facultyTh: 'นิเทศศาสตร์',
  },
  '29': { facultyEn: 'Economics', facultyTh: 'เศรษฐศาสตร์' },
  '30': { facultyEn: 'Medicine', facultyTh: 'แพทยศาสตร์' },
  '31': {
    facultyEn: 'Veterinary Science',
    facultyTh: 'สัตวแพทยศาสตร์',
  },
  '32': { facultyEn: 'Dentistry', facultyTh: 'ทันตแพทยศาสตร์' },
  '33': {
    facultyEn: 'Pharmaceutical Sciences',
    facultyTh: 'เภสัชศาสตร์',
  },
  '34': { facultyEn: 'Law', facultyTh: 'นิติศาสตร์' },
  '35': {
    facultyEn: 'Fine And Applied Arts',
    facultyTh: 'ศิลปกรรมศาสตร์',
  },
  '36': { facultyEn: 'Nursing', facultyTh: 'พยาบาลศาสตร์' },
  '37': {
    facultyEn: 'Allied Health Sciences',
    facultyTh: 'สหเวชศาสตร์',
  },
  '38': { facultyEn: 'Psychology', facultyTh: 'จิตวิทยา' },
  '39': {
    facultyEn: 'Sports Science',
    facultyTh: 'วิทยาศาสตร์การกีฬา',
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
    content: 'วิศวกรรมศาสตร์',
  },
  {
    value: FacultyID.ARTS,
    content: 'อักษรศาสตร์',
  },
  {
    value: FacultyID.SCIENCE,
    content: 'วิทยาศาสตร์',
  },
  {
    value: FacultyID.POLITICAL_SCIENCE,
    content: 'รัฐศาสตร์',
  },
  {
    value: FacultyID.ARCHITECTURE,
    content: 'สถาปัตยกรรมศาสตร์',
  },
  {
    value: FacultyID.COMMERCE_ACCOUNTANCY,
    content: 'พาณิชยศาสตร์และการบัญชี',
  },
  {
    value: FacultyID.EDUCATION,
    content: 'ครุศาสตร์',
  },
  {
    value: FacultyID.ECONOMICS,
    content: 'เศรษฐศาสตร์',
  },
  {
    value: FacultyID.MEDICINE,
    content: 'แพทยศาสตร์',
  },
  {
    value: FacultyID.VETERINARY_SCIENCE,
    content: 'สัตวแพทยศาสตร์',
  },
  {
    value: FacultyID.DENTISTRY,
    content: 'ทันตแพทยศาสตร์',
  },
  {
    value: FacultyID.PHARMACUTICAL,
    content: 'สัตวแพทยศาสตร์',
  },
  {
    value: FacultyID.LAW,
    content: 'นิติศาสตร์',
  },
  {
    value: FacultyID.FINE_ARTS,
    content: 'ศิลปกรรมศาสตร์',
  },
  {
    value: FacultyID.NURSING,
    content: 'พยาบาลศาสตร์',
  },
  {
    value: FacultyID.PSYCHOLOGY,
    content: 'จิตวิทยา',
  },
  {
    value: FacultyID.SPORT_SCIENCE,
    content: 'วิทยาศาสตร์การกีฬา',
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
