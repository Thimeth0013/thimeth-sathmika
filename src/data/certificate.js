import hpAgileProjectManagementPdf from '../assets/certificates/hpAgileProjectManagement.pdf'
import hpAgileProjectManagementImg from '../assets/certificates/hpAgileProjectManagement.png'
import hpAiForBeginnersPdf from '../assets/certificates/hpAiForBeginners.pdf'
import hpAiForBeginnersImg from '../assets/certificates/hpAiForBeginners.png'

const CertificateData = [
  {
    id: 1,
    title: "Agile Project Management",
    description: "Certificate in Agile methodologies like Scrum and Kanban transforms business development and customer satisfaction management.",
    company: "HP LIFE",
    companyUrl: "https://www.life-global.org/",
    thumbnail: hpAgileProjectManagementImg,
    pdf: hpAgileProjectManagementPdf,
    date: "August 2025",
  },  
  {
    id: 2,
    title: "AI for Beginners",
    description: "Certificate in key AI concepts and their applications, why data is important to AI, how the technology is being used in businesses, and insight about its ethical implication.",
    company: "HP LIFE",
    companyUrl: "https://www.life-global.org/",
    thumbnail: hpAiForBeginnersImg,
    pdf: hpAiForBeginnersPdf,
    date: "August 2025",
  }
];

export default CertificateData;
