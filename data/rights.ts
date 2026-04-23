export interface RightsCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  items: RightsItem[];
}

export interface RightsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  reference: string;
}

export const rightsCategories: RightsCategory[] = [
  {
    id: "constitutional",
    title: "Constitutional Rights",
    icon: "book-open",
    color: "#2d3e50",
    items: [
      {
        id: "art14",
        title: "Right to Equality",
        summary: "Article 14 guarantees equality before law",
        content:
          "Article 14 of the Indian Constitution guarantees equality before the law and equal protection of the laws within the territory of India. This means that the State shall not deny to any person equality before the law or the equal protection of the laws.\n\nThis right ensures that:\n- Every person is treated equally by law\n- No discrimination based on religion, race, caste, sex, or place of birth\n- Equal access to public places and facilities\n- Equal opportunity in matters of public employment",
        reference: "Article 14, Constitution of India",
      },
      {
        id: "cr_002",
        title: "Right Against Caste Discrimination",
        summary:
          "Article 15 prohibits discrimination on grounds of religion, race, caste, sex or place of birth",
        content:
          "Article 15 prohibits the State from discriminating against any citizen on grounds of religion, race, caste, sex, or place of birth.\n\nKey provisions:\n- No restriction on access to shops, hotels, public entertainment\n- No restriction on the use of wells, tanks, bathing ghats, roads, and places of public resort maintained out of State funds\n- Special provisions can be made for women and children\n- Special provisions can be made for socially and educationally backward classes or SC/ST\n\nWho can invoke this right:\n- Any citizen of India can approach the court if discriminated against on these grounds\n- File a complaint with the National Commission for Scheduled Castes or the National Human Rights Commission",
        reference: "Article 15, Constitution of India",
      },
      {
        id: "cr_003",
        title: "Right to Equal Employment Opportunity",
        summary: "Article 16 guarantees equal opportunity in public employment",
        content:
          "Article 16 guarantees equality of opportunity for all citizens in matters of employment or appointment to any office under the State.\n\nKey rights:\n- No citizen can be discriminated in public employment on grounds of religion, race, caste, sex, descent, place of birth or residence\n- Parliament can enact laws for reservations for backward classes\n- Reservations for SC/ST in public services are permitted\n\nIf Denied Employment Unlawfully:\n1. File a complaint with the concerned department's grievance cell\n2. Approach the Central Administrative Tribunal (CAT) for central government employment\n3. File a writ petition in the High Court\n4. File a complaint with the National Human Rights Commission",
        reference: "Article 16, Constitution of India",
      },
      {
        id: "cr_004",
        title: "Abolition of Untouchability",
        summary: "Article 17 abolishes untouchability in any form",
        content:
          "Article 17 abolishes untouchability and forbids its practice in any form. The enforcement of any disability arising from untouchability is made an offense.\n\nProtection of Civil Rights Act, 1955:\n- Practice of untouchability is a cognizable offense\n- Punishment: 6 months to 2 years imprisonment and/or fine\n- Refusing to sell goods or render services on grounds of untouchability is punishable\n- Insulting a person on grounds of untouchability is punishable\n\nHow to Report:\n- File a complaint at the nearest police station (FIR must be registered)\n- Contact the National Commission for Scheduled Castes: 011-23386234\n- Approach the State SC/ST Commissioner\n- File a complaint under SC/ST (Prevention of Atrocities) Act, 1989",
        reference: "Article 17, Constitution of India; Protection of Civil Rights Act, 1955",
      },
      {
        id: "art19",
        title: "Right to Freedom",
        summary: "Article 19 protects six freedoms of citizens",
        content:
          "Article 19 of the Indian Constitution guarantees six fundamental freedoms to all citizens:\n\n1. Freedom of Speech and Expression\n2. Freedom to Assemble Peacefully\n3. Freedom to Form Associations or Unions\n4. Freedom to Move Freely Throughout India\n5. Freedom to Reside and Settle in Any Part of India\n6. Freedom to Practice Any Profession or Carry On Any Occupation, Trade, or Business\n\nThese freedoms are subject to reasonable restrictions imposed by the State in the interest of sovereignty, integrity, security, public order, decency, morality, or in relation to contempt of court.",
        reference: "Article 19, Constitution of India",
      },
      {
        id: "art21",
        title: "Right to Life & Liberty",
        summary: "Article 21 protects life and personal liberty",
        content:
          "Article 21 states: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.'\n\nThe Supreme Court has expanded this right to include:\n- Right to live with dignity\n- Right to livelihood\n- Right to privacy\n- Right to health\n- Right to clean environment\n- Right to shelter\n- Right to education\n- Right to free legal aid\n- Right against solitary confinement\n- Right to speedy trial",
        reference: "Article 21, Constitution of India",
      },
      {
        id: "cr_007",
        title: "Right Against Arbitrary Arrest",
        summary: "Article 22 protects against detention without cause",
        content:
          "Article 22 provides protection against arbitrary arrest and detention:\n\nYour Rights When Arrested:\n1. Right to be informed of the grounds of arrest\n2. Right to consult and be defended by a lawyer of your choice\n3. Right to be produced before the nearest Magistrate within 24 hours\n4. Cannot be detained beyond 24 hours without Magistrate's order\n\nProtective Detention:\n- Even under preventive detention laws, you must be informed of the grounds\n- An Advisory Board must review your detention within 3 months\n- You have the right to make a representation against your detention\n\nWhat to Do If Illegally Detained:\n1. Have someone file a Habeas Corpus petition in the High Court\n2. Contact the State Legal Services Authority for free legal aid\n3. Inform family members who can hire a lawyer or contact NALSA (15100)",
        reference: "Article 22, Constitution of India",
      },
      {
        id: "cr_008",
        title: "Right Against Child Labour",
        summary: "Article 24 prohibits employment of children below 14 in hazardous work",
        content:
          "Article 24 prohibits the employment of children below the age of 14 years in any factory, mine, or other hazardous employment.\n\nChild Labour Laws:\n- Child Labour (Prohibition and Regulation) Amendment Act, 2016\n- Children below 14 years cannot work in any occupation or process\n- Adolescents (14-18 years) cannot work in hazardous occupations\n- Penalty for employers: 6 months to 2 years imprisonment, Rs. 20,000–50,000 fine\n\nExceptions:\n- Children can work in family enterprises after school hours\n- Children can work as artists in audio-visual entertainment industries\n\nHow to Report Child Labour:\n- Call Childline: 1098 (free, 24x7)\n- File a complaint at the local police station\n- Contact the District Labour Officer\n- Report online: pencil.gov.in",
        reference: "Article 24, Constitution of India; Child Labour Act, 2016",
      },
      {
        id: "art25",
        title: "Freedom of Religion",
        summary: "Articles 25-28 protect religious freedom",
        content:
          "Articles 25 to 28 of the Constitution guarantee freedom of religion:\n\nArticle 25: Freedom of conscience and free profession, practice, and propagation of religion.\n\nArticle 26: Freedom to manage religious affairs, establish and maintain institutions, and own and acquire property.\n\nArticle 27: Freedom from payment of taxes for promotion of any particular religion.\n\nArticle 28: Freedom from attending religious instruction in certain educational institutions.",
        reference: "Articles 25-28, Constitution of India",
      },
      {
        id: "art32",
        title: "Right to Constitutional Remedies",
        summary: "Article 32 allows citizens to approach Supreme Court",
        content:
          "Article 32 is called the 'Heart and Soul' of the Constitution by Dr. B.R. Ambedkar. It gives the right to move the Supreme Court for the enforcement of fundamental rights.\n\nThe Supreme Court can issue five types of writs:\n1. Habeas Corpus - To produce a detained person before court\n2. Mandamus - To direct a public authority to perform its duty\n3. Prohibition - To prohibit a lower court from exceeding jurisdiction\n4. Certiorari - To quash an order of a lower court\n5. Quo Warranto - To question the authority of a person holding public office",
        reference: "Article 32, Constitution of India",
      },
    ],
  },
  {
    id: "rti",
    title: "RTI Act 2005",
    icon: "file-text",
    color: "#783232",
    items: [
      {
        id: "rti-basics",
        title: "What is RTI?",
        summary: "Right to Information empowers citizens",
        content:
          "The Right to Information Act, 2005 empowers every citizen of India to:\n\n- Request information from any public authority\n- Inspect documents, works, and records\n- Take notes, extracts, or certified copies of documents\n- Obtain information in electronic form\n\nKey Points:\n- Application fee: Rs. 10 (BPL applicants are exempt)\n- Response time: 30 days (48 hours for life/liberty matters)\n- First Appeal: Within 30 days to First Appellate Authority\n- Second Appeal: Within 90 days to Central/State Information Commission\n\nNo reason needs to be given for requesting information.",
        reference: "Right to Information Act, 2005",
      },
      {
        id: "rti-how",
        title: "How to File RTI",
        summary: "Step-by-step guide to filing an RTI application",
        content:
          "Steps to File an RTI Application:\n\n1. Identify the Public Authority that holds the information\n2. Find the Public Information Officer (PIO) of that authority\n3. Write an application addressed to the PIO\n4. Include:\n   - Your name and contact details\n   - Specific information requested\n   - Period for which information is needed\n5. Pay the application fee of Rs. 10\n6. Submit via post, in person, or online at rtionline.gov.in\n\nTips:\n- Be specific about what information you need\n- Mention section 6(1) of RTI Act\n- Keep a copy of your application\n- Note the date of submission for tracking",
        reference: "Section 6, RTI Act 2005",
      },
      {
        id: "rti-appeal",
        title: "RTI Appeals & Complaints",
        summary: "What to do if your RTI application is rejected or ignored",
        content:
          "If your RTI application is denied or you get incomplete information:\n\nFirst Appeal:\n- File within 30 days of receiving response (or 30 days after deadline if no response)\n- Address to the First Appellate Authority (FAA) of the same department\n- No fee is required for first appeal\n- Decision must be given within 30 days (45 days if justified)\n\nSecond Appeal / Complaint:\n- File with the Central/State Information Commission\n- File within 90 days of FAA decision\n- CIC/SIC can impose penalties up to Rs. 25,000 on erring PIOs\n- CIC/SIC can order compensation to the applicant\n\nGrounds for Penalty:\n- Not accepting application without reason\n- Denying information maliciously\n- Giving false information\n- Obstructing furnishing of information",
        reference: "Sections 18-20, RTI Act 2005",
      },
    ],
  },
  {
    id: "mgnrega",
    title: "MGNREGA Rights",
    icon: "briefcase",
    color: "#2d7a4f",
    items: [
      {
        id: "mgnrega-basics",
        title: "Your MGNREGA Rights",
        summary: "100 days guaranteed employment per year",
        content:
          "The Mahatma Gandhi National Rural Employment Guarantee Act guarantees:\n\n- 100 days of wage employment per year to every rural household\n- Work within 5 km of the village\n- Minimum wages as notified by the state\n- Work within 15 days of application\n- Unemployment allowance if work is not provided within 15 days\n- Facilities at worksite: drinking water, shade, first aid\n- Equal wages for men and women\n- 1/3 of workers should be women\n\nHow to Apply:\n1. Register with the Gram Panchayat\n2. Get a Job Card (free of cost)\n3. Apply for work in writing\n4. Get a dated receipt",
        reference: "MGNREGA, 2005",
      },
      {
        id: "mgnrega-guarantee",
        title: "Employment Guarantee — Your Entitlements",
        summary: "What you are entitled to if work is not provided in time",
        content:
          "Under MGNREGA, if the Government fails to provide work within 15 days of application:\n\nUnemployment Allowance:\n- 1/4 of the wage rate for the first 30 days of the financial year\n- 1/2 of the wage rate for the remaining period\n- Paid by the State Government, not the Centre\n\nWorksite Entitlements:\n- Drinking water at the worksite\n- Shade for resting, especially for children\n- First-aid box with prescribed medicines\n- Crèche if 5+ children below 6 years are present\n- Medical assistance in case of injury on duty\n\nWage Payment:\n- Wages must be paid weekly, not later than a fortnight\n- Delay in payment entitles workers to compensation (0.05% of unpaid amount per day)\n\nGrievance Redressal:\n- Complain to the Gram Panchayat\n- Approach the Programme Officer at the Block level\n- Social audit grievances can be filed at nrega.nic.in",
        reference: "Sections 7, 8, 25, 26, MGNREGA 2005",
      },
    ],
  },
  {
    id: "domestic-violence",
    title: "Domestic Violence Act",
    icon: "shield",
    color: "#783232",
    items: [
      {
        id: "dv-rights",
        title: "Protection from Domestic Violence",
        summary: "Your rights under the DV Act 2005",
        content:
          "The Protection of Women from Domestic Violence Act, 2005 provides:\n\nTypes of Abuse Covered:\n- Physical abuse (beating, slapping)\n- Sexual abuse\n- Verbal and emotional abuse (insults, threats)\n- Economic abuse (not providing money, taking away earnings)\n\nYour Rights:\n- Right to reside in the shared household\n- Protection orders against the abuser\n- Monetary relief for expenses and losses\n- Custody orders for children\n- Compensation for injuries\n\nWho Can Help:\n- Protection Officer (appointed by government)\n- Service Providers (registered NGOs)\n- Women's Helpline: 181\n- Police: 100",
        reference: "Protection of Women from Domestic Violence Act, 2005",
      },
      {
        id: "dv-complaint",
        title: "How to File a Complaint",
        summary: "Steps to seek protection under DV Act",
        content:
          "Steps to File a Domestic Violence Complaint:\n\n1. Contact the Protection Officer in your district\n2. You can also approach:\n   - Police Station\n   - Magistrate Court directly\n   - Service Provider (NGO)\n3. File a Domestic Incident Report (DIR)\n4. The Magistrate will issue notice to the respondent\n5. Hearing within 3 days of first hearing\n6. Orders can include:\n   - Protection Order\n   - Residence Order\n   - Monetary Relief\n   - Custody Order\n   - Compensation Order\n\nImportant: You do NOT need a lawyer to file a complaint. The Protection Officer will assist you free of cost.",
        reference: "Sections 12-29, DV Act 2005",
      },
    ],
  },
  {
    id: "consumer",
    title: "Consumer Protection",
    icon: "shopping-bag",
    color: "#b07d2a",
    items: [
      {
        id: "consumer-rights",
        title: "Your Consumer Rights",
        summary: "Six basic consumer rights in India",
        content:
          "The Consumer Protection Act, 2019 gives you six basic rights:\n\n1. Right to Safety - Protection against hazardous goods\n2. Right to Information - Complete details about products\n3. Right to Choose - Access to variety of goods at competitive prices\n4. Right to be Heard - Consumer interests will receive due consideration\n5. Right to Seek Redressal - Fair settlement of genuine grievances\n6. Right to Consumer Education - Knowledge about consumer rights\n\nYou can file complaints:\n- Online: consumerhelpline.gov.in\n- Helpline: 1800-11-4000 (toll-free)\n- District Consumer Forum (up to Rs. 50 lakh)\n- State Commission (Rs. 50 lakh to Rs. 2 crore)\n- National Commission (above Rs. 2 crore)",
        reference: "Consumer Protection Act, 2019",
      },
      {
        id: "consumer-ecommerce",
        title: "E-commerce Consumer Rights",
        summary: "Your rights when shopping online",
        content:
          "The Consumer Protection (E-Commerce) Rules, 2020 protect online shoppers:\n\nYour Rights:\n- Right to transparent information about seller, product, price, and return policy\n- Platform must display country of origin for all products\n- Right to return goods within a reasonable period\n- Right to receive goods within the promised timeline\n- Right to a full refund for defective or wrong products\n- Grievance Redressal Officer must be available 24x7\n\nIf Cheated Online:\n1. Report to the platform's grievance officer (they must respond in 48 hours)\n2. File a complaint at consumerhelpline.gov.in\n3. Contact the National Consumer Helpline: 1800-11-4000\n4. File a complaint in the District Consumer Forum\n5. Report fraud to cybercrime.gov.in or call 1930",
        reference: "Consumer Protection (E-Commerce) Rules, 2020",
      },
    ],
  },
  {
    id: "sc-st",
    title: "SC/ST Prevention of Atrocities",
    icon: "users",
    color: "#2d3e50",
    items: [
      {
        id: "scst-act",
        title: "SC/ST Atrocities Act",
        summary: "Protection against caste-based discrimination",
        content:
          "The Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989 protects against:\n\n- Forcing to eat or drink inedible substances\n- Dumping waste on land or premises\n- Parading naked or with painted face\n- Dispossessing from land\n- Compelling to do forced or bonded labour\n- Denial of access to water sources\n- Preventing from voting or filing nomination\n- Wrongful prosecution\n- Intimidation or harassment\n\nReporting:\n- File FIR at any police station\n- Police must register case immediately (no preliminary inquiry)\n- Investigation by officer not below DSP rank\n- Exclusive Special Courts for trial\n- Compensation and rehabilitation for victims",
        reference: "SC/ST (Prevention of Atrocities) Act, 1989",
      },
      {
        id: "scst-relief",
        title: "Relief & Compensation Under SC/ST Act",
        summary: "Financial and legal relief available to victims",
        content:
          "Victims of atrocities under the SC/ST Act are entitled to:\n\nImmediate Relief:\n- First aid and medical aid immediately after atrocity\n- Food, water, clothing, and shelter as needed\n- Police protection and escort to hospital\n\nMonetary Compensation:\n- Rs. 85,000 to Rs. 8.25 lakh depending on the nature of atrocity (per 2016 Amendment Rules)\n- 75% of the compensation paid upon filing of charge sheet\n- Remaining 25% after conviction or acquittal\n\nRehabilitation:\n- Agricultural land if dispossessed\n- House if damaged or destroyed\n- Employment or employment-related assistance\n\nWho to Contact:\n- District Magistrate/Collector\n- SP/DCP of Police\n- State SC/ST Commission\n- National Commission for Scheduled Castes: 011-23386234",
        reference: "SC/ST (Prevention of Atrocities) Amendment Rules, 2016",
      },
    ],
  },
  {
    id: "labour",
    title: "Labour Rights",
    icon: "tool",
    color: "#2d7a4f",
    items: [
      {
        id: "minimum-wage",
        title: "Minimum Wage Rights",
        summary: "Every worker is entitled to minimum wages",
        content:
          "The Minimum Wages Act, 1948 guarantees every worker a minimum wage:\n\nKey Rights:\n- No employer can pay below the notified minimum wage\n- Different minimum wages for different scheduled employments\n- Overtime wages must be at least double the ordinary rate\n- Wages must be paid on time — monthly, weekly, or daily as per agreement\n- Equal remuneration for men and women doing the same work\n\nIf Wages Are Denied:\n1. Complain to the Labour Inspector / Labour Commissioner\n2. File a claim before the Authority under the Act within 6 months\n3. You can get twice the amount of wages withheld\n\nHelpline: Contact State Labour Department\nNational Labour Helpline: 1800-11-7717",
        reference: "Minimum Wages Act, 1948 & Code on Wages, 2019",
      },
      {
        id: "labour-maternity",
        title: "Maternity Benefits",
        summary: "26 weeks paid maternity leave for women",
        content:
          "The Maternity Benefit (Amendment) Act, 2017 provides:\n\n- 26 weeks of paid maternity leave (for first two children)\n- 12 weeks for third child onwards\n- Adoption/commissioning mothers: 12 weeks leave\n- Work from home option available after maternity leave\n- Crèche facility mandatory in establishments with 50+ employees\n- No dismissal during absence on maternity leave\n- Medical bonus of Rs. 3,500 if no prenatal/postnatal care is provided\n\nWho is Covered:\n- Women employees who have worked for at least 80 days in the last 12 months\n- Both organised and unorganised sector workers\n\nContact: ESIC helpline 1800-11-2526 or State Labour Department",
        reference: "Maternity Benefit (Amendment) Act, 2017",
      },
      {
        id: "labour-gratuity",
        title: "Gratuity & Provident Fund",
        summary: "Long-term employment benefits you're entitled to",
        content:
          "Payment of Gratuity Act, 1972:\n- Payable on resignation, retirement, death, or disability\n- Eligibility: 5 years of continuous service (except death/disability)\n- Calculation: 15 days' wage for each year of service\n- Maximum: Rs. 20 lakhs\n\nEmployees' Provident Fund (EPF):\n- Both employee and employer contribute 12% of basic salary\n- Employee's full contribution goes to EPF account\n- Employer's contribution: 3.67% to EPF, 8.33% to EPS (pension)\n- You can withdraw on retirement, medical emergency, home purchase, marriage\n- Can be transferred when changing jobs\n\nTo check your EPF balance: EPFO website or missed call to 011-22901406\nHelpline: EPFO 1800-118-005",
        reference: "Payment of Gratuity Act, 1972; Employees' Provident Funds Act, 1952",
      },
      {
        id: "labour-workplace-safety",
        title: "Workplace Safety Rights",
        summary: "Every worker has the right to a safe workplace",
        content:
          "The Occupational Safety, Health and Working Conditions Code, 2020 and factory laws protect workers:\n\nYour Rights at Work:\n- Safe and healthy working environment\n- Protection from hazardous chemicals, machinery, and substances\n- Maximum 8-hour working day (48 hours per week)\n- Minimum 30-minute break for every 5 hours of work\n- Overtime paid at twice the ordinary wage rate\n- Annual leave: 1 day for every 20 days of work\n\nEmployer Obligations:\n- Maintain first aid facilities\n- Provide drinking water, washrooms, canteen (for 100+ workers)\n- Display health and safety notices in local language\n- Report accidents causing death or serious injury to the government\n\nIf Rights Are Violated:\n1. Complain to the factory inspector or labour officer\n2. Contact State Labour Department\n3. File complaint under relevant factory or workplace safety law",
        reference:
          "Factories Act, 1948; Occupational Safety, Health and Working Conditions Code, 2020",
      },
    ],
  },
  {
    id: "property",
    title: "Property & Housing Rights",
    icon: "home",
    color: "#4a2d6e",
    items: [
      {
        id: "rera-rights",
        title: "Home Buyer Rights (RERA)",
        summary: "Your rights when buying a property",
        content:
          "The Real Estate (Regulation and Development) Act, 2016 (RERA) protects home buyers:\n\nYour Rights:\n- Developer must register project with RERA authority\n- Get all project details and documents before purchase\n- Possession on agreed date, or compensation for delay\n- Structural defects must be rectified for 5 years after possession\n- Developer cannot change approved plans without 2/3 buyer consent\n- Right to access all project documents\n- Refund with interest if developer fails to deliver\n\nIf Developer Defaults:\n1. File complaint with State RERA Authority\n2. RERA adjudicating officer can award compensation\n3. Appeals can be made to RERA Appellate Tribunal\n\nWebsite: rera.gov.in (find your state RERA)",
        reference: "Real Estate (Regulation and Development) Act, 2016",
      },
      {
        id: "land-acquisition",
        title: "Land Acquisition Rights",
        summary: "Rights when government acquires your land",
        content:
          "The Right to Fair Compensation and Transparency in Land Acquisition Act, 2013:\n\nKey Rights:\n- Government must give advance notice and conduct Social Impact Assessment\n- Consent of 70-80% of affected families required for private/PPP projects\n- Fair compensation: 2-4 times the market value in rural areas\n- Compensation must be paid before taking possession\n- Rehabilitation and resettlement for displaced families\n- Annuity payments for 20 years\n- First priority in employment in projects on acquired land\n- Right to reclaim land if not used within 5 years\n\nIf Rights Violated:\n1. File objection during SIA process\n2. Approach Land Acquisition Collector\n3. File writ petition in High Court",
        reference: "Right to Fair Compensation and Transparency in Land Acquisition Act, 2013",
      },
    ],
  },
  {
    id: "family",
    title: "Family & Women's Rights",
    icon: "heart",
    color: "#a0316e",
    items: [
      {
        id: "maintenance-rights",
        title: "Right to Maintenance",
        summary: "Women have the right to maintenance from husband/family",
        content:
          "Women in India have strong maintenance rights under multiple laws:\n\nSection 125 CrPC (All Religions):\n- Wife (including divorced wife), children, and parents can claim maintenance\n- No minimum income limit — husband just needs to have means to pay\n- Interim maintenance can be ordered within 60 days\n- If husband doesn't pay, he can be sent to prison\n\nHindu Marriage Act:\n- Permanent alimony and maintenance for wife on separation or divorce\n- Court considers husband's income, wife's income, conduct of both parties\n\nMuslim Women (Protection of Rights on Divorce) Act, 1986:\n- Right to maintenance during iddat period\n- Mehr amount must be paid on divorce\n\nHow to Apply:\n- File application under Section 125 CrPC in Family Court\n- You can hire a lawyer or approach DLSA for free legal aid\n- National Commission for Women: 7827170170",
        reference: "Section 125 CrPC; Hindu Marriage Act; Muslim Women Act, 1986",
      },
      {
        id: "workplace-harassment",
        title: "Right Against Sexual Harassment at Workplace",
        summary: "POSH Act protects women from workplace harassment",
        content:
          "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (POSH Act):\n\nWhat Counts as Sexual Harassment:\n- Physical contact and advances\n- Demand or request for sexual favours\n- Showing pornography\n- Making sexually coloured remarks\n- Any unwelcome physical, verbal, or non-verbal conduct of sexual nature\n\nYour Rights:\n- Every workplace with 10+ employees must have an Internal Complaints Committee (ICC)\n- Complaint to be filed within 3 months of incident\n- Inquiry must be completed within 90 days\n- Interim relief including transfer or leave during inquiry\n- Identity must be kept confidential\n\nIf Employer Has No ICC (Small Workplaces):\n- File complaint with the Local Complaints Committee (LCC) at the District level\n- Contact District Collector's office\n\nHelpline: National Commission for Women: 7827170170",
        reference: "POSH Act, 2013; Vishaka Guidelines",
      },
      {
        id: "divorce-rights",
        title: "Divorce & Separation Rights",
        summary: "Understanding divorce laws and rights in India",
        content:
          "Divorce laws in India depend on the religion of the parties:\n\nHindu Marriage Act (Hindus, Sikhs, Jains, Buddhists):\n- Grounds for divorce: adultery, cruelty, desertion (2 years), conversion, mental disorder, leprosy, venereal disease, renunciation, presumed dead\n- Divorce by mutual consent: 6-month waiting period, then final divorce\n- Wife can claim permanent alimony, child custody, and maintenance\n\nMuslim Personal Law:\n- Husband can divorce by Triple Talaq (but instant triple talaq is now illegal under 2019 Act)\n- Wife can seek divorce by Khula (with husband's consent) or Mubarat (mutual divorce)\n- Wife can also seek divorce through court under Dissolution of Muslim Marriages Act, 1939\n\nSpecial Marriage Act (Inter-religion marriages):\n- Applies to couples married under this act regardless of religion\n- Grounds similar to Hindu Marriage Act\n\nFree Legal Aid:\n- Approach your District Legal Services Authority (DLSA)\n- Call NALSA: 15100",
        reference: "Hindu Marriage Act, 1955; Muslim Personal Law; Special Marriage Act, 1954",
      },
    ],
  },
  {
    id: "agriculture",
    title: "Farmers & Agriculture Rights",
    icon: "sun",
    color: "#5a7a2d",
    items: [
      {
        id: "pm-kisan",
        title: "PM-Kisan — Income Support for Farmers",
        summary: "Rs. 6000/year income support for eligible farmers",
        content:
          "Pradhan Mantri Kisan Samman Nidhi (PM-Kisan) provides:\n\n- Rs. 6,000 per year to small and marginal farmer families\n- Paid in 3 equal installments of Rs. 2,000 each\n- Directly credited to bank account via DBT\n\nEligibility:\n- All farmer families who own cultivable land\n- Land must be in the name of the farmer (individual or joint)\n- Excluded: Institutional land holders, former/current government officials, income tax payers, professionals\n\nHow to Register:\n1. Visit your nearest Common Service Centre (CSC) or Gram Panchayat\n2. Visit pmkisan.gov.in to self-register\n3. Documents needed: Aadhaar, land records, bank passbook\n\nCheck Status:\n- Visit pmkisan.gov.in → Beneficiary Status\n- Call helpline: 155261 / 011-24300606",
        reference: "PM-KISAN Scheme, 2019",
      },
      {
        id: "crop-insurance",
        title: "Pradhan Mantri Fasal Bima Yojana",
        summary: "Crop insurance for farmers at very low premium",
        content:
          "Pradhan Mantri Fasal Bima Yojana (PMFBY) provides affordable crop insurance:\n\nPremium Rates (Maximum):\n- Kharif crops: 2% of Sum Insured\n- Rabi crops: 1.5% of Sum Insured\n- Commercial/Horticultural crops: 5% of Sum Insured\n- Government pays the balance premium\n\nCoverage:\n- Loss due to non-preventable risks: drought, flood, landslide, cyclone, fire, lightning\n- Post-harvest losses for up to 14 days\n- Localized calamities: hailstorm, landslide, inundation in specific fields\n\nHow to Apply:\n- Apply through your bank (if you have a crop loan, it may be automatic)\n- Apply at CSC centres\n- Apply online at pmfby.gov.in\n- Deadline: Within 2 weeks of sowing\n\nHelpline: 1800-200-7710",
        reference: "PM Fasal Bima Yojana, 2016",
      },
      {
        id: "msp-rights",
        title: "Minimum Support Price (MSP) Rights",
        summary: "Government guaranteed price for your crops",
        content:
          "Minimum Support Price (MSP) is the price the government guarantees for certain crops:\n\nCrops Covered (23 crops):\n- Cereals: Paddy, Wheat, Maize, Bajra, Jowar, Ragi, Barley\n- Pulses: Arhar, Moong, Urad, Masur, Gram\n- Oilseeds: Groundnut, Sunflower, Soybean, Rapeseed, Sesame, Safflower, Nigerseed\n- Commercial: Sugarcane, Cotton (Medium/Long Staple), Jute, Copra\n\nYour Rights:\n- Sell to government agencies (like FCI, NAFED, CCI) at MSP\n- Find procurement centers in your area\n- Government must procure all offered quantity at MSP\n\nHow to Sell at MSP:\n1. Register at your state's e-procurement portal or at the nearest procurement center\n2. Carry identity proof, land records, and bank details\n3. Crop must meet prescribed quality specifications\n\nInformation: agmarknet.gov.in",
        reference: "Commission for Agricultural Costs and Prices (CACP) MSP Recommendations",
      },
    ],
  },
  {
    id: "cyber",
    title: "Cyber Safety & Digital Rights",
    icon: "shield",
    color: "#2d4a7a",
    items: [
      {
        id: "cyber-crime-rights",
        title: "Rights of Cybercrime Victims",
        summary: "How to report and get help for online fraud and harassment",
        content:
          "The Information Technology Act, 2000 and its amendments protect citizens online:\n\nTypes of Cybercrime Covered:\n- Online financial fraud (phishing, UPI fraud, fake e-commerce)\n- Identity theft and impersonation\n- Cyber stalking and online harassment\n- Cyberbullying\n- Hacking and data theft\n- Morphed or fake images/videos\n- Online defamation\n\nHow to Report:\n1. Report to Cyber Crime Portal: cybercrime.gov.in\n2. Call National Cybercrime Helpline: 1930\n3. File FIR at nearest police station\n4. For financial fraud, also inform your bank immediately\n\nTime is Critical:\n- For online financial fraud, report within the first hour\n- Call 1930 immediately — banks can freeze transactions\n- Block your debit/credit card immediately via net banking or bank helpline",
        reference: "Information Technology Act, 2000 (amended 2008)",
      },
      {
        id: "anti-ragging",
        title: "Anti-Ragging Rights for Students",
        summary: "Zero tolerance for ragging in educational institutions",
        content:
          "The UGC Anti-Ragging Regulations, 2009 and Supreme Court orders protect students:\n\nWhat Counts as Ragging:\n- Any conduct that causes or likely to cause physical or psychological harm\n- Asking students to do acts that affect dignity\n- Obstructing or disrupting studies of another student\n- Financial extortion or theft from a student\n- Criminal intimidation, wrongful confinement\n\nYour Rights as a Student:\n- Every institution must have an Anti-Ragging Committee\n- 24x7 Anti-Ragging Helpline: 1800-180-5522\n- Can report anonymously\n- Institution must take action within 7 days of complaint\n\nPenalties for Ragging:\n- Expulsion from institution\n- Suspension / withholding of scholarship\n- Withholding of results\n- FIR can be filed — imprisonment up to 3 years depending on severity\n\nComplaint Portal: antiragging.in",
        reference: "UGC Anti-Ragging Regulations, 2009; SLP (Civil) No. 24295/2004",
      },
      {
        id: "data-privacy",
        title: "Digital Privacy Rights",
        summary: "Your right to privacy in the digital age",
        content:
          "The Supreme Court in Puttaswamy vs Union of India (2017) held that Right to Privacy is a Fundamental Right under Article 21.\n\nDigital Information Technology (Amendment) Act, 2023 further strengthens this:\n\nYour Digital Rights:\n- Right to access your personal data held by companies\n- Right to correction of inaccurate personal data\n- Right to erasure ('right to be forgotten') in certain circumstances\n- Right to know how your data is being processed\n- Right to nominate someone to exercise rights in case of death or incapacity\n\nProtection Against:\n- Unauthorized sharing or sale of your personal data\n- Data breaches (companies must notify you and the government)\n- Processing of data of children under 18 without parental consent\n\nHow to Complain:\n- File complaint with the Data Protection Board (when established)\n- Currently, approach MEITY: meity.gov.in or the court under IT Act\n- File cybercrime complaint: cybercrime.gov.in",
        reference: "Puttaswamy v. Union of India, 2017; DPDP Act, 2023",
      },
    ],
  },
  {
    id: "education",
    title: "Education Rights",
    icon: "book",
    color: "#2d4a7a",
    items: [
      {
        id: "rte-basics",
        title: "Right to Free & Compulsory Education",
        summary: "Every child aged 6-14 has a fundamental right to free education",
        content:
          "The Right to Education Act, 2009 (Article 21A of the Constitution) guarantees:\n\n- Free and compulsory education for all children aged 6 to 14 years\n- Government schools cannot charge any fee\n- Private schools must reserve 25% seats for economically weaker sections (EWS)\n- No child can be held back, expelled, or required to pass a board exam until Class 8\n- Schools must meet infrastructure norms (toilets, drinking water, classrooms)\n- Trained teachers must be provided in all schools\n\nIf Your Child Is Denied Admission:\n1. Approach the School Management Committee (SMC)\n2. File a complaint with the District Education Officer\n3. Approach the State Commission for Protection of Child Rights (SCPCR)\n4. File a complaint with the National Commission for Protection of Child Rights: 1800-11-1902",
        reference: "Article 21A, Constitution of India; Right to Education Act, 2009",
      },
      {
        id: "mid-day-meal",
        title: "Mid-Day Meal & Nutrition Rights",
        summary: "Children in government schools have the right to nutritious mid-day meals",
        content:
          "The National Food Security Act and Supreme Court orders guarantee mid-day meals in government schools:\n\nYour Rights:\n- Every child enrolled in government or government-aided schools (Classes 1-8) must receive a hot cooked mid-day meal\n- Minimum calorie standards: 450 calories and 12 grams of protein for primary classes (1-5); 700 calories and 20 grams of protein for upper primary (6-8)\n- Eggs and fruits are provided in many states\n- Meals must be hygienic and cooked fresh daily\n\nUnder PM POSHAN (formerly Mid-Day Meal Scheme):\n- Coverage extended to pre-primary (Balvatikas) as well\n- States can supplement with fruits, eggs, or milk\n\nIf Meal Is Not Provided:\n1. Report to the School Principal or Headmaster\n2. Complain to the Block Education Officer\n3. File a complaint with NCPCR: ncpcr.gov.in",
        reference: "National Food Security Act, 2013; PM POSHAN Scheme",
      },
      {
        id: "scholarships",
        title: "Scholarships & Educational Benefits",
        summary: "Government scholarships for SC/ST, OBC, minorities, and meritorious students",
        content:
          "The Government of India provides multiple scholarships for eligible students:\n\nPre-Matric Scholarships:\n- Available for SC/ST/OBC/Minority students from Class 1 to 10\n- Income limit varies by category (generally Rs. 2-2.5 lakh per year)\n\nPost-Matric Scholarships:\n- For SC/ST/OBC/Minority students from Class 11 onwards, including professional courses\n- Covers tuition fees, maintenance allowance, and other allowances\n\nNational Means-cum-Merit Scholarship (NMMS):\n- For meritorious students from lower income families at Class 8 level\n- Rs. 12,000 per year for Classes 9-12\n\nCentral Sector Scholarship:\n- Top 20 percentile scorers in Class 12 from government schools\n- Rs. 10,000/year for undergraduate, Rs. 20,000/year for postgraduate\n\nHow to Apply:\n- Visit scholarships.gov.in (National Scholarship Portal)\n- Apply before deadlines (usually October-November)\n- Renew every year by maintaining academic progress",
        reference: "National Scholarship Portal; National Food Security Act, 2013",
      },
    ],
  },
  {
    id: "senior-citizens",
    title: "Senior Citizens Rights",
    icon: "users",
    color: "#b07d2a",
    items: [
      {
        id: "senior-maintenance",
        title: "Right to Maintenance from Children",
        summary: "Parents aged 60+ can legally claim maintenance from adult children",
        content:
          "The Maintenance and Welfare of Parents and Senior Citizens Act, 2007 protects senior citizens:\n\nYour Rights:\n- Senior citizens (60+) can claim maintenance from their adult children or relatives\n- Maximum maintenance: Rs. 10,000 per month (states can raise this limit)\n- Maintenance Tribunal in each district processes applications quickly (within 90 days)\n- If children abandon parents after inheriting property, the gift/transfer can be declared void\n- Abandoned senior citizens can get their property back\n\nWho Can Apply:\n- Parents (biological, adoptive, step)\n- Senior citizens without children can claim from relatives who inherit their property\n\nHow to Apply:\n1. File an application with the Maintenance Tribunal (at the Sub-Divisional Magistrate's office)\n2. No court fee is required\n3. You can apply yourself without a lawyer\n\nHelpline:\n- Elder Line (National): 14567",
        reference: "Maintenance and Welfare of Parents and Senior Citizens Act, 2007",
      },
      {
        id: "senior-concessions",
        title: "Senior Citizens Concessions & Benefits",
        summary: "Discounts and benefits available to citizens aged 60 and above",
        content:
          "Senior citizens are entitled to several concessions across sectors:\n\nRailways (Indian Railways):\n- 40% concession for male passengers aged 60+ on all classes\n- 50% concession for female passengers aged 58+\n- Available on all trains except Rajdhani, Shatabdi, Duronto (no concession on premium trains)\n\nAirways:\n- Most airlines offer 5-50% discounts for passengers 60+ — check individual airline websites\n\nIncome Tax:\n- Senior citizens (60-79): Income up to Rs. 3 lakh is tax-free\n- Super senior citizens (80+): Income up to Rs. 5 lakh is tax-free\n- Higher deductions under Section 80D for health insurance premiums\n\nBanking:\n- Higher interest rates on Fixed Deposits (0.25-0.50% extra)\n- Priority banking services at most banks\n\nHealth:\n- CGHS (for central government pensioners) and state health schemes provide medical coverage\n- Ayushman Bharat provides health insurance cover of Rs. 5 lakh per year",
        reference: "Income Tax Act; Indian Railways Concession Policy; Maintenance Act 2007",
      },
      {
        id: "senior-protection",
        title: "Protection from Abuse & Neglect",
        summary: "Senior citizens have legal protection against abuse, neglect, and fraud",
        content:
          "Senior citizens are protected from various forms of abuse under multiple laws:\n\nTypes of Abuse Covered:\n- Physical abuse (assault, force, confinement)\n- Financial abuse (property fraud, forced transfers, cheating)\n- Emotional/psychological abuse\n- Neglect (not providing food, medicine, care)\n\nLegal Protections:\n- Maintenance Act 2007: Can get maintenance from children and reclaim abandoned property\n- IPC Section 304 (Culpable Homicide): Severe neglect causing death is punishable\n- IPC Section 498: Cruelty by relatives\n- POCSO equivalent protections at state level for institutional abuse\n\nWho to Contact:\n- Elder Line: 14567 (free, 24x7, national helpline)\n- Police: 100 (for physical abuse, register FIR)\n- State Social Welfare Department\n- Maintenance Tribunal at Sub-Divisional Magistrate's office\n- National Commission for Senior Citizens: ncsc.gov.in",
        reference: "Maintenance and Welfare of Parents and Senior Citizens Act, 2007; IPC",
      },
    ],
  },
  {
    id: "disability",
    title: "Disability Rights",
    icon: "heart",
    color: "#4a6e8a",
    items: [
      {
        id: "rpwd-rights",
        title: "Rights of Persons with Disabilities",
        summary: "RPWD Act 2016 recognises 21 types of disabilities with comprehensive rights",
        content:
          "The Rights of Persons with Disabilities Act, 2016 (RPWD Act) covers 21 types of disabilities and provides:\n\nFundamental Rights:\n- Right to equality and non-discrimination\n- Right to life with dignity\n- Right to protection and safety\n- Right to accessibility (physical and digital)\n- Right to legal capacity and guardianship\n\nDisabilities Covered:\n- Physical: Locomotor disability, leprosy cured, dwarfism, muscular dystrophy, acid attack victims\n- Visual: Blindness, low vision\n- Hearing: Deaf, hard of hearing\n- Speech: Speech and language disability\n- Intellectual: Intellectual disability, specific learning disability, autism\n- Mental: Mental illness\n- Neurological: Multiple sclerosis, Parkinson's disease, hemophilia\n- Blood disorders: Thalassemia, sickle cell disease\n- Multiple disabilities\n\nKey Benefits:\n- 4% reservation in government jobs (from previous 3%)\n- 5% reservation in higher educational institutions\n- UDID (Unique Disability ID) card for accessing benefits across India",
        reference: "Rights of Persons with Disabilities Act, 2016",
      },
      {
        id: "disability-benefits",
        title: "Government Benefits for Disabled Persons",
        summary: "Pension, concessions, and welfare schemes for persons with disabilities",
        content:
          "Persons with a certified disability of 40% or more are entitled to multiple government benefits:\n\nFinancial Support:\n- Indira Gandhi National Disability Pension: Rs. 300/month for BPL families\n- State-level disability pensions (vary by state, Rs. 500-3000/month)\n- ADIP Scheme: Assistive devices provided free or at subsidized rates\n\nTransport Concessions:\n- 75% concession on Indian Railways (with escort companion)\n- Free/subsidized bus passes in many states\n- 50% concession on air travel for certain disabilities\n\nTax Benefits:\n- Deduction of Rs. 75,000 under Section 80U for 40-80% disability\n- Rs. 1,25,000 deduction for 80%+ disability\n- Deduction under 80DD for treatment and insurance of dependent with disability\n\nEducation:\n- Fee waiver/scholarship at government institutions\n- Special schools for visually impaired, hearing impaired, intellectually disabled\n- DAISY talking books and Braille material through National Institute for the Blind\n\nHelpline: Disability Helpline: 1800-11-4515",
        reference: "RPWD Act, 2016; Income Tax Act; National Social Assistance Programme",
      },
      {
        id: "disability-employment",
        title: "Employment Rights for Disabled Persons",
        summary:
          "Reservation, reasonable accommodation, and protection against discrimination at work",
        content:
          "The RPWD Act, 2016 guarantees strong employment protections:\n\nReservation in Government Jobs:\n- 4% of all government vacancies reserved for persons with benchmark disabilities\n- 1% for Blindness and low vision, 1% for Deaf and hard of hearing, 1% for locomotor disability, 1% for autism/intellectual disability/mental illness/multiple disabilities\n\nReasonable Accommodation:\n- Every employer must provide 'reasonable accommodation' to employees with disabilities\n- Includes modified workstations, extra time for tests, accessible premises\n- Refusal to provide reasonable accommodation = discrimination\n\nProtection Against Discrimination:\n- No employer can discriminate solely on ground of disability\n- Special Recruitment Drive by central government periodically\n- Penalty for employer not complying: Rs. 10,000 to Rs. 5,00,000 fine\n\nCEO / HR Designated Officer:\n- Every establishment must designate a Grievance Redressal Officer\n\nHow to Complain:\n1. File complaint with State Commissioner for Persons with Disabilities\n2. Approach Chief Commissioner for Persons with Disabilities at national level\n3. File a court case for discrimination\n\nHelpline: 1800-11-4515 (free)",
        reference: "Rights of Persons with Disabilities Act, 2016, Sections 20-24",
      },
    ],
  },
  {
    id: "environment",
    title: "Environment & Health Rights",
    icon: "sun",
    color: "#2d6e4a",
    items: [
      {
        id: "clean-environment",
        title: "Right to Clean Environment",
        summary: "Every citizen has the right to a clean and healthy environment",
        content:
          "The Supreme Court has held that the Right to a Clean Environment is part of the Right to Life under Article 21:\n\nKey Environmental Laws:\n- The Environment Protection Act, 1986\n- The Air (Prevention and Control of Pollution) Act, 1981\n- The Water (Prevention and Control of Pollution) Act, 1974\n- The Hazardous Waste Management Rules, 2016\n\nYour Rights:\n- Right to breathe clean air\n- Right to clean drinking water\n- Right to live in a pollution-free environment\n- Right to information about environmental quality in your area\n\nIf Environment Is Polluted:\n1. File a complaint with the State Pollution Control Board\n2. File a Public Interest Litigation (PIL) in the High Court\n3. Approach the National Green Tribunal (NGT) — free filing for environmental cases\n4. Report to the Central Pollution Control Board: cpcb.nic.in\n\nNational Green Tribunal (NGT):\n- Any person can file a petition about environmental damage\n- No court fee for filing cases involving public interest\n- NGT orders are binding on all states and Union Territories",
        reference: "Article 21, Constitution; Environment Protection Act, 1986; NGT Act, 2010",
      },
      {
        id: "food-safety",
        title: "Food Safety Rights",
        summary: "Every citizen has the right to safe, hygienic, and properly labelled food",
        content:
          "The Food Safety and Standards Act, 2006 (FSSAI) protects your right to safe food:\n\nYour Rights as a Consumer:\n- Right to safe and hygienic food free from adulterants\n- Right to correct labelling (ingredients, nutritional information, expiry date, manufacturer)\n- Right to food that meets prescribed quality standards\n- Right to file a complaint if food is adulterated or sub-standard\n\nCommon Offences:\n- Selling food past expiry date: Rs. 2-10 lakh fine\n- Adulteration that may cause injury: up to Rs. 10 lakh fine\n- Adulteration causing death: Life imprisonment\n\nHow to Report Unsafe Food:\n1. Call FSSAI helpline: 1800-11-2100 (toll-free)\n2. Report on FSSAI website: fssai.gov.in\n3. Download 'Food Safety Connect' app by FSSAI\n4. Lodge complaint with local health inspector or municipal authorities\n5. File a complaint with the District Food Safety Officer\n\nIn Restaurants / Hotels:\n- Restaurants must display their FSSAI license number\n- You can report unsanitary conditions or food poisoning",
        reference: "Food Safety and Standards Act, 2006; FSSAI Regulations",
      },
      {
        id: "noise-pollution",
        title: "Rights Against Noise Pollution",
        summary: "Citizens have the right to a noise-free environment within legal limits",
        content:
          "The Noise Pollution (Regulation and Control) Rules, 2000 protect citizens from excessive noise:\n\nPermissible Noise Levels:\n- Industrial areas: Day 75 dB, Night 70 dB\n- Commercial areas: Day 65 dB, Night 55 dB\n- Residential areas: Day 55 dB, Night 45 dB\n- Silence zones (hospitals/schools): Day 50 dB, Night 40 dB\n\nLoud Speakers & DJ Music:\n- Cannot be used without a permit from the competent authority\n- Night-time restrictions: Cannot use loudspeakers between 10 PM and 6 AM\n- Even with a permit, must not exceed 10 dB above ambient noise levels\n\nFestivals & Firecrackers:\n- Firecrackers can be burst only between 8 PM and 10 PM on festival days\n- Green crackers only allowed in certain states — check state regulations\n\nHow to Complain:\n1. Call the Police (100) for immediate loud noise\n2. File a complaint with the local Municipal Corporation\n3. Approach the District Magistrate for permits/violations\n4. File a complaint with the State Pollution Control Board\n5. File a PIL in High Court for systematic violations",
        reference: "Noise Pollution (Regulation and Control) Rules, 2000; EP Act, 1986",
      },
      {
        id: "right-to-health",
        title: "Right to Health & Medical Services",
        summary: "Citizens have a right to free emergency medical care at all hospitals",
        content:
          "The Supreme Court has interpreted the Right to Life (Article 21) to include the Right to Health:\n\nEmergency Medical Treatment:\n- No hospital (government or private) can deny emergency treatment due to lack of money\n- Supreme Court ruling: Refusing emergency treatment is a violation of Article 21\n- Government hospitals must provide free emergency care to all\n- Private hospitals empanelled under Ayushman Bharat must treat cardholders for free\n\nAyushman Bharat (PM-JAY):\n- Health cover of Rs. 5 lakh per family per year for secondary and tertiary care\n- Covers 1,929+ medical procedures\n- Target: 10.74 crore poor and vulnerable families\n- Cashless and paperless treatment at empanelled hospitals\n\nJanani Suraksha Yojana:\n- Free delivery and post-natal care for pregnant women in government hospitals\n- Financial assistance for institutional delivery\n\nNational Health Mission:\n- Free medicines, diagnostics, and treatment at government health facilities\n- Jan Aushadhi stores — generic medicines at very low cost\n\nIf Denied Emergency Care:\n1. Report to the hospital superintendent immediately\n2. Call 108 (emergency ambulance)\n3. File a complaint with the State Medical Council\n4. Approach the Consumer Forum for medical negligence",
        reference:
          "Article 21, Constitution; Paschim Banga Khet Samity v. State of West Bengal, 1996",
      },
      {
        id: "social-security",
        title: "Right to Social Security",
        summary: "Workers and vulnerable citizens have the right to social security schemes",
        content:
          "India has a framework of social security laws protecting organized and unorganized workers:\n\nFor Organized Sector Workers:\n- Employees' Provident Fund (EPF): Both employer and employee contribute 12% of basic salary\n- Employees' State Insurance (ESIC): Medical care and cash benefits for workers earning up to Rs. 21,000/month\n- Payment of Gratuity: After 5 years of service, entitled to 15 days' wage per year of service\n- Employees' Pension Scheme (EPS): Monthly pension on retirement\n\nFor Unorganized Sector Workers (Building Workers, Domestic Workers, etc.):\n- e-Shram Card: Register at eshram.gov.in for access to social security schemes\n- PM Shram Yogi Maandhan: Pension of Rs. 3,000/month at age 60 for unorganized workers\n- ABVKY Insurance: Rs. 2 lakh accident insurance, Rs. 1 lakh on partial disability\n- PM Jeevan Jyoti Bima Yojana: Life cover of Rs. 2 lakh for Rs. 436/year\n- PM Suraksha Bima Yojana: Accident insurance cover of Rs. 2 lakh for Rs. 20/year\n\nGrievances:\n- EPFO: 1800-118-005\n- ESIC: 1800-11-2526\n- Labor Helpline: 1800-11-7717",
        reference: "EPF Act 1952; ESI Act 1948; Unorganised Workers Social Security Act, 2008",
      },
    ],
  },
];
