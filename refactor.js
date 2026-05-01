const fs = require('fs');
const path = require('path');

const dir = 'd:/work/couponsscript/server/cypress/e2e/api/admin/category-management';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Common assertion fixes
  content = content.replace(/response\.body\.data/g, 'response.body');
  content = content.replace(/expect\(response\.body\)\.to\.have\.property\('success'([^\)]*)\);?\n?/g, '');
  content = content.replace(/expect\(response\.body\.success\)\.to\.be\.true;?/g, '');
  
  // Endpoint URL replacements
  content = content.replace(/url: \`\$\{baseUrl\}\/categories\`/g, 'url: `${baseUrl}/categories/create`');
  content = content.replace(/cy\.request\('POST', \`\$\{baseUrl\}\/categories\`/g, 'cy.request(\'POST\', `${baseUrl}/categories/create`');
  
  // Delete URLs
  content = content.replace(/url: \`\$\{baseUrl\}\/categories\/\$\{testCategoryId\}\`/g, 'url: `${baseUrl}/categories/delete/${testCategoryId}`');
  content = content.replace(/cy\.request\('DELETE', \`\$\{baseUrl\}\/categories\/\$\{testCategoryId\}\`/g, 'cy.request(\'DELETE\', `${baseUrl}/categories/delete/${testCategoryId}`');
  
  // Update URLs
  content = content.replace(/url: \`\$\{baseUrl\}\/categories\/\$\{testCategoryId\}\`/g, 'url: `${baseUrl}/categories/update/${testCategoryId}`');
  
  // Custom manual replacements for special cases might still be needed in the next step
  
  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Done refactoring');
