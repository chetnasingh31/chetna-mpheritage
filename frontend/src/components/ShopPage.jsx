import React, { useState, useEffect } from 'react';

const PRODUCTS = [
  {
    id: 'p1',
    name: 'Adi Varaha Sculpture',
    title: 'Adi Varaha Sculpture | 9th Century Vishnu Avatar Hindu Temple Idol Museum Replica',
    desc: 'A side-profile view of the Adi Varaha Sculpture, a terracotta-style replica featuring intricate carvings of the boar-headed Vishnu avatar.',
    era: '9th Century CE',
    sizes: ['7 Inch'],
    price: 9999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/adi-varaha-side-profile-full-view-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Stone Composite & Terracotta finish',
    weight: '1.8 kg',
    origin: 'Hinglajgarh, Madhya Pradesh',
    specText: 'Crafted as a museum-grade replication of the 9th Century CE Adi Varaha avatar, this sculpture shows Vishnu as the cosmic boar, rescuing Bhudevi (the earth goddess) from the depths of the cosmic ocean. Hand-finished by state-empanelled artisans.'
  },
  {
    id: 'p2',
    name: 'Nar Varaha Sculpture',
    title: 'Nar Varaha Sculpture | 10th Century Man-Boar Vishnu Avatar Temple Art Replica',
    desc: 'A full front view of the Nar Varaha Sculpture, a stone composite replica showing the man-boar deity rescuing Bhudevi.',
    era: '10th Century CE',
    sizes: ['5 Inch', '9 Inch', '12 Inch'],
    price: 2499,
    img: 'https://cdn.varahaheritage.com/uploadAssets/nar-varaha-full-front-studio-view-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Premium Stone Composite with Sandstone patina',
    weight: '3.5 kg',
    origin: 'Gwalior Fort Collection, M.P.',
    specText: 'Depicting the anthropomorphic man-boar form of Vishnu, this replica captures the Pratihara dynasty sculpture style. The deity holds Bhudevi secure on his shoulder, detailed with deep temple carvings.'
  },
  {
    id: 'p3',
    name: 'Kamdhenu Sculpture',
    title: 'Kamdhenu Sculpture | 12th Century Wish-Fulfilling Cow Hindu Sacred Art Museum Replica',
    desc: 'A front view of the Kamdhenu Sculpture, a stone composite relief depicting a cow nursing its calf with traditional ornamentation.',
    era: '12th Century CE',
    sizes: ['4 Inch', '9 Inch'],
    price: 1299,
    img: 'https://cdn.varahaheritage.com/uploadAssets/kamdhenu-front-view-stone-relief-1.webp',
    authority: 'Directorate of Archaeology, Archaeology, and Museums M.P.',
    material: 'High-density Stone Composite',
    weight: '1.2 kg',
    origin: 'Malwa Region Excavations, M.P.',
    specText: 'The wish-fulfilling cow, Kamdhenu, is sculpted in a relief structure. Features a detailed calf nursing, ornate back carpets, and the divine faces embedded in the iconographical representation.'
  },
  {
    id: 'p4',
    name: 'Ravananugraha Sculpture',
    title: 'Ravananugraha Sculpture | 11th Century Shiva blessing Ravana Temple Art Museum Replica',
    desc: 'A front-facing view of the stone composite Ravananugraha Sculpture showing intricate 11th-century style carvings of Shiva and Ravana.',
    era: '11th Century CE',
    sizes: ['12 Inch'],
    price: 11999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/ravananugraha-front-view-full-sculpture-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Aged Sandstone Composite',
    weight: '5.2 kg',
    origin: 'Khajuraho Temple Complex, M.P.',
    specText: 'A replica of the legendary relief panel at Khajuraho. It illustrates Ravana shaking Mount Kailash, while Shiva calmly presses down with his toe to trap him, eventually blessing him. Highly complex multi-layered structure.'
  },
  {
    id: 'p5',
    name: 'Gauri Parvati Sculpture',
    title: 'Gauri Parvati Sculpture | 10th Century Hindu Goddess Temple Art Museum Replica',
    desc: 'A full front view of the Gauri Parvati Sculpture, a stone composite replica featuring intricate Pratihara style carvings.',
    era: '10th Century CE',
    sizes: ['7 Inch', '9 Inch'],
    price: 4999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/gauri-front-view-full-sculpture-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Stone Composite',
    weight: '2.1 kg',
    origin: 'Bateshwar Temples, Morena, M.P.',
    specText: 'Parvati in her benign Gauri form, holding lotus flowers and displaying the varada mudra. Intricately carved crown (Jatamukuta) and necklace details typical of Gurjara-Pratihara art.'
  },
  {
    id: 'p6',
    name: 'Female Figure Bust Sculpture',
    title: 'Female Figure Bust Sculpture | 10th–12th Century Classical Indian Temple Art Replica',
    desc: 'A front-view of the Female Figure Bust Sculpture, a stone composite replica showcasing intricate Chola style jewelry and craftsmanship.',
    era: '10-12th Century CE',
    sizes: ['7 Inch', '9 Inch'],
    price: 4999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/bust-of-a-female-figure-front-view-bust-sculpture-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Cream Sandstone Composite',
    weight: '2.0 kg',
    origin: 'Central India Historical Sites',
    specText: 'Captures the classic Indian tribhanga or torso detail. The elaborate coiffure, beaded ornaments, and refined facial expressions represent the high period of medieval temple sculpture.'
  },
  {
    id: 'p7',
    name: 'Shiva Lingam with Nandi & Serpent',
    title: 'Shiva Lingam with Nandi & Serpent | 13th–15th Century Sacred Hindu Artifact Replica',
    desc: 'A front-facing view of the Shiva Lingam with Nandi & Serpent replica, featuring intricate stone composite carving on a stand.',
    era: '13-15th Century CE',
    sizes: ['4 Inch', '7 Inch'],
    price: 1999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/bust-of-a-shiva-lingam-nandi-and-serpent-motif-front-view-studio-shot-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Dark Basalt Composite',
    weight: '1.5 kg',
    origin: 'Omkareshwar Temple Artifacts, M.P.',
    specText: 'A detailed votive Shiva Lingam depicting the coiled serpent wrapping the pillar and the faithful Nandi bull seated in eternal adoration at the base. Hand-finished dark polish.'
  },
  {
    id: 'p8',
    name: 'Salabhanjika Sculpture',
    title: 'Salabhanjika Sculpture | 10th Century Indian Temple Bracket Figure Art Museum Replica',
    desc: 'A front view of the Salabhanjika Sculpture, a stone composite replica showing a female figure in a graceful tribhanga pose.',
    era: '10th Century CE',
    sizes: ['7 Inch', '9 Inch'],
    price: 4999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/salabhanjika-front-view-full-figure-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Buff Sandstone Composite',
    weight: '2.6 kg',
    origin: 'Gyaraspur Museum, Vidisha, M.P.',
    specText: 'Often called the "Indian Mona Lisa", this replica is modeled on the world-famous Gyaraspur Salabhanjika. Captures the graceful tree-nymph leaning on a branch, showing flawless anatomical curves and detailed jewelry.'
  },
  {
    id: 'p9',
    name: 'Alasa Nayika Sculpture',
    title: 'Alasa Nayika Sculpture | 10th Century Celestial Beauty Indian Temple Art Museum Replica',
    desc: 'A full-body view of the Alasa Nayika Sculpture, a sandstone-style replica showing a woman in a graceful tribhanga pose.',
    era: '10th Century CE',
    sizes: ['9 Inch'],
    price: 5999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/alasa-kanya-full-body-front-view-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Polished Sandstone Composite',
    weight: '3.1 kg',
    origin: 'Khajuraho East Group Temples, M.P.',
    specText: 'The indolent or stretching celestial maiden (Alasa Kanya) is a staple of medieval Indian architecture. Symbolizes pure beauty, with micro-carvings on garments, waist girdles, and hairstyles.'
  },
  {
    id: 'p10',
    name: 'Anantasayana Vishnu Sculpture',
    title: 'Anantasayana Vishnu Sculpture | 500 CE Reclining Vishnu on Shesha Temple Museum Replica',
    desc: 'A detailed terracotta-style Anantasayana Vishnu Sculpture showing the deity reclining on a serpent within an ornate temple niche.',
    era: '500 CE',
    sizes: ['12 Inch'],
    price: 9999,
    comparePrice: 13999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/anantasayana-vishnu-front-view-full-panel-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Terracotta Composite relief',
    weight: '4.8 kg',
    origin: 'Deogarh Temple Arch, Central India',
    specText: 'Recreating the late Gupta art style, this panel depicts Lord Vishnu sleeping on the coils of the serpent king Shesha. Goddess Lakshmi gently massages his feet while other deities surround him in the celestial realm.'
  },
  {
    id: 'p11',
    name: 'Natesh Shiva Sculpture',
    title: 'Natesh Shiva Sculpture | 8th Century Dancing Shiva Nataraj Idol Museum Replica',
    desc: 'A full-front view of the Natesh Shiva Sculpture, a stone composite replica showing the deity in a graceful dancing pose.',
    era: '8th Century CE',
    sizes: ['9 Inch'],
    price: 6999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/natesh-shiva-full-front-studio-shot-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Verdigris Stone Composite',
    weight: '3.2 kg',
    origin: 'Malwa Archaeological Site, M.P.',
    specText: 'An early medieval Natesha (Lord of Dance), highlighting multiple arms representing cosmic acts of creation, destruction, and preservation. Sturdy base with a classic temple posture.'
  },
  {
    id: 'p12',
    name: 'Gajasura Vadha Sculpture',
    title: 'Gajasura Vadha Sculpture | 10th Century Shiva Slaying Demon Temple Relief Museum Replica',
    desc: 'A full-front view of the Gajasura Vadha Sculpture, a stone composite replica featuring intricate temple relief carvings of Shiva.',
    era: '10th Century CE',
    sizes: ['12 Inch'],
    price: 11999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/gajasura-vadha-front-view-full-sculpture-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Grey Stone Composite',
    weight: '5.8 kg',
    origin: 'Hinglajgarh Fort Collection, M.P.',
    specText: 'Lord Shiva performing the fierce dance of triumph while tearing open the skin of the elephant demon Gajasura. An exceptionally detailed carving displaying heavy historical ornamentation.'
  },
  {
    id: 'p13',
    name: 'Sanchi Torana Gateway Miniature',
    title: 'Sanchi Torana Gateway Miniature | 1st Century BCE Buddhist Great Stupa Replica',
    desc: 'A full-front view of the Sanchi Torana Gateway Miniature, a detailed stone composite replica featuring intricate carvings on a wooden base.',
    era: '1st Century BCE',
    sizes: ['10 Inch'],
    price: 6999,
    comparePrice: 9999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/sanchi-torana-the-great-stupa-gateway-full-front-view-replica-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Polished Sandstone Composite & Hardwood Base',
    weight: '2.5 kg',
    origin: 'Sanchi, Vidisha, M.P.',
    specText: 'Detailed miniature of the Northern Torana (Gateway) of Stupa 1. Replicates Jataka tales, narrative reliefs of the Buddha\'s life, elephant capitals, and the famous Salabhanjika bracket figures on a polished teak base.'
  },
  {
    id: 'p14',
    name: 'Lakshmi Narayan Sculpture (12 Inch)',
    title: 'Lakshmi Narayan Sculpture (12 Inch) | 12th Century Vishnu & Lakshmi Hindu Idol',
    desc: 'A front view of the Lakshmi Narayan Sculpture featuring intricate stone-carved deities on a dark wooden base.',
    era: '12th Century CE',
    sizes: ['12 Inch'],
    price: 9999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/lakshmi-narayan-12-inch-front-view-full-sculpture-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Cream Sandstone Composite & Teak Base',
    weight: '4.2 kg',
    origin: 'Khajuraho Museum Collection, M.P.',
    specText: 'Lord Vishnu and Goddess Lakshmi in a loving, protective embrace. The intricate carving features attributes like the discuss (Sudarshana), conch, mace, and a highly decorated prabhavali arch.'
  },
  {
    id: 'p15',
    name: 'Lakshmi Narayan Sculpture (9 Inch)',
    title: 'Lakshmi Narayan Sculpture (9 Inch) | 12th Century Vishnu & Lakshmi Hindu Idol',
    desc: 'A front-facing view of the Lakshmi Narayan Sculpture, a hand-finished terracotta-style replica showcasing intricate 12th-century Indian stone carving details.',
    era: '12th Century CE',
    sizes: ['9 Inch'],
    price: 4999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/lakshmi-narayan-09-inch-front-view-full-shot-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Terracotta Composite',
    weight: '2.4 kg',
    origin: 'Bundelkhand Temples, M.P.',
    specText: 'A compact 9-inch version of the classical Lakshmi Narayan idol. Designed with terracotta pigments to evoke a warm, antique clay texture.'
  },
  {
    id: 'p16',
    name: 'Vinayaki Sculpture',
    title: 'Vinayaki Sculpture | 11th Century Rare Female Ganesha Hindu Temple Art Museum Replica',
    desc: 'A museum-grade Vinayaki Sculpture replica featuring intricate dark stone carving of the elephant-headed deity standing between two pillars.',
    era: '11th Century CE',
    sizes: ['5 Inch', '7 Inch'],
    price: 2499,
    img: 'https://cdn.varahaheritage.com/uploadAssets/vinayaki-front-view-full-sculpture-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Basalt Black Composite',
    weight: '1.9 kg',
    origin: 'Chausath Yogini Temple, Bhedaghat, Jabalpur',
    specText: 'Replicates one of the rarest icons in Hindu iconography: Vinayaki, the female aspect of Ganesha. Highly valued by art collectors and scholars for its preservation accuracy.'
  },
  {
    id: 'p17',
    name: 'Ganesha Sculpture',
    title: 'Ganesha Sculpture | 10th Century Hindu Elephant God Temple Art Museum Replica',
    desc: 'A front-facing view of the Ganesha Sculpture, a handcrafted sandstone replica featuring intricate 10th-century temple art details on a wooden base.',
    era: '10th Century CE',
    sizes: ['8 Inch'],
    price: 4999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/ganesha-front-view-full-sculpture-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Red Sandstone Composite & Teak Base',
    weight: '2.8 kg',
    origin: 'Udayagiri Caves, Vidisha, M.P.',
    specText: 'A seated Lord Ganesha replica holding his classical attributes (sweetmeat modak, broken tusk, axe). Highly textured red sandstone patina replicates the ancient sandstone rock cliffs.'
  },
  {
    id: 'p18',
    name: 'Krishna\'s Birth Sculpture',
    title: 'Krishna\'s Birth Sculpture | 10th Century Rare Janmashtami Hindu Temple Art Museum Replica',
    desc: 'Krishna\'s Birth Sculpture | 10th Century Rare Janmashtami Hindu Temple Art Museum Replica',
    era: '10th Century CE',
    sizes: ['6 Inch'],
    price: 5999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/krishnas-birth-front-view-hands-holding-4.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Ochre Sandstone Composite',
    weight: '2.3 kg',
    origin: 'Hinglajgarh Museum, M.P.',
    specText: 'A highly unique panel detailing Devaki holding infant Krishna in the prison cell, surrounded by temple columns. A celebrated masterpiece of Pratihara narrative art.'
  },
  {
    id: 'p19',
    name: 'Tripurantaka Shiva Sculpture',
    title: 'Tripurantaka Shiva Sculpture | 10th-Century A.D. Museum Artifact Replica',
    desc: 'A front-facing view of the Tripurantaka Shiva stone composite sculpture, showing the deity holding a bow and arrow.',
    era: '10th Century AD',
    sizes: ['9 Inch'],
    price: 6999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/tripurantaka-shiva-front-view-studio-shot-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Aged Sandstone Composite',
    weight: '3.6 kg',
    origin: 'Gwalior Archaeological Museum, M.P.',
    specText: 'Depicting Lord Shiva as the destroyer of the three demon fortresses (Tripura). Shiva is sculpted with dynamic posture, drawing his cosmic bow.'
  },
  {
    id: 'p20',
    name: 'Chaturbhuj Vishnu Sculpture',
    title: 'Chaturbhuj Vishnu Sculpture | 12th Century Cosmic Preserver Museum Replica',
    desc: 'A full front view of the Chaturbhuj Vishnu Sculpture, a hand-finished stone composite replica featuring intricate divine carvings.',
    era: '12th Century CE',
    sizes: ['12 Inch'],
    price: 9999,
    img: 'https://cdn.varahaheritage.com/uploadAssets/chaturbhuj-vishnu-sculpture-full-front-view-sculpture-1.webp',
    authority: 'Directorate of Archaeology, Archives and Museums M.P.',
    material: 'Cream Stone Composite',
    weight: '4.5 kg',
    origin: 'Chaturbhuj Temple, Orchha, M.P.',
    specText: 'Four-armed standing form of Lord Vishnu holding the conch shell (Shankha), wheel (Chakra), mace (Gada), and lotus (Padma). Complete with detailed halo carving.'
  }
];

const getProductStory = (prod) => {
  if (!prod) return '';
  switch (prod.id) {
    case 'p1':
      return "The Adi Varaha sculpture depicts the third avatar of Lord Vishnu, where he manifests as a giant boar. This terracotta-style replica showcases the powerful boar-headed deity lifting Bhudevi (Goddess Earth) from the primeval ocean, defeating the demon Hiranyaksha. Original excavated from Hinglajgarh, this replica carries the signature Gurjara-Pratihara style characteristics, representing divine strength and resilience.";
    case 'p2':
      return "Nar Varaha portrays the anthropomorphic form of Vishnu's boar avatar. Standing in a majestic posture, the deity is represented with a human body and a boar's head, raising Bhudevi upon his shoulder. The intricate Pratihara dynasty details on the stone composite replica highlight historical ornaments, a decorated pedestal, and the protective grace of the preserver deity.";
    case 'p3':
      return "Kamdhenu, the sacred wish-fulfilling cow, is depicted nursing her calf in this classic 12th-century Malwa region relief. Decorated with rich ceremonial garlands, anklets, and jewelry, she represents motherly love, abundance, and cosmic purity. Having this museum-grade replica in the home invokes prosperity and spiritual harmony according to traditional Vastu principles.";
    case 'p4':
      return "This multi-layered relief recreates the famous Khajuraho panel showing Ravananugraha Shiva. The demon king Ravana attempts to shake Mount Kailash, Shiva's abode, out of arrogance. In response, Shiva calmly presses down with his toe, trapping Ravana's arms beneath the mountain. Appalled, Ravana sings Shiva's praises for a thousand years, prompting Shiva to bless him. An iconic depiction of supreme serenity overcoming pride.";
    case 'p5':
      return "Gauri Parvati is always visualized as the young, serene 16-year-old manifestation of Goddess Parvati. She is a living example of wisdom and the power of profound austerity. As the daughter of Himavan, lord of the mountains, Gauri is also known as Parvati (daughter of the mountain). The name Gauri, however, primarily means 'the radiant one,' referring to her luminous golden complexion. As Mahagauri, she embodies purifying grace, helping devotees overcome inner darkness and spiritual impurities. In order to become the wife of Lord Shiva, Parvati, as Kanya, underwent severe penance. The dust collected on her skin, darkening her appearance. Appeased by her dedication, Lord Shiva gave her the promise of marriage. She took a dip in the holy Ganga after that and transformed into a radiant form as 'Gauri'. She is also the 8th form of Durga, revered as Mahagauri. She is adored by many as a benevolent mother goddess; her presence in the home brings divine blessings. This Gauri sculpture is from the Pratihara period. She is depicted standing in a symmetrical pose on a simple pedestal. She is four-armed, holding a rosary and a lotus in her right hand and a lotus and a water pot in her left hand. She brings prosperity and well-being wherever she resides.";
    case 'p6':
      return "The Female Figure Bust represents the epitome of classical Indian aesthetic beauty from the medieval era. Modeled on bracket figures and temple deities of Central India, it shows complex coiffure, bead-like jewelry, and graceful anatomical contours. Ideal for heritage collectors, it highlights the mastery of ancient stone-carving artisans.";
    case 'p7':
      return "The sacred Shiva Lingam with Nandi and the Serpent represents the cosmic pillar of light and the primary symbol of Lord Shiva. The coiled serpent represents Kundalini energy, and the seated Nandi bull symbolises devotion and strength. This dark basalt composite replica brings a serene and peaceful atmosphere to any study or prayer room.";
    case 'p8':
      return "Modeled after the world-famous Gyaraspur Salabhanjika preserved at the Gujari Mahal Museum in Gwalior, this replica is often referred to as the 'Indian Mona Lisa'. The sculpture depicts a celestial tree nymph (yakshini) in a beautiful triple-bend posture (tribhanga) leaning against an ashoka tree. It showcases absolute anatomical perfection and the peak of 10th-century Pratihara art craftsmanship.";
    case 'p9':
      return "Alasa Nayika, the stretching celestial maiden, is a classic motif in Indian temple architecture, representing feminine beauty, grace, and leisure. Modeled on the world-famous temples of Khajuraho, this replica is hand-finished in sand-colored composite, displaying intricate carving on garments, jewelry, and posture.";
    case 'p10':
      return "A magnificent Gupta-era relief panel depicting Lord Vishnu reclining on the coils of the serpent king Sheshanaga in the cosmic ocean. Goddess Lakshmi sits at his feet while divine guardians and deities watch over the cosmic sleep. Replicates the monumental carvings of Deogarh, symbolizing cosmic balance and creation.";
    default:
      return `${prod.name} represents a quintessential example of historical Indian art. Modelled closely on museum artifacts, this research-grade replica is hand-finished by empanelled master artisans. Its presence preserves the rich heritage and spiritual legacy of India's classical history.`;
  }
};

const defaultReviews = {
  p1: [
    { author: "Karthik S.", rating: 5, date: "12 May, 2026", text: "The terracotta finish on this Adi Varaha sculpture looks incredibly authentic. It has a beautiful rustic charm." },
    { author: "Sunita Sharma", rating: 5, date: "2 May, 2026", text: "Beautifully captured form of Varaha rescuing Bhudevi. Perfect size for my study shelf." },
    { author: "Rohan Patel", rating: 5, date: "18 Apr, 2026", text: "Stunning level of detail. The package arrived in pristine condition, very secure." }
  ],
  p2: [
    { author: "Amit V.", rating: 5, date: "10 May, 2026", text: "The Nar Varaha replica has a very pure feeling about it. The composite stone feels premium and heavy." },
    { author: "Dipti", rating: 5, date: "1 May, 2026", text: "Adds a peaceful, protective energy to the entrance hallway. Outstanding craftsmanship." },
    { author: "Deepali", rating: 5, date: "29 Apr, 2026", text: "Bought this for my father's retirement office. The sculpture looks even better in person." }
  ],
  p3: [
    { author: "Meera Nair", rating: 5, date: "14 May, 2026", text: "Kamdhenu nursing her calf is sculpted with such detail. A lovely reminder of traditional Indian folklore." },
    { author: "Aaditya Rao", rating: 5, date: "4 May, 2026", text: "Very premium stone texture. Looks excellent in our puja room." },
    { author: "Sneha G.", rating: 4, date: "20 Apr, 2026", text: "Beautiful relief panel. Shipping took around 6 days but it was well worth the wait." }
  ],
  p4: [
    { author: "Vikram K.", rating: 5, date: "15 May, 2026", text: "The Ravananugraha relief is a masterpiece. The multi-layered carving captures the depth of the original Khajuraho panel." },
    { author: "Nisha Gupta", rating: 5, date: "9 May, 2026", text: "Simply breathtaking. The details on Shiva's foot and Ravana's multiple hands are extremely precise." },
    { author: "Vijay Iyer", rating: 5, date: "30 Apr, 2026", text: "A highly complex design that stands out in any heritage collection. Worth every rupee." }
  ],
  p5: [
    { author: "Preeti M.", rating: 5, date: "11 May, 2026", text: "This Gauri Parvati sculpture has such a serene presence. Fits perfectly into our home temple setup." },
    { author: "Anil Kapoor", rating: 5, date: "3 May, 2026", text: "Incredible replica of Gurjara-Pratihara art. Varaha Heritage is doing an excellent job preserving heritage." },
    { author: "Jasmine Kaur", rating: 5, date: "25 Apr, 2026", text: "Beautifully hand-finished piece. Comes with a certified document of replication which is a great touch." }
  ],
  p6: [
    { author: "Rajesh S.", rating: 5, date: "8 May, 2026", text: "The Female Figure Bust is absolutely graceful. Displays the classical tribhanga curves perfectly." },
    { author: "Pooja Malhotra", rating: 5, date: "1 May, 2026", text: "Very elegant sandstone patina. It feels like a real museum artifact on my desk." },
    { author: "Siddharth B.", rating: 4, date: "24 Apr, 2026", text: "Elegant craftsmanship and heavy base. A high-quality reproduction." }
  ],
  p7: [
    { author: "Harish J.", rating: 5, date: "13 May, 2026", text: "The Shiva Lingam has a beautiful dark basalt polish. The serpent detail is clean and sharp." },
    { author: "Divya T.", rating: 5, date: "6 May, 2026", text: "Adds an incredibly calm and meditative vibe to the room. I love the texture." },
    { author: "Kunal Shah", rating: 5, date: "28 Apr, 2026", text: "Outstanding quality. Securely packed and delivered within 5 days." }
  ],
  p8: [
    { author: "Shalini R.", rating: 5, date: "12 May, 2026", text: "Fascinated by the Gyaraspur Salabhanjika. This replica is exceptionally faithful to the original Mona Lisa of India." },
    { author: "Madhavan N.", rating: 5, date: "2 May, 2026", text: "Stunning tri-bend posture and details on the jewelry. A prized addition to my living room." },
    { author: "Neeta Joshi", rating: 5, date: "20 Apr, 2026", text: "Elegant, beautiful, and authentic. The certified replication document is highly detailed." }
  ],
  p9: [
    { author: "Sanjay D.", rating: 5, date: "10 May, 2026", text: "The Alasa Nayika sculpture captures the delicate stretching posture perfectly. Gorgeous sandstone texture." },
    { author: "Kiran Bala", rating: 5, date: "3 May, 2026", text: "Highly detailed and very heavy. Recreates the magic of Khajuraho art right at home." },
    { author: "Tarun G.", rating: 5, date: "27 Apr, 2026", text: "Absolutely loved the packaging and the speed of delivery. Safe and professional." }
  ],
  p10: [
    { author: "Prakash V.", rating: 5, date: "16 May, 2026", text: "Anantasayana Vishnu panel is massive and detailed. Recreates the Gupta era style gloriously." },
    { author: "Aruna Sen", rating: 5, date: "8 May, 2026", text: "The reclining Vishnu and Lakshmi details are so peaceful. Truly premium terracotta relief." },
    { author: "Gaurav Roy", rating: 5, date: "1 May, 2026", text: "Amazing craftsmanship. Safe packaging and museum-certified certificate included." }
  ],
  p11: [
    { author: "Vikram S.", rating: 5, date: "15 May, 2026", text: "The Natesh Shiva pose is captured with incredible fluidity. Very satisfied." },
    { author: "Ritu M.", rating: 5, date: "5 May, 2026", text: "Looks fantastic. The verdigris finish adds a nice antique touch to the statue." },
    { author: "Anita R.", rating: 4, date: "22 Apr, 2026", text: "Beautiful sculpture, fits perfectly on my bookshelf." }
  ],
  p12: [
    { author: "Kiran V.", rating: 5, date: "17 May, 2026", text: "The Gajasura Vadha detail is fierce and majestic. A true highlight of my collection." },
    { author: "Rajiv D.", rating: 5, date: "10 May, 2026", text: "Solid weight and intricate carving. Definitely a museum-quality replica." },
    { author: "Suman P.", rating: 5, date: "2 May, 2026", text: "Exceptional finish, looks very authentic. Fast delivery too." }
  ],
  p13: [
    { author: "Sunil K.", rating: 5, date: "18 May, 2026", text: "The Sanchi Torana gateway is a miniature marvel. The detailing on the figures is impressive." },
    { author: "Meena L.", rating: 5, date: "12 May, 2026", text: "Love the combination of sandstone and the hardwood base. Highly aesthetic." },
    { author: "Rahul J.", rating: 5, date: "29 Apr, 2026", text: "Perfect piece of Buddhist art. Arrived well packaged." }
  ],
  p14: [
    { author: "Deepak S.", rating: 5, date: "20 May, 2026", text: "The Lakshmi Narayan sculpture is so elegant. The wood base complements the stone well." },
    { author: "Pooja V.", rating: 5, date: "14 May, 2026", text: "Divine and graceful. The carving of the attributes is really well executed." },
    { author: "Amit B.", rating: 5, date: "5 May, 2026", text: "A beautiful addition to my home altar. Excellent craftsmanship." }
  ],
  p15: [
    { author: "Geeta R.", rating: 5, date: "19 May, 2026", text: "Compact but beautiful. The 9-inch Lakshmi Narayan size is perfect for my side table." },
    { author: "Sanjay M.", rating: 5, date: "11 May, 2026", text: "Love the terracotta texture. It feels very warm and authentic." },
    { author: "Rita D.", rating: 4, date: "3 May, 2026", text: "Great small sculpture, very detailed for its size." }
  ],
  p16: [
    { author: "Dr. Anish", rating: 5, date: "21 May, 2026", text: "A rare Vinayaki icon! So glad to have this in my collection. Very accurate reproduction." },
    { author: "Leela K.", rating: 5, date: "13 May, 2026", text: "The basalt black finish is striking. A unique and beautiful piece of art." },
    { author: "Varun T.", rating: 5, date: "6 May, 2026", text: "Excellent quality and historical accuracy. Highly recommended." }
  ],
  p17: [
    { author: "Arjun S.", rating: 5, date: "22 May, 2026", text: "This Ganesha sculpture feels very grounded. The red sandstone look is very convincing." },
    { author: "Sneha P.", rating: 5, date: "14 May, 2026", text: "Lovely small Ganesha. The wooden base adds a nice finish." },
    { author: "Rahul N.", rating: 5, date: "4 May, 2026", text: "Very happy with the purchase. The detail on the modak and tusk is quite sharp." }
  ],
  p18: [
    { author: "Maya D.", rating: 5, date: "23 May, 2026", text: "Krishna's birth panel is so emotionally resonant. A unique masterpiece." },
    { author: "Karan B.", rating: 5, date: "15 May, 2026", text: "Incredible Pratihara narrative art. Very well crafted." },
    { author: "Ritu S.", rating: 5, date: "7 May, 2026", text: "Beautifully made and the ochre sandstone tone is perfect." }
  ],
  p19: [
    { author: "Suresh P.", rating: 5, date: "24 May, 2026", text: "The Tripurantaka Shiva is full of energy. A very dynamic and well-carved piece." },
    { author: "Neha G.", rating: 5, date: "16 May, 2026", text: "The aged sandstone composite looks so real. Great addition to my gallery." },
    { author: "Manish R.", rating: 5, date: "8 May, 2026", text: "High-quality museum replica. The bow and arrow detail is excellent." }
  ],
  p20: [
    { author: "Vinod T.", rating: 5, date: "25 May, 2026", text: "The Chaturbhuj Vishnu is majestic. The halo detail is just wonderful." },
    { author: "Anjali S.", rating: 5, date: "17 May, 2026", text: "Very grand presence. The cream stone composite is very high quality." },
    { author: "Rakesh K.", rating: 5, date: "9 May, 2026", text: "Fantastic replica, exactly as described. Very happy with the purchase." }
  ]
};

const getProductReviews = (prod) => {
  if (!prod) return [];
  const defaults = defaultReviews[prod.id];
  if (defaults) return defaults;
  return [
    {
      author: "Abhishek G.",
      rating: 5,
      date: "14 May, 2026",
      text: `The detail on the ${prod.name} is magnificent. You can feel the museum-certified heritage quality.`
    },
    {
      author: "Shruti K.",
      rating: 5,
      date: "5 May, 2026",
      text: `Beautifully hand-finished replica. Recreates the ancient historical art perfectly.`
    },
    {
      author: "Nikhil S.",
      rating: 5,
      date: "28 Apr, 2026",
      text: `Excellent weight, premium packaging, and fast shipping. Highly recommended for collectors.`
    }
  ];
};

export default function ShopPage({ onBackToPortal }) {
  const [cookieConsent, setCookieConsent] = useState(
    localStorage.getItem('mp_replica_cookies_accepted') !== 'true'
  );

  // Cart state
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [activeDetailProduct, setActiveDetailProduct] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [detailQty, setDetailQty] = useState(1);
  const [detailTab, setDetailTab] = useState('desc');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState('');

  // Interactive Reviews, Gallery, and Recommendations state
  const [customReviews, setCustomReviews] = useState({});
  const [newReviewForm, setNewReviewForm] = useState({ author: '', rating: 5, text: '' });
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [rotation360, setRotation360] = useState(0);
  const [isDragging360, setIsDragging360] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  useEffect(() => {
    setActiveImgIndex(0);
    setRotation360(0);
    setIsDragging360(false);
    setDetailQty(1);
    setDetailTab('desc');
    setPincode('');
    setPincodeStatus('');
    if (activeDetailProduct) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeDetailProduct]);

  const handleDragStart = (e) => {
    setIsDragging360(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    setDragStartX(clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging360) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartX;
    setDragStartX(clientX);
    setRotation360(prev => {
      let next = prev - deltaX * 1.2;
      if (next < 0) next += 360;
      if (next > 360) next -= 360;
      return next;
    });
  };

  const handleDragEnd = () => {
    setIsDragging360(false);
  };

  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoomMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Search & Filter state
  const [filterEra, setFilterEra] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Checkout states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', zip: ''
  });
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleAcceptCookies = () => {
    localStorage.setItem('mp_replica_cookies_accepted', 'true');
    setCookieConsent(false);
  };

  const handleDeclineCookies = () => {
    setCookieConsent(false);
  };

  // Add item to cart
  const addToCart = (product, size) => {
    const chosenSize = size || product.sizes[0];
    const cartKey = `${product.id}-${chosenSize}`;

    setCart(prevCart => {
      const existsIndex = prevCart.findIndex(item => item.cartKey === cartKey);
      if (existsIndex > -1) {
        const updated = [...prevCart];
        updated[existsIndex].quantity += 1;
        return updated;
      } else {
        return [...prevCart, {
          cartKey,
          product,
          size: chosenSize,
          quantity: 1
        }];
      }
    });

    // Automatically open cart drawer to give e-commerce feedback
    setIsCartOpen(true);
  };

  const updateQuantity = (cartKey, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.cartKey === cartKey) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (cartKey) => {
    setCart(prevCart => prevCart.filter(item => item.cartKey !== cartKey));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.address) {
      alert("Please complete the required shipping details.");
      return;
    }
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCart([]);
      setCheckoutSuccess(false);
      setIsCheckoutOpen(false);
      setCheckoutForm({ name: '', email: '', phone: '', address: '', city: '', zip: '' });
      alert("Order Placed Successfully! Your authentic certificate of replication and tracking link have been dispatched to your email address.");
    }, 1500);
  };

  // Unique eras for filters
  const eras = ['all', '1st Century BCE', '500 CE', '8th Century CE', '9th Century CE', '10th Century CE', '11th Century CE', '12th Century CE', '13-15th Century CE'];

  const filteredProducts = PRODUCTS.filter(prod => {
    const matchesEra = filterEra === 'all' || prod.era === filterEra;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEra && matchesSearch;
  });

  return (
    <div
      style={{
        background: '#FAF6F0',
        minHeight: '100vh',
        fontFamily: "'Inter', sans-sans-serif",
        color: '#2E2A27',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' stroke='rgba%28184, 92, 56, 0.02%29' stroke-width='1.2' fill='none'/%3E%3Ccircle cx='30' cy='30' r='3' fill='rgba%28184, 92, 56, 0.02%29'/%3E%3C/svg%3E")`,
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Design-Same Top Header Banner */}
      <header
        style={{
          background: 'rgba(253, 251, 247, 0.96)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(184, 92, 56, 0.15)',
          position: 'sticky',
          top: 0,
          zIndex: 500,
          padding: '0 48px',
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}
      >
        <div
          onClick={onBackToPortal}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #B85C38, #8c4125)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '18px',
              color: '#ffffff',
              fontWeight: 700,
              boxShadow: '0 4px 8px rgba(184,92,56,0.2)'
            }}
          >
            व
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '17px', fontWeight: 700, color: '#B85C38', letterSpacing: '1.2px' }}>
              VARAHA HERITAGE
            </span>
            <span style={{ fontSize: '9px', color: '#8c8070', letterSpacing: '1.8px', textTransform: 'uppercase', fontWeight: 600 }}>
              Museum Replica Portal
            </span>
          </div>
        </div>

        <nav className="shop-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <ul style={{ display: 'flex', gap: '32px', listStyle: 'none', margin: 0, padding: 0 }}>
            <li><button onClick={onBackToPortal} style={{ background: 'none', border: 'none', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '0.8px', color: '#2E2A27', cursor: 'pointer', transition: 'color 0.2s' }}>Explore Museums</button></li>
            <li><button style={{ background: 'none', border: 'none', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '0.8px', color: '#2E2A27', cursor: 'pointer' }}>Souvenirs</button></li>
            <li><button style={{ background: 'none', border: 'none', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '0.8px', color: '#B85C38', cursor: 'pointer' }}>Replica</button></li>
            <li><button style={{ background: 'none', border: 'none', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '0.8px', color: '#2E2A27', cursor: 'pointer' }}>Wall Accents</button></li>
            <li><button onClick={onBackToPortal} style={{ background: 'none', border: 'none', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '0.8px', color: '#2E2A27', cursor: 'pointer' }}>About Us</button></li>
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Cart Icon trigger */}
          <div
            onClick={() => setIsCartOpen(true)}
            style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(184, 92, 56, 0.05)', transition: 'background 0.2s' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2E2A27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cart.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#B85C38',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(184,92,56,0.3)'
                }}
              >
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </div>

          <button
            onClick={onBackToPortal}
            style={{
              padding: '10px 20px',
              border: '1px solid #B85C38',
              borderRadius: '2px',
              background: 'transparent',
              color: '#B85C38',
              fontSize: '11px',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(184, 92, 56, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            ← Back to Portal
          </button>
        </div>
      </header>

      {/* Breadcrumb Path */}
      <div
        style={{
          width: '100%',
          margin: '24px auto 0',
          padding: '0 48px',
          fontSize: '12px',
          color: '#8c8070',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          boxSizing: 'border-box'
        }}
      >
        <span onClick={onBackToPortal} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#B85C38'} onMouseLeave={(e) => e.currentTarget.style.color = '#8c8070'}>Home</span>
        <span style={{ margin: '0 5px' }}>/</span>
        {activeDetailProduct ? (
          <>
            <span onClick={() => setActiveDetailProduct(null)} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#B85C38'} onMouseLeave={(e) => e.currentTarget.style.color = '#8c8070'}>replica</span>
            <span style={{ margin: '0 5px' }}>/</span>
            <span style={{ color: '#B85C38', fontWeight: 700 }}>{activeDetailProduct.name}</span>
          </>
        ) : (
          <span style={{ color: '#B85C38', fontWeight: 700 }}>replica</span>
        )}
      </div>

      {/* Main Banner exactly like live website */}
      {!activeDetailProduct && (
        <div
          style={{
            width: '100%',
            margin: '16px auto 32px',
            padding: '0 48px',
            boxSizing: 'border-box'
          }}
        >
        <div
          style={{
            background: '#FDFBF9',
            border: '1px solid rgba(184, 92, 56, 0.2)',
            borderRadius: '8px',
            padding: '48px 56px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 16px 36px rgba(184, 92, 56, 0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '32px'
          }}
        >
          {/* Flipped Background Image */}
          <img
            src="https://images.pexels.com/photos/19455909/pexels-photo-19455909.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Museum Hallway Replicas"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 40%',
              transform: 'scaleX(-1)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />

          {/* Fade Overlay for legibility */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(254, 252, 249, 0.82) 0%, rgba(246, 240, 230, 0.72) 100%)',
              zIndex: 1,
              pointerEvents: 'none'
            }}
          />
          {/* Inner decorative border framing */}
          <div
            style={{
              position: 'absolute',
              inset: '12px',
              border: '1px solid rgba(184, 92, 56, 0.12)',
              pointerEvents: 'none',
              borderRadius: '6px'
            }}
          />

          {/* Subtle brand watermark */}
          <div
            style={{
              position: 'absolute',
              left: '30%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '280px',
              fontWeight: 700,
              color: '#B85C38',
              opacity: 0.02,
              pointerEvents: 'none',
              userSelect: 'none',
              lineHeight: 1
            }}
          >
            व
          </div>

          {/* Left Text Block */}
          <div style={{ position: 'relative', zIndex: 2, flex: '2 1 400px', maxWidth: '580px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '10px', color: '#B85C38' }}>✦</span>
              <span style={{ fontSize: '10px', color: '#B85C38', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700 }}>
                Authentic Replicas
              </span>
              <span style={{ height: '1px', flexGrow: 1, maxMidth: '100px', background: 'linear-gradient(90deg, rgba(184, 92, 56, 0.25), transparent)' }}></span>
            </div>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '40px', color: '#2E2A27', margin: '0 0 16px 0', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600, lineHeight: 1.2 }}>
              Preserving <span style={{ color: '#B85C38', borderBottom: '2px solid rgba(184, 92, 56, 0.25)', paddingBottom: '2px' }}>Madhya Pradesh</span>'s Sacred Art
            </h2>
            <p style={{ fontSize: '13px', color: '#635b51', margin: 0, lineHeight: 1.7, fontWeight: 500, letterSpacing: '0.2px' }}>
              Explore museum-certified, research-grade replica sculptures crafted by state-empanelled master artisans. Each masterpiece is accompanied by a certified document of historical replication.
            </p>
          </div>

          {/* Right Stats Block - Styled Directly on Background */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              flex: '1 1 200px',
              maxWidth: '260px',
              minWidth: '160px',
              textAlign: 'right',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ fontSize: '38px', color: '#B85C38', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, lineHeight: 1, letterSpacing: '1px' }}>20</div>
              <div style={{ fontSize: '9px', color: '#8c8070', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 700, marginTop: '4px' }}>
                Certified Replicas
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
              <span style={{ height: '1px', width: '32px', background: 'linear-gradient(90deg, transparent, rgba(184, 92, 56, 0.25))' }}></span>
              <span style={{ fontSize: '8px', color: '#C9A84C' }}>✦</span>
            </div>

            <div>
              <div style={{ fontSize: '13px', color: '#2E2A27', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', lineHeight: 1.2 }}>100% Handmade</div>
              <div style={{ fontSize: '10px', color: '#8c8070', marginTop: '3px', fontWeight: 500 }}>By Empanelled Artisans</div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Filters and Search toolbar */}
      {!activeDetailProduct && (
        <div
          style={{
            width: '100%',
            margin: '0 auto 24px',
            padding: '0 48px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxSizing: 'border-box'
          }}
        >
          {/* Era Dropdown filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ fontSize: '12px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#2E2A27' }}>Period / Era:</label>
            <select
              value={filterEra}
              onChange={(e) => setFilterEra(e.target.value)}
              style={{
                padding: '8px 16px',
                border: '1px solid rgba(184, 92, 56, 0.25)',
                background: '#FFFFFF',
                borderRadius: '2px',
                fontSize: '12px',
                color: '#2E2A27',
                fontFamily: "'Inter', sans-sans-serif",
                cursor: 'pointer'
              }}
            >
              {eras.map(era => (
                <option key={era} value={era}>
                  {era === 'all' ? 'All Historical Eras' : era}
                </option>
              ))}
            </select>
          </div>

          {/* Text Search input */}
          <div style={{ position: 'relative', width: '320px' }}>
            <input
              type="text"
              placeholder="Search replicas (e.g. Varaha, Shiva)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 16px 9px 36px',
                border: '1px solid rgba(184, 92, 56, 0.25)',
                borderRadius: '2px',
                fontSize: '12px',
                background: '#FFFFFF',
                fontFamily: "'Inter', sans-sans-serif",
                boxSizing: 'border-box'
              }}
            >
            </input>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(184, 92, 56, 0.6)"
              strokeWidth="2.5"
              style={{ position: 'absolute', left: '12px', top: '11px' }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>
      )}

      {/* Main product catalog grid */}
      <main
        style={{

          width: '100%',
          margin: '0 auto 64px',
          padding: '0 48px',
          boxSizing: 'border-box',
          flexGrow: 1
        }}
      >
        {activeDetailProduct ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', marginTop: '16px' }}>
            {/* Main Product columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
              {/* Left Column - Gallery */}
              <div>
                <div
                  onMouseMove={handleZoomMouseMove}
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(184, 92, 56, 0.12)',
                    borderRadius: '4px',
                    height: '520px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'zoom-in'
                  }}
                >
                  <img
                    src={activeDetailProduct.img}
                    alt={activeDetailProduct.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transition: isZoomed ? 'none' : 'transform 0.2s ease, transform-origin 0.2s ease'
                    }}
                  />
                  {!isZoomed && (
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: '#B85C38',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                      Hover to Zoom
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Product Meta */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#B85C38', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {activeDetailProduct.era}
                    </span>
                    <span style={{ color: '#8c8070', fontSize: '10px' }}>•</span>
                    <span style={{ fontSize: '11px', color: '#8c8070', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      {activeDetailProduct.origin.split(',')[0]}
                    </span>
                  </div>

                  <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '28px', color: '#2E2A27', margin: '0 0 12px 0', fontWeight: 700, lineHeight: 1.2 }}>
                    {activeDetailProduct.title}
                  </h1>

                  {/* Rating summary */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <div style={{ color: '#C9A84C', letterSpacing: '1px' }}>★★★★★</div>
                    <span style={{ fontWeight: 600, color: '#2E2A27' }}>5.0</span>
                    <span style={{ color: '#8c8070' }}>|</span>
                    <span style={{ color: '#8c8070', textDecoration: 'underline', cursor: 'pointer' }}>
                      {(getProductReviews(activeDetailProduct).length + (customReviews[activeDetailProduct.id]?.length || 0))} Reviews
                    </span>
                  </div>
                </div>

                {/* Price block */}
                <div style={{ background: 'rgba(184, 92, 56, 0.03)', padding: '16px 20px', borderRadius: '4px', borderLeft: '3px solid #B85C38' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#B85C38', fontFamily: "'Montserrat', sans-serif" }}>
                    ₹{activeDetailProduct.price.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#8c8070', marginTop: '2px' }}>
                    Inclusive of all taxes
                  </div>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '11px', fontWeight: 'bold', color: '#6E6558' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 8v13H3V8" />
                        <rect x="1" y="3" width="22" height="5" />
                        <line x1="12" y1="22" x2="12" y2="8" />
                        <path d="M12 8H7.5a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8z" />
                        <path d="M12 8h4.5a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8z" />
                      </svg>
                      Premium Packaging
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Stone Composite
                    </span>
                  </div>
                </div>

                {/* Size selector */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#8c8070', marginBottom: '8px' }}>
                    Select Size
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {activeDetailProduct.sizes.map((sz) => {
                      const sizeSelected = selectedSizes[activeDetailProduct.id] || activeDetailProduct.sizes[0];
                      const isSelected = sizeSelected === sz;
                      return (
                        <button
                          key={sz}
                          onClick={() => setSelectedSizes(prev => ({ ...prev, [activeDetailProduct.id]: sz }))}
                          style={{
                            padding: '8px 20px',
                            border: isSelected ? '2px solid #B85C38' : '1px solid rgba(46, 42, 39, 0.15)',
                            background: isSelected ? '#FAF6F0' : '#ffffff',
                            color: isSelected ? '#B85C38' : '#2E2A27',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            borderRadius: '4px',
                            transition: 'all 0.15s',
                            fontFamily: "'Montserrat', sans-serif"
                          }}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity selector */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#8c8070', marginBottom: '8px' }}>
                    Quantity
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', width: '120px', border: '1px solid rgba(46, 42, 39, 0.25)', borderRadius: '2px', background: '#FFFFFF' }}>
                    <button
                      onClick={() => setDetailQty(prev => Math.max(1, prev - 1))}
                      style={{ flex: 1, padding: '8px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      -
                    </button>
                    <span style={{ flex: 1, textAlign: 'center', fontSize: '13px', fontWeight: 'bold' }}>{detailQty}</span>
                    <button
                      onClick={() => setDetailQty(prev => prev + 1)}
                      style={{ flex: 1, padding: '8px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Main Actions */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                  <button
                    onClick={() => {
                      const sizeSelected = selectedSizes[activeDetailProduct.id] || activeDetailProduct.sizes[0];
                      for (let i = 0; i < detailQty; i++) {
                        addToCart(activeDetailProduct, sizeSelected);
                      }
                      setIsCheckoutOpen(true);
                    }}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: 'linear-gradient(135deg, #B85C38, #9c4c2d)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '2px',
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 700,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(184, 92, 56, 0.2)'
                    }}
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => {
                      const sizeSelected = selectedSizes[activeDetailProduct.id] || activeDetailProduct.sizes[0];
                      for (let i = 0; i < detailQty; i++) {
                        addToCart(activeDetailProduct, sizeSelected);
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: '#ffffff',
                      color: '#B85C38',
                      border: '2px solid #B85C38',
                      borderRadius: '2px',
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 700,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      cursor: 'pointer'
                    }}
                  >
                    Add to Cart
                  </button>
                </div>

                {/* Shipping info */}
                <div style={{ borderTop: '1px solid rgba(46, 42, 39, 0.1)', paddingTop: '16px', fontSize: '12px', color: '#6E6558', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    <span><strong>Estimated Delivery:</strong> Within 7 business days</span>
                  </div>
                  
                  {/* Pincode availability checker */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontWeight: 600, color: '#8c8070' }}>Delivery Availability Check</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Enter Pin Code"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid rgba(184, 92, 56, 0.25)',
                          borderRadius: '2px',
                          fontSize: '12px',
                          width: '140px',
                          boxSizing: 'border-box'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!pincode.trim()) {
                            setPincodeStatus("Please Enter a Pin Code");
                          } else if (/^\d{6}$/.test(pincode.trim())) {
                            setPincodeStatus(`✓ Delivery available for code ${pincode}. Free delivery on certified orders.`);
                          } else {
                            setPincodeStatus("Invalid pin code format. Enter a 6-digit code.");
                          }
                        }}
                        style={{
                          padding: '8px 16px',
                          background: '#2E2A27',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '2px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        Check
                      </button>
                    </div>
                    {pincodeStatus && (
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: pincodeStatus.startsWith('✓') ? '#2e7d32' : '#c62828', marginTop: '2px' }}>
                        {pincodeStatus}
                      </span>
                    )}
                  </div>
                </div>

                {/* Specifications Tabs / Accordions */}
                <div style={{ marginTop: '16px', border: '1px solid rgba(184, 92, 56, 0.15)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', background: 'rgba(184, 92, 56, 0.05)', borderBottom: '1px solid rgba(184, 92, 56, 0.15)' }}>
                    {['desc', 'info', 'story'].map((tb) => (
                      <button
                        key={tb}
                        onClick={() => setDetailTab(tb)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: detailTab === tb ? '#ffffff' : 'transparent',
                          border: 'none',
                          borderBottom: detailTab === tb ? '2px solid #B85C38' : 'none',
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          color: detailTab === tb ? '#B85C38' : '#6E6558',
                          transition: 'all 0.15s'
                        }}
                      >
                        {tb === 'desc' ? 'Description' : tb === 'info' ? 'Information' : 'Heritage Story'}
                      </button>
                    ))}
                  </div>

                  <div style={{ padding: '20px', background: '#ffffff', fontSize: '13px', lineHeight: 1.6, color: '#6E6558' }}>
                    {detailTab === 'desc' && (
                      <div>
                        <p style={{ margin: '0 0 12px 0' }}>{activeDetailProduct.specText}</p>
                        <p style={{ margin: 0 }}>{activeDetailProduct.desc}</p>
                      </div>
                    )}
                    {detailTab === 'info' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', borderBottom: '1px solid #f3f3f3', paddingBottom: '6px' }}>
                          <strong style={{ color: '#2E2A27' }}>Name:</strong>
                          <span>{activeDetailProduct.name}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', borderBottom: '1px solid #f3f3f3', paddingBottom: '6px' }}>
                          <strong style={{ color: '#2E2A27' }}>Material:</strong>
                          <span>{activeDetailProduct.material}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', borderBottom: '1px solid #f3f3f3', paddingBottom: '6px' }}>
                          <strong style={{ color: '#2E2A27' }}>Weight:</strong>
                          <span>{activeDetailProduct.weight}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', borderBottom: '1px solid #f3f3f3', paddingBottom: '6px' }}>
                          <strong style={{ color: '#2E2A27' }}>Origin Site:</strong>
                          <span>{activeDetailProduct.origin}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
                          <strong style={{ color: '#2E2A27' }}>Preserved At:</strong>
                          <span>{activeDetailProduct.authority}</span>
                        </div>
                      </div>
                    )}
                    {detailTab === 'story' && (
                      <p style={{ margin: 0, fontStyle: 'italic' }}>{getProductStory(activeDetailProduct)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div style={{ borderTop: '1px solid rgba(184, 92, 56, 0.15)', paddingTop: '40px' }}>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '20px', color: '#2E2A27', marginBottom: '24px' }}>
                Customer Reviews
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'start' }}>
                {/* Left Side: Summary and Submission Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ background: '#FDFBF9', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: 700, color: '#B85C38', fontFamily: "'Montserrat', sans-serif", lineHeight: 1 }}>5.0</div>
                    <div style={{ color: '#C9A84C', fontSize: '18px', margin: '8px 0' }}>★★★★★</div>
                    <div style={{ fontSize: '12px', color: '#8c8070' }}>
                      Based on {(getProductReviews(activeDetailProduct).length + (customReviews[activeDetailProduct.id]?.length || 0))} Verified Reviews
                    </div>
                  </div>

                  {/* Add a Review Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newReviewForm.author.trim() || !newReviewForm.text.trim()) {
                        alert("Please fill in your name and review message.");
                        return;
                      }
                      const freshReview = {
                        author: newReviewForm.author,
                        rating: newReviewForm.rating,
                        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                        text: newReviewForm.text
                      };
                      setCustomReviews(prev => ({
                        ...prev,
                        [activeDetailProduct.id]: [freshReview, ...(prev[activeDetailProduct.id] || [])]
                      }));
                      setNewReviewForm({ author: '', rating: 5, text: '' });
                      alert("Thank you! Your verified purchase review has been published.");
                    }}
                    style={{
                      padding: '20px',
                      background: '#FFFFFF',
                      border: '1px solid rgba(184, 92, 56, 0.15)',
                      borderRadius: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <h4 style={{ fontFamily: "'Montserrat', sans-serif", margin: '0 0 4px 0', fontSize: '14px', color: '#B85C38', fontWeight: 700 }}>Write a Review</h4>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#8c8070', marginBottom: '4px', textAlign: 'left' }}>Your Name</label>
                      <input
                        type="text"
                        required
                        value={newReviewForm.author}
                        onChange={(e) => setNewReviewForm(prev => ({ ...prev, author: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid rgba(184,92,56,0.2)', borderRadius: '2px', fontSize: '12px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#8c8070', marginBottom: '4px', textAlign: 'left' }}>Rating</label>
                      <select
                        value={newReviewForm.rating}
                        onChange={(e) => setNewReviewForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                        style={{ width: '100%', padding: '8px', border: '1px solid rgba(184,92,56,0.2)', borderRadius: '2px', fontSize: '12px', boxSizing: 'border-box', background: '#ffffff' }}
                      >
                        {[5, 4, 3, 2, 1].map(num => (
                          <option key={num} value={num}>{num} Stars</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#8c8070', marginBottom: '4px', textAlign: 'left' }}>Your Feedback</label>
                      <textarea
                        required
                        rows="3"
                        value={newReviewForm.text}
                        onChange={(e) => setNewReviewForm(prev => ({ ...prev, text: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid rgba(184,92,56,0.2)', borderRadius: '2px', fontSize: '12px', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        padding: '10px',
                        background: '#B85C38',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '2px',
                        fontSize: '11px',
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 700,
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}
                    >
                      Submit Review
                    </button>
                  </form>
                </div>

                {/* Right Side: Reviews List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    ...(customReviews[activeDetailProduct.id] || []),
                    ...getProductReviews(activeDetailProduct)
                  ].map((rv, idx) => (
                    <div key={idx} style={{ borderBottom: '1px solid rgba(46, 42, 39, 0.08)', paddingBottom: '20px', textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ color: '#2E2A27', fontSize: '13px' }}>{rv.author}</strong>
                          <span style={{ fontSize: '10px', background: '#2e7d32', color: '#ffffff', padding: '2px 6px', borderRadius: '2px', fontWeight: 'bold' }}>✓ Verified Purchase</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#8c8070' }}>{rv.date}</span>
                      </div>
                      <div style={{ color: '#C9A84C', fontSize: '12px', marginBottom: '6px' }}>
                        {'★'.repeat(rv.rating)}{'☆'.repeat(5 - rv.rating)}
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#6E6558', lineHeight: 1.5 }}>{rv.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Also Bought Together Horizontal Carousel */}
            <div style={{ borderTop: '1px solid rgba(184, 92, 56, 0.15)', paddingTop: '40px' }}>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '20px', color: '#2E2A27', marginBottom: '24px' }}>
                Also Bought Together
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: '24px',
                  overflowX: 'auto',
                  paddingBottom: '20px',
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {PRODUCTS.filter(p => p.id !== activeDetailProduct.id).map((prod) => {
                  const sizeSelected = selectedSizes[prod.id] || prod.sizes[0];
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setActiveDetailProduct(prod)}
                      style={{
                        flex: '0 0 260px',
                        scrollSnapAlign: 'start',
                        background: '#FFFFFF',
                        border: '1px solid rgba(184, 92, 56, 0.12)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 8px 24px rgba(17, 17, 17, 0.02)',
                        transition: 'all 0.3s',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ height: '240px', position: 'relative', overflow: 'hidden', background: '#F5F2EC' }}>
                        <img src={prod.img} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                        <h4 style={{ fontFamily: "'Inter', sans-sans-serif", fontSize: '13px', margin: 0, fontWeight: 500, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                          {prod.title}
                        </h4>
                        <div style={{ fontSize: '11px', color: '#B85C38', fontWeight: 600 }}>{prod.era}</div>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>₹{prod.price.toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed rgba(184,92,56,0.2)', background: '#FFFFFF', borderRadius: '4px' }}>
            <span style={{ fontSize: '32px' }}>🏛️</span>
            <h3 style={{ fontFamily: "'Montserrat', sans-serif", margin: '16px 0 8px 0', fontSize: '18px' }}>No Replicas Found</h3>
            <p style={{ fontSize: '13px', color: '#8c8070', margin: 0 }}>Try clearing your search query or choosing another period.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {filteredProducts.map((prod) => {
              const sizeSelected = selectedSizes[prod.id] || prod.sizes[0];
              const isFav = !!favorites[prod.id];
              return (
                <div
                  key={prod.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(184, 92, 56, 0.12)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 8px 24px rgba(17, 17, 17, 0.02)',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(184, 92, 56, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(184, 92, 56, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(17, 17, 17, 0.02)';
                    e.currentTarget.style.borderColor = 'rgba(184, 92, 56, 0.12)';
                  }}
                >
                  {/* Portrait aspect ratio image container */}
                  <div
                    style={{
                      height: '350px',
                      position: 'relative',
                      overflow: 'hidden',
                      background: '#F5F2EC',
                      cursor: 'pointer'
                    }}
                  >
                    <img
                      src={prod.img}
                      alt={prod.name}
                      onClick={() => setActiveDetailProduct(prod)}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                    />

                    {/* Top right floating actions */}
                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(`${window.location.origin}/products/${prod.id}`);
                          alert(`Product Link Copied: ${prod.name}`);
                        }}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: '#ffffff',
                          border: 'none',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#2E2A27',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFavorites(prev => ({ ...prev, [prod.id]: !prev[prod.id] }));
                        }}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: '#ffffff',
                          border: 'none',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: isFav ? '#cc3333' : '#2E2A27',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? '#cc3333' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>

                    {/* Centered QUICK ADD button overlaying bottom of image */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod, sizeSelected);
                      }}
                      style={{
                        position: 'absolute',
                        bottom: '16px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#ffffff',
                        border: '1px solid rgba(46, 42, 39, 0.12)',
                        borderRadius: '6px',
                        padding: '10px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Inter', sans-sans-serif",
                        fontWeight: 600,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: '#2E2A27',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        transition: 'all 0.2s',
                        zIndex: 10,
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#FAF6F0';
                        e.currentTarget.style.transform = 'translateX(-50%) scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.transform = 'translateX(-50%) scale(1.0)';
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      QUICK ADD
                    </button>
                  </div>

                  {/* Minimal Details Block */}
                  <div style={{ padding: '16px 16px 20px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Title with single line truncation */}
                    <h3
                      onClick={() => setActiveDetailProduct(prod)}
                      style={{
                        fontFamily: "'Inter', sans-sans-serif",
                        fontSize: '14px',
                        color: '#2E2A27',
                        margin: 0,
                        lineHeight: 1.3,
                        fontWeight: 500,
                        cursor: 'pointer',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                      }}
                      title={prod.title}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#B85C38'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#2E2A27'}
                    >
                      {prod.title}
                    </h3>

                    {/* Era/Period Subtitle */}
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#B85C38' }}>
                      {prod.era}
                    </div>

                    {/* Size pills */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '4px 0' }}>
                      {prod.sizes.map((sz) => {
                        const isSelected = sizeSelected === sz;
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSizes(prev => ({ ...prev, [prod.id]: sz }));
                            }}
                            style={{
                              padding: '4px 12px',
                              border: isSelected ? '1.5px solid #B85C38' : '1.5px solid #E5E1DA',
                              background: isSelected ? '#FAF6F0' : '#ffffff',
                              color: isSelected ? '#B85C38' : '#6E6558',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              borderRadius: '20px',
                              transition: 'all 0.15s',
                              fontFamily: "'Inter', sans-sans-serif"
                            }}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>

                    {/* Price tag */}
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#2E2A27', fontFamily: "'Inter', sans-sans-serif" }}>
                      ₹{prod.price.toLocaleString()}
                    </div>

                    {/* Authority information */}
                    <div style={{ fontSize: '11px', color: '#8c8070', lineHeight: 1.4, marginTop: '2px' }}>
                      {prod.authority}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Trust Badges - Match Live Theme */}
      <section
        style={{
          borderTop: '1px solid rgba(184, 92, 56, 0.15)',
          borderBottom: '1px solid rgba(184, 92, 56, 0.15)',
          background: '#FDFBF7',
          padding: '48px 0'
        }}
      >
        <div style={{ margin: '0 auto', padding: '0 48px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '32px' }}>
          <div style={{ textAlign: 'center', flex: '1 1 240px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}>🇮🇳</span>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontFamily: "'Montserrat', sans-serif", color: '#B85C38', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Proudly Indian</h4>
            <span style={{ fontSize: '12px', color: '#6e6558', lineHeight: 1.4 }}>Recognised by <strong style={{ color: '#2E2A27' }}>Startup India</strong></span>
          </div>
          <div style={{ textAlign: 'center', flex: '1 1 240px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}>✦</span>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontFamily: "'Montserrat', sans-serif", color: '#B85C38', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Impeccable details</h4>
            <span style={{ fontSize: '12px', color: '#6e6558', lineHeight: 1.4 }}>Hand Finished <br />Research Grade Details</span>
          </div>
          <div style={{ textAlign: 'center', flex: '1 1 240px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}>🏛️</span>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontFamily: "'Montserrat', sans-serif", color: '#B85C38', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Authentic Products</h4>
            <span style={{ fontSize: '12px', color: '#6e6558', lineHeight: 1.4 }}>Museum Certified <br />Limited Edition Replicas</span>
          </div>
        </div>
      </section>

      {/* Dark Footer Block */}
      <footer
        style={{
          background: '#0D0C0B',
          color: '#FAF6F0',
          padding: '72px 48px 36px',
          fontSize: '13px'
        }}
      >
        <div style={{ margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '48px', borderBottom: '1px solid rgba(250,246,240,0.06)', paddingBottom: '56px', marginBottom: '36px' }}>
          <div>
            <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', letterSpacing: '1px', marginBottom: '20px', color: '#FAF6F0', fontWeight: 700 }}>CATEGORIES</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><button onClick={onBackToPortal} style={{ background: 'none', border: 'none', color: '#FAF6F0', opacity: 0.7, padding: 0, cursor: 'pointer', fontSize: 'inherit' }}>Explore Museums</button></li>
              <li><button style={{ background: 'none', border: 'none', color: '#FAF6F0', opacity: 0.7, padding: 0, cursor: 'pointer', fontSize: 'inherit' }}>Souvenirs</button></li>
              <li><button style={{ background: 'none', border: 'none', color: '#FAF6F0', opacity: 0.7, padding: 0, cursor: 'pointer', fontSize: 'inherit' }}>Replica</button></li>
              <li><button style={{ background: 'none', border: 'none', color: '#FAF6F0', opacity: 0.7, padding: 0, cursor: 'pointer', fontSize: 'inherit' }}>Wall Accents</button></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', letterSpacing: '1px', marginBottom: '20px', color: '#FAF6F0', fontWeight: 700 }}>INFORMATION</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', opacity: 0.7 }}>
              <li>PRIVACY POLICY</li>
              <li>RETURN &amp; SHIPMENT</li>
              <li>TERMS OF USE</li>
              <li>CONTACT US</li>
              <li>TRACK ORDER</li>
              <li>BULK ORDERS</li>
              <li>AUTHENTICATION</li>
              <li>FAQs</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', letterSpacing: '1px', marginBottom: '20px', color: '#FAF6F0', fontWeight: 700 }}>BRAND</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><button onClick={onBackToPortal} style={{ background: 'none', border: 'none', color: '#FAF6F0', opacity: 0.7, padding: 0, cursor: 'pointer', fontSize: 'inherit' }}>ABOUT US</button></li>
              <li style={{ opacity: 0.7 }}>BLOGS</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', letterSpacing: '1px', marginBottom: '20px', color: '#FAF6F0', fontWeight: 700 }}>Get in Touch</h4>
            <p style={{ margin: '0 0 10px 0', opacity: 0.7 }}>+91 9310960694</p>
            <p style={{ margin: 0, opacity: 0.7 }}>info@varahaheritage.com</p>
          </div>
        </div>

        <div style={{ margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ margin: 0, opacity: 0.5, fontSize: '11px' }}>
            Copyright © 2026 Varaha Heritage. All rights reserved.
          </p>
          <p style={{ margin: 0, opacity: 0.3, fontSize: '10px', fontStyle: 'italic' }}>
            Museum Replica Artefacts Online | Indian Heritage Replicas | Varaha Heritage
          </p>
        </div>
      </footer>

      {/* Cart Side Drawer Component */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              background: '#FAF6F0',
              height: '100%',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              padding: '32px',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(184,92,56,0.15)', paddingBottom: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <h3 style={{ fontFamily: "'Montserrat', sans-serif", margin: 0, fontSize: '18px', fontWeight: 700 }}>Your Basket</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#2E2A27' }}
              >
                ×
              </button>
            </div>

            {/* Drawer Body - Items List */}
            <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '4px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#8c8070' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8c8070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 16px' }}>
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Your cart is empty.
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.cartKey} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(184,92,56,0.06)', paddingBottom: '16px' }}>
                    <img
                      src={item.product.img}
                      alt={item.product.name}
                      style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '1px', border: '1px solid rgba(184,92,56,0.1)' }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ fontFamily: "'Montserrat', sans-serif", margin: '0 0 4px 0', fontSize: '13px', fontWeight: 700 }}>{item.product.name}</h4>
                      <div style={{ fontSize: '11px', color: '#8c8070', marginBottom: '8px' }}>Size: {item.size}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Quantity Counter */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(46,42,39,0.2)', borderRadius: '1px' }}>
                          <button onClick={() => updateQuantity(item.cartKey, -1)} style={{ border: 'none', background: 'none', padding: '2px 8px', cursor: 'pointer' }}>-</button>
                          <span style={{ fontSize: '12px', padding: '0 6px', fontWeight: 'bold' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartKey, 1)} style={{ border: 'none', background: 'none', padding: '2px 8px', cursor: 'pointer' }}>+</button>
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#B85C38', fontSize: '13px' }}>
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartKey)}
                      style={{ background: 'none', border: 'none', color: '#cc3333', fontSize: '16px', cursor: 'pointer', alignSelf: 'flex-start' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer - Totals & Actions */}
            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(184,92,56,0.15)', paddingTop: '20px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#8c8070', fontWeight: 600 }}>Total Basket Value:</span>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: '#B85C38', fontFamily: "'Montserrat', sans-serif" }}>
                    ₹{getCartTotal().toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #B85C38, #9c4c2d)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '1px',
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(184,92,56,0.2)'
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}



      {/* Checkout Modal Form */}
      {isCheckoutOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '500px',
              background: '#FAF6F0',
              borderRadius: '4px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              padding: '36px',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            <button
              onClick={() => setIsCheckoutOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#2E2A27' }}
            >
              ×
            </button>

            <h3 style={{ fontFamily: "'Montserrat', sans-serif", margin: '0 0 8px 0', fontSize: '20px', fontWeight: 700, color: '#B85C38' }}>Shipping Details</h3>
            <p style={{ fontSize: '12px', color: '#8c8070', margin: '0 0 24px 0' }}>Provide your delivery address below to finalize procurement of certified replicas.</p>

            {checkoutSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>⏳</span>
                <p style={{ fontWeight: 'bold', fontSize: '16px', color: '#2E2A27' }}>Securing transaction gateway...</p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8c8070', fontWeight: 700, marginBottom: '6px' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.name}
                    onChange={e => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(184,92,56,0.2)', borderRadius: '2px', background: '#FFFFFF', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8c8070', fontWeight: 700, marginBottom: '6px' }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={checkoutForm.email}
                      onChange={e => setCheckoutForm(prev => ({ ...prev, email: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(184,92,56,0.2)', borderRadius: '2px', background: '#FFFFFF', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8c8070', fontWeight: 700, marginBottom: '6px' }}>Phone Number</label>
                    <input
                      type="tel"
                      value={checkoutForm.phone}
                      onChange={e => setCheckoutForm(prev => ({ ...prev, phone: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(184,92,56,0.2)', borderRadius: '2px', background: '#FFFFFF', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8c8070', fontWeight: 700, marginBottom: '6px' }}>Delivery Address *</label>
                  <textarea
                    required
                    rows="3"
                    value={checkoutForm.address}
                    onChange={e => setCheckoutForm(prev => ({ ...prev, address: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(184,92,56,0.2)', borderRadius: '2px', background: '#FFFFFF', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8c8070', fontWeight: 700, marginBottom: '6px' }}>City *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.city}
                      onChange={e => setCheckoutForm(prev => ({ ...prev, city: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(184,92,56,0.2)', borderRadius: '2px', background: '#FFFFFF', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8c8070', fontWeight: 700, marginBottom: '6px' }}>Zip/Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.zip}
                      onChange={e => setCheckoutForm(prev => ({ ...prev, zip: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(184,92,56,0.2)', borderRadius: '2px', background: '#FFFFFF', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(184,92,56,0.1)', paddingTop: '16px', marginTop: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(135deg, #B85C38, #9c4c2d)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '1px',
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 700,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      cursor: 'pointer'
                    }}
                  >
                    Place Procurement Order (₹{getCartTotal().toLocaleString()})
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Cookie Consent toast */}
      {cookieConsent && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            right: '24px',
            maxWidth: '600px',
            margin: '0 auto',
            background: 'rgba(26, 24, 22, 0.96)',
            border: '1px solid #B85C38',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            borderRadius: '4px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            zIndex: 9999
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', color: '#FAF6F0', flex: '1 1 300px', lineHeight: 1.4 }}>
            We use cookies and analytics to improve your replica browsing experience. By accepting, you consent to the use of cookies as per our Privacy Policy.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleDeclineCookies}
              style={{
                background: 'transparent',
                border: '1px solid rgba(250, 246, 240, 0.3)',
                color: '#FAF6F0',
                padding: '6px 14px',
                borderRadius: '2px',
                fontSize: '11px',
                cursor: 'pointer',
                fontFamily: "'Montserrat', sans-serif",
                textTransform: 'uppercase',
                transition: 'all 0.2s'
              }}
            >
              Decline
            </button>
            <button
              onClick={handleAcceptCookies}
              style={{
                background: '#B85C38',
                border: 'none',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '2px',
                fontSize: '11px',
                cursor: 'pointer',
                fontFamily: "'Montserrat', sans-serif",
                textTransform: 'uppercase',
                transition: 'all 0.2s'
              }}
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
