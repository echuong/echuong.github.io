/* ============================================
   BioSearch - Scientific Dataset Search App
   ============================================ */

(function () {
    'use strict';

    // --- Configuration ---
    const EUTILS_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
    const TOOL_NAME = 'biosearch_webapp';
    const TOOL_EMAIL = 'biosearch@example.com';

    // --- DOM Elements ---
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const statusSection = document.getElementById('status-section');
    const statusText = document.getElementById('status-text');
    const summarySection = document.getElementById('summary-section');
    const summaryText = document.getElementById('summary-text');
    const clearBtn = document.getElementById('clear-btn');
    const resultsSection = document.getElementById('results-section');
    const resultsList = document.getElementById('results-list');
    const resultsTabs = document.getElementById('results-tabs');
    const emptyState = document.getElementById('empty-state');
    const sraCount = document.getElementById('sra-count');
    const gdsCount = document.getElementById('gds-count');
    const gapCount = document.getElementById('gap-count');
    const maxResultsSelect = document.getElementById('max-results');
    const sortOrderSelect = document.getElementById('sort-order');

    // --- State ---
    let allResults = [];
    let activeTab = 'all';
    let activeAssay = '';
    let activeOrganism = '';
    let activeDatabases = new Set(['sra', 'gds', 'gap']);
    let currentAbortController = null;

    // --- Initialize ---
    function init() {
        searchForm.addEventListener('submit', handleSearch);
        clearBtn.addEventListener('click', clearResults);

        // Database filter chips (toggle)
        document.querySelectorAll('#db-filters .chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const db = chip.dataset.db;
                chip.classList.toggle('active');
                if (activeDatabases.has(db)) {
                    activeDatabases.delete(db);
                } else {
                    activeDatabases.add(db);
                }
                // Ensure at least one is selected
                if (activeDatabases.size === 0) {
                    activeDatabases.add(db);
                    chip.classList.add('active');
                }
            });
        });

        // Assay filter chips (single select)
        document.querySelectorAll('#assay-filters .chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('#assay-filters .chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                activeAssay = chip.dataset.assay;
            });
        });

        // Organism filter chips (single select)
        document.querySelectorAll('#organism-filters .chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('#organism-filters .chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                activeOrganism = chip.dataset.organism;
            });
        });

        // Tabs
        resultsTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.tab');
            if (!tab) return;
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeTab = tab.dataset.tab;
            renderResults();
        });

        // Example search chips
        document.querySelectorAll('.example-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                searchInput.value = chip.dataset.query;
                searchForm.dispatchEvent(new Event('submit'));
            });
        });
    }

    // --- Search Handler ---
    async function handleSearch(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;

        // Abort any in-flight requests
        if (currentAbortController) {
            currentAbortController.abort();
        }
        currentAbortController = new AbortController();

        const retmax = parseInt(maxResultsSelect.value, 10);
        const sort = sortOrderSelect.value === 'date' ? 'pub+date' : 'relevance';

        // Reset UI
        allResults = [];
        activeTab = 'all';
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelector('.tab[data-tab="all"]').classList.add('active');
        showStatus('Searching databases...');
        hideElement(summarySection);
        hideElement(resultsSection);
        hideElement(emptyState);

        const databases = Array.from(activeDatabases);
        const searchPromises = databases.map(db =>
            searchDatabase(db, query, retmax, sort, currentAbortController.signal)
        );

        const results = await Promise.allSettled(searchPromises);

        // Check if aborted
        if (currentAbortController.signal.aborted) return;

        hideStatus();

        // Collect results
        let totalFound = 0;
        let sraResults = [];
        let gdsResults = [];
        let gapResults = [];

        results.forEach((result, i) => {
            const db = databases[i];
            if (result.status === 'fulfilled' && result.value) {
                const items = result.value;
                items.forEach(item => item._db = db);
                if (db === 'sra') sraResults = items;
                else if (db === 'gds') gdsResults = items;
                else if (db === 'gap') gapResults = items;
                totalFound += items.length;
            } else if (result.status === 'rejected') {
                const errMsg = result.reason?.message || 'Unknown error';
                if (errMsg !== 'The user aborted a request.') {
                    console.error(`Error searching ${db}:`, result.reason);
                    allResults.push({
                        _db: db,
                        _error: true,
                        _errorMessage: errMsg
                    });
                }
            }
        });

        allResults = [...sraResults, ...gdsResults, ...gapResults, ...allResults.filter(r => r._error)];

        // Update counts
        sraCount.textContent = sraResults.length;
        gdsCount.textContent = gdsResults.length;
        gapCount.textContent = gapResults.length;

        if (totalFound > 0 || allResults.some(r => r._error)) {
            summaryText.textContent = `Found ${totalFound} result${totalFound !== 1 ? 's' : ''} for "${query}"`;
            showElement(summarySection);
            showElement(resultsSection);
            renderResults();
        } else {
            showElement(emptyState);
            emptyState.querySelector('.empty-content').innerHTML = `
                <div class="empty-icon">&#x1F50D;</div>
                <h2>No results found</h2>
                <p>No datasets matched your search for "<strong>${escapeHtml(query)}</strong>". Try broadening your search or changing filters.</p>
            `;
        }
    }

    // --- NCBI API Calls ---
    async function searchDatabase(db, query, retmax, sort, signal) {
        // Build the search query with filters
        let term = buildQuery(db, query);

        // Step 1: ESearch to get IDs
        const searchUrl = `${EUTILS_BASE}/esearch.fcgi?db=${db}&term=${encodeURIComponent(term)}&retmax=${retmax}&sort=${sort}&retmode=json&tool=${TOOL_NAME}&email=${TOOL_EMAIL}&usehistory=y`;

        const searchResp = await fetch(searchUrl, { signal });
        if (!searchResp.ok) throw new Error(`HTTP ${searchResp.status} from esearch (${db})`);
        const searchData = await searchResp.json();

        const idList = searchData?.esearchresult?.idlist;
        if (!idList || idList.length === 0) return [];

        // Step 2: ESummary to get details
        const ids = idList.join(',');
        const summaryUrl = `${EUTILS_BASE}/esummary.fcgi?db=${db}&id=${ids}&retmode=json&tool=${TOOL_NAME}&email=${TOOL_EMAIL}`;

        const summaryResp = await fetch(summaryUrl, { signal });
        if (!summaryResp.ok) throw new Error(`HTTP ${summaryResp.status} from esummary (${db})`);
        const summaryData = await summaryResp.json();

        const uids = summaryData?.result?.uids;
        if (!uids) return [];

        return uids.map(uid => {
            const doc = summaryData.result[uid];
            return parseRecord(db, uid, doc);
        }).filter(Boolean);
    }

    // --- Query Builder ---
    function buildQuery(db, rawQuery) {
        let parts = [rawQuery];

        if (activeOrganism) {
            parts.push(`"${activeOrganism}"[Organism]`);
        }

        if (db === 'sra' && activeAssay) {
            // Map common assay names to SRA strategy terms
            const assayMap = {
                'rna seq': '"rna seq"[Strategy]',
                'atac seq': '"atac seq"[Strategy]',
                'chip seq': '"chip seq"[Strategy]',
                'wgs': '"wgs"[Strategy]',
                'wxs': '"wxs"[Strategy]',
                'scrna seq': '"rna seq"[Strategy] AND "single cell"',
                'bisulfite seq': '"bisulfite seq"[Strategy]',
                'hi-c': '"hi-c"[Strategy]'
            };
            if (assayMap[activeAssay]) {
                parts.push(assayMap[activeAssay]);
            }
        }

        if (db === 'gds') {
            // Restrict to Series entries (most useful)
            parts.push('GSE[ETYP]');
            // Add assay as text search for GEO
            if (activeAssay) {
                const geoAssayMap = {
                    'rna seq': 'RNA-seq',
                    'atac seq': 'ATAC-seq',
                    'chip seq': 'ChIP-seq',
                    'wgs': 'whole genome sequencing',
                    'wxs': 'exome sequencing',
                    'scrna seq': 'single cell RNA-seq',
                    'bisulfite seq': 'bisulfite sequencing',
                    'hi-c': 'Hi-C'
                };
                if (geoAssayMap[activeAssay]) {
                    parts.push(`"${geoAssayMap[activeAssay]}"`);
                }
            }
        }

        if (db === 'gap' && activeAssay) {
            const gapAssayMap = {
                'rna seq': 'RNA-seq',
                'atac seq': 'ATAC-seq',
                'chip seq': 'ChIP-seq',
                'wgs': 'whole genome sequencing',
                'wxs': 'exome',
                'scrna seq': 'single cell',
                'bisulfite seq': 'methylation',
                'hi-c': 'Hi-C'
            };
            if (gapAssayMap[activeAssay]) {
                parts.push(gapAssayMap[activeAssay]);
            }
        }

        return parts.join(' AND ');
    }

    // --- Record Parsers ---
    function parseRecord(db, uid, doc) {
        if (!doc || doc.error) return null;

        if (db === 'sra') return parseSraRecord(uid, doc);
        if (db === 'gds') return parseGeoRecord(uid, doc);
        if (db === 'gap') return parseGapRecord(uid, doc);
        return null;
    }

    function parseSraRecord(uid, doc) {
        // SRA esummary embeds XML in expxml and runs fields
        const expXml = doc.expxml || '';
        const runsXml = doc.runs || '';

        const title = extractXmlTag(expXml, 'Title') || 'Untitled';
        const organism = extractXmlAttr(expXml, 'Organism', 'ScientificName') || '';
        const platform = extractXmlAttr(expXml, 'Platform', 'instrument_model') || extractXmlTag(expXml, 'Platform') || '';
        const strategy = extractXmlTag(expXml, 'Library_descriptor', 'LIBRARY_STRATEGY') || extractXmlTag(expXml, 'LIBRARY_STRATEGY') || '';
        const bioproject = extractXmlAttr(expXml, 'Bioproject', 'id') || extractXmlContent(expXml, 'Bioproject') || '';
        const studyAcc = extractXmlAttr(expXml, 'Study', 'acc') || '';
        const experimentAcc = extractXmlAttr(expXml, 'Experiment', 'acc') || '';
        const createDate = doc.createdate || '';

        // Parse runs to get total run count and accessions
        const runAccessions = [];
        const runMatches = runsXml.match(/acc="([^"]+)"/g);
        if (runMatches) {
            runMatches.forEach(m => {
                const acc = m.match(/acc="([^"]+)"/);
                if (acc) runAccessions.push(acc[1]);
            });
        }

        // Try to extract sample count from runs
        const totalRuns = runAccessions.length;
        const totalBases = extractXmlAttr(runsXml, 'Run', 'total_bases') || '';

        return {
            _db: 'sra',
            uid,
            title,
            accession: experimentAcc || studyAcc,
            studyAccession: studyAcc,
            bioproject,
            organism,
            platform,
            strategy,
            date: createDate,
            runCount: totalRuns,
            description: title,
            links: buildSraLinks(studyAcc, experimentAcc, bioproject)
        };
    }

    function parseGeoRecord(uid, doc) {
        const title = doc.title || 'Untitled';
        const summary = doc.summary || '';
        const accession = doc.accession || '';
        const gpl = doc.gpl || '';
        const gdsType = doc.gdstype || '';
        const taxon = doc.taxon || '';
        const entryType = doc.entrytype || '';
        const nSamples = doc.n_samples || 0;
        const pdat = doc.pdat || '';

        // For pubmed IDs
        const pubmedIds = doc.pubmedids || [];

        return {
            _db: 'gds',
            uid,
            title,
            accession,
            description: summary,
            organism: taxon,
            platform: gpl ? `GPL${gpl}` : '',
            dataType: gdsType,
            entryType,
            sampleCount: nSamples,
            date: pdat,
            pubmedIds,
            links: buildGeoLinks(accession, pubmedIds)
        };
    }

    function parseGapRecord(uid, doc) {
        const title = doc.d_title || doc.study_name || 'Untitled';
        const description = doc.d_description || doc.description || '';
        const studyAcc = doc.study_accession_version || doc.d_study_id || '';
        const disease = doc.d_disease_list || doc.disease || '';
        const nSubjects = doc.d_num_subjects || '';
        const nAnalyses = doc.d_num_analyses || '';
        const nVariables = doc.d_num_variables || '';
        const createDate = doc.d_create_date || doc.create_date || '';

        return {
            _db: 'gap',
            uid,
            title,
            accession: studyAcc,
            description: description || title,
            disease,
            subjectCount: nSubjects,
            analysisCount: nAnalyses,
            variableCount: nVariables,
            date: createDate,
            links: buildGapLinks(studyAcc, uid)
        };
    }

    // --- Link Builders ---
    function buildSraLinks(studyAcc, experimentAcc, bioproject) {
        const links = [];
        if (experimentAcc) {
            links.push({ label: 'SRA Experiment', url: `https://www.ncbi.nlm.nih.gov/sra/${experimentAcc}`, icon: 'external' });
        }
        if (studyAcc) {
            links.push({ label: 'SRA Study', url: `https://www.ncbi.nlm.nih.gov/sra/?term=${studyAcc}`, icon: 'external' });
        }
        if (bioproject) {
            links.push({ label: 'BioProject', url: `https://www.ncbi.nlm.nih.gov/bioproject/${bioproject}`, icon: 'external' });
        }
        if (studyAcc || experimentAcc) {
            const acc = studyAcc || experimentAcc;
            links.push({ label: 'Find Paper', url: `https://pubmed.ncbi.nlm.nih.gov/?term=${acc}`, icon: 'paper' });
        }
        return links;
    }

    function buildGeoLinks(accession, pubmedIds) {
        const links = [];
        if (accession) {
            links.push({ label: 'GEO Record', url: `https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${accession}`, icon: 'external' });
        }
        if (pubmedIds && pubmedIds.length > 0) {
            pubmedIds.forEach(pmid => {
                links.push({ label: `PubMed ${pmid}`, url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`, icon: 'paper' });
            });
        }
        if (accession) {
            links.push({ label: 'Download', url: `https://www.ncbi.nlm.nih.gov/geo/download/?acc=${accession}`, icon: 'download' });
        }
        return links;
    }

    function buildGapLinks(studyAcc, uid) {
        const links = [];
        if (studyAcc) {
            const baseAcc = studyAcc.split('.')[0];
            links.push({ label: 'dbGaP Study', url: `https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=${baseAcc}`, icon: 'external' });
        }
        links.push({ label: 'Entrez Record', url: `https://www.ncbi.nlm.nih.gov/gap/?term=${uid}[uid]`, icon: 'external' });
        if (studyAcc) {
            const baseAcc = studyAcc.split('.')[0];
            links.push({ label: 'Find Paper', url: `https://pubmed.ncbi.nlm.nih.gov/?term=${baseAcc}`, icon: 'paper' });
        }
        return links;
    }

    // --- XML Helpers (for SRA's embedded XML) ---
    function extractXmlTag(xml, ...tagNames) {
        // Search through nested tags
        for (const tag of tagNames) {
            const match = xml.match(new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, 'i'));
            if (match) return match[1].trim();
        }
        // Try the last tag name as a simple content extraction
        const lastTag = tagNames[tagNames.length - 1];
        const match = xml.match(new RegExp(`<${lastTag}[^>]*>([^<]*)<`, 'i'));
        if (match) return match[1].trim();
        return '';
    }

    function extractXmlAttr(xml, tag, attr) {
        const match = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i'));
        return match ? match[1].trim() : '';
    }

    function extractXmlContent(xml, tag) {
        const match = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i'));
        return match ? match[1].trim() : '';
    }

    // --- Rendering ---
    function renderResults() {
        resultsList.innerHTML = '';

        const filtered = activeTab === 'all'
            ? allResults
            : allResults.filter(r => r._db === activeTab);

        if (filtered.length === 0) {
            resultsList.innerHTML = `
                <div class="no-results">
                    <h3>No results in this category</h3>
                    <p>Try the "All" tab or adjust your filters.</p>
                </div>`;
            return;
        }

        filtered.forEach(item => {
            if (item._error) {
                resultsList.appendChild(createErrorCard(item));
            } else {
                resultsList.appendChild(createResultCard(item));
            }
        });
    }

    function createResultCard(item) {
        const card = document.createElement('div');
        card.className = 'result-card';

        const dbLabel = item._db === 'sra' ? 'SRA' : item._db === 'gds' ? 'GEO' : 'dbGaP';
        const dbClass = item._db;

        let metaHtml = '';

        if (item.organism) {
            metaHtml += `<span class="result-meta-item"><strong>Organism:</strong> ${escapeHtml(item.organism)}</span>`;
        }
        if (item.strategy) {
            metaHtml += `<span class="result-meta-item"><strong>Strategy:</strong> ${escapeHtml(item.strategy)}</span>`;
        }
        if (item.dataType) {
            metaHtml += `<span class="result-meta-item"><strong>Type:</strong> ${escapeHtml(item.dataType)}</span>`;
        }
        if (item.platform) {
            metaHtml += `<span class="result-meta-item"><strong>Platform:</strong> ${escapeHtml(item.platform)}</span>`;
        }
        if (item.runCount) {
            metaHtml += `<span class="result-meta-item"><strong>Runs:</strong> ${item.runCount}</span>`;
        }
        if (item.sampleCount) {
            metaHtml += `<span class="result-meta-item"><strong>Samples:</strong> ${item.sampleCount}</span>`;
        }
        if (item.subjectCount) {
            metaHtml += `<span class="result-meta-item"><strong>Subjects:</strong> ${item.subjectCount}</span>`;
        }
        if (item.disease) {
            metaHtml += `<span class="result-meta-item"><strong>Disease:</strong> ${escapeHtml(item.disease)}</span>`;
        }
        if (item.date) {
            metaHtml += `<span class="result-meta-item"><strong>Date:</strong> ${escapeHtml(item.date)}</span>`;
        }

        let linksHtml = '';
        if (item.links && item.links.length > 0) {
            linksHtml = `<div class="result-links">
                ${item.links.map(link => `
                    <a href="${escapeHtml(link.url)}" class="result-link" target="_blank" rel="noopener">
                        ${getLinkIcon(link.icon)}
                        ${escapeHtml(link.label)}
                    </a>
                `).join('')}
            </div>`;
        }

        // Build primary URL for title link
        const titleUrl = item.links && item.links.length > 0 ? item.links[0].url : '#';

        card.innerHTML = `
            <div class="result-card-header">
                <h3 class="result-title">
                    <a href="${escapeHtml(titleUrl)}" target="_blank" rel="noopener">${escapeHtml(item.title)}</a>
                </h3>
                <span class="db-badge ${dbClass}">${dbLabel}</span>
            </div>
            ${item.accession ? `<div class="result-accession">${escapeHtml(item.accession)}</div>` : ''}
            ${item.description && item.description !== item.title ? `<p class="result-description">${escapeHtml(item.description)}</p>` : ''}
            ${metaHtml ? `<div class="result-meta">${metaHtml}</div>` : ''}
            ${linksHtml}
        `;

        return card;
    }

    function createErrorCard(item) {
        const card = document.createElement('div');
        card.className = 'error-card';
        const dbLabel = item._db === 'sra' ? 'SRA' : item._db === 'gds' ? 'GEO' : 'dbGaP';
        card.innerHTML = `
            <strong>${dbLabel} search failed</strong>
            ${escapeHtml(item._errorMessage)}. This may be a temporary issue or a CORS restriction. Try again or visit
            <a href="https://www.ncbi.nlm.nih.gov/${item._db === 'gds' ? 'geo' : item._db}/" target="_blank" rel="noopener">NCBI ${dbLabel}</a> directly.
        `;
        return card;
    }

    function getLinkIcon(type) {
        if (type === 'paper') {
            return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;
        }
        if (type === 'download') {
            return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
        }
        // Default: external link icon
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
    }

    // --- UI Helpers ---
    function showStatus(msg) {
        statusText.textContent = msg;
        showElement(statusSection);
        searchBtn.disabled = true;
    }

    function hideStatus() {
        hideElement(statusSection);
        searchBtn.disabled = false;
    }

    function showElement(el) {
        el.classList.remove('hidden');
    }

    function hideElement(el) {
        el.classList.add('hidden');
    }

    function clearResults() {
        allResults = [];
        hideElement(summarySection);
        hideElement(resultsSection);
        showElement(emptyState);
        resetEmptyState();
        searchInput.value = '';
        searchInput.focus();
    }

    function resetEmptyState() {
        emptyState.querySelector('.empty-content').innerHTML = `
            <div class="empty-icon">&#x1F50D;</div>
            <h2>Search scientific datasets</h2>
            <p>Search across NCBI's Sequence Read Archive (SRA), Gene Expression Omnibus (GEO), and Database of Genotypes and Phenotypes (dbGaP).</p>
            <div class="example-searches">
                <p class="example-label">Try searching for:</p>
                <div class="example-chips">
                    <button class="example-chip" data-query="breast cancer RNA-seq">breast cancer RNA-seq</button>
                    <button class="example-chip" data-query="CRISPR screen">CRISPR screen</button>
                    <button class="example-chip" data-query="single cell atlas">single cell atlas</button>
                    <button class="example-chip" data-query="COVID-19">COVID-19</button>
                    <button class="example-chip" data-query="epigenome roadmap">epigenome roadmap</button>
                    <button class="example-chip" data-query="transposable elements">transposable elements</button>
                </div>
            </div>
        `;
        // Re-bind example chip events
        document.querySelectorAll('.example-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                searchInput.value = chip.dataset.query;
                searchForm.dispatchEvent(new Event('submit'));
            });
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // --- Boot ---
    init();
})();
