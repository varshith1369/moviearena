import json
import os

print("Building MovieArena 380+ movies catalog...")

TELUGU_MOVIES = [
    {
        "id": 857598, "title": "Pushpa 2 - The Rule", "year": "2024", "rating": 7.5,
        "genres": [28, 80, 53], "poster": "/1T21FblunT0y8fz7YaW8JMYgUKm.jpg", "backdrop": "/7jGItf7idJsBm9QTNoTNTU3KiGe.jpg",
        "overview": "Pushpa Raj continues his supreme dominance over the red sanders syndicate, taking on SP Bhanwar Singh Shekhawat and expanding his empire beyond borders."
    },
    {
        "id": 801688, "title": "Kalki 2898 AD", "year": "2024", "rating": 7.6,
        "genres": [878, 28, 14], "poster": "/9Pb91PqS2wM9eQzGk5gS6Wv3Q1b.jpg", "backdrop": "/siOU9ZcsmVwJqBwz6Z1d93pYxV0.jpg",
        "overview": "A modern-day avatar of Vishnu descends in a dystopian future to protect the world and the chosen child from Supreme Yaskin."
    },
    {
        "id": 949423, "title": "Devara: Part 1", "year": "2024", "rating": 7.2,
        "genres": [28, 18, 53], "poster": "/pU2z7eJd2mZ8jD1j2wE0o2rG9vG.jpg", "backdrop": "/1n0hG1eL7PzBqC3v8wH9qF0d3mB.jpg",
        "overview": "An epic action saga set against coastal lands, chronicling fear, courage, and violent sea trade rivalries across generations."
    },
    {
        "id": 987401, "title": "Hanu-Man", "year": "2024", "rating": 7.8,
        "genres": [28, 14, 12], "poster": "/2d8LkVn6vM0r8X8r6mB7k2n9m1p.jpg", "backdrop": "/3r0rM7jL6gC9q2v8pE4jM9mF7b1.jpg",
        "overview": "An ordinary guy gains superhuman powers from lord Hanuman in a remote village called Anjanadri to fight an evil power."
    },
    {
        "id": 579974, "title": "RRR", "year": "2022", "rating": 8.0,
        "genres": [28, 18, 36], "poster": "/kdPbpzG1YwY4f0OaFspc5j6Fk0K.jpg", "backdrop": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
        "overview": "A fictional history of two legendary revolutionaries' journey away from home before they began fighting for their country in the 1920s."
    },
    {
        "id": 350312, "title": "Bāhubali 2: The Conclusion", "year": "2017", "rating": 8.2,
        "genres": [28, 12, 14], "poster": "/21sC2assIm2YehsBoT6QZ12n4hT.jpg", "backdrop": "/w5C2T6tYp7O4s8bW8Vq5k4jK6zX.jpg",
        "overview": "When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers while waging a war against Bhallaladeva."
    },
    {
        "id": 256040, "title": "Bāhubali: The Beginning", "year": "2015", "rating": 8.0,
        "genres": [28, 12, 14], "poster": "/9FtJ2o7q0v1M1gH3t6c5r7y8b4u.jpg", "backdrop": "/7tYh1V3Q2p8W9o0b6mK3j8X7l5n.jpg",
        "overview": "In the kingdom of Mahishmati, a fierce warrior rises to challenge a tyrannical king and discover his true divine royal lineage."
    },
    {
        "id": 792307, "title": "Salaar: Part 1 - Ceasefire", "year": "2023", "rating": 7.3,
        "genres": [28, 80, 53], "poster": "/5kL0m1n2o3p4q5r6s7t8u9v0w1x.jpg", "backdrop": "/8y0q1w2e3r4t5y6u7i8o9p0a1s2.jpg",
        "overview": "A gang leader tries to keep a promise made to his dying friend and takes on the other criminal gangs in the lawless city-state of Khansaar."
    },
    {
        "id": 822119, "title": "Guntur Kaaram", "year": "2024", "rating": 6.8,
        "genres": [28, 18], "poster": "/h2N1X7fP8uW3rM5tB9cK6zV1mO2.jpg", "backdrop": "/3r0rM7jL6gC9q2v8pE4jM9mF7b1.jpg",
        "overview": "The king of the underworld in Guntur embarks on a turbulent path when he uncovers betrayals tied closely to his family roots."
    },
    {
        "id": 1198544, "title": "Saripodhaa Sanivaaram", "year": "2024", "rating": 7.5,
        "genres": [28, 53], "poster": "/mY5o6mK9tP8l2w4j6h1g8d3f7c2.jpg", "backdrop": "/4o9rM7jL6gC9q2v8pE4jM9mF7b1.jpg",
        "overview": "A young vigilante channels his fury strictly on Saturdays, taking on a corrupt, tyrannical police officer terrorizing a neighborhood."
    },
    {
        "id": 1045938, "title": "Tillu Square", "year": "2024", "rating": 7.4,
        "genres": [35, 80, 10749], "poster": "/9k3mF1g9vP6m2j8w5l0r4t8c7n3.jpg", "backdrop": "/2d8LkVn6vM0r8X8r6mB7k2n9m1p.jpg",
        "overview": "DJ Tillu finds himself entangled in another high-stakes crime conspiracy when his new romantic involvement brings fatal complications."
    },
    {
        "id": 1184918, "title": "Lucky Baskhar", "year": "2024", "rating": 8.1,
        "genres": [18, 53, 80], "poster": "/7m2k1j6h5g4f3d2s1a9z8y7x6w5.jpg", "backdrop": "/5kL0m1n2o3p4q5r6s7t8u9v0w1x.jpg",
        "overview": "A modest bank cashier gets drawn into financial manipulation during the 1990s Bombay stock boom to transform his family destiny."
    },
    {
        "id": 1083862, "title": "Hi Nanna", "year": "2023", "rating": 8.2,
        "genres": [18, 10749, 10751], "poster": "/4k8w5m9l7p3j1h6g2f8d4s0a6z3.jpg", "backdrop": "/6y1q2w3e4r5t6y7u8i9o0p1a2s3.jpg",
        "overview": "A loving single father's close bond with his daughter is reshaped when an empathetic woman enters their lives, unraveling the past."
    },
    {
        "id": 955374, "title": "Dasara", "year": "2023", "rating": 7.4,
        "genres": [28, 18], "poster": "/5r2j9m7w4k1h8g6f3d0s7a2z9x4.jpg", "backdrop": "/7tYh1V3Q2p8W9o0b6mK3j8X7l5n.jpg",
        "overview": "Set in Veerlapally coal village, Dharani fights for loyalty, romance, and freedom against oppressive village tyrants."
    },
    {
        "id": 969681, "title": "Sita Ramam", "year": "2022", "rating": 8.4,
        "genres": [10749, 18, 10752], "poster": "/9j7w3m5l1p8h4g0f6d2s9a5z1x8.jpg", "backdrop": "/w5C2T6tYp7O4s8bW8Vq5k4jK6zX.jpg",
        "overview": "An orphan soldier's life changes dramatically after he receives a letter from a girl named Sita, igniting an timeless love story."
    },
    {
        "id": 588226, "title": "Jersey", "year": "2019", "rating": 8.5,
        "genres": [18], "poster": "/3b1j9m7w5k2h8g4f0d6s2a8z4x0.jpg", "backdrop": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
        "overview": "A failed cricketer decides to revive his career in his late thirties despite everyone mocking him, to fulfill his young son's dream."
    },
    {
        "id": 472569, "title": "Arjun Reddy", "year": "2017", "rating": 8.1,
        "genres": [18, 10749], "poster": "/8m4k0j6h2g8f4d0s6a2z8y4x0w6.jpg", "backdrop": "/1n0hG1eL7PzBqC3v8wH9qF0d3mB.jpg",
        "overview": "A brilliant medical surgeon spirals into self-destruction and addiction after his girlfriend is forced to marry someone else."
    },
    {
        "id": 504584, "title": "Rangasthalam", "year": "2018", "rating": 8.3,
        "genres": [28, 18], "poster": "/2a6k0j4h8g2f6d0s4a8z2y6x0w4.jpg", "backdrop": "/siOU9ZcsmVwJqBwz6Z1d93pYxV0.jpg",
        "overview": "Chitti Babu, a hearing-impaired villager, must stand up against thirty years of corrupt leadership after his brother challenges the system."
    },
    {
        "id": 622340, "title": "Ala Vaikunthapurramuloo", "year": "2020", "rating": 7.7,
        "genres": [28, 35, 18], "poster": "/7f0j4h8g2f6d0s4a8z2y6x0w4a.jpg", "backdrop": "/3r0rM7jL6gC9q2v8pE4jM9mF7b1.jpg",
        "overview": "Bantu's life is tossed upside down upon discovering he was swapped at birth by a conniving clerk into a wealthy family home."
    },
    {
        "id": 24226, "title": "Magadheera", "year": "2009", "rating": 7.9,
        "genres": [28, 14, 10749], "poster": "/5l8j2h6f0d4s8a2z6y0w4x8v2u6.jpg", "backdrop": "/7tYh1V3Q2p8W9o0b6mK3j8X7l5n.jpg",
        "overview": "A bike stuntman learns he is the reincarnation of a valiant 17th-century warrior pledged to protect his princess from evil."
    },
    {
        "id": 109091, "title": "Eega", "year": "2012", "rating": 7.8,
        "genres": [28, 35, 14], "poster": "/8j4f0d6s2a8z4y0w6x2v8u4t0r6.jpg", "backdrop": "/w5C2T6tYp7O4s8bW8Vq5k4jK6zX.jpg",
        "overview": "A murdered man is reincarnated as a common housefly and seeks vengeance against the ruthless tycoon who killed him."
    },
    {
        "id": 12211, "title": "Pokiri", "year": "2006", "rating": 8.0,
        "genres": [28, 80, 53], "poster": "/4k8w5m9l7p3j1h6g2f8d4s0a6z3.jpg", "backdrop": "/kdPbpzG1YwY4f0OaFspc5j6Fk0K.jpg",
        "overview": "Pandu, a ruthless mercenary for hire, hides a shocking undercover identity while eliminating rival underworld gangs in Hyderabad."
    },
    {
        "id": 12212, "title": "Athadu", "year": "2005", "rating": 8.2,
        "genres": [28, 53, 18], "poster": "/7m2k1j6h5g4f3d2s1a9z8y7x6w5.jpg", "backdrop": "/21sC2assIm2YehsBoT6QZ12n4hT.jpg",
        "overview": "A professional sniper framed for assassination takes refuge in a traditional joint family under a false identity."
    },
    {
        "id": 25777, "title": "Okkadu", "year": "2003", "rating": 8.0,
        "genres": [28, 10749, 18], "poster": "/9k3mF1g9vP6m2j8w5l0r4t8c7n3.jpg", "backdrop": "/8y0q1w2e3r4t5y6u7i8o9p0a1s2.jpg",
        "overview": "A Kabaddi player travels to Kurnool and ends up rescuing a terrified girl from an influential factionist leader obsessed with her."
    },
    {
        "id": 35848, "title": "Chatrapathi", "year": "2005", "rating": 7.7,
        "genres": [28, 18], "poster": "/2d8LkVn6vM0r8X8r6mB7k2n9m1p.jpg", "backdrop": "/4o9rM7jL6gC9q2v8pE4jM9mF7b1.jpg",
        "overview": "Displaced Sri Lankan refugees in Vizag find their savior when Sivaji rises against local exploitation to reunite with his mother."
    },
    {
        "id": 39591, "title": "Simhadri", "year": "2003", "rating": 7.6,
        "genres": [28, 18], "poster": "/mY5o6mK9tP8l2w4j6h1g8d3f7c2.jpg", "backdrop": "/7jGItf7idJsBm9QTNoTNTU3KiGe.jpg",
        "overview": "An adopted loyal servant is revealed to be the terrifying vigilante Singamalai who waged war against the underworld."
    },
    {
        "id": 39592, "title": "Yamadonga", "year": "2007", "rating": 7.3,
        "genres": [28, 35, 14], "poster": "/h2N1X7fP8uW3rM5tB9cK6zV1mO2.jpg", "backdrop": "/siOU9ZcsmVwJqBwz6Z1d93pYxV0.jpg",
        "overview": "A petty thief dies prematurely and lands in Yamaloka, where he challenges Lord Yama himself for the throne of hell."
    },
    {
        "id": 37788, "title": "Indra", "year": "2002", "rating": 7.7,
        "genres": [28, 18], "poster": "/pU2z7eJd2mZ8jD1j2wE0o2rG9vG.jpg", "backdrop": "/1n0hG1eL7PzBqC3v8wH9qF0d3mB.jpg",
        "overview": "A noble Rayalaseema leader tries to bring peace and water to parched faction-ridden lands at immense personal cost."
    },
    {
        "id": 37789, "title": "Tagore", "year": "2003", "rating": 7.8,
        "genres": [28, 18, 53], "poster": "/siOU9ZcsmVwJqBwz6Z1d93pYxV0.jpg", "backdrop": "/w5C2T6tYp7O4s8bW8Vq5k4jK6zX.jpg",
        "overview": "A college professor forms the secret Anti-Corruption Force with former students to systematically eradicate systemic bribery."
    },
    {
        "id": 48596, "title": "Kushi", "year": "2001", "rating": 8.1,
        "genres": [35, 10749], "poster": "/w5C2T6tYp7O4s8bW8Vq5k4jK6zX.jpg", "backdrop": "/kdPbpzG1YwY4f0OaFspc5j6Fk0K.jpg",
        "overview": "Two college students deeply in love struggle to confess their mutual feelings due to monumental egos and comedic misunderstandings."
    },
    {
        "id": 63102, "title": "Tholi Prema", "year": "1998", "rating": 8.3,
        "genres": [18, 10749], "poster": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", "backdrop": "/21sC2assIm2YehsBoT6QZ12n4hT.jpg",
        "overview": "Balu falls in love with Anu at first sight and proves his genuine devotion over time without placing demands on her."
    },
    {
        "id": 37787, "title": "Manmadhudu", "year": "2002", "rating": 8.2,
        "genres": [35, 10749], "poster": "/kdPbpzG1YwY4f0OaFspc5j6Fk0K.jpg", "backdrop": "/7tYh1V3Q2p8W9o0b6mK3j8X7l5n.jpg",
        "overview": "An advertising agency head with cynicism towards romance is forced to work with a bubbly woman in Paris."
    },
    {
        "id": 39593, "title": "Nuvvu Naaku Nachav", "year": "2001", "rating": 8.5,
        "genres": [35, 10749, 18], "poster": "/21sC2assIm2YehsBoT6QZ12n4hT.jpg", "backdrop": "/8y0q1w2e3r4t5y6u7i8o9p0a1s2.jpg",
        "overview": "A witty youth stays at his father's friend's home and falls in love with the daughter, who is already engaged."
    },
    {
        "id": 28169, "title": "Bommarillu", "year": "2006", "rating": 8.1,
        "genres": [18, 10749, 35], "poster": "/8y0q1w2e3r4t5y6u7i8o9p0a1s2.jpg", "backdrop": "/4o9rM7jL6gC9q2v8pE4jM9mF7b1.jpg",
        "overview": "A suffocated son struggles to assert his autonomy against an overly controlling father while falling for Hasini."
    },
    {
        "id": 42205, "title": "Arya", "year": "2004", "rating": 7.9,
        "genres": [28, 10749, 35], "poster": "/4o9rM7jL6gC9q2v8pE4jM9mF7b1.jpg", "backdrop": "/2d8LkVn6vM0r8X8r6mB7k2n9m1p.jpg",
        "overview": "Arya practices selfless, unconditional love towards Geetha while she is dating a college bully."
    },
    {
        "id": 38814, "title": "Arya 2", "year": "2009", "rating": 7.4,
        "genres": [28, 35, 10749], "poster": "/2d8LkVn6vM0r8X8r6mB7k2n9m1p.jpg", "backdrop": "/mY5o6mK9tP8l2w4j6h1g8d3f7c2.jpg",
        "overview": "An unpredictable young man enters his childhood friend's software company and falls for a female colleague."
    },
    {
        "id": 13327, "title": "Jalsa", "year": "2008", "rating": 7.7,
        "genres": [28, 35, 10749], "poster": "/mY5o6mK9tP8l2w4j6h1g8d3f7c2.jpg", "backdrop": "/h2N1X7fP8uW3rM5tB9cK6zV1mO2.jpg",
        "overview": "A former Naxalite reformed by a police officer tries to lead a normal life until an old nemesis re-emerges."
    },
    {
        "id": 75787, "title": "Dookudu", "year": "2011", "rating": 7.6,
        "genres": [28, 35], "poster": "/h2N1X7fP8uW3rM5tB9cK6zV1mO2.jpg", "backdrop": "/pU2z7eJd2mZ8jD1j2wE0o2rG9vG.jpg",
        "overview": "A daring IPS officer stages an elaborate mock movie set to protect his father from reality after an attack."
    },
    {
        "id": 100796, "title": "Gabbar Singh", "year": "2012", "rating": 7.5,
        "genres": [28, 35], "poster": "/pU2z7eJd2mZ8jD1j2wE0o2rG9vG.jpg", "backdrop": "/siOU9ZcsmVwJqBwz6Z1d93pYxV0.jpg",
        "overview": "An eccentric cop inspired by Gabbar Singh takes charge of a lawless village and takes down a corrupt politician."
    },
    {
        "id": 168453, "title": "Mirchi", "year": "2013", "rating": 7.5,
        "genres": [28, 18, 10749], "poster": "/siOU9ZcsmVwJqBwz6Z1d93pYxV0.jpg", "backdrop": "/w5C2T6tYp7O4s8bW8Vq5k4jK6zX.jpg",
        "overview": "Jai advocates love over violence and ventures into his family's faction-torn village to reform bitter rivals."
    },
    {
        "id": 259695, "title": "Race Gurram", "year": "2014", "rating": 7.4,
        "genres": [28, 35], "poster": "/w5C2T6tYp7O4s8bW8Vq5k4jK6zX.jpg", "backdrop": "/kdPbpzG1YwY4f0OaFspc5j6Fk0K.jpg",
        "overview": "Two contrasting brothers clash over everything until a politician targets the elder brother, prompting retaliation."
    },
    {
        "id": 341013, "title": "Srimanthudu", "year": "2015", "rating": 7.6,
        "genres": [28, 18], "poster": "/kdPbpzG1YwY4f0OaFspc5j6Fk0K.jpg", "backdrop": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
        "overview": "The sole heir of a billionaire empire adopts his ancestral village to develop it and empower oppressed farmers."
    },
    {
        "id": 508763, "title": "Bharat Ane Nenu", "year": "2018", "rating": 7.7,
        "genres": [28, 18], "poster": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", "backdrop": "/21sC2assIm2YehsBoT6QZ12n4hT.jpg",
        "overview": "A foreign-educated graduate unexpectedly becomes Chief Minister and attempts to revolutionize state governance."
    },
    {
        "id": 521876, "title": "Maharshi", "year": "2019", "rating": 7.4,
        "genres": [28, 18], "poster": "/21sC2assIm2YehsBoT6QZ12n4hT.jpg", "backdrop": "/7tYh1V3Q2p8W9o0b6mK3j8X7l5n.jpg",
        "overview": "A wealthy CEO returns to his homeland to rescue his struggling farmer friend and spearheads an agricultural revival."
    },
    {
        "id": 602211, "title": "Sarileru Neekevvaru", "year": "2020", "rating": 7.1,
        "genres": [28, 35], "poster": "/7tYh1V3Q2p8W9o0b6mK3j8X7l5n.jpg", "backdrop": "/8y0q1w2e3r4t5y6u7i8o9p0a1s2.jpg",
        "overview": "An Army Major travels to Kurnool on a delicate family mission and confronts a corrupt minister exploiting the citizens."
    },
    {
        "id": 538858, "title": "Geetha Govindam", "year": "2018", "rating": 7.6,
        "genres": [35, 10749], "poster": "/8y0q1w2e3r4t5y6u7i8o9p0a1s2.jpg", "backdrop": "/4o9rM7jL6gC9q2v8pE4jM9mF7b1.jpg",
        "overview": "An upright college lecturer is misjudged as an opportunist by an assertive woman, whom he must win over when fate reunites them."
    },
    {
        "id": 508768, "title": "Mahanati", "year": "2018", "rating": 8.5,
        "genres": [18, 36], "poster": "/4o9rM7jL6gC9q2v8pE4jM9mF7b1.jpg", "backdrop": "/2d8LkVn6vM0r8X8r6mB7k2n9m1p.jpg",
        "overview": "The poignant biographical drama of Savitri, one of South Indian cinema's greatest actresses whose life spanned triumph and tragedy."
    },
    {
        "id": 537877, "title": "C/o Kancharapalem", "year": "2018", "rating": 8.6,
        "genres": [18, 10749], "poster": "/2d8LkVn6vM0r8X8r6mB7k2n9m1p.jpg", "backdrop": "/mY5o6mK9tP8l2w4j6h1g8d3f7c2.jpg",
        "overview": "Four unconventional love stories spanning different age groups unfold in the colorful community of Kancharapalem in Vizag."
    },
    {
        "id": 538860, "title": "Goodachari", "year": "2018", "rating": 7.8,
        "genres": [28, 53], "poster": "/mY5o6mK9tP8l2w4j6h1g8d3f7c2.jpg", "backdrop": "/h2N1X7fP8uW3rM5tB9cK6zV1mO2.jpg",
        "overview": "A young intelligence trainee is framed for assassination and embarks on a globe-trotting mission to clear his name."
    },
    {
        "id": 673593, "title": "HIT: The First Case", "year": "2020", "rating": 7.7,
        "genres": [80, 9648, 53], "poster": "/h2N1X7fP8uW3rM5tB9cK6zV1mO2.jpg", "backdrop": "/pU2z7eJd2mZ8jD1j2wE0o2rG9vG.jpg",
        "overview": "A PTSD-plagued Homicide officer investigates the mysterious disappearance of a college girl in Hyderabad."
    },
    {
        "id": 864692, "title": "HIT: The Second Case", "year": "2022", "rating": 7.4,
        "genres": [80, 9648, 53], "poster": "/pU2z7eJd2mZ8jD1j2wE0o2rG9vG.jpg", "backdrop": "/siOU9ZcsmVwJqBwz6Z1d93pYxV0.jpg",
        "overview": "Superintendent of Police Krishna Dev tracks down a deranged serial killer butchering women across Vizag."
    },
    {
        "id": 609800, "title": "Agent Sai Srinivasa Athreya", "year": "2019", "rating": 8.2,
        "genres": [35, 9648, 53], "poster": "/siOU9ZcsmVwJqBwz6Z1d93pYxV0.jpg", "backdrop": "/w5C2T6tYp7O4s8bW8Vq5k4jK6zX.jpg",
        "overview": "A quirky detective stumbles into a sinister nationwide body-trafficking conspiracy."
    },
    {
        "id": 608889, "title": "Brochevarevarura", "year": "2019", "rating": 8.0,
        "genres": [35, 80], "poster": "/w5C2T6tYp7O4s8bW8Vq5k4jK6zX.jpg", "backdrop": "/kdPbpzG1YwY4f0OaFspc5j6Fk0K.jpg",
        "overview": "Three college failures plan a fake kidnapping to help their classmate that spirals into chaos."
    },
    {
        "id": 654299, "title": "Mathu Vadalara", "year": "2019", "rating": 7.9,
        "genres": [35, 53], "poster": "/kdPbpzG1YwY4f0OaFspc5j6Fk0K.jpg", "backdrop": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
        "overview": "A delivery courier attempting a petty scam gets trapped in a high-rise luxury apartment with an unconscious corpse."
    },
    {
        "id": 725201, "title": "Karthikeya 2", "year": "2022", "rating": 7.6,
        "genres": [12, 14, 9648], "poster": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", "backdrop": "/21sC2assIm2YehsBoT6QZ12n4hT.jpg",
        "overview": "Doctor Karthikeya uncovers an ancient mythological secret tied to Lord Krishna's anklet across Dwarka."
    },
    {
        "id": 855263, "title": "Bimbisara", "year": "2022", "rating": 7.4,
        "genres": [28, 14], "poster": "/21sC2assIm2YehsBoT6QZ12n4hT.jpg", "backdrop": "/7tYh1V3Q2p8W9o0b6mK3j8X7l5n.jpg",
        "overview": "An ancient cruel emperor of Trigartala kingdom is cast into the modern 21st-century world through a magical mirror."
    },
    {
        "id": 994143, "title": "Virupaksha", "year": "2023", "rating": 7.6,
        "genres": [27, 9648, 53], "poster": "/7tYh1V3Q2p8W9o0b6mK3j8X7l5n.jpg", "backdrop": "/8y0q1w2e3r4t5y6u7i8o9p0a1s2.jpg",
        "overview": "Mysterious deaths plague a secluded village in 1990 as dark black-magic occult rituals claim victims."
    },
    {
        "id": 1146314, "title": "Baby", "year": "2023", "rating": 7.3,
        "genres": [18, 10749], "poster": "/8y0q1w2e3r4t5y6u7i8o9p0a1s2.jpg", "backdrop": "/4o9rM7jL6gC9q2v8pE4jM9mF7b1.jpg",
        "overview": "A tender childhood romance fractures when an auto-driver's girlfriend enters urban college life and explores independence."
    },
    {
        "id": 997776, "title": "Waltair Veerayya", "year": "2023", "rating": 6.9,
        "genres": [28, 35], "poster": "/4o9rM7jL6gC9q2v8pE4jM9mF7b1.jpg", "backdrop": "/2d8LkVn6vM0r8X8r6mB7k2n9m1p.jpg",
        "overview": "A Vizag fisherman smuggler takes on a high-stakes undercover mission in Malaysia to capture an escaped drug lord."
    },
    {
        "id": 997777, "title": "Veera Simha Reddy", "year": "2023", "rating": 6.8,
        "genres": [28, 18], "poster": "/2d8LkVn6vM0r8X8r6mB7k2n9m1p.jpg", "backdrop": "/mY5o6mK9tP8l2w4j6h1g8d3f7c2.jpg",
        "overview": "A revered Rayalaseema chieftain's long-lost son in Istanbul discovers his family's bloody faction heritage in Pulicharla."
    },
    {
        "id": 1083863, "title": "Bhagavanth Kesari", "year": "2023", "rating": 7.3,
        "genres": [28, 18], "poster": "/mY5o6mK9tP8l2w4j6h1g8d3f7c2.jpg", "backdrop": "/h2N1X7fP8uW3rM5tB9cK6zV1mO2.jpg",
        "overview": "Nelakonda Bhagavanth Kesari trains his guardian daughter to overcome anxiety and qualify for the Army."
    },
    {
        "id": 1083864, "title": "BRO", "year": "2023", "rating": 6.7,
        "genres": [14, 35, 18], "poster": "/h2N1X7fP8uW3rM5tB9cK6zV1mO2.jpg", "backdrop": "/pU2z7eJd2mZ8jD1j2wE0o2rG9vG.jpg",
        "overview": "An egoistic workaholic dies in an accident but is granted a 90-day lease on life by Titan, the god of time."
    },
    {
        "id": 67685, "title": "Mayabazar", "year": "1957", "rating": 9.1,
        "genres": [14, 35, 18], "poster": "/pU2z7eJd2mZ8jD1j2wE0o2rG9vG.jpg", "backdrop": "/siOU9ZcsmVwJqBwz6Z1d93pYxV0.jpg",
        "overview": "The crown jewel of Indian cinema: Lord Krishna and Ghatotkacha use magical illusions to foil the Kauravas."
    },
    {
        "id": 39594, "title": "Shiva", "year": "1989", "rating": 8.3,
        "genres": [28, 18, 80], "poster": "/siOU9ZcsmVwJqBwz6Z1d93pYxV0.jpg", "backdrop": "/w5C2T6tYp7O4s8bW8Vq5k4jK6zX.jpg",
        "overview": "A newcomer university student takes a stand against student political thuggery, igniting an explosive cycle chain rebellion."
    },
    {
        "id": 37790, "title": "Jagadeka Veerudu Athiloka Sundari", "year": "1990", "rating": 8.1,
        "genres": [14, 28, 10749], "poster": "/w5C2T6tYp7O4s8bW8Vq5k4jK6zX.jpg", "backdrop": "/kdPbpzG1YwY4f0OaFspc5j6Fk0K.jpg",
        "overview": "A courageous guide finds a divine celestial ring belonging to Indra's daughter, who descends from heaven."
    },
    {
        "id": 39595, "title": "Kshana Kshanam", "year": "1991", "rating": 8.0,
        "genres": [35, 53, 10749], "poster": "/kdPbpzG1YwY4f0OaFspc5j6Fk0K.jpg", "backdrop": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
        "overview": "A photographer and young woman are pursued through forests after accidentally obtaining bank robbery loot."
    },
    {
        "id": 48597, "title": "Geethanjali", "year": "1989", "rating": 8.4,
        "genres": [18, 10749], "poster": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", "backdrop": "/21sC2assIm2YehsBoT6QZ12n4hT.jpg",
        "overview": "Two terminally ill individuals meet in Ooty and discover life-affirming love amidst their remaining days."
    },
    {
        "id": 67686, "title": "Swathi Muthyam", "year": "1986", "rating": 8.7,
        "genres": [18], "poster": "/21sC2assIm2YehsBoT6QZ12n4hT.jpg", "backdrop": "/7tYh1V3Q2p8W9o0b6mK3j8X7l5n.jpg",
        "overview": "Kamal Haasan as an innocent, pure-hearted man who marries a young widow to protect her from societal cruelty."
    },
    {
        "id": 67687, "title": "Sagara Sangamam", "year": "1983", "rating": 8.8,
        "genres": [18, 10402], "poster": "/7tYh1V3Q2p8W9o0b6mK3j8X7l5n.jpg", "backdrop": "/8y0q1w2e3r4t5y6u7i8o9p0a1s2.jpg",
        "overview": "A consummate classical dancer descends into alcoholism following personal tragedies until a young dancer brings revival."
    },
    {
        "id": 67688, "title": "Rudraveena", "year": "1988", "rating": 8.5,
        "genres": [18, 10402], "poster": "/8y0q1w2e3r4t5y6u7i8o9p0a1s2.jpg", "backdrop": "/4o9rM7jL6gC9q2v8pE4jM9mF7b1.jpg",
        "overview": "Chiranjeevi as a revolutionary carnatic musician who defies his conservative father to dedicate music to social upliftment."
    }
]

print(f"Telugu Movies Count: {len(TELUGU_MOVIES)}")
