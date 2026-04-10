export interface ProcedureStep {
  title: string;
  description: string;
  tip?: string;
}

export interface Procedure {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  documents: string[];
  steps: ProcedureStep[];
  helpline?: string;
  website?: string;
  letterTemplate?: string;
  eligibilityType?: "old-age-pension" | "widow-pension";
}

export const procedures: Procedure[] = [
  {
    id: "free-legal-aid",
    title: "Free Legal Aid",
    category: "Legal Services",
    icon: "shield",
    color: "#2d7a4f",
    description: "Apply for free legal aid through the District Legal Services Authority (DLSA) if you cannot afford a lawyer.",
    documents: [
      "Aadhaar Card or any government-issued identity proof",
      "Income certificate (income below Rs. 3 lakh per year for general eligibility)",
      "Caste certificate (for SC/ST applicants — exempt from income limit)",
      "Any documents related to your legal problem (FIR copy, court summons, land documents, etc.)",
      "Passport size photograph",
    ],
    steps: [
      {
        title: "Check Eligibility",
        description: "Free legal aid is available to: Women and children (regardless of income), SC/ST members, victims of trafficking, persons with disabilities, industrial workmen, people in custody, and persons with annual income below Rs. 3 lakh.",
        tip: "Even if you are not sure about eligibility, visit the DLSA — they will assess your situation for free.",
      },
      {
        title: "Visit Your District Legal Services Authority (DLSA)",
        description: "Find the DLSA office in your district — it is usually located in or near the District Court complex. You can also call NALSA at 15100 to get the DLSA address.",
        tip: "Every district in India has a DLSA. Taluka Legal Services Committees also provide aid at the block level.",
      },
      {
        title: "Meet the Secretary / Legal Aid Officer",
        description: "Meet the DLSA Secretary or the designated Legal Aid Officer. Explain your legal problem clearly. They will assess your eligibility and the nature of your case.",
      },
      {
        title: "Submit Application",
        description: "Fill out the application form for legal aid (available free at the DLSA). Submit along with the required documents. You can also submit the application online at nalsa.gov.in.",
      },
      {
        title: "Get a Panel Lawyer Assigned",
        description: "Once your application is approved (usually within a few days), a panel lawyer (empanelled by the DLSA) will be assigned to represent you. The lawyer's fee is paid entirely by the government.",
        tip: "You can request a change of lawyer if you are not satisfied with the one assigned.",
      },
      {
        title: "Attend Court / Mediation",
        description: "Work with your assigned lawyer to attend court hearings or mediation sessions. DLSA also provides free mediation and Lok Adalat services to resolve disputes without going to court.",
        tip: "Lok Adalat awards are final and no court fees are charged. Disputes settled in Lok Adalat cannot be appealed.",
      },
    ],
    helpline: "15100",
    website: "nalsa.gov.in",
  },
  {
    id: "rti-application",
    title: "RTI Application",
    category: "Transparency",
    icon: "file-text",
    color: "#2d3e50",
    description: "File a Right to Information application to get information from any government department.",
    letterTemplate: `To,
The Public Information Officer,
[Name of Department/Ministry],
[Address of Department]

Subject: Application under Section 6(1) of the Right to Information Act, 2005

Respected Sir/Madam,

I, [Your Full Name], a citizen of India, residing at [Your Complete Address], hereby request the following information under Section 6(1) of the Right to Information Act, 2005:

1. [Describe the specific information you are seeking]
2. [Add more specific questions if needed]
3. [Time period or year for which information is sought]

I am enclosing an application fee of Rs. 10/- (Rupees Ten Only) by way of [Indian Postal Order/Demand Draft/Court Fee Stamp] bearing No. _________.

If the information requested is not held by your department, please transfer this application to the appropriate Public Information Officer as per Section 6(3) of the RTI Act, 2005, and inform me accordingly.

I expect a response within 30 days as mandated under Section 7(1) of the RTI Act, 2005.

Thanking you.

Yours sincerely,

[Your Full Name]
[Your Address]
[City, State, PIN Code]
[Mobile Number]
[Date]`,
    documents: [
      "Application on plain paper or prescribed form",
      "Application fee of Rs. 10 (DD/IPO/Cash)",
      "BPL certificate (if applicable, for fee exemption)",
    ],
    steps: [
      {
        title: "Identify the Public Authority",
        description: "Determine which government department or office holds the information you need.",
        tip: "You can file RTI to any government body - central, state, or local.",
      },
      {
        title: "Write the Application",
        description: "Address it to the Public Information Officer (PIO). Mention 'Under Section 6(1) of RTI Act, 2005'. Be specific about the information you need.",
        tip: "Keep questions clear and specific. Avoid vague requests.",
      },
      {
        title: "Pay the Fee",
        description: "Pay Rs. 10 via Demand Draft, Indian Postal Order, or cash. BPL card holders are exempt.",
      },
      {
        title: "Submit the Application",
        description: "Submit by post, in person, or online at rtionline.gov.in. Keep a copy and note the date.",
        tip: "Always get a receipt with date stamp.",
      },
      {
        title: "Wait for Response",
        description: "The PIO must respond within 30 days. For life/liberty matters, response must come within 48 hours.",
      },
      {
        title: "File Appeal if Needed",
        description: "If unsatisfied, file First Appeal within 30 days to the First Appellate Authority. Second Appeal goes to the Information Commission within 90 days.",
      },
    ],
    helpline: "1800-11-0001",
    website: "rtionline.gov.in",
  },
  {
    id: "ration-card",
    title: "Ration Card",
    category: "Food Security",
    icon: "package",
    color: "#2d7a4f",
    description: "Apply for a new ration card to access subsidized food grains under the Public Distribution System.",
    documents: [
      "Aadhaar Card of all family members",
      "Address proof (electricity bill/rent agreement)",
      "Income certificate",
      "Passport size photographs",
      "Bank account details",
    ],
    steps: [
      {
        title: "Get Application Form",
        description: "Obtain the application form from the nearest Fair Price Shop, Tehsildar office, or download from the state food department website.",
      },
      {
        title: "Fill the Form",
        description: "Fill in details of all family members including name, age, Aadhaar number, and relationship with head of family.",
      },
      {
        title: "Attach Documents",
        description: "Attach copies of all required documents. Get the form attested by a local authority if required.",
      },
      {
        title: "Submit Application",
        description: "Submit to the Food and Civil Supplies Department or the designated office in your area.",
      },
      {
        title: "Verification",
        description: "An inspector will visit your residence for verification. Ensure all family members are present.",
        tip: "Keep original documents ready for verification.",
      },
      {
        title: "Collect Ration Card",
        description: "Once approved, collect your ration card from the office. The process typically takes 15-30 days.",
      },
    ],
    helpline: "1800-11-0001",
  },
  {
    id: "voter-id",
    title: "Voter ID Correction",
    category: "Democracy",
    icon: "check-square",
    color: "#2d3e50",
    description: "Correct errors in your Voter ID card using Form 8.",
    documents: [
      "Form 8 (filled)",
      "Current Voter ID card copy",
      "Proof of correct information (Aadhaar/PAN/Passport)",
      "Passport size photograph",
    ],
    steps: [
      {
        title: "Download Form 8",
        description: "Get Form 8 from the Election Commission website (nvsp.in) or the nearest Electoral Registration Office.",
      },
      {
        title: "Fill Correction Details",
        description: "Mark the fields that need correction and fill in the correct information.",
      },
      {
        title: "Attach Supporting Documents",
        description: "Attach proof documents that support the correct information.",
      },
      {
        title: "Submit Form",
        description: "Submit online at nvsp.in or at the Electoral Registration Office. Note the reference number.",
      },
      {
        title: "Track Status",
        description: "Track your application status online using the reference number.",
      },
    ],
    website: "nvsp.in",
  },
  {
    id: "aadhaar-update",
    title: "Aadhaar Update",
    category: "Identity",
    icon: "credit-card",
    color: "#783232",
    description: "Update your Aadhaar card details including name, address, date of birth, and mobile number.",
    documents: [
      "Current Aadhaar card",
      "Proof of identity (any government ID)",
      "Proof of address (utility bill/bank statement)",
      "Date of birth proof (if updating DOB)",
    ],
    steps: [
      {
        title: "Visit Aadhaar Center or Go Online",
        description: "Visit the nearest Aadhaar Enrollment Center or go to myaadhaar.uidai.gov.in for online updates.",
        tip: "Online updates are limited to address and mobile number only.",
      },
      {
        title: "Fill Update Form",
        description: "Fill the Aadhaar Update/Correction Form. Tick the fields you want to update.",
      },
      {
        title: "Submit Documents",
        description: "Submit supporting documents for verification. Biometric verification will be done at the center.",
      },
      {
        title: "Pay Update Fee",
        description: "Pay Rs. 50 for demographic update at the center. Online address update is free.",
      },
      {
        title: "Collect URN",
        description: "Collect the Update Request Number (URN). Use this to track your update status.",
      },
    ],
    helpline: "1947",
    website: "myaadhaar.uidai.gov.in",
  },
  {
    id: "old-age-pension",
    title: "Old Age Pension",
    category: "Social Welfare",
    icon: "heart",
    color: "#b07d2a",
    description: "Apply for old age pension under the National Social Assistance Programme.",
    eligibilityType: "old-age-pension",
    documents: [
      "Age proof (Aadhaar/Birth Certificate)",
      "BPL certificate or Income certificate",
      "Bank passbook copy",
      "Passport size photographs",
      "Aadhaar Card",
    ],
    steps: [
      {
        title: "Check Eligibility",
        description: "You must be 60 years or above and belong to a BPL family or have income below the state-defined threshold.",
        tip: "Different states have different age and income criteria.",
      },
      {
        title: "Get Application Form",
        description: "Obtain the form from the Block Development Office, Tehsildar office, or download from the state social welfare department website.",
      },
      {
        title: "Fill and Submit",
        description: "Fill the form with complete details and submit along with required documents to the designated office.",
      },
      {
        title: "Verification",
        description: "The local authority will verify your eligibility, age, and income details.",
      },
      {
        title: "Receive Pension",
        description: "Once approved, pension will be credited directly to your bank account every month. Amount varies by state (Rs. 200-2000/month).",
      },
    ],
  },
  {
    id: "widow-pension",
    title: "Widow Pension",
    category: "Social Welfare",
    icon: "heart",
    color: "#783232",
    description: "Apply for widow pension under the Indira Gandhi National Widow Pension Scheme.",
    eligibilityType: "widow-pension",
    documents: [
      "Death certificate of husband",
      "Age proof of applicant",
      "BPL certificate or Income certificate",
      "Bank passbook copy",
      "Aadhaar Card",
      "Passport size photographs",
    ],
    steps: [
      {
        title: "Check Eligibility",
        description: "Widows aged 40-79 years from BPL families are eligible. Amount: Rs. 300/month (Rs. 500 after age 80).",
      },
      {
        title: "Collect Application Form",
        description: "Get the form from the District Social Welfare Office or Panchayat office.",
      },
      {
        title: "Submit with Documents",
        description: "Submit the filled form with all required documents including husband's death certificate.",
      },
      {
        title: "Verification & Approval",
        description: "After verification, the pension will be sanctioned and credited to your bank account.",
      },
    ],
  },
  {
    id: "mgnrega-job-card",
    title: "MGNREGA Job Card",
    category: "Employment",
    icon: "briefcase",
    color: "#2d7a4f",
    description: "Apply for a MGNREGA Job Card to get 100 days of guaranteed employment.",
    documents: [
      "Application on plain paper",
      "Passport size photograph of adult family members",
      "Aadhaar Card",
      "Address proof",
    ],
    steps: [
      {
        title: "Apply at Gram Panchayat",
        description: "Submit a written application to the Gram Panchayat. Include names of all adult family members who want to work.",
      },
      {
        title: "Verification",
        description: "The Gram Panchayat will verify your details and residence.",
      },
      {
        title: "Receive Job Card",
        description: "Job Card will be issued within 15 days of application. It is free of cost and contains photographs of all registered members.",
        tip: "The Job Card belongs to the household, not to any individual.",
      },
      {
        title: "Apply for Work",
        description: "Submit a written application to the Gram Panchayat requesting work. You must get a dated receipt.",
      },
      {
        title: "Get Work or Unemployment Allowance",
        description: "Work must be provided within 15 days. If not, you are entitled to unemployment allowance.",
      },
    ],
    helpline: "1800-345-22-44",
    website: "nrega.nic.in",
  },
  {
    id: "pm-awas-yojana",
    title: "PM Awas Yojana",
    category: "Social Welfare",
    icon: "home",
    color: "#4a2d6e",
    description: "Apply for housing under the Pradhan Mantri Awas Yojana (PMAY) for affordable housing.",
    documents: [
      "Aadhaar Card of all family members",
      "Income certificate (annual income below Rs. 6 lakh for MIG-I, Rs. 12 lakh for MIG-II)",
      "Bank account details",
      "Address proof",
      "Affidavit that you don't own a pucca house",
      "Passport size photographs",
    ],
    steps: [
      {
        title: "Check Eligibility",
        description: "PMAY-Urban: EWS (income up to Rs. 3L), LIG (Rs. 3-6L), MIG-I (Rs. 6-12L), MIG-II (Rs. 12-18L). You should not own a pucca house in your name or spouse's name.",
        tip: "PMAY-Gramin is for rural areas with different criteria — check with your Gram Panchayat.",
      },
      {
        title: "Register Online",
        description: "Visit pmaymis.gov.in or visit your nearest Common Service Centre (CSC) to register.",
      },
      {
        title: "Submit Application",
        description: "Fill in family details, income details, and upload required documents. Get acknowledgment number.",
      },
      {
        title: "Survey & Verification",
        description: "A field officer will visit to verify your details and eligibility.",
      },
      {
        title: "Loan Subsidy",
        description: "Once approved, interest subsidy will be credited directly to your loan account, reducing your EMI significantly.",
        tip: "EWS/LIG: 6.5% subsidy on first Rs. 6 lakh loan. Apply through any bank or housing finance company.",
      },
    ],
    helpline: "1800-11-6163",
    website: "pmaymis.gov.in",
  },
  {
    id: "disability-certificate",
    title: "Disability Certificate (UDID)",
    category: "Identity",
    icon: "heart",
    color: "#783232",
    description: "Apply for a Unique Disability ID (UDID) card to access government benefits and concessions.",
    documents: [
      "Recent passport size photograph",
      "Proof of identity (Aadhaar/PAN/Voter ID)",
      "Proof of address",
      "Medical records related to disability",
      "Doctor's prescription or hospital documents",
    ],
    steps: [
      {
        title: "Register Online",
        description: "Visit swavlambancard.gov.in and click 'Apply for Disability Certificate'.",
      },
      {
        title: "Fill Application Form",
        description: "Fill in personal details, disability type, and percentage of disability. Upload required documents.",
      },
      {
        title: "Get Examination Date",
        description: "After submission, you'll receive a date for medical examination at a government hospital.",
      },
      {
        title: "Medical Examination",
        description: "Visit the designated government hospital on the given date. A medical board will assess your disability.",
        tip: "Bring all original medical records and documents to the examination.",
      },
      {
        title: "Receive UDID Card",
        description: "After verification, your UDID card will be sent to your address. This card gives you access to all disability benefits across India.",
      },
    ],
    helpline: "1800-11-4515",
    website: "swavlambancard.gov.in",
  },
  {
    id: "consumer-complaint",
    title: "Consumer Complaint",
    category: "Transparency",
    icon: "alert-circle",
    color: "#b07d2a",
    description: "File a consumer complaint against unfair trade practices or defective products/services.",
    documents: [
      "Purchase bill/invoice (original or copy)",
      "Warranty/guarantee card if applicable",
      "Proof of payment",
      "Written complaint to the company with their response (if any)",
      "Photos of defective product if applicable",
    ],
    steps: [
      {
        title: "Try to Resolve with Company First",
        description: "Send a written complaint to the company's customer service. Keep a record of your communication.",
        tip: "Use email for a paper trail. Allow 15-30 days for response.",
      },
      {
        title: "Determine the Forum",
        description: "District Commission: complaints up to Rs. 50 lakh. State Commission: Rs. 50 lakh to Rs. 2 crore. National Commission: above Rs. 2 crore.",
      },
      {
        title: "File Complaint Online",
        description: "Visit consumerhelpline.gov.in or edaakhil.nic.in to file your complaint online. Or visit the District Consumer Forum directly.",
      },
      {
        title: "Pay Court Fee",
        description: "Pay the nominal court fee (Rs. 100-5000 depending on claim amount). Complaints up to Rs. 5 lakh: no fee.",
      },
      {
        title: "Attend Hearings",
        description: "Attend the hearing dates. The forum will issue notice to the opposite party. Resolution typically takes 90-150 days.",
        tip: "You don't need a lawyer in Consumer Forums. You can represent yourself.",
      },
    ],
    helpline: "1800-11-4000",
    website: "consumerhelpline.gov.in",
  },
  {
    id: "birth-certificate",
    title: "Birth Certificate",
    category: "Identity",
    icon: "file-text",
    color: "#2d7a4f",
    description: "Register a birth and obtain an official Birth Certificate from the Municipal Corporation or Gram Panchayat.",
    documents: [
      "Discharge slip or certificate from the hospital where birth occurred",
      "Parents' Aadhaar Cards",
      "Parents' Marriage Certificate",
      "Proof of address of parents",
      "Affidavit if reporting after 21 days of birth",
    ],
    steps: [
      {
        title: "Report the Birth",
        description: "A birth must be reported within 21 days. For hospital births, the hospital typically registers it. For home births, the head of the family must report to the local authority.",
        tip: "If more than 21 days have passed, a late fee and an affidavit may be required.",
      },
      {
        title: "Visit the Registration Office",
        description: "Visit the Municipal Corporation office (urban) or Gram Panchayat / Tehsildar office (rural). Submit the hospital discharge slip and parent details.",
      },
      {
        title: "Fill Registration Form",
        description: "Fill Form 1 (Birth Registration Form) with all required details: child's name, date/place of birth, parents' names and address.",
      },
      {
        title: "Submit Documents",
        description: "Attach supporting documents. Pay the nominal fee (varies by state; usually Rs. 10–50).",
      },
      {
        title: "Collect Certificate",
        description: "Collect the birth certificate within 7 days. You can also apply online via the CRS portal at crsorgi.gov.in.",
        tip: "Apply for multiple copies — you'll need them for school admission, passports, and other documents.",
      },
    ],
    helpline: "1800-111-555",
    website: "crsorgi.gov.in",
  },
  {
    id: "caste-certificate",
    title: "Caste Certificate",
    category: "Identity",
    icon: "award",
    color: "#783232",
    description: "Apply for a Scheduled Caste (SC), Scheduled Tribe (ST), or Other Backward Class (OBC) certificate for reservations and government benefits.",
    documents: [
      "Aadhaar Card",
      "Address proof (electricity bill / rent agreement)",
      "Parent's caste certificate or school leaving certificate showing caste",
      "Ration card",
      "Passport size photographs",
    ],
    steps: [
      {
        title: "Visit Tehsildar / SDM Office",
        description: "Go to your Tehsildar (rural) or Sub-Divisional Magistrate (urban) office. Many states now allow online applications through the district portal.",
      },
      {
        title: "Obtain Application Form",
        description: "Get the prescribed caste certificate application form. Fill in personal details, caste/sub-caste, and reason for application.",
      },
      {
        title: "Submit Documents",
        description: "Attach all required documents and submit the form. Some states require self-attestation.",
        tip: "Your parent's caste certificate or school records showing caste are the strongest proofs.",
      },
      {
        title: "Enquiry by Revenue Officer",
        description: "A Revenue Inspector may visit for verification. Ensure you are available and neighbours can vouch for your family background.",
      },
      {
        title: "Collect Certificate",
        description: "Collect the certificate from the office once processed (usually 15–30 days). Check for correct spelling of name and caste.",
      },
    ],
  },
  {
    id: "income-certificate",
    title: "Income Certificate",
    category: "Identity",
    icon: "dollar-sign",
    color: "#b07d2a",
    description: "Obtain an official income certificate from the government to avail of BPL benefits, scholarships, and fee waivers.",
    documents: [
      "Aadhaar Card",
      "Ration Card (BPL/APL)",
      "Salary slips or employer certificate (if employed)",
      "Self-declaration of income for self-employed/farmers",
      "Bank passbook",
      "Address proof",
    ],
    steps: [
      {
        title: "Apply at Tehsildar Office or Online",
        description: "Visit the Tehsildar's office or apply via your state's e-district portal. Most states have digitised this process.",
      },
      {
        title: "Fill the Application Form",
        description: "Provide complete family income details including all sources: salary, agriculture, business, rent, etc.",
        tip: "If income comes from multiple sources, list all of them. Underreporting can lead to certificate cancellation.",
      },
      {
        title: "Submit with Documents",
        description: "Attach income proofs and Aadhaar. Pay the nominal application fee (usually Rs. 10–30).",
      },
      {
        title: "Verification",
        description: "A Revenue Officer may verify the income claim by visiting your residence or checking records.",
      },
      {
        title: "Receive Certificate",
        description: "Income certificate is typically issued within 15 days. Valid for 1 year — renew annually.",
      },
    ],
  },
  {
    id: "domicile-certificate",
    title: "Domicile Certificate",
    category: "Identity",
    icon: "map-pin",
    color: "#2d3e50",
    description: "Obtain a domicile (residence) certificate to prove you are a permanent resident of a state, required for state jobs and admissions.",
    documents: [
      "Aadhaar Card",
      "Address proof (voter ID / utility bill / ration card)",
      "Property documents or rent agreement",
      "Parent's domicile certificate (if applying as a minor)",
      "Passport size photographs",
    ],
    steps: [
      {
        title: "Apply at Tehsildar or via State Portal",
        description: "Visit your Tehsildar/SDM office or apply online through your state's e-district portal with your Aadhaar and address proof.",
      },
      {
        title: "Fill Application Form",
        description: "Mention duration of residence in the state (usually 3–10 years required depending on state rules).",
        tip: "Attach utility bills or voter ID covering multiple years to show continuous residence.",
      },
      {
        title: "Submit Documents and Pay Fee",
        description: "Submit the application with documents. Fee is usually Rs. 10–50 depending on the state.",
      },
      {
        title: "Verification",
        description: "A Revenue Inspector may verify your residence claim.",
      },
      {
        title: "Collect Certificate",
        description: "Certificate is typically ready in 15–30 days. It is usually valid for 3 years.",
      },
    ],
  },
  {
    id: "scholarship-application",
    title: "Scholarship Application",
    category: "Education",
    icon: "book",
    color: "#2d7a4f",
    description: "Apply for central and state government scholarships for SC/ST/OBC students, minorities, and meritorious students.",
    documents: [
      "Aadhaar Card",
      "Caste certificate (for SC/ST/OBC scholarships)",
      "Income certificate (family income below state threshold)",
      "Previous year mark sheet / bonafide student certificate",
      "Bank account details (student's account, preferably IFSC-enabled)",
      "Institution fee receipt",
    ],
    steps: [
      {
        title: "Identify the Right Scholarship",
        description: "Visit scholarships.gov.in (National Scholarship Portal) to see all central government scholarships. Also check your state government's scholarship portal.",
        tip: "Key schemes: Pre-Matric and Post-Matric Scholarship for SC/ST/OBC, Merit-cum-Means for minorities, Central Sector Scheme for higher education.",
      },
      {
        title: "Register on NSP",
        description: "Create an account on scholarships.gov.in using your Aadhaar number and mobile. Students in Classes 9–12 and higher education can apply.",
      },
      {
        title: "Fill Application Form",
        description: "Fill in personal, academic, and bank details carefully. Upload required documents in specified format.",
        tip: "Bank account must be in the student's name, not parent's.",
      },
      {
        title: "Institute Verification",
        description: "Your school or college must verify your application on the NSP portal. Follow up with your institution's NSP coordinator.",
      },
      {
        title: "Track and Receive",
        description: "Track your application status on NSP. Scholarship amount is directly credited to your bank account via DBT.",
      },
    ],
    website: "scholarships.gov.in",
    helpline: "0120-6619540",
  },
  {
    id: "driving-licence",
    title: "Driving Licence",
    category: "Identity",
    icon: "navigation",
    color: "#2d3e50",
    description: "Apply for a new driving licence or renew an existing one through the Sarathi portal.",
    documents: [
      "Aadhaar Card (identity + address proof)",
      "Age proof (birth certificate / 10th mark sheet)",
      "Passport size photographs",
      "Medical certificate (Form 1A — required for commercial vehicles and applicants above 40)",
      "Learner's Licence number (for new permanent licence)",
    ],
    steps: [
      {
        title: "Apply for Learner's Licence First",
        description: "Visit sarathi.parivahan.gov.in to apply online. Select your state and RTO. Fill the application, pay the fee (Rs. 150–200), and book a slot for the learner's licence test.",
      },
      {
        title: "Pass Learner's Test",
        description: "Appear for an online/offline test at the RTO on traffic rules. Pass to get the Learner's Licence (LL). LL is valid for 6 months.",
        tip: "Practice with the mock tests on the Sarathi portal before your test.",
      },
      {
        title: "Practice Driving for 30 Days",
        description: "After getting your LL, practice driving for at least 30 days before applying for the permanent licence.",
      },
      {
        title: "Apply for Permanent DL",
        description: "Apply online for the Driving Test slot. Appear at the RTO on the scheduled date for the road driving test.",
      },
      {
        title: "Receive DL",
        description: "If you pass, the Driving Licence is sent to your registered address by post within 7–10 days. Download DigiLocker copy immediately.",
      },
    ],
    website: "sarathi.parivahan.gov.in",
    helpline: "1800-11-9191",
  },
  {
    id: "passport",
    title: "Passport",
    category: "Identity",
    icon: "globe",
    color: "#4a2d6e",
    description: "Apply for a new Indian passport or renew an existing one through the Passport Seva portal.",
    documents: [
      "Aadhaar Card (address + identity proof)",
      "PAN Card or birth certificate (date of birth proof)",
      "Old passport (for renewal)",
      "Police verification documents if required",
      "Passport size photograph (white background, 2×2 inch)",
    ],
    steps: [
      {
        title: "Register at Passport Seva Portal",
        description: "Visit passportindia.gov.in and create an account. Select your nearest Passport Seva Kendra (PSK).",
      },
      {
        title: "Fill Application Form (Form 1)",
        description: "Fill the online application form carefully. Select Fresh Passport or Re-issue (renewal). Pay the fee: Rs. 1500 (36 pages), Rs. 2000 (60 pages).",
        tip: "Use Aadhaar to pre-fill your details. Double-check name spelling — it must match all documents.",
      },
      {
        title: "Book Appointment",
        description: "Book an appointment at your nearest PSK or Post Office Passport Seva Kendra (POPSK). POPSK appointments are easier to get in small towns.",
      },
      {
        title: "Visit the PSK on Appointment Date",
        description: "Carry all original documents and attested copies. Go through document verification, biometric enrollment (photo + fingerprint), and officer interview.",
      },
      {
        title: "Police Verification",
        description: "A police officer will visit your address for verification. Ensure documents are ready and you are available.",
        tip: "Normal processing: 30–45 days. Tatkal: 7–14 days (additional fee of Rs. 2000).",
      },
      {
        title: "Receive Passport",
        description: "Passport is dispatched by Speed Post to your registered address. Track delivery on the Passport Seva portal.",
      },
    ],
    website: "passportindia.gov.in",
    helpline: "1800-258-1800",
  },
  {
    id: "land-records",
    title: "Land Records (Khasra / Khatauni)",
    category: "Property",
    icon: "map",
    color: "#b07d2a",
    description: "Obtain official land records including Khasra (field measurement) and Khatauni (ownership record) from the Revenue Department.",
    documents: [
      "Aadhaar Card",
      "Previous land records or Ration Card (for identification of land)",
      "Survey/Khasra number of the land",
      "Application fee (varies by state, usually Rs. 10–50)",
    ],
    steps: [
      {
        title: "Identify Your Land Details",
        description: "Know your Khasra number, village name, and district. This information is on older land documents or can be obtained from neighbours/panchayat.",
      },
      {
        title: "Visit or Apply Online",
        description: "Many states have online portals: Bhulekh (UP), BhoomiRashiHP (HP), Dharani (Telangana), AnyROR (Gujarat), etc. Visit your state's land record portal.",
        tip: "States like UP, Maharashtra, and Rajasthan have fully online Khasra/Khatauni records — no need to visit offices.",
      },
      {
        title: "Search by Khasra Number or Owner Name",
        description: "On the portal or at the Patwari/Tahsildar office, search records using the Khasra number or landowner name and village.",
      },
      {
        title: "Get Verified Copy",
        description: "Download the digital copy (usually free or small fee). For a certified/signed copy, apply at the Tehsildar office and pay the prescribed fee.",
      },
      {
        title: "Use for Legal Purposes",
        description: "The certified Khatauni is accepted as proof of ownership for bank loans, court cases, and government schemes. Keep multiple copies.",
      },
    ],
  },
  {
    id: "kisan-credit-card",
    title: "Kisan Credit Card (KCC)",
    category: "Agriculture",
    icon: "credit-card",
    color: "#2d7a4f",
    description: "Apply for a Kisan Credit Card to get affordable short-term crop loans and farming credit from banks.",
    documents: [
      "Land ownership documents (Khatauni / Khasra)",
      "Aadhaar Card",
      "PAN Card (if loan above Rs. 1 lakh)",
      "Passport size photographs",
      "Bank account details",
      "Crop details and land area information",
    ],
    steps: [
      {
        title: "Visit a Bank Branch",
        description: "Visit any nationalised bank, co-operative bank, or Regional Rural Bank (RRB) near you. Cooperative banks often have simpler KCC processes for small farmers.",
        tip: "PM Kisan beneficiaries can get KCC easily — banks have a simplified form for them.",
      },
      {
        title: "Fill KCC Application Form",
        description: "Fill the Kisan Credit Card application. Mention total land holding, type of crops grown, and estimated annual income.",
      },
      {
        title: "Submit Land and Identity Documents",
        description: "Submit Khatauni/Khasra (proof of land), Aadhaar, and photographs. The bank will assess your credit limit based on your land area and crop type.",
      },
      {
        title: "Loan Sanction",
        description: "The bank will sanction a credit limit (typically Rs. 10,000–3,00,000 for small farmers). This is based on land holding × crop value.",
        tip: "Interest rate is 7% per annum (4% with government interest subvention if repaid on time).",
      },
      {
        title: "Receive KCC",
        description: "A Rupay debit card is issued linked to your KCC account. Use it for purchasing seeds, fertilizers, or withdrawing cash for farming expenses.",
      },
    ],
    helpline: "1800-180-1551",
    website: "pmkisan.gov.in",
  },
  {
    id: "pm-kisan",
    title: "PM-KISAN Registration",
    category: "Agriculture",
    icon: "sun",
    color: "#2d7a4f",
    description: "Register for PM Kisan Samman Nidhi Yojana to receive Rs. 6,000 per year directly into your bank account.",
    documents: [
      "Aadhaar Card (mandatory — must be linked to bank account)",
      "Land ownership documents (Khatauni / Khasra)",
      "Bank account passbook (account linked to Aadhaar)",
      "Mobile number",
    ],
    steps: [
      {
        title: "Check Eligibility",
        description: "Small and marginal farmers owning cultivable land up to 2 hectares are eligible. Institutional landholders, government employees (except Class IV/Group D), income tax payers, and professionals are not eligible.",
        tip: "Aadhaar must be seeded (linked) to your bank account for DBT transfer to work.",
      },
      {
        title: "Apply at CSC or Online",
        description: "Visit pmkisan.gov.in and click 'New Farmer Registration'. Or visit your nearest Common Service Centre (CSC) or Lekhpal/Patwari office.",
      },
      {
        title: "Fill Registration Form",
        description: "Enter Aadhaar, state, district, village, and bank account details. Upload land records.",
        tip: "Name on Aadhaar must exactly match the bank account name for the transfer to succeed.",
      },
      {
        title: "Verification by State Government",
        description: "State/District agriculture officers verify the registration. Verification is usually completed within 30–60 days.",
      },
      {
        title: "Receive Instalments",
        description: "Rs. 2,000 is deposited every 4 months directly to your Aadhaar-linked bank account. Check your status at pmkisan.gov.in using your Aadhaar or registration number.",
      },
    ],
    helpline: "155261",
    website: "pmkisan.gov.in",
  },
  {
    id: "ayushman-bharat",
    title: "Ayushman Bharat (PM-JAY)",
    category: "Healthcare",
    icon: "heart",
    color: "#783232",
    description: "Enrol for Ayushman Bharat PM-JAY health insurance to get free hospitalisation coverage of up to Rs. 5 lakh per year.",
    documents: [
      "Aadhaar Card",
      "Ration Card (to verify SECC/PMJAY beneficiary status)",
      "Mobile number",
    ],
    steps: [
      {
        title: "Check Eligibility",
        description: "Visit pmjay.gov.in and click 'Am I Eligible?' Enter your name, mobile, or ration card number. Eligibility is based on the SECC 2011 socio-economic data for rural, and occupational categories for urban.",
        tip: "If your name is in the SECC list, you are automatically eligible — no separate registration is required.",
      },
      {
        title: "Visit Empanelled Hospital or CSC",
        description: "Visit any Ayushman Bharat empanelled hospital (public or private) or Common Service Centre to get your Ayushman card made.",
      },
      {
        title: "e-KYC Verification",
        description: "Your Aadhaar will be used for biometric/OTP verification. A hospital Arogya Mitra will help you complete the process.",
      },
      {
        title: "Get Ayushman Bharat Card",
        description: "The Ayushman Bharat Health Account (ABHA) card is issued. This card entitles you to cashless treatment at any empanelled hospital across India.",
        tip: "Keep the card safe. You can also download it digitally from the PMJAY app.",
      },
      {
        title: "Avail Treatment",
        description: "Show your Ayushman card at any empanelled hospital. You get free treatment for 1,500+ medical packages including surgeries, chemotherapy, ICU, and more.",
      },
    ],
    helpline: "14555",
    website: "pmjay.gov.in",
  },
  {
    id: "marriage-certificate",
    title: "Marriage Certificate",
    category: "Identity",
    icon: "heart",
    color: "#b07d2a",
    description: "Register your marriage and obtain an official Marriage Certificate under the Hindu Marriage Act or Special Marriage Act.",
    documents: [
      "Aadhaar Cards of both spouses",
      "Age proof for both spouses (birth certificate / 10th mark sheet)",
      "Address proof of both spouses",
      "Passport size photographs of both spouses",
      "Two passport size photographs of the marriage ceremony",
      "Marriage invitation card (if available)",
      "Two witnesses with their Aadhaar Cards",
    ],
    steps: [
      {
        title: "Choose the Applicable Act",
        description: "Hindu Marriage Act: for Hindus, Sikhs, Buddhists, Jains. Special Marriage Act: for inter-religion marriages or civil marriages. Both are legally equal.",
      },
      {
        title: "Apply Online or at Sub-Registrar Office",
        description: "Visit your Sub-Registrar's office (under the Revenue Department) or apply online via your state's marriage registration portal. Many states now allow online applications.",
        tip: "The Sub-Registrar's office should be in the jurisdiction where either spouse resides.",
      },
      {
        title: "Fill Application and Pay Fee",
        description: "Fill the marriage registration form with personal details of both spouses and the marriage date/place. Pay the registration fee (Rs. 100–1000 depending on state).",
      },
      {
        title: "Appear with Witnesses",
        description: "Both spouses and two witnesses must appear at the Sub-Registrar's office on the scheduled date. Bring all original documents.",
        tip: "Under the Special Marriage Act, a 30-day notice period is required before registration.",
      },
      {
        title: "Receive Certificate",
        description: "The Marriage Certificate is issued on the same day or within a few days. Keep multiple certified copies — it is required for spouse visa, joint bank accounts, and property matters.",
      },
    ],
  },
  {
    id: "legal-heir-certificate",
    title: "Legal Heir Certificate",
    category: "Property",
    icon: "users",
    color: "#2d3e50",
    description: "Obtain a Legal Heir Certificate to establish your relationship to a deceased person for claiming property, pension, or insurance.",
    documents: [
      "Death Certificate of the deceased",
      "Aadhaar Cards of all legal heirs",
      "Address proof",
      "Ration Card (showing family members)",
      "Affidavit listing all legal heirs (notarised)",
      "Passport size photographs of applicant",
    ],
    steps: [
      {
        title: "Apply at Tehsildar or Municipality",
        description: "Apply at the Tehsildar office (rural/semi-urban) or Municipal Corporation (urban). Some states allow online application through the e-district portal.",
      },
      {
        title: "Fill Application Form",
        description: "Mention all legal heirs including their relationship to the deceased, age, and address. Attach the death certificate.",
        tip: "All heirs must be listed — omitting any heir can cause legal complications later.",
      },
      {
        title: "Submit Affidavit",
        description: "Submit a notarised affidavit confirming that the list of heirs provided is complete and accurate.",
      },
      {
        title: "Enquiry by Revenue Officer",
        description: "The Tahsildar or a Revenue Inspector will conduct a field enquiry to verify the family details and confirm there are no other heirs.",
      },
      {
        title: "Collect Certificate",
        description: "The certificate is usually issued within 30 days. Use it to claim pension arrears, bank deposits, insurance, property, or government dues of the deceased.",
      },
    ],
  },
  {
    id: "mutation-dakhil-kharij",
    title: "Property Mutation (Dakhil Kharij)",
    category: "Property",
    icon: "edit",
    color: "#4a2d6e",
    description: "Apply for mutation of property records (Dakhil Kharij) to get the property officially transferred to your name after purchase or inheritance.",
    documents: [
      "Sale Deed / Gift Deed / Will (registered document establishing ownership)",
      "Death Certificate of previous owner (if inherited)",
      "Legal Heir Certificate (if inherited)",
      "Aadhaar Card",
      "Latest property tax receipt",
      "Khasra / Khatauni of the property",
    ],
    steps: [
      {
        title: "Apply at Tehsildar / Municipality",
        description: "Submit a mutation application at the Tehsildar office (rural land) or Municipal Corporation (urban property). Some states offer online mutation through their land record portals.",
        tip: "Mutation is compulsory after buying or inheriting property. Without it, the property remains in the seller/deceased's name in government records.",
      },
      {
        title: "Submit Sale Deed and Documents",
        description: "Attach the registered sale deed or inheritance documents. Pay the mutation fee (usually Rs. 25–500 depending on the state and property type).",
      },
      {
        title: "Public Notice",
        description: "The Tehsildar's office issues a public notice allowing objections. This period is typically 15–30 days.",
      },
      {
        title: "Hearing and Verification",
        description: "If there are no objections, the Revenue Inspector verifies the documents and property on-site. Attend any hearing scheduled.",
      },
      {
        title: "Mutation Order and Updated Khatauni",
        description: "After approval, the Revenue Department issues the Mutation Order and updates the Khatauni (land register) in your name. Keep a certified copy of the updated Khatauni.",
        tip: "Without mutation, you cannot sell the property or take a loan against it.",
      },
    ],
  },
];
