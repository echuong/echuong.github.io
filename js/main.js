/* ========================================
   CHUONG LAB — GENOME INVADERS
   Main JavaScript
   ======================================== */

(function () {
    'use strict';

    // --- Member Bio Data ---
    const memberData = {
        'ed-chuong': {
            name: 'Edward Chuong',
            pronouns: 'he/his',
            role: 'Principal Investigator \u2022 Associate Professor',
            details: 'BioFrontiers \u2022 MCDB \u2022 CRI STAR Investigator \u2022 Kavli Fellow \u2022 Packard Fellow \u2022 Sloan Fellow',
            photo: 'images/headshots/ed_chuong.jpg',
            email: 'edward.chuong@colorado.edu',
            bio: 'Ed grew up in sunny Southern California, and studied Bioinformatics at the University of California, San Diego from 2003\u20132007. There, he worked with Dr. Hopi Hoekstra exploring the evolution of genes involved in maternal-fetal genetic conflict. He next pursued a PhD at Stanford University from 2007\u20132013, in the lab of Dr. Julie Baker. There, he discovered that ancient retroviruses were a major source of regulatory elements in the placenta, potentially facilitating the evolution of pregnancy in mammals. Caught by the transposon bug, he did a postdoc at the University of Utah, co-advised by Dr. Nels Elde and Dr. C\u00e9dric Feschotte. His work revealed that endogenous retroviruses have been co-opted to act as regulatory elements in primate immune responses. In 2018, he joined the BioFrontiers Institute to start a research group focusing on the evolution of gene regulatory networks in human health and disease. In his free time, Ed enjoys cooking, hiking, skiing, and canyoneering.'
        },
        'giulia-pasquesi': {
            name: 'Giulia Pasquesi',
            pronouns: 'she/hers',
            role: 'Postdoc \u2022 Sie Foundation Fellow \u2022 NIH K99',
            details: 'BioFrontiers \u2022 PhD U. Texas Arlington \u2022 MS/BS U. Pisa',
            photo: 'images/headshots/giulia_pasquesi.jpg',
            email: 'giulia.pasquesi@colorado.edu',
            bio: 'Giulia was born and raised in Milan (northern Italy). In 2008 she moved to Tuscany to study ethology and neurobiology (BS), and then population and conservation genetics (MS). In 2015 she left Italy to join Todd Castoe\'s snake genomics lab in Texas. Under his mentorship, Giulia focused on the characterization of transposable elements in squamate reptiles to understand broad patterns of vertebrate genome evolution. While working on the dissertation, Giulia found her true scientific call: to work on TEs in respect to their relationships with the host. In Ed\'s lab she has been combining wet and dry lab techniques to study the role of TE-derived alternative peptide isoforms in host-pathogen evolutionary arms-races. Since joining the lab, Giulia has also found another call: road bike hill climb, which she combines with running, skiing, and pole dancing when not playing computer games or reading.'
        },
        'holly-allen': {
            name: 'Holly Allen',
            pronouns: 'she/hers',
            role: 'Lab Manager / Staff Scientist',
            details: 'BioFrontiers \u2022 PhD U. Manchester \u2022 MS/BS U. Sheffield',
            photo: 'images/headshots/holly_allen.jpg',
            email: 'holly.allen@colorado.edu',
            bio: 'Holly grew up in the suburbs of London, UK, but spent most of her adult life in the North of England. She received an undergraduate and a master\'s degree in Biology from the University of Sheffield, where she studied the symbiosis between fungi and wheat. She completed a PhD in Plant Sciences from the University of Manchester, where she studied the molecular mechanisms responsible for the symptoms of a disease in apple trees. After her PhD, she worked as a postdoc with Ying Gu at Penn State University, where she studied the trafficking of protein complexes during cellulose synthesis. She joined the Chuong lab in June 2022 as lab manager, where she helps run the wet lab and assists in various research projects. Outside of the lab, she enjoys hiking, cooking, playing board games, and cycling.'
        },
        'atma-ivancevic': {
            name: 'Atma Ivancevic',
            pronouns: 'she/hers',
            role: 'Research Associate',
            details: 'BioFrontiers \u2022 PhD U. Adelaide \u2022 BS U. Adelaide',
            photo: 'images/headshots/atma_ivancevic.jpg',
            email: 'atma.ivancevic@colorado.edu',
            bio: 'Atma was born in Serbia but raised by the sandy beaches of South Australia. Her scientific career began at the University of Adelaide, where she completed an undergraduate degree in applied maths and genetics, and a PhD in computational biology. Following her PhD, she moved into medical research, studying the genetic basis of neurological disorders as a bioinformatician at the Adelaide Medical School. In late 2018, Atma moved to the US for a computational postdoc position in the Chuong lab, where she currently investigates the role of endogenous retroviruses and other transposable elements in gene dysregulation and cancer progression. In her spare time, she enjoys hiking, biking and swimming.'
        },
        'lynn-sanford': {
            name: 'Lynn Sanford',
            pronouns: 'she/they',
            role: 'Research Staff',
            details: 'BioFrontiers \u2022 PhD CU Boulder \u2022 BA Pomona College',
            photo: 'images/headshots/lynn_sanford.jpg',
            email: 'lynn.sanford@colorado.edu',
            bio: 'Lynn was born and raised in Colorado before heading to California to earn her B.A. from Pomona College in 2009. She began her research career at Oregon Health and Science University studying the role of metals in neurodegenerative disorders, work she continued as a graduate student in Amy Palmer\'s lab at CU Boulder, where she investigated zinc signaling in hippocampal neurons. After defending in 2019, she stayed at CU but pivoted to fully computational postdoctoral work with Robin Dowell, focusing on enhancers and transcriptional regulation. Lynn joined the Chuong Lab in August 2025, where she is leveraging public datasets to study how transposable elements act as regulatory switches in cancer. Outside of the lab, she enjoys reading, writing, gaming, and going on adventures with her family.'
        },
        'mia-chaw': {
            name: 'Mia Chaw',
            pronouns: 'she/hers',
            role: 'Professional Research Assistant',
            details: 'BioFrontiers \u2022 BA MCDB & Anthropology, CU Boulder',
            photo: 'images/headshots/mia_chaw.jpg',
            email: '',
            bio: 'Mia was born and raised in Denver, Colorado. A love of great apes and fascination with archaic hominids developed into a passion for evolution and genetics, leading her to pursue her Bachelor of Arts in Molecular, Cellular, and Developmental Biology (MCDB) and Anthropology. She completed her undergraduate research and honors thesis in Dr. Fernando Villanea\'s lab, using computational genetics to investigate Neanderthal and Denisovan introgression in Indigenous American populations. After graduating in May 2025, she spent ten weeks in Dr. Aaron Johnson\'s lab at CU Anschutz studying histone methylation in EZH2 mutants, before joining the Chuong Lab as a Professional Research Assistant. In her spare time, Mia loves cats, science fiction, rock climbing, painting, watching movies, reading, and trying new restaurants.'
        },
        'olivia-joyner': {
            name: 'Olivia Joyner',
            pronouns: 'she/hers',
            role: 'Graduate Student \u2022 MCDB',
            details: 'BS Biotechnology, Cal State San Marcos \u2022 AS MiraCosta College',
            photo: 'images/headshots/olivia_joyner.jpg',
            email: 'olivia.delletorri@colorado.edu',
            bio: 'Olivia is a California native who has a passion for outreach and inclusivity. She received her AS degree in Biotechnology at MiraCosta College in 2018 and BS degree in Biotechnology at the California State University, San Marcos in 2021. Her background includes stem cell research, with an emphasis in hippocampal neuron development, and yeast strain engineering, including the synthesis of carotenoids and cannabinoids. Olivia joined the Chuong Lab in Summer of 2022 as a PhD student in the Molecular, Cellular, and Developmental Biology Department. Her project looks at how transposable elements and repeat expansions contribute as non-coding regulatory elements in human disease. She also seeks to be more inclusive of underrepresented racial backgrounds in genomic analyses. In her spare time, she enjoys painting, yoga, roller skating, slack-lining and hiking.'
        },
        'andrea-ordonez': {
            name: 'Andrea Ordonez',
            pronouns: 'she/hers',
            role: 'Graduate Student \u2022 MCDB',
            details: 'MSc Imperial College London \u2022 BA UC Berkeley',
            photo: 'images/headshots/andrea_ordonez.jpg',
            email: 'andrea.ordonez@colorado.edu',
            bio: 'Andrea was born and raised in Quito, Ecuador, where she was inspired by the ecological and human diversity that surrounded her to pursue the study of molecular biology and genetics. She graduated in 2015 with a BA in Molecular and Cellular Biology from the University of California, Berkeley. This led to a year of research in metastatic breast cancer at UCSF in Dr. John Park\'s lab. She then pursued an MSc in Human Molecular Genetics at Imperial College London from 2018\u20132019 and carried out her master\'s thesis project at The Francis Crick Institute in Dr. Robin Lovell-Badge\'s lab. She is currently working on using RNAseq data to find candidates of novel receptor isoforms, formed from transposition events, with the potential to modulate the immune response. Outside the lab, Andrea loves to travel, experience new cultures and flavors, and scuba dive.'
        },
        'jimmy-pazzanese': {
            name: 'James (Jimmy) Pazzanese Jr',
            pronouns: 'he/his',
            role: 'Graduate Student \u2022 MCDB',
            details: 'BS Genetics, U. New Hampshire',
            photo: 'images/headshots/jimmy_pazzanese.png',
            email: 'james.pazzanesejr@colorado.edu',
            bio: 'Jimmy was born in Boston, Massachusetts, and raised in Frederick, Maryland. His passion for genetics emerged during high school, leading him to pursue a Bachelor of Science in Genetics at the University of New Hampshire. During his time at UNH, he conducted research on microbes that degrade barnacle glue post-mortem. Graduating amid the challenges of a global pandemic, Jimmy joined NOVAVAX Inc., where he spent three years engineering recombinant antibodies and SARS-CoV-2 spike proteins as part of the Vaccine Development team. He joined the Chuong lab in the summer of 2024 as a PhD student. His research focuses on identifying and characterizing alternatively spliced isoforms, particularly those containing transposable elements. Outside the lab, Jimmy enjoys hiking with his dog Cassie, camping, playing volleyball and basketball, and spending quality time with friends.'
        },
        'carolina-valderrama': {
            name: 'Carolina Valderrama Hincapie',
            pronouns: 'she/her',
            role: 'Graduate Student \u2022 MCDB/IQ Bio',
            details: 'Co-advised with Kasinath lab \u2022 BS Biology, U. New Mexico',
            photo: 'images/headshots/carolina_valderrama.jpg',
            email: 'carolina.valderramahincapie@colorado.edu',
            bio: 'Carolina was born in Bogota, Colombia, where she grew up and lived until she moved to the US to pursue her interests in becoming a researcher. She completed her Bachelor of Science in Biology at the University of New Mexico, Albuquerque, where she was studying insect-microbe interactions in agricultural pests. She is currently a PhD student in the MCDB program at CU, co-advised between the Chuong lab and the Kasinath lab. Her project focuses on understanding how chromatin remodeler proteins interact at the molecular level, and how disruptions in their function can affect normal cellular processes, contribute to disease, and influence the activity of transposable elements. She uses a combination of biochemical, genomic and computational approaches. Outside the lab, Carolina enjoys going on hikes, solving sudoku puzzles and cooking.'
        },
        'ashley-agyepong': {
            name: 'Ashley Agyepong',
            pronouns: '',
            role: 'Undergraduate \u2022 Boettcher Scholar \u2022 MCDB',
            details: 'MCDB major \u2022 French minor',
            photo: 'images/headshots/ashley_agyepong.jpg',
            email: 'ashley.agyepong@colorado.edu',
            bio: 'Ashley was born and raised in Aurora, Colorado with her parents and two brothers. She is currently pursuing a Bachelor in MCDB with a minor in French. One of her biggest passions is connecting science to social equity & justice and improving scientific communication with marginalized communities. She hopes to achieve this by going into the medical field. She also loves baking, crocheting, and watching movies.'
        }
    };

    // --- Mobile nav toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // --- Active nav highlighting on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    function highlightNav() {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navAnchors.forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === '#' + id) {
                        a.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', highlightNav, { passive: true });

    // --- Space Invader Sprites in Hero ---
    const field = document.getElementById('invaders-field');
    if (field) {
        createInvaders(field);
    }

    function createInvaders(container) {
        const colors = ['#e94560', '#00d4ff', '#16c79a', '#f5f749', '#a855f7'];
        const patterns = [
            [[0,1,0,0,0,1,0],[0,0,1,0,1,0,0],[0,1,1,1,1,1,0],[1,1,0,1,0,1,1],[1,1,1,1,1,1,1],[0,1,0,0,0,1,0]],
            [[0,0,1,0,1,0,0],[0,0,0,1,0,0,0],[0,1,1,1,1,1,0],[1,1,0,1,0,1,1],[1,1,1,1,1,1,1],[0,0,1,0,1,0,0]],
            [[0,0,0,1,0,0,0],[0,0,1,1,1,0,0],[0,1,1,1,1,1,0],[1,1,0,1,0,1,1],[1,1,1,1,1,1,1],[0,1,0,0,0,1,0]],
        ];

        const pixelSize = 4;
        const invaderCount = 36;
        const containerWidth = container.offsetWidth || window.innerWidth;

        for (let i = 0; i < invaderCount; i++) {
            const pattern = patterns[i % patterns.length];
            const color = colors[i % colors.length];
            const canvas = document.createElement('canvas');
            const cols = pattern[0].length;
            const rows = pattern.length;
            canvas.width = cols * pixelSize;
            canvas.height = rows * pixelSize;
            canvas.className = 'invader-sprite';

            const ctx = canvas.getContext('2d');
            ctx.fillStyle = color;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (pattern[r][c]) {
                        ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
                    }
                }
            }

            const x = Math.random() * (containerWidth - canvas.width);
            const y = Math.random() * 160;
            canvas.style.left = x + 'px';
            canvas.style.top = y + 'px';
            canvas.style.animationDelay = (Math.random() * 5) + 's';
            canvas.style.animationDuration = (6 + Math.random() * 4) + 's';
            canvas.style.opacity = (0.3 + Math.random() * 0.4).toString();

            container.appendChild(canvas);
        }
    }

    // --- Smooth scroll for all anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Team Member Modal ---
    const modal = document.getElementById('member-modal');
    const modalOverlay = modal ? modal.querySelector('.modal-overlay') : null;
    const modalClose = modal ? modal.querySelector('.modal-close') : null;

    function openModal(memberId) {
        const data = memberData[memberId];
        if (!data || !modal) return;

        document.getElementById('modal-photo').src = data.photo;
        document.getElementById('modal-photo').alt = data.name;

        const nameEl = document.getElementById('modal-name');
        if (data.pronouns) {
            nameEl.innerHTML = data.name + ' <span class="modal-pronouns">(' + data.pronouns + ')</span>';
        } else {
            nameEl.textContent = data.name;
        }

        document.getElementById('modal-role').textContent = data.role;

        // Show details line if available
        let detailsEl = document.getElementById('modal-details');
        if (!detailsEl) {
            detailsEl = document.createElement('span');
            detailsEl.id = 'modal-details';
            detailsEl.className = 'modal-details';
            document.getElementById('modal-role').after(detailsEl);
        }
        if (data.details) {
            detailsEl.textContent = data.details;
            detailsEl.style.display = 'block';
        } else {
            detailsEl.style.display = 'none';
        }

        document.getElementById('modal-bio').textContent = data.bio;

        const emailLink = document.getElementById('modal-email');
        if (data.email) {
            emailLink.href = 'mailto:' + data.email;
            emailLink.textContent = data.email;
            emailLink.style.display = 'inline-block';
        } else {
            emailLink.style.display = 'none';
        }

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Attach click handlers to team cards
    document.querySelectorAll('.team-card[data-member]').forEach(card => {
        card.addEventListener('click', () => {
            openModal(card.dataset.member);
        });
    });

    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });

    // --- Scrolling Genome Background Animation ---
    const genomeBg = document.getElementById('genome-bg');
    if (genomeBg) {
        const ctx = genomeBg.getContext('2d');
        let W, H;
        let chromosomes = [];
        let invaders = [];

        function resize() {
            W = window.innerWidth;
            H = window.innerHeight;
            genomeBg.width = W;
            genomeBg.height = H;
            generateChromosomes();
            generateInvaders();
        }

        function generateChromosomes() {
            chromosomes = [];
            const count = Math.max(3, Math.floor(W / 300));
            for (let i = 0; i < count; i++) {
                const x = (W / (count + 1)) * (i + 1) + (Math.random() - 0.5) * 80;
                const h = H * (0.4 + Math.random() * 0.3);
                const y = H * 0.15 + Math.random() * H * 0.2;
                const w = 30 + Math.random() * 20;
                const bands = Math.floor(6 + Math.random() * 8);
                chromosomes.push({ x, y, w, h, bands });
            }
        }

        function generateInvaders() {
            invaders = [];
            const colors = ['#e94560', '#00d4ff', '#16c79a', '#f5f749', '#a855f7'];
            const count = 55 + Math.floor(Math.random() * 25);
            for (let i = 0; i < count; i++) {
                // Each invader starts floating freely and has a target landing spot on a chromosome
                const chromo = chromosomes[Math.floor(Math.random() * chromosomes.length)];
                const landX = chromo.x + (Math.random() - 0.5) * chromo.w * 0.8;
                const landY = chromo.y + Math.random() * chromo.h;

                invaders.push({
                    startX: Math.random() * W,
                    startY: Math.random() * H,
                    landX,
                    landY,
                    size: 3 + Math.random() * 3,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    floatPhase: Math.random() * Math.PI * 2,
                    floatSpeed: 0.5 + Math.random() * 1.5,
                    landPhase: Math.random() * 0.65, // each invader starts landing at a different scroll point
                });
            }
        }

        function drawFrame() {
            ctx.clearRect(0, 0, W, H);

            const scrollMax = document.body.scrollHeight - H;
            const progress = Math.min(1, window.scrollY / Math.max(1, scrollMax));

            // Draw chromosomes — get more visible as you scroll
            const chromoAlpha = 0.04 + progress * 0.10;
            chromosomes.forEach(chr => {
                // Main chromosome body
                ctx.fillStyle = `rgba(233, 69, 96, ${chromoAlpha})`;
                const r = chr.w / 2;
                ctx.beginPath();
                ctx.moveTo(chr.x - r, chr.y + r);
                ctx.lineTo(chr.x - r, chr.y + chr.h - r);
                ctx.quadraticCurveTo(chr.x - r, chr.y + chr.h, chr.x, chr.y + chr.h);
                ctx.quadraticCurveTo(chr.x + r, chr.y + chr.h, chr.x + r, chr.y + chr.h - r);
                ctx.lineTo(chr.x + r, chr.y + r);
                ctx.quadraticCurveTo(chr.x + r, chr.y, chr.x, chr.y);
                ctx.quadraticCurveTo(chr.x - r, chr.y, chr.x - r, chr.y + r);
                ctx.fill();

                // Banding pattern
                const bandH = chr.h / chr.bands;
                for (let b = 0; b < chr.bands; b++) {
                    if (b % 2 === 0) {
                        ctx.fillStyle = `rgba(0, 212, 255, ${chromoAlpha * 0.5})`;
                        ctx.fillRect(chr.x - r + 2, chr.y + b * bandH, chr.w - 4, bandH * 0.6);
                    }
                }
            });

            // Draw invaders — interpolate from floating to landed based on scroll
            const time = Date.now() / 1000;
            invaders.forEach((inv, idx) => {
                // Each invader has its own landing threshold — they land progressively
                const landStart = inv.landPhase; // 0..0.6 — when this invader starts landing
                const landEnd = landStart + 0.35; // takes 35% of scroll to fully land
                const rawT = Math.min(1, Math.max(0, (progress - landStart) / (landEnd - landStart)));
                const ease = rawT * rawT * (3 - 2 * rawT); // smoothstep

                // Float wobble (decreases as they land)
                const wobbleX = Math.sin(time * inv.floatSpeed + inv.floatPhase) * 15 * (1 - ease);
                const wobbleY = Math.cos(time * inv.floatSpeed * 0.7 + inv.floatPhase) * 10 * (1 - ease);

                const x = inv.startX + (inv.landX - inv.startX) * ease + wobbleX;
                const y = inv.startY + (inv.landY - inv.startY) * ease + wobbleY;

                // Alpha: dim when floating, glow when landed
                const alpha = 0.15 + ease * 0.35;

                // Draw a tiny pixel invader shape
                const s = inv.size;
                ctx.fillStyle = inv.color;
                ctx.globalAlpha = alpha;

                // Simple 3x3 invader silhouette
                ctx.fillRect(x - s, y - s, s, s);
                ctx.fillRect(x + s, y - s, s, s);
                ctx.fillRect(x, y, s, s);
                ctx.fillRect(x - s, y + s, s, s);
                ctx.fillRect(x + s, y + s, s, s);

                // Glow when landed
                if (ease > 0.7) {
                    ctx.shadowColor = inv.color;
                    ctx.shadowBlur = 6 * (ease - 0.7) / 0.3;
                    ctx.fillRect(x, y, s, s);
                    ctx.shadowBlur = 0;
                }

                ctx.globalAlpha = 1;
            });

            requestAnimationFrame(drawFrame);
        }

        window.addEventListener('resize', resize);
        resize();
        drawFrame();
    }

})();
