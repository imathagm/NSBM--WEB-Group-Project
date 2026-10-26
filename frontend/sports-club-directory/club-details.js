document.addEventListener("DOMContentLoaded", function () {
    function scheduleOnlyClub(name, category, image, schedule) {
        return {
            name: name + " Club",
            category: category,
            image: image,
            intro: "This page includes the training schedule transcribed from the provided 2026 schedule photo.",
            description: ["The provided schedule image does not include a full official club profile."],
            activities: [],
            facilities: [],
            staff: [],
            leaders: [],
            achievements: [],
            schedule: schedule,
            sourceNote: "Only the training schedule from the provided 2026 practice schedule image is shown here. Full official club information was not included."
        };
    }

    const clubs = {
        athletics: {
            name: "Athletics Club",
            category: "Individual sport",
            image: "images/athletics.jpg",
            intro: "A prominent club in Sri Lanka’s university sports community, supporting both emerging and accomplished athletes from the NSBM community.",
            description: [
                "The NSBM Athletics Club has served as a training ground for skilled athletes, including members who have earned national recognition and gold medals. It supports elite and developing athletes in pursuing sporting and academic excellence.",
                "The club brings current and former NSBM students together through its events, fostering a shared community and contributing to the university’s reputation in the wider higher-education sports sector.",
                "The club launched the NSBM U-Sports Athletic Championship, an inter-university championship open to state and non-state higher-education institutions across Sri Lanka. It provides a platform for universities to showcase their athletics and supports the growth of university sport.",
                "The club welcomes participants across ages, abilities and standards, including runners, throwers, jumpers and walkers, as well as students taking part for enjoyment."
            ],
            activities: [
                "Participate in events organized by the club alongside current students and alumni.",
                "Take part in running, throwing, jumping and walking activities.",
                "Compete through the NSBM U-Sports Athletic Championship, which welcomes higher-education institutions across Sri Lanka.",
                "Receive expert training advice from fully qualified coaches."
            ],
            facilities: ["Fully equipped on-campus gym area", "Swimming pool", "Sports equipment", "Guidance from fully qualified coaches"],
            staff: ["Mr. Venura Colombage — FOB", "Ms. Aushadharie Vidanalage — FOB"],
            leaders: [
                "President — Vinsuka Gammanpila",
                "Male Captain — Naveen Perera",
                "Female Captain — Aaradhi Perera",
                "Male Vice Captains — Sasindu Adhikari and Linuka Rathnappriya",
                "Female Vice Captains — Umasha Jayarathne and Udari Bandara"
            ],
            achievements: [
                {
                    competition: "SLIIT Relay Competition — 2023",
                    results: [
                        "Overall Runner-up — University Boys category",
                        "Overall 2nd Runner-up — University Girls category",
                        "Gold medal — 4 × 200 m relay, University Boys category",
                        "Gold medal — Medley Relay, University Boys category"
                    ]
                },
                { competition: "SLTC Athletic Meet — 2022", results: ["2nd Runners-up — Invitation Relay"] },
                { competition: "NSBM U-Sports — 2022", results: ["Men’s Overall 2nd Runners-up"] }
            ],
            schedule: [
                { day: "Monday", startTime: "1:00 PM", endTime: "5:00 PM", venue: "NSBM Phase 02 Ground", sessionType: "Practice session" },
                { day: "Wednesday", startTime: "1:00 PM", endTime: "5:00 PM", venue: "NSBM Phase 02 Ground", sessionType: "Practice session" },
                { day: "Friday", startTime: "1:00 PM", endTime: "4:00 PM", venue: "NSBM Phase 02 Ground", sessionType: "Practice session" }
            ]
        },
        badminton: {
            name: "Badminton Club",
            category: "Racket sport",
            image: "images/badminton.jpg",
            intro: "An active campus club bringing together more than 150 members, from beginners to competitive representatives.",
            description: [
                "Open to all undergraduates, NSBM Badminton Club provides space for recreation, fitness and skill development in a fast-paced sport. The official profile describes the club as progressive and inclusive.",
                "Members have opportunities to participate in local, inter-university, national and international competitions. The profile also identifies personal benefits of badminton including sharper reflexes, improved hand–eye coordination and mental agility.",
                "Year-round social activities help create a lively club community and friendships beyond the court."
            ],
            activities: ["Recreational play, fitness and skill development", "Competition opportunities from local to international level", "Year-round social activities"],
            facilities: [],
            staff: ["Mr. Thisal Yatawara — FOB", "Ms. Ashani Jayasundara — FOB"],
            leaders: [
                "President — Induneth Fernando",
                "Male Captain — Manthuka Rupatunge",
                "Female Captain — Sandali Gee Kiyanage",
                "Male Vice Captain — Tharindu Umayanga",
                "Female Vice Captain — Methmi Shehara"
            ],
            achievements: [
                {
                    competition: "Badminton competition results",
                    results: [
                        "Colombo Shuttle Saga 2025 — Runners-up",
                        "ICBT Smash Down 2024 (Girls) — 2nd Runners-up",
                        "GSF 2024 — Runners-up",
                        "ICBT Smash Down 2023 (Girls) — 2nd Runners-up",
                        "U Sports 2023 — Boys Champions; Girls Runners-up",
                        "U Sports 2022 — Male Champions; Female 2nd Runners-up",
                        "SMASHES 2022 (Mixed) — 2nd Runner-up",
                        "APIIT Extravaganza 2022 (Mixed) — 2nd Runner-up",
                        "GSF 2019 (Green Shuttle Fiesta) — Champions"
                    ]
                }
            ],
            schedule: [
                { day: "Tuesday", startTime: "9:00 AM", endTime: "12:00 PM", venue: "NSBM Indoor Stadium", sessionType: "Practice session" },
                { day: "Thursday", startTime: "2:00 PM", endTime: "4:00 PM", venue: "NSBM Indoor Stadium", sessionType: "Practice session" }
            ]
        },
        chess: {
            name: "Chess Club",
            category: "Mind sport",
            image: "images/chess.jpg",
            intro: "The NSBM Green University Chess Club began in 2017 and has recorded inter-university team results across several seasons.",
            description: [
                "The official profile traces the club’s history through its student leadership and competition results. It describes the club’s early foundation under President Yomal Hewasinghe and Captain Niroshan Chathuranga.",
                "The profile records that the girls’ team were runners-up at the 4th SLIIT Castle Fest 2019 and champions at NSBM U-Sports 2019. The boys’ team placed 2nd runners-up at the SLIIT event and 1st runners-up at U-Sports.",
                "The page also documents leadership through the COVID-19 disruption and the 2021–2022 period. In 2022–2023, Nipun Harshana Dabare served as President and Captain; the club became champions at the Sabra Chess Championship and secured a 1st runners-up finish at another competition mentioned on the source page."
            ],
            activities: ["Inter-university and university chess competitions", "The official profile documents team participation at SLIIT Castle Fest, NSBM U-Sports and the Sabra Chess Championship"],
            facilities: [],
            staff: [],
            leaders: [
                "2017 President — Yomal Hewasinghe",
                "2017 Captain — Niroshan Chathuranga",
                "2020 President — Sanura Chamantha",
                "2021–2022 President — Nipun Harshana Dabare",
                "2021–2022 Captain — Nadun Yasodana Hewawasan",
                "2022–2023 President and Captain — Nipun Harshana Dabare"
            ],
            leadershipNote: "These are historical leaders recorded in the official profile, not a current leadership list.",
            achievements: [
                {
                    competition: "4th SLIIT Castle Fest — 2019",
                    results: ["Girls’ team — Runners-up", "Boys’ team — 2nd runners-up"]
                },
                {
                    competition: "NSBM U-Sports — 2019",
                    results: ["Girls’ team — Champions", "Boys’ team — 1st runners-up"]
                },
                {
                    competition: "Sabra Chess Championship — 2022–2023",
                    results: ["Champions; the source also reports a 1st runners-up finish at a further competition without naming it in that sentence"]
                }
            ],
            schedule: [
                { day: "Wednesday", startTime: "10:00 AM", endTime: "12:00 PM", venue: "FOC - L - 104", sessionType: "Practice session" },
                { day: "Friday", startTime: "10:00 AM", endTime: "12:00 PM", venue: "FOC - L - 104", sessionType: "Practice session" }
            ]
        },
        cricket: {
            name: "Cricket Club",
            category: "Team sport",
            image: "images/cricket.jpg",
            intro: "An active NSBM club with more than 50 regular members and alumni members.",
            description: [
                "The NSBM University Cricket Team represents NSBM Green University in inter-university tournaments and competitions. The official profile describes its members as students who share a passion for cricket and a commitment to improving their skills.",
                "Training focuses on technical proficiency, tactical understanding and physical fitness, developing individual ability while fostering teamwork and camaraderie.",
                "The team is described as competitive and sportsmanlike. The profile says its dedication and discipline have produced victories and recognition within the university and the wider cricket community."
            ],
            activities: ["Inter-university tournaments and competitions", "Training focused on technical skill, tactics and physical fitness", "Teamwork and sportsmanship"],
            facilities: [],
            staff: [],
            leaders: [],
            achievements: [],
            schedule: [
                { day: "Monday", startTime: "1:00 PM", endTime: "3:00 PM", venue: "NSBM Phase 02 Ground", sessionType: "Practice session" },
                { day: "Wednesday", startTime: "1:00 PM", endTime: "3:00 PM", venue: "NSBM Phase 02 Ground", sessionType: "Practice session" }
            ]
        },
        "martial-arts": {
            name: "Martial Arts Club",
            category: "Martial arts",
            image: "images/karate.jpg",
            intro: "A combined NSBM Taekwondo and Karate club offering undergraduates opportunities to develop martial-arts and self-defence skills.",
            description: [
                "The NSBM Martial Arts Club brings together the Taekwondo Club and Karate Club. The official profile presents both as ways for undergraduates to develop self-defence and fighting skills.",
                "Members receive expert guidance and rigorous training intended to foster discipline, physical fitness and mental strength. Outstanding performers may participate in events around Sri Lanka and represent the NSBM community.",
                "The club profile also describes martial arts as a way to build confidence and contribute to a culture of excellence."
            ],
            activities: ["Taekwondo and Karate training", "Self-defence and martial-arts skill development", "Participation in events around Sri Lanka for outstanding performers"],
            facilities: [],
            staff: ["Mr. Maleesha Edirisinghe — FOB", "Ms. Rhythmani Perera — FOB"],
            leaders: [
                "Taekwondo Captain — Rajith Ruwan Bandara Thennakoon (Male) and Dewmi Rivithma Amarasinghe (Female)",
                "Taekwondo Vice Captain — Dilshan Lahiru Samanweera and Gayan Sampath Samarasinghe",
                "Karate Captain — G. V. Sashika Rukshan",
                "Karate Vice Captain — Ashan Dimantha Herath"
            ],
            achievements: [
                {
                    competition: "Taekwondo",
                    results: ["Independence Cup Taekwondo Championship 2023 — 1 Silver Medal and 2 Bronze Medals"]
                },
                {
                    competition: "Karate",
                    results: [
                        "10th Commonwealth Karate Championship, Birmingham, England — 2nd Runners-up",
                        "Kanninjuku International Karate Championship — 11 medals",
                        "International Peter Gimo Super Cup Open Karate Championship — 5 Gold, 2 Silver and 1 Bronze Medal",
                        "25th International Open Karate Championships 2022 — 5 Gold Medals"
                    ]
                }
            ],
            schedule: [
                { day: "Tuesday", startTime: "2:00 PM", endTime: "6:00 PM", venue: "NSBM Indoor Stadium", sessionType: "Karate practice" },
                { day: "Wednesday", startTime: "1:00 PM", endTime: "7:00 PM", venue: "NSBM Indoor Stadium", sessionType: "Taekwondo practice" },
                { day: "Thursday", startTime: "2:00 PM", endTime: "6:00 PM", venue: "NSBM Indoor Stadium", sessionType: "Karate practice" },
                { day: "Friday", startTime: "3:00 PM", endTime: "7:00 PM", venue: "NSBM Indoor Stadium", sessionType: "Taekwondo practice" }
            ]
        },
        netball: {
            name: "Netball Club",
            category: "Team sport",
            image: "images/netball.jpg",
            intro: "Formed in 2016, NSBM Netball Club is an active, women-centred club open to undergraduates at all levels.",
            description: [
                "The official profile says the club has grown over the years and creates opportunities for students to develop teamwork, self-esteem, perseverance, discipline and time management.",
                "The club is open to undergraduates at all levels and provides pathways to compete at university and island level. It celebrates the achievements of its performers while aiming to maintain a welcoming environment for NSBM students."
            ],
            activities: ["Develop teamwork, confidence, perseverance, discipline and time management", "Compete at university and island level"],
            facilities: ["Gym area", "Swimming pool", "Sports equipment"],
            staff: ["Ms. Nethmi Udara — FOB", "Ms. Charmain Patrick — FOB"],
            leaders: ["Captain — Malithi Dissanayake", "Vice Captain — Dilmi Sathsarani"],
            achievements: [
                {
                    competition: "Netball results",
                    results: [
                        "U Sports 2022 — 2nd Place",
                        "KDU Leaders Trophy 2017 and 2018 — Runners-up",
                        "CIMA Tournament 2017 — 2nd Runners-up"
                    ]
                }
            ],
            schedule: [
                { day: "Monday", startTime: "2:30 PM", endTime: "5:00 PM", venue: "NSBM Phase 01 Ground", sessionType: "Practice session" },
                { day: "Wednesday", startTime: "2:30 PM", endTime: "5:00 PM", venue: "NSBM Phase 01 Ground", sessionType: "Practice session" },
                { day: "Friday", startTime: "2:30 PM", endTime: "5:00 PM", venue: "NSBM Phase 01 Ground", sessionType: "Practice session" }
            ]
        },
        rugby: {
            name: "Rugby Club",
            category: "Team sport",
            image: "images/rugby.jpg",
            intro: "A competitive club whose published profile emphasizes unity, discipline, determination and physical and mental endurance.",
            description: [
                "The official Rugby page describes unity and discipline as the club’s guiding principles and highlights the physical and mental endurance required by the sport.",
                "The profile recounts tournament success at Mora 7s, ICBT 7s, KDU 10s and the UiTM international sports tournament in Malaysia. It also describes a Mora 7s championship played on 19 February at Havelock Park and a later UiTM cup-stage runners-up finish.",
                "The page encourages determined and passionate players to take part, describing every team member as having a role on the field. Its published competition account uses relative terms such as “this year” and “last year” without a publication date, so those references are retained without assigning a calendar year."
            ],
            activities: ["Rugby training and team play", "Competition participation including Mora 7s, ICBT 7s, KDU 10s and the UiTM international sports tournament"],
            facilities: [],
            staff: [],
            leaders: ["Kasun Wimalasuriya — Captain named in the source profile", "Selaka Molligoda — Deputy named in the source profile"],
            leadershipNote: "The Rugby profile does not state when this captaincy applied; these names may not be the current leaders.",
            achievements: [
                {
                    competition: "Tournament results mentioned on the Rugby profile",
                    results: [
                        "Winners at Mora 7s, ICBT 7s and KDU 10s in the source’s undated “last year” account",
                        "UiTM International Sports Tournament — Bowl champions in the previous-year account; later Cup-stage runners-up",
                        "Mora 7s — Championship on 19 February at Havelock Park; year not specified in the profile"
                    ]
                }
            ],
            schedule: [
                { day: "Monday", startTime: "2:00 PM", endTime: "6:00 PM", venue: "NSBM Phase 02 Ground", sessionType: "Practice session" },
                { day: "Wednesday", startTime: "2:00 PM", endTime: "6:00 PM", venue: "NSBM Phase 02 Ground", sessionType: "Practice session" },
                { day: "Friday", startTime: "2:00 PM", endTime: "6:00 PM", venue: "NSBM Phase 02 Ground", sessionType: "Practice session" }
            ],
            scheduleNote: "Schedule transcribed from the provided 2026 practice schedule image. Confirm details before attending."
        },
        swimming: {
            name: "Swimming Club",
            category: "Individual sport",
            image: "images/swimming.jpg",
            intro: "A swimming community with an international-level pool and facilities, welcoming both experienced swimmers and beginners.",
            description: [
                "The official profile describes the NSBM Swimming Club as a place for aquatic sport and camaraderie, supported by an international-level swimming pool and additional facilities.",
                "The club’s journey began with the NSBM Interuniversity Swimming Championship 2017 (U-Sports). The profile reports that the club became champions at that event and says members continue to pursue excellence through hard work and dedication.",
                "The club welcomes experienced swimmers who wish to compete and beginners who are new to the water, offering a supportive environment for both."
            ],
            activities: ["Swimming for beginners and experienced swimmers", "Inter-university competition"],
            facilities: ["International-level swimming pool", "Additional facilities (not specified in the profile)"],
            staff: [],
            leaders: [],
            achievements: [
                { competition: "NSBM Interuniversity Swimming Championship 2017 (U-Sports)", results: ["Champions"] }
            ],
            schedule: [
                { day: "Tuesday", startTime: "2:30 PM", endTime: "5:00 PM", venue: "NSBM Swimming Pool", sessionType: "Practice session" },
                { day: "Thursday", startTime: "2:30 PM", endTime: "5:00 PM", venue: "NSBM Swimming Pool", sessionType: "Practice session" }
            ]
        },
        "table-tennis": {
            name: "Table Tennis Club",
            category: "Racket sport",
            image: "images/table-tennis.jpg",
            intro: "An active NSBM club since 2017, offering undergraduates opportunities to develop through one of the world’s fastest sports.",
            description: [
                "The official profile describes table tennis as a fast-paced sport requiring fitness and speed. Introduced at NSBM Green University in 2017, the club has provided undergraduates with opportunities to improve hand–eye coordination, reflexes and mental alertness."
            ],
            activities: ["Develop fitness, speed, hand–eye coordination, reflexes and mental alertness"],
            facilities: [],
            staff: ["Ms. Tharani Sooriyaarachchi — FOB", "Mr. Piumal Herath — FOB"],
            leaders: ["Men’s Captain — Hiran Kanchana", "Women’s Captain — Hansani Kapugeekiyanage"],
            achievements: [
                { competition: "U Sports — 2022", results: ["Men’s event — 2nd Place", "Women’s event — 2nd Place", "Mixed event — Champions"] }
            ],
            schedule: [
                { day: "Monday", startTime: "1:00 PM", endTime: "5:00 PM", venue: "NSBM Indoor Stadium", sessionType: "Practice session" },
                { day: "Tuesday", startTime: "1:00 PM", endTime: "5:00 PM", venue: "NSBM Indoor Stadium", sessionType: "Practice session" },
                { day: "Wednesday", startTime: "1:00 PM", endTime: "5:00 PM", venue: "NSBM Indoor Stadium", sessionType: "Practice session" }
            ]
        },
        football: scheduleOnlyClub("Football", "Team sport", "images/football.jpg", [
            { day: "Tuesday", startTime: "3:00 PM", endTime: "6:00 PM", venue: "NSBM Phase 02 Ground", sessionType: "Practice session" },
            { day: "Thursday", startTime: "3:00 PM", endTime: "6:00 PM", venue: "NSBM Phase 02 Ground", sessionType: "Practice session" }
        ]),
        basketball: {
            name: "Basketball Club",
            category: "Team sport",
            image: "images/basketball.jpg",
            intro: "The NSBM Basketball Club brings current students and alumni together through basketball events and competition.",
            description: [
                "The Vice Chancellor’s Challenge Trophy Basketball Tournament 2026 brought the current NSBM Basketball Team and NSBM Alumni Basketball Team together for men’s and women’s matches at the NSBM Recreational Centre on 19 August 2026.",
                "The alumni team won both matches. The tournament celebrated teamwork and sportsmanship and strengthened connections between NSBM’s alumni and current student community."
            ],
            activities: ["Men’s and women’s basketball competition, including events that bring current students and alumni together."],
            facilities: [],
            staff: [],
            leaders: [],
            achievements: [
                {
                    competition: "Vice Chancellor’s Challenge Trophy Basketball Tournament — 2026",
                    results: [
                        "NSBM Alumni Basketball Team — winners in both the Men’s and Women’s matches; the current NSBM Basketball Team also competed.",
                        "Men’s Most Valuable Player — Dinush Jayaweera.",
                        "Women’s Most Valuable Player — Gaganie Silva."
                    ]
                }
            ],
            schedule: [
                { day: "Monday", startTime: "10:00 AM", endTime: "1:30 PM", venue: "NSBM Indoor Stadium", sessionType: "Practice session" },
                { day: "Wednesday", startTime: "10:00 AM", endTime: "1:30 PM", venue: "NSBM Indoor Stadium", sessionType: "Practice session" }
            ],
            articleSource: "https://www.nsbm.ac.lk/nsbm-alumni-basketball-team-clinches-victory-at-vice-chancellors-challenge-trophy-2026/"
        },
        calisthenics: {
            name: "Calisthenics Club",
            category: "Individual sport",
            image: "images/calisthenics.jpg",
            intro: "NSBM describes its Calisthenics Club as the first such club in Sri Lanka’s higher-education landscape, supporting students in bodyweight strength training.",
            description: [
                "Calisthenics uses body weight for resistance. NSBM launched the club to guide students in this fitness discipline and promote physical well-being.",
                "The club trains at a newly built open-air gym with facilities for calisthenics. At NSBM Sports Fiesta 2024, members showcased the discipline and inspired students to pursue fitness."
            ],
            activities: ["Bodyweight strength training and calisthenics practice.", "Showcase performances, including at NSBM Sports Fiesta 2024."],
            facilities: ["Newly built open-air gym equipped for calisthenics training."],
            staff: [],
            leaders: [],
            achievements: [
                {
                    competition: "NSBM Sports Fiesta — 2024",
                    results: ["The club showcased calisthenics and inspired students to pursue their fitness goals."]
                }
            ],
            schedule: [
                { day: "Wednesday", startTime: "1:00 PM", endTime: "5:00 PM", venue: "NSBM Phase 02 Ground (Outdoor Gym)", sessionType: "Practice session" },
                { day: "Friday", startTime: "1:00 PM", endTime: "5:00 PM", venue: "NSBM Phase 02 Ground (Outdoor Gym)", sessionType: "Practice session" }
            ],
            articleSource: "https://www.nsbm.ac.lk/nsbm-launches-the-first-ever-calisthenics-club-in-a-sri-lankan-university/"
        },
        hockey: {
            name: "Hockey Club",
            category: "Team sport",
            image: "images/hockey.jpg",
            intro: "NSBM’s men’s and women’s hockey teams compete in inter-university championships.",
            description: [
                "At the KDU Leaders’ Trophy 2026 Inter-University Sports Championship, NSBM’s Women’s Team finished first runner-up and the Men’s Team finished second runner-up.",
                "The teams demonstrated teamwork and commitment throughout the competition and were guided in their preparation by coach Mr. Shanaka."
            ],
            activities: ["Hockey training and inter-university competition for the men’s and women’s teams."],
            facilities: [],
            staff: ["Coach — Mr. Shanaka"],
            leaders: [],
            achievements: [
                {
                    competition: "KDU Leaders’ Trophy — 2026",
                    results: ["Women’s Team — first runner-up.", "Men’s Team — second runner-up."]
                }
            ],
            schedule: [
                { day: "Tuesday", startTime: "2:00 PM", endTime: "5:00 PM", venue: "NSBM Phase 01 Ground", sessionType: "Practice session" },
                { day: "Thursday", startTime: "2:00 PM", endTime: "5:00 PM", venue: "NSBM Phase 01 Ground", sessionType: "Practice session" }
            ],
            articleSource: "https://www.nsbm.ac.lk/nsbm-hockey-teams-achieve-titles-at-kdu-leaders-trophy-2026/"
        },
        archery: {
            name: "Archery Club",
            category: "Individual sport",
            image: "images/archery.jpg",
            intro: "The NSBM Archery Club introduces undergraduates to archery through workshops and hands-on opportunities.",
            description: [
                "On September 2 (the article does not specify a year), the club hosted a workshop at the Phase 1 grounds to inspire undergraduates to learn archery.",
                "The workshop offered hands-on experience and insights into the sport, and welcomed a group of new members."
            ],
            activities: ["Archery workshop activities, including practical experience for students new to the sport."],
            facilities: [],
            staff: [],
            leaders: [],
            achievements: [
                {
                    competition: "Archery Club workshop — September 2",
                    results: ["Introduced archery to NSBM undergraduates and welcomed new members; the source does not specify the year."]
                }
            ],
            schedule: [
                { day: "Tuesday", startTime: "9:00 AM", endTime: "12:00 PM", venue: "NSBM Phase 01 Ground", sessionType: "Practice session" },
                { day: "Thursday", startTime: "9:00 AM", endTime: "12:00 PM", venue: "NSBM Phase 01 Ground", sessionType: "Practice session" }
            ],
            articleSource: "https://www.nsbm.ac.lk/nsbm-archery-club-hosts-workshop-to-inspire-new-talent/"
        },
        powerlifting: {
            name: "Powerlifting Club",
            category: "Individual sport",
            image: "images/powerlifting.jpg",
            intro: "The NSBM Powerlifting Club competes across weight categories and earned the Overall Runners-Up title at the 2026 Shakthi Powerlifting Championship.",
            description: [
                "At the Shakthi Powerlifting Championship on 26 August 2026, NSBM athletes earned seven medals: three gold, three silver and one bronze, securing Overall Runners-Up.",
                "K.O.K. Perera also set four Junior U23 National Records in the 105 kg category. The club’s results reflect the athletes’ strength, discipline and commitment."
            ],
            activities: ["Powerlifting competition across multiple weight categories."],
            facilities: [],
            staff: [],
            leaders: [],
            achievements: [
                {
                    competition: "Shakthi Powerlifting Championship — 2026",
                    results: [
                        "Overall Runners-Up; seven medals: three Gold, three Silver and one Bronze.",
                        "52 kg — Silver — G.D. Keshala.",
                        "57 kg — Bronze — J.A.N.N. Jayaweera.",
                        "59 kg — Silver — D.A. Samarasinghe.",
                        "74 kg — Silver — H.D.R. Nethsara.",
                        "83 kg — Gold — B.B. Rajapaksha.",
                        "93 kg — Gold — C.V.S. Anthony.",
                        "105 kg — Gold — K.O.K. Perera; four Junior U23 National Records: Squat 256 kg, Bench Press 163 kg, Deadlift 255.5 kg and Total 674.5 kg."
                    ]
                }
            ],
            schedule: [
                { day: "Monday", startTime: "11:30 AM", endTime: "2:30 PM", venue: "NSBM Gymnasium", sessionType: "Practice session" },
                { day: "Tuesday", startTime: "11:30 AM", endTime: "2:30 PM", venue: "NSBM Gymnasium", sessionType: "Practice session" },
                { day: "Wednesday", startTime: "11:30 AM", endTime: "2:30 PM", venue: "NSBM Gymnasium", sessionType: "Practice session" },
                { day: "Friday", startTime: "11:30 AM", endTime: "2:30 PM", venue: "NSBM Gymnasium", sessionType: "Practice session" }
            ],
            articleSource: "https://www.nsbm.ac.lk/nsbm-powerlifting-club-secures-overall-runners-up-at-shakthi-powerlifting-championship-2026/"
        },
        tennis: {
            name: "Tennis Club",
            category: "Racket sport",
            image: "images/tennis.jpg",
            intro: "A tennis initiative announced for 2023 to provide a platform for NSBM players and enthusiasts.",
            description: [
                "The official Tennis Club profile describes the club as an initiative to uplift NSBM Green University’s sporting community. Its stated goal is to provide professional players and tennis enthusiasts at NSBM Green with a platform to showcase their talent, ability and interest."
            ],
            activities: ["A platform for professional tennis players and tennis enthusiasts to showcase their skills and interest"],
            facilities: [],
            staff: ["Mr. P. Thilakarathne — FOC", "Ms. Isuri Caldera — FOB"],
            leaders: ["President / Captain — Kalpa De Silva", "Vice President — Shashan Thissera"],
            achievements: [],
            schedule: [
                { day: "Tuesday", startTime: "4:00 PM", endTime: "6:00 PM", venue: "Tennis court (confirm availability)", sessionType: "Suggested skills and drills" },
                { day: "Thursday", startTime: "4:00 PM", endTime: "6:00 PM", venue: "Tennis court (confirm availability)", sessionType: "Suggested practice and conditioning" },
                { day: "Saturday", startTime: "8:00 AM", endTime: "10:00 AM", venue: "Tennis court (confirm availability)", sessionType: "Suggested match play" }
            ],
            scheduleNote: "Proposed sample schedule for the project, not an official NSBM timetable. Confirm court availability and timings with the university before attending."
        },
        volleyball: {
            name: "Volleyball Club",
            category: "Team sport",
            image: "images/volleyball.jpg",
            intro: "A club focused on helping young athletes develop volleyball skills in a safe environment built around teamwork and sportsmanship.",
            description: [
                "The official profile says the club aims to help young athletes improve at volleyball and learn team spirit and sportsmanship. It encourages the development of skills and techniques needed to compete at a high level, with attention to physical, mental and emotional development.",
                "The club uses sport to teach leadership, teamwork, work ethic, resilience through adversity and success, communication, ethics and loyalty. It also emphasizes the importance of academics and life beyond the court.",
                "Its stated goal is to “Develop Better Players, Better Teams and Better People.”"
            ],
            activities: ["Develop volleyball skills and techniques", "Promote leadership, teamwork, communication, work ethic, resilience, ethics and loyalty", "Support personal and academic development beyond the court"],
            facilities: [],
            staff: ["Ms. V. K. M. Chandima — FOB", "Mr. Praveen Ranaweera — FOB"],
            leaders: [
                "Men’s Captain — Nuwan Jayalath",
                "Men’s Vice Captain — Nimesha Lokuge",
                "Women’s Captain — Heshani Hettige",
                "Women’s Vice Captain — Thakshila Jayathilaka"
            ],
            achievements: [],
            schedule: [
                { day: "Wednesday", startTime: "1:00 PM", endTime: "4:00 PM", venue: "NSBM Phase 01 Ground", sessionType: "Practice session" },
                { day: "Friday", startTime: "3:00 PM", endTime: "5:00 PM", venue: "NSBM Phase 01 Ground", sessionType: "Practice session" }
            ]
        }
    };

    const elements = {
        title: document.querySelector("#club-title"),
        category: document.querySelector("#club-category"),
        intro: document.querySelector("#club-intro"),
        description: document.querySelector("#club-description"),
        activities: document.querySelector("#club-activities"),
        facilities: document.querySelector("#club-facilities"),
        staff: document.querySelector("#club-staff"),
        leaders: document.querySelector("#club-leaders"),
        leadershipNote: document.querySelector("#leadership-note"),
        achievements: document.querySelector("#club-achievements"),
        schedule: document.querySelector("#club-schedule"),
        scheduleAnnouncement: document.querySelector("#schedule-announcement"),
        scheduleTableWrap: document.querySelector("#schedule-table-wrap"),
        scheduleNote: document.querySelector("#schedule-note"),
        sourceTitle: document.querySelector("#source-notice-title"),
        sourceNote: document.querySelector("#club-source-note"),
        sourceLink: document.querySelector("#club-source-link"),
        image: document.querySelector("#club-image"),
        imageCaption: document.querySelector("#club-image-caption"),
        currentYear: document.querySelector("#current-year")
    };

    function appendParagraphs(container, paragraphs) {
        container.replaceChildren();
        paragraphs.forEach(function (text) {
            const paragraph = document.createElement("p");
            paragraph.textContent = text;
            container.append(paragraph);
        });
    }

    function appendList(container, items, className) {
        const list = document.createElement("ul");
        list.className = className;
        items.forEach(function (text) {
            const item = document.createElement("li");
            item.textContent = text;
            list.append(item);
        });
        container.replaceChildren(list);
    }

    function renderSchedule(sessions) {
        elements.schedule.replaceChildren();

        if (sessions.length === 0) {
            elements.scheduleAnnouncement.hidden = false;
            elements.scheduleTableWrap.hidden = true;
            return;
        }

        sessions.forEach(function (session) {
            const row = document.createElement("tr");
            [
                session.day,
                session.startTime || "Not listed",
                session.endTime || "Not listed",
                session.venue || "Not specified",
                session.sessionType || "Not specified"
            ].forEach(function (value) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.append(cell);
            });
            elements.schedule.append(row);
        });

        elements.scheduleAnnouncement.hidden = true;
        elements.scheduleTableWrap.hidden = false;
    }

    function renderClub(club) {
        elements.title.textContent = club.name;
        elements.category.textContent = club.category.toLocaleUpperCase();
        elements.intro.textContent = club.intro;
        elements.sourceTitle.textContent = club.articleSource ? "Official NSBM article" : (club.sourceNote ? "Schedule data source" : "Official club information");
        elements.sourceNote.textContent = club.articleSource
            ? "Club details are summarized from the linked NSBM article. The training schedule is transcribed separately from the provided 2026 practice schedule image; confirm details before attending."
            : (club.sourceNote || "Club information is summarized from the official NSBM Sports Clubs pages. No external link is required to view these details.");
        elements.sourceLink.hidden = !club.articleSource;
        if (club.articleSource) {
            elements.sourceLink.href = club.articleSource;
        }
        appendParagraphs(elements.description, club.description);
        appendList(elements.activities, club.activities, "detail-list");
        appendList(elements.facilities, club.facilities, "detail-list");
        appendList(elements.staff, club.staff, "people-list__items");
        appendList(elements.leaders, club.leaders, "people-list__items");
        elements.leadershipNote.textContent = club.leadershipNote || "";
        elements.leadershipNote.hidden = !club.leadershipNote;
        elements.achievements.replaceChildren();

        club.achievements.forEach(function (achievement) {
            const group = document.createElement("article");
            const heading = document.createElement("h3");
            const results = document.createElement("ul");
            heading.textContent = achievement.competition;
            results.className = "detail-list";
            achievement.results.forEach(function (text) {
                const item = document.createElement("li");
                item.textContent = text;
                results.append(item);
            });
            group.append(heading, results);
            elements.achievements.append(group);
        });

        document.querySelector("#activities-section").hidden = club.activities.length === 0;
        document.querySelector("#facilities-section").hidden = club.facilities.length === 0;
        document.querySelector("#staff-section").hidden = club.staff.length === 0;
        document.querySelector("#leaders-section").hidden = club.leaders.length === 0;
        document.querySelector("#achievements-section").hidden = club.achievements.length === 0;
        renderSchedule(club.schedule);
        elements.scheduleNote.textContent = club.scheduleNote || (club.schedule.length ? "Schedule transcribed from the provided 2026 practice schedule image. Confirm details before attending." : "");
        elements.scheduleNote.hidden = !elements.scheduleNote.textContent;
        elements.image.src = club.image;
        elements.image.alt = club.name + " project image; not an official NSBM photograph";
        elements.imageCaption.textContent = "Project image; not represented as official NSBM photography.";
        document.querySelector("#join-title").textContent = "Interested in " + club.name + "?";
        document.title = club.name + " | NSBM SportsHub";
    }

    function showUnavailableClub() {
        elements.title.textContent = "Club details unavailable";
        elements.category.textContent = "CLUB DETAILS";
        elements.intro.textContent = "This club does not have information configured in this prototype yet.";
        document.querySelector(".details-layout").hidden = true;
        document.querySelector(".source-notice").hidden = true;
        document.querySelector(".club-hero__image").hidden = true;
        document.querySelector(".join-banner").hidden = true;
        document.querySelector(".primary-nav .button").hidden = true;
        document.querySelector(".site-footer__contact p").textContent = "Club information is not configured for this club yet.";
        document.title = "Club Details Unavailable | NSBM SportsHub";
    }

    const clubId = new URLSearchParams(window.location.search).get("id");
    const club = clubId ? clubs[clubId.toLocaleLowerCase()] : null;

    if (club) {
        renderClub(club);
    } else {
        showUnavailableClub();
    }

    elements.currentYear.textContent = String(new Date().getFullYear());
});
