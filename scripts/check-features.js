const fs = require('fs');
const path = require('path');

// Read the README.md file
const readmePath = path.join(__dirname, '..', 'README.md');
const readme = fs.readFileSync(readmePath, 'utf8');

// Parse feature sections
const featureSections = readme.match(/### [^\n]+\n(?:- \[[x ]\][^\n]+\n)+/g);

// Calculate statistics
const stats = {
  total: 0,
  implemented: 0,
  pending: 0,
  sections: []
};

featureSections.forEach(section => {
  const sectionName = section.match(/### ([^\n]+)/)[1];
  const features = section.match(/- \[[x ]\][^\n]+/g);
  
  const sectionStats = {
    name: sectionName,
    total: features.length,
    implemented: features.filter(f => f.includes('[x]')).length,
    pending: features.filter(f => f.includes('[ ]')).length,
    features: {
      implemented: features.filter(f => f.includes('[x]')).map(f => f.replace(/- \[[x]\] /, '')),
      pending: features.filter(f => f.includes('[ ]')).map(f => f.replace(/- \[ \] /, ''))
    }
  };
  
  stats.total += sectionStats.total;
  stats.implemented += sectionStats.implemented;
  stats.pending += sectionStats.pending;
  stats.sections.push(sectionStats);
});

// Generate report
console.log('\nSmart Classroom Management System - Feature Implementation Status\n');
console.log(`Overall Progress: ${stats.implemented}/${stats.total} (${Math.round(stats.implemented/stats.total*100)}%)\n`);

stats.sections.forEach(section => {
  console.log(`\n${section.name}`);
  console.log('='.repeat(section.name.length));
  console.log(`Progress: ${section.implemented}/${section.total} (${Math.round(section.implemented/section.total*100)}%)`);
  
  if (section.features.implemented.length > 0) {
    console.log('\nImplemented:');
    section.features.implemented.forEach(f => console.log(`✓ ${f}`));
  }
  
  if (section.features.pending.length > 0) {
    console.log('\nPending:');
    section.features.pending.forEach(f => console.log(`○ ${f}`));
  }
  
  console.log('\n' + '-'.repeat(50));
});

// Save report to file
const reportPath = path.join(__dirname, '..', 'feature-status.txt');
const report = `Feature Implementation Status Report
Generated on: ${new Date().toLocaleString()}

Overall Progress: ${stats.implemented}/${stats.total} features implemented (${Math.round(stats.implemented/stats.total*100)}%)

Detailed Status:
${stats.sections.map(section => `
${section.name}
${'='.repeat(section.name.length)}
Progress: ${section.implemented}/${section.total} (${Math.round(section.implemented/section.total*100)}%)

Implemented:
${section.features.implemented.map(f => `✓ ${f}`).join('\n')}

Pending:
${section.features.pending.map(f => `○ ${f}`).join('\n')}
`).join('\n' + '-'.repeat(50) + '\n')}`;

fs.writeFileSync(reportPath, report);
console.log(`\nDetailed report saved to: ${reportPath}`); 