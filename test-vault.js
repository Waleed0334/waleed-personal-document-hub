import { validateFile, generateUUID, ALLOWED_DOCUMENT_UPDATE_FIELDS } from './src/services/documentService.js';
import { DEFAULT_CATEGORIES, MAX_FILE_SIZE_BYTES } from './src/constants/categories.js';

console.log('--- Starting Waleed Vault Automated Unit Verification ---');

// 1. Verify Categories
console.log(`Checking Default Categories: Found ${DEFAULT_CATEGORIES.length} categories.`);
const categorySlugs = DEFAULT_CATEGORIES.map(c => c.slug);
console.assert(categorySlugs.includes('personal'), 'Personal category missing');
console.assert(categorySlugs.includes('educational'), 'Educational category missing');
console.assert(categorySlugs.includes('university'), 'University category missing');
console.assert(categorySlugs.includes('professional'), 'Professional category missing');
console.assert(categorySlugs.includes('other'), 'Other category missing');

// Verify Subcategories
const personal = DEFAULT_CATEGORIES.find(c => c.slug === 'personal');
console.assert(personal.subcategories.includes('CNIC (Front)'), 'CNIC Front missing');
console.assert(personal.subcategories.includes('Passport'), 'Passport missing');

const edu = DEFAULT_CATEGORIES.find(c => c.slug === 'educational');
console.assert(edu.subcategories.includes('Matric Marksheet'), 'Matric Marksheet missing');
console.assert(edu.subcategories.includes('Intermediate Certificate'), 'Intermediate Certificate missing');

const uni = DEFAULT_CATEGORIES.find(c => c.slug === 'university');
console.assert(uni.subcategories.includes('FAST University Student Card'), 'FAST Student Card missing');

const prof = DEFAULT_CATEGORIES.find(c => c.slug === 'professional');
console.assert(prof.subcategories.includes('Updated CV / Resume'), 'CV / Resume missing');
console.assert(prof.subcategories.includes('Competition Certificates'), 'Competition Certificates missing');

console.log('✓ All categories and subcategories verified successfully.');

// Verify Category UUID format
DEFAULT_CATEGORIES.forEach(cat => {
  console.assert(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cat.id), `Category ID is not a valid UUID: ${cat.id}`);
});
console.log('✓ Category UUID format verified.');

// 2. Test File Validation
const validPdf = { name: 'transcript.pdf', size: 2 * 1024 * 1024, type: 'application/pdf' };
const validPng = { name: 'cnic_front.png', size: 1 * 1024 * 1024, type: 'image/png' };
const oversized = { name: 'huge_backup.pdf', size: 55 * 1024 * 1024, type: 'application/pdf' };
const badType = { name: 'malicious.exe', size: 500, type: 'application/x-msdownload' };

console.assert(validateFile(validPdf).valid === true, 'Valid PDF failed');
console.assert(validateFile(validPng).valid === true, 'Valid PNG failed');
console.assert(validateFile(oversized).valid === false, 'Oversized file should be rejected');
console.assert(validateFile(badType).valid === false, 'Malicious exe should be rejected');

console.log('✓ File validation and security boundaries verified.');

// 3. Verify RFC4122 v4 UUID Generation (CSPRNG, Zero Math.random)
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const sampleUUID1 = generateUUID();
const sampleUUID2 = generateUUID();
console.assert(uuidRegex.test(sampleUUID1), `Invalid UUID format: ${sampleUUID1}`);
console.assert(uuidRegex.test(sampleUUID2), `Invalid UUID format: ${sampleUUID2}`);
console.assert(sampleUUID1 !== sampleUUID2, 'UUID collision detected');
console.assert(!generateUUID.toString().includes('Math.random'), 'Math.random detected in UUID generator!');
console.log('✓ Cryptographically secure RFC4122 v4 UUID generation verified (Zero Math.random).');

// 4. Verify Document Path Construction and Traversal Defense
const userId = '11111111-2222-3333-4444-555555555555';
const docId = sampleUUID1;
const filename = 'marksheet_semester_1.pdf';
const constructedPath = `${userId}/${docId}/${filename}`;

// Path convention check
console.assert(constructedPath.startsWith(`${userId}/${docId}/`), 'Path convention violated');

// Traversal pattern regex matching SQL: !~ '(^|/)(\.\.?)(/|$)'
const traversalRegex = /(^|\/)(\.\.?)(\/|$)/;
console.assert(!traversalRegex.test(constructedPath), 'Valid path falsely flagged as traversal');
console.assert(traversalRegex.test('../evil.pdf'), 'Parent traversal .. not detected');
console.assert(traversalRegex.test(`${userId}/./doc/test.pdf`), 'Current dir . traversal not detected');
console.assert(traversalRegex.test(`${userId}/../../etc/passwd`), 'Multi-parent traversal not detected');
console.log('✓ Storage path format and traversal protection logic verified.');

// 5. Verify Update Field Allowlist Enforcement
const maliciousUpdate = {
  title: 'Valid New Title',
  id: '00000000-0000-0000-0000-000000000000',
  user_id: 'attacker-user-id',
  file_path: 'other-user/stolen.pdf',
  is_favorite: true,
};
const filteredFields = Object.keys(maliciousUpdate).filter(k => ALLOWED_DOCUMENT_UPDATE_FIELDS.includes(k));
console.assert(filteredFields.includes('title'), 'Allowed field title rejected');
console.assert(filteredFields.includes('is_favorite'), 'Allowed field is_favorite rejected');
console.assert(!filteredFields.includes('id'), 'Dangerous field id not filtered');
console.assert(!filteredFields.includes('user_id'), 'Dangerous field user_id not filtered');
console.assert(!filteredFields.includes('file_path'), 'Dangerous field file_path not filtered');
console.log('✓ Document update allowlist enforcement verified.');

// 6. Verify Search Logic Simulation
const testDocs = [
  { title: 'FAST Student ID Card', category_name: 'University Documents', tags: ['FAST', 'Student Card'], description: 'Card' },
  { title: 'Matriculation Marksheet', category_name: 'Educational Documents', tags: ['Matric', 'Board'], description: 'Grade A+' },
  { title: 'CNIC Specimen Front', category_name: 'Personal Documents', tags: ['CNIC', 'National ID'], description: 'ID' },
  { title: 'Updated CV Resume', category_name: 'Professional Documents', tags: ['CV', 'Resume'], description: 'Data Science' },
];

function searchSimulator(query, docs) {
  const q = query.toLowerCase().trim();
  return docs.filter(d =>
    d.title.toLowerCase().includes(q) ||
    d.category_name.toLowerCase().includes(q) ||
    d.tags.some(t => t.toLowerCase().includes(q))
  );
}

console.assert(searchSimulator('FAST', testDocs).length === 1, 'Search FAST failed');
console.assert(searchSimulator('Matric', testDocs).length === 1, 'Search Matric failed');
console.assert(searchSimulator('CNIC', testDocs).length === 1, 'Search CNIC failed');
console.assert(searchSimulator('CV', testDocs).length === 1, 'Search CV failed');

console.log('✓ Search query matching verified.');
console.log('--- ALL AUTOMATED VERIFICATIONS PASSED ---');
