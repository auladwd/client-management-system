export interface District {
  name: string;
  bnName: string;
  division: string;
  upazilas: string[];
}

export const DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

export const BANGLADESH_DISTRICTS: District[] = [
  // Dhaka Division
  {
    name: "Dhaka",
    bnName: "ঢাকা",
    division: "Dhaka",
    upazilas: ["Dhamrai", "Dohar", "Keraniganj", "Nawabganj", "Savar", "Tejgaon", "Mirpur", "Dhanmondi", "Gulshan", "Uttara"]
  },
  {
    name: "Gazipur",
    bnName: "গাজীপুর",
    division: "Dhaka",
    upazilas: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur", "Tongi"]
  },
  {
    name: "Narayanganj",
    bnName: "নারায়ণগঞ্জ",
    division: "Dhaka",
    upazilas: ["Araihazar", "Bandar", "Narayanganj Sadar", "Rupganj", "Sonargaon"]
  },
  {
    name: "Tangail",
    bnName: "টাঙ্গাইল",
    division: "Dhaka",
    upazilas: ["Tangail Sadar", "Basail", "Bhuapur", "Delduar", "Ghatail", "Gopalpur", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Dhanbari"]
  },
  {
    name: "Kishoreganj",
    bnName: "কিশোরগঞ্জ",
    division: "Dhaka",
    upazilas: ["Kishoreganj Sadar", "Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail"]
  },
  {
    name: "Manikganj",
    bnName: "মানিকগঞ্জ",
    division: "Dhaka",
    upazilas: ["Manikganj Sadar", "Daulatpur", "Ghior", "Harirampur", "Saturia", "Shivalaya", "Singair"]
  },
  {
    name: "Munshiganj",
    bnName: "মুন্সিগঞ্জ",
    division: "Dhaka",
    upazilas: ["Munshiganj Sadar", "Gazaria", "Lohajang", "Sirajdikhan", "Sreenagar", "Tongibari"]
  },
  {
    name: "Narsingdi",
    bnName: "নরসিংদী",
    division: "Dhaka",
    upazilas: ["Narsingdi Sadar", "Belabo", "Monohardi", "Palash", "Raipura", "Shibpur"]
  },
  {
    name: "Faridpur",
    bnName: "ফরিদপুর",
    division: "Dhaka",
    upazilas: ["Faridpur Sadar", "Alfadanga", "Bhanga", "Boalmari", "Charbhadrasan", "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha"]
  },
  {
    name: "Gopalganj",
    bnName: "গোপালগঞ্জ",
    division: "Dhaka",
    upazilas: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"]
  },
  {
    name: "Madaripur",
    bnName: "মাদারীপুর",
    division: "Dhaka",
    upazilas: ["Madaripur Sadar", "Kalkini", "Rajoir", "Shibchar", "Dasar"]
  },
  {
    name: "Rajbari",
    bnName: "রাজবাড়ী",
    division: "Dhaka",
    upazilas: ["Rajbari Sadar", "Baliakandi", "Goalandaghat", "Pangsha", "Kalukhali"]
  },
  {
    name: "Shariatpur",
    bnName: "শরীয়তপুর",
    division: "Dhaka",
    upazilas: ["Shariatpur Sadar", "Bhedarganj", "Damudya", "Gosairhat", "Naria", "Zajira"]
  },

  // Chattogram Division
  {
    name: "Chattogram",
    bnName: "চট্টগ্রাম",
    division: "Chattogram",
    upazilas: ["Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Fatikchhari", "Hathazari", "Karnaphuli", "Lohagara", "Mirsharai", "Patiya", "Rangunia", "Raozan", "Sandwip", "Satkania", "Sitakunda"]
  },
  {
    name: "Cox's Bazar",
    bnName: "কক্সবাজার",
    division: "Chattogram",
    upazilas: ["Cox's Bazar Sadar", "Chakaria", "Kutubdia", "Maheshkhali", "Ramu", "Teknaf", "Ukhia", "Pekua", "Eidgaon"]
  },
  {
    name: "Cumilla",
    bnName: "কুমিল্লা",
    division: "Chattogram",
    upazilas: ["Cumilla Adarsha Sadar", "Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram", "Daudkandi", "Debidwar", "Homna", "Laksam", "Muradnagar", "Nangalkot", "Titas", "Meghna", "Monohargonj", "Cumilla Sadar Dakshin", "Lalmai"]
  },
  {
    name: "Feni",
    bnName: "ফেনী",
    division: "Chattogram",
    upazilas: ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan", "Parshuram", "Fulgazi", "Sonagazi"]
  },
  {
    name: "Brahmanbaria",
    bnName: "ব্রাহ্মণবাড়িয়া",
    division: "Chattogram",
    upazilas: ["Brahmanbaria Sadar", "Ashuganj", "Akhaura", "Bancharampur", "Bijoynagar", "Kasba", "Nabinagar", "Nasirnagar", "Sarail"]
  },
  {
    name: "Noakhali",
    bnName: "নোয়াখালী",
    division: "Chattogram",
    upazilas: ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Senbagh", "Sonaimuri", "Subarnachar", "Kabirhat"]
  },
  {
    name: "Chandpur",
    bnName: "চাঁদপুর",
    division: "Chattogram",
    upazilas: ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti"]
  },
  {
    name: "Lakshmipur",
    bnName: "লক্ষ্মীপুর",
    division: "Chattogram",
    upazilas: ["Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati", "Kamalnagar"]
  },
  {
    name: "Bandarban",
    bnName: "বান্দরবান",
    division: "Chattogram",
    upazilas: ["Bandarban Sadar", "Ali Kadam", "Lama", "Naikhongchhari", "Rowangchhari", "Ruma", "Thanchi"]
  },
  {
    name: "Khagrachhari",
    bnName: "খাগড়াছড়ি",
    division: "Chattogram",
    upazilas: ["Khagrachhari Sadar", "Dighinala", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh", "Guimara"]
  },
  {
    name: "Rangamati",
    bnName: "রাঙ্গামাটি",
    division: "Chattogram",
    upazilas: ["Rangamati Sadar", "Bagaichhari", "Barkal", "Belaichhari", "Juraichhari", "Kaptai", "Kawkhali", "Langadu", "Naniarchar", "Rajasthali"]
  },

  // Rajshahi Division
  {
    name: "Rajshahi",
    bnName: "রাজশাহী",
    division: "Rajshahi",
    upazilas: ["Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Paba", "Puthia", "Tanore"]
  },
  {
    name: "Bogura",
    bnName: "বগুড়া",
    division: "Rajshahi",
    upazilas: ["Bogura Sadar", "Adamdighi", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur", "Shibganj", "Sonatala"]
  },
  {
    name: "Pabna",
    bnName: "পাবনা",
    division: "Rajshahi",
    upazilas: ["Pabna Sadar", "Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Santhia", "Sujanagar"]
  },
  {
    name: "Sirajganj",
    bnName: "সিরাজগঞ্জ",
    division: "Rajshahi",
    upazilas: ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Rayganj", "Shahjadpur", "Tarash", "Ullahpara"]
  },
  {
    name: "Naogaon",
    bnName: "নওগাঁ",
    division: "Rajshahi",
    upazilas: ["Naogaon Sadar", "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mohadevpur", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"]
  },
  {
    name: "Natore",
    bnName: "নাটোর",
    division: "Rajshahi",
    upazilas: ["Natore Sadar", "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Singra", "Naldanga"]
  },
  {
    name: "Chapai Nawabganj",
    bnName: "চাঁপাইনবাবগঞ্জ",
    division: "Rajshahi",
    upazilas: ["Chapai Nawabganj Sadar", "Bholahat", "Gomastapur", "Nachole", "Shibganj"]
  },
  {
    name: "Joypurhat",
    bnName: "জয়পুরহাট",
    division: "Rajshahi",
    upazilas: ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"]
  },

  // Khulna Division
  {
    name: "Khulna",
    bnName: "খুলনা",
    division: "Khulna",
    upazilas: ["Batiaghata", "Dacope", "Dumuria", "Dighalia", "Koyra", "Paikgachha", "Phultala", "Rupsha", "Terokhada"]
  },
  {
    name: "Jashore",
    bnName: "যশোর",
    division: "Khulna",
    upazilas: ["Jashore Sadar", "Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"]
  },
  {
    name: "Kushtia",
    bnName: "কুষ্টিয়া",
    division: "Khulna",
    upazilas: ["Kushtia Sadar", "Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Mirpur"]
  },
  {
    name: "Satkhira",
    bnName: "সাতক্ষীরা",
    division: "Khulna",
    upazilas: ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"]
  },
  {
    name: "Jhenaidah",
    bnName: "ঝিনাইদহ",
    division: "Khulna",
    upazilas: ["Jhenaidah Sadar", "Harinakundu", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"]
  },
  {
    name: "Chuadanga",
    bnName: "চুয়াডাঙ্গা",
    division: "Khulna",
    upazilas: ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"]
  },
  {
    name: "Bagerhat",
    bnName: "বাগেরহাট",
    division: "Khulna",
    upazilas: ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"]
  },
  {
    name: "Magura",
    bnName: "মাগুরা",
    division: "Khulna",
    upazilas: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"]
  },
  {
    name: "Meherpur",
    bnName: "মেহেরপুর",
    division: "Khulna",
    upazilas: ["Meherpur Sadar", "Gangni", "Mujibnagar"]
  },
  {
    name: "Narail",
    bnName: "নড়াইল",
    division: "Khulna",
    upazilas: ["Narail Sadar", "Kalia", "Lohagara"]
  },

  // Barishal Division
  {
    name: "Barishal",
    bnName: "বরিশাল",
    division: "Barishal",
    upazilas: ["Barishal Sadar", "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"]
  },
  {
    name: "Patuakhali",
    bnName: "পটুয়াখালী",
    division: "Barishal",
    upazilas: ["Patuakhali Sadar", "Bauphal", "Dashmina", "Galachipa", "Kalapara", "Mirzaganj", "Rangabali", "Dumki"]
  },
  {
    name: "Bhola",
    bnName: "ভোলা",
    division: "Barishal",
    upazilas: ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"]
  },
  {
    name: "Pirojpur",
    bnName: "পিরোজপুর",
    division: "Barishal",
    upazilas: ["Pirojpur Sadar", "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad (Swarupkati)", "Indurkani"]
  },
  {
    name: "Barguna",
    bnName: "বরগুনা",
    division: "Barishal",
    upazilas: ["Barguna Sadar", "Amtali", "Bamna", "Betagi", "Patharghata", "Taltali"]
  },
  {
    name: "Jhalokati",
    bnName: "ঝালকাঠি",
    division: "Barishal",
    upazilas: ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"]
  },

  // Sylhet Division
  {
    name: "Sylhet",
    bnName: "সিলেট",
    division: "Sylhet",
    upazilas: ["Sylhet Sadar", "Beanibazar", "Bishwanath", "Dakshin Surma", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Companiganj", "Zakiganj", "Osmani Nagar"]
  },
  {
    name: "Moulvibazar",
    bnName: "মৌলভীবাজার",
    division: "Sylhet",
    upazilas: ["Moulvibazar Sadar", "Barlekha", "Juri", "Kamalganj", "Kulaura", "Rajnagar", "Sreemangal"]
  },
  {
    name: "Habiganj",
    bnName: "হবিগঞ্জ",
    division: "Sylhet",
    upazilas: ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Baniachong", "Chunarughat", "Lakhai", "Madhabpur", "Nabiganj", "Sayestaganj"]
  },
  {
    name: "Sunamganj",
    bnName: "সুনামগঞ্জ",
    division: "Sylhet",
    upazilas: ["Sunamganj Sadar", "Bishwamvarpur", "Chhatak", "Derai", "Dharampasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Sullah", "Tahirpur", "Shanthiganj", "Madhyanagar"]
  },

  // Rangpur Division
  {
    name: "Rangpur",
    bnName: "রংপুর",
    division: "Rangpur",
    upazilas: ["Rangpur Sadar", "Badarganj", "Gangachhara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"]
  },
  {
    name: "Dinajpur",
    bnName: "দিনাজপুর",
    division: "Rangpur",
    upazilas: ["Dinajpur Sadar", "Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Phulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"]
  },
  {
    name: "Gaibandha",
    bnName: "গাইবান্ধা",
    division: "Rangpur",
    upazilas: ["Gaibandha Sadar", "Fulchhari", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"]
  },
  {
    name: "Kurigram",
    bnName: "কুড়িগ্রাম",
    division: "Rangpur",
    upazilas: ["Kurigram Sadar", "Bhurungamari", "Char Rajibpur", "Chilmari", "Phulbari", "Nageshwari", "Rajarhat", "Raomari", "Ulipur"]
  },
  {
    name: "Nilphamari",
    bnName: "নীলফামারী",
    division: "Rangpur",
    upazilas: ["Nilphamari Sadar", "Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Saidpur"]
  },
  {
    name: "Panchagarh",
    bnName: "পঞ্চগড়",
    division: "Rangpur",
    upazilas: ["Panchagarh Sadar", "Atwari", "Boda", "Debiganj", "Tetulia"]
  },
  {
    name: "Thakurgaon",
    bnName: "ঠাকুরগাঁও",
    division: "Rangpur",
    upazilas: ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Pirganj", "Ranisankail"]
  },
  {
    name: "Lalmonirhat",
    bnName: "লালমনিরহাট",
    division: "Rangpur",
    upazilas: ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Kaliganj", "Patgram"]
  },

  // Mymensingh Division
  {
    name: "Mymensingh",
    bnName: "ময়মনসিংহ",
    division: "Mymensingh",
    upazilas: ["Mymensingh Sadar", "Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Nandail", "Phulpur", "Trishal", "Tara Khanda"]
  },
  {
    name: "Jamalpur",
    bnName: "জামালপুর",
    division: "Mymensingh",
    upazilas: ["Jamalpur Sadar", "Bakshiganj", "Dewanganj", "Islampur", "Madarganj", "Melandaha", "Sarishabari"]
  },
  {
    name: "Netrokona",
    bnName: "নেত্রকোণা",
    division: "Mymensingh",
    upazilas: ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Khaliajuri", "Kalmakanda", "Kendua", "Madan", "Mohanganj", "Purbadhala"]
  },
  {
    name: "Sherpur",
    bnName: "শেরপুর",
    division: "Mymensingh",
    upazilas: ["Sherpur Sadar", "Jhenaigati", "Nakla", "Nalitabari", "Sreebardi"]
  }
];

export function getDistrictsByDivision(division: string): District[] {
  return BANGLADESH_DISTRICTS.filter((d) => d.division.toLowerCase() === division.toLowerCase());
}

export function getUpazilas(districtName: string): string[] {
  const dist = BANGLADESH_DISTRICTS.find(
    (d) => d.name.toLowerCase() === districtName.toLowerCase() || d.bnName === districtName
  );
  return dist ? dist.upazilas : [];
}
